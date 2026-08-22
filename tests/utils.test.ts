import { describe, it, expect } from "vitest"
import { normalizeExtractedText } from "@/lib/document-processing"
import { validateContent } from "@/services/ai.service"
import { formatFileSize } from "@/lib/helpers"

const NULL = String.fromCharCode(0)
const CR = String.fromCharCode(13)
const LF = String.fromCharCode(10)

describe("normalizeExtractedText", () => {
  it("removes null characters", () => {
    expect(normalizeExtractedText(`a${NULL}b`)).toBe("ab")
  })

  it("normalizes line endings and collapses excess newlines", () => {
    const input = `line1${CR}${LF}line2${LF}${LF}${LF}${LF}line3  `
    const expected = `line1${LF}line2${LF}${LF}line3`
    expect(normalizeExtractedText(input)).toBe(expected)
  })

  it("trims surrounding whitespace", () => {
    expect(normalizeExtractedText("   hello   ")).toBe("hello")
  })
})

describe("validateContent", () => {
  it("rejects content shorter than 50 characters", () => {
    expect(validateContent("this is too short")).toBe(false)
  })

  it("rejects content with too few words", () => {
    expect(validateContent("a".repeat(60))).toBe(false)
  })

  it("rejects content with low alphanumeric ratio", () => {
    expect(validateContent("!!!!????....".repeat(10))).toBe(false)
  })

  it("accepts reasonable legal text", () => {
    const text =
      "This Agreement is made between the parties and sets forth the terms of the rental arrangement for the property located at the stated address.".repeat(
        2
      )
    expect(validateContent(text)).toBe(true)
  })
})

describe("formatFileSize", () => {
  it("formats zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 Bytes")
  })

  it("formats bytes", () => {
    expect(formatFileSize(512)).toBe("512 Bytes")
  })

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB")
  })

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe("2.5 MB")
  })
})
