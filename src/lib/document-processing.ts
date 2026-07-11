import { UserFacingError } from "@/lib/api-error"

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

async function extractImagesFromPdfBuffer(buffer: Buffer) {
  const { getDocument, OPS } = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const sharp = (await import("sharp")).default
  
  const doc = await getDocument(new Uint8Array(buffer)).promise
  const pageCount = doc._pdfInfo.numPages
  const imageBuffers: Buffer[] = []
  
  for (let p = 1; p <= Math.min(pageCount, 10); p++) {
    const page = await doc.getPage(p)
    const ops = await page.getOperatorList()
    
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === OPS.paintImageXObject || ops.fnArray[i] === OPS.paintInlineImageXObject) {
        const name = ops.argsArray[i][0]
        const common = await page.commonObjs.has(name)
        const img = await (common ? page.commonObjs.get(name) : page.objs.get(name))
        
        const { width, height } = img
        const bytes = img.data.length
        const channels = bytes / width / height
        
        if ([1, 2, 3, 4].includes(channels)) {
          const pngBuffer = await sharp(img.data, {
            raw: { width, height, channels: channels as 1 | 2 | 3 | 4 }
          }).png().toBuffer()
          imageBuffers.push(pngBuffer)
        }
      }
    }
  }
  return imageBuffers
}

async function extractTextFromPdf(buffer: Buffer, language: string) {
  const { PDFParse } = await import("pdf-parse")
  const { validateContent } = await import("@/services/ai.service")
  const parser = new PDFParse({ data: buffer })

  let text = ""
  try {
    const result = await parser.getText()
    text = normalizeExtractedText(result.text)
  } finally {
    await parser.destroy()
  }

  // If text is good, return it
  if (validateContent(text)) {
    return { text, isOcrFallback: false }
  }

  // Fallback to OCR using direct image extraction
  try {
    const imageBuffers = await extractImagesFromPdfBuffer(buffer)
    let ocrText = ""

    // Process up to first 10 images to cap processing time
    for (const imgBuffer of imageBuffers) {
      const pageResult = await extractTextFromImage(imgBuffer, language)
      ocrText += pageResult.text + "\n\n"
    }
    
    ocrText = normalizeExtractedText(ocrText)
    if (ocrText.length > 50) {
       return { text: ocrText, isOcrFallback: true }
    }
  } catch (ocrError) {
    console.error("PDF OCR fallback failed:", ocrError)
  }

  return { text, isOcrFallback: false } // Return whatever we got from pdf-parse if OCR fails or gets nothing
}

async function extractTextFromDocx(buffer: Buffer) {
  const mammoth = await import("mammoth")
  const result = await mammoth.extractRawText({ buffer })
  return { text: normalizeExtractedText(result.value), isOcrFallback: false }
}

async function extractTextFromImage(buffer: Buffer, language: string) {
  const { createWorker } = await import("tesseract.js")
  const requestedLanguage = OCR_LANGUAGE_MAP[language] || OCR_LANGUAGE_MAP.EN

  const runOcr = async (ocrLanguage: string) => {
    const worker = await createWorker(ocrLanguage)

    try {
      const { data } = await worker.recognize(buffer)
      return { text: normalizeExtractedText(data.text), isOcrFallback: true }
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
      return { text: normalizeExtractedText(buffer.toString("utf-8")), isOcrFallback: false }
    case "pdf":
      return extractTextFromPdf(buffer, language)
    case "docx":
      return extractTextFromDocx(buffer)
    case "png":
    case "jpg":
    case "jpeg":
      return extractTextFromImage(buffer, language)
    default:
      throw new UserFacingError(`Unsupported file extension: ${fileExtension}`)
  }
}
