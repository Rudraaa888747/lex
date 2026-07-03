import { cache } from "react"
import { auth as rawAuth } from "./auth-config"

/**
 * Cached auth — deduplicates auth() calls within a single server request.
 * React's `cache()` ensures that even if multiple Server Components
 * call `getAuth()` in the same render tree, the underlying `auth()`
 * (and its DB queries) only runs ONCE.
 */
export const getAuth = cache(async () => {
  return rawAuth()
})
