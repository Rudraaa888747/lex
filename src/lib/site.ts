export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://lex-ecru.vercel.app")

export const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@lexai.com"
export const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@lexai.com"
export const pressEmail = process.env.NEXT_PUBLIC_PRESS_EMAIL || "press@lexai.com"
export const careersEmail = process.env.NEXT_PUBLIC_CAREERS_EMAIL || "careers@lexai.com"
