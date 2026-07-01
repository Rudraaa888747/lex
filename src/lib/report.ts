import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

function wrapText(text: string, maxLength = 95) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines
}

export async function buildAnalysisReportPdf(params: {
  documentTitle: string
  createdAt: string
  summary?: string | null
  plainLanguage?: string | null
  redFlags: string[]
}) {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  let cursorY = 790

  const drawBlock = (title: string, value: string) => {
    page.drawText(title, {
      x: 40,
      y: cursorY,
      size: 14,
      font: boldFont,
      color: rgb(0.11, 0.16, 0.24),
    })
    cursorY -= 22

    for (const line of wrapText(value || "Not available")) {
      page.drawText(line, {
        x: 40,
        y: cursorY,
        size: 10.5,
        font,
        color: rgb(0.2, 0.24, 0.3),
      })
      cursorY -= 14
      if (cursorY < 60) break
    }

    cursorY -= 16
  }

  page.drawText("Legal Analysis Report", {
    x: 40,
    y: cursorY,
    size: 22,
    font: boldFont,
    color: rgb(0.05, 0.09, 0.16),
  })
  cursorY -= 30

  page.drawText(`Document: ${params.documentTitle}`, {
    x: 40,
    y: cursorY,
    size: 11,
    font,
    color: rgb(0.25, 0.31, 0.38),
  })
  cursorY -= 16

  page.drawText(`Generated: ${new Date(params.createdAt).toLocaleString("en-IN")}`, {
    x: 40,
    y: cursorY,
    size: 11,
    font,
    color: rgb(0.25, 0.31, 0.38),
  })
  cursorY -= 28

  drawBlock("Executive Summary", params.summary || "Not available")
  drawBlock("Plain Language Explanation", params.plainLanguage || "Not available")

  page.drawText("Top Red Flags", {
    x: 40,
    y: cursorY,
    size: 14,
    font: boldFont,
    color: rgb(0.11, 0.16, 0.24),
  })
  cursorY -= 22

  for (const flag of params.redFlags.slice(0, 8)) {
    for (const line of wrapText(`- ${flag}`, 90)) {
      page.drawText(line, {
        x: 48,
        y: cursorY,
        size: 10.5,
        font,
        color: rgb(0.2, 0.24, 0.3),
      })
      cursorY -= 14
      if (cursorY < 60) break
    }
  }

  return Buffer.from(await pdf.save())
}
