import { createClient } from "@supabase/supabase-js"

export const PRIVATE_DOCUMENT_BUCKET = process.env.SUPABASE_PRIVATE_DOCUMENT_BUCKET || "pdf"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for document storage")
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for private document storage")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function removeStoredDocuments(paths: string[]) {
  const objectPaths = paths.filter(Boolean)
  if (objectPaths.length === 0) return

  const { error } = await getSupabaseAdmin()
    .storage
    .from(PRIVATE_DOCUMENT_BUCKET)
    .remove(objectPaths)

  if (error) {
    throw error
  }
}

export async function createPrivateDocumentUrl(path: string, expiresInSeconds = 60) {
  const { data, error } = await getSupabaseAdmin()
    .storage
    .from(PRIVATE_DOCUMENT_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error) {
    throw error
  }

  return data.signedUrl
}

export const supabaseAdmin = {
  storage: {
    from(bucket: string) {
      return getSupabaseAdmin().storage.from(bucket)
    },
  },
}
