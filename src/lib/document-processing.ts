const OCR_LANGUAGE_MAP: Record<string, string> = {
  EN: "eng",
  HI: "hin",
  GU: "guj",
}

function normalizeExtractedText(value: string) {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function extractTextFromPdf(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse")
  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    return normalizeExtractedText(result.text)
  } finally {
    await parser.destroy()
  }
}

async function extractTextFromDocx(buffer: Buffer) {
  const mammoth = await import("mammoth")
  const result = await mammoth.extractRawText({ buffer })
  return normalizeExtractedText(result.value)
}

async function extractTextFromImage(buffer: Buffer, language: string) {
  const { createWorker } = await import("tesseract.js")
  const requestedLanguage = OCR_LANGUAGE_MAP[language] || OCR_LANGUAGE_MAP.EN

  const runOcr = async (ocrLanguage: string) => {
    const worker = await createWorker(ocrLanguage)

    try {
      const { data } = await worker.recognize(buffer)
      return normalizeExtractedText(data.text)
    } finally {
      await worker.terminate()
    }
  }

  try {
    return await runOcr(requestedLanguage)
  } catch (error) {
    if (requestedLanguage === OCR_LANGUAGE_MAP.EN) {
      throw error
    }

    return runOcr(OCR_LANGUAGE_MAP.EN)
  }
}

export async function extractDocumentTextFromBuffer(params: {
  buffer: Buffer
  fileExtension: string
  language: string
}) {
  const { buffer, fileExtension, language } = params

  switch (fileExtension) {
    case "txt":
      return normalizeExtractedText(buffer.toString("utf-8"))
    case "pdf":
      return extractTextFromPdf(buffer)
    case "docx":
      return extractTextFromDocx(buffer)
    case "png":
    case "jpg":
    case "jpeg":
      return extractTextFromImage(buffer, language)
    default:
      throw new Error(`Unsupported file extension: ${fileExtension}`)
  }
}
