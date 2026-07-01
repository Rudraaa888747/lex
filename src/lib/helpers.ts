import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export const documentTypes = [
  { value: "RENTAL_AGREEMENT", label: "Rental Agreement" },
  { value: "EMPLOYMENT_CONTRACT", label: "Employment Contract" },
  { value: "NDA", label: "Non-Disclosure Agreement" },
  { value: "INSURANCE_POLICY", label: "Insurance Policy" },
  { value: "SERVICE_CONTRACT", label: "Service Contract" },
  { value: "TERMS_CONDITIONS", label: "Terms & Conditions" },
  { value: "PRIVACY_POLICY", label: "Privacy Policy" },
  { value: "VENDOR_AGREEMENT", label: "Vendor Agreement" },
  { value: "BUSINESS_CONTRACT", label: "Business Contract" },
  { value: "LEGAL_NOTICE", label: "Legal Notice" },
  { value: "OTHER", label: "Other Legal Document" },
]

export const languages = [
  { value: "EN", label: "English" },
  { value: "HI", label: "Hindi (हिन्दी)" },
  { value: "GU", label: "Gujarati (ગુજરાતી)" },
]
