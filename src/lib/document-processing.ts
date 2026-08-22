import { UserFacingError } from "@/lib/api-error"

const OCR_LANGUAGE_MAP: Record<string, string> = {
  EN: "eng",
  HI: "hin",
  GU: "guj",
}

export function normalizeExtractedText(value: string) {
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
        const img = await new Promise<any>((resolve) => {
          if (common) {
            page.commonObjs.get(name, resolve)
          } else {
            page.objs.get(name, resolve)
          }
        })
        
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

    // Reuse a single worker across all pages instead of creating one per image
    const worker = await createOcrWorker(language)

    try {
      for (const imgBuffer of imageBuffers) {
        const pageText = await recognizeWithWorker(worker, imgBuffer)
        ocrText += pageText + "\n\n"
      }
    } finally {
      await worker.terminate()
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

async function createOcrWorker(language: string) {
  const { createWorker } = await import("tesseract.js")
  const requestedLanguage = OCR_LANGUAGE_MAP[language] || OCR_LANGUAGE_MAP.EN

  try {
    return await createWorker(requestedLanguage)
  } catch (error) {
    if (requestedLanguage === OCR_LANGUAGE_MAP.EN) {
      throw error
    }

    return createWorker(OCR_LANGUAGE_MAP.EN)
  }
}

async function recognizeWithWorker(worker: Awaited<ReturnType<typeof createOcrWorker>>, buffer: Buffer) {
  const { data } = await worker.recognize(buffer)
  return data.text
}

async function extractTextFromImage(buffer: Buffer, language: string) {
  const worker = await createOcrWorker(language)

  try {
    return { text: normalizeExtractedText(await recognizeWithWorker(worker, buffer)), isOcrFallback: true }
  } finally {
    await worker.terminate()
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
