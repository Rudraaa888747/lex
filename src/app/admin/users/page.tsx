"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, UserX, UserCheck, Loader2 } from "lucide-react"
import { showToast } from "@/components/premium-toast"
import { formatDate } from "@/lib/helpers"

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  plan: string
  createdAt: string
  emailVerified: boolean
  image: string | null
  suspended?: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  // Debounce server search so each keystroke isn't a request.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [search])

  const loadUsers = useCallback(async (loadCursor?: string | null, query?: string) => {
    if (loadCursor) setLoadingMore(true)
    else {
      setLoading(true)
      setLoadError(null)
    }
    try {
      const params = new URLSearchParams()
      if (query) params.set("search", query)
      if (loadCursor) params.set("cursor", loadCursor)
      const qs = params.toString()
      const res = await fetch(`/api/admin/users${qs ? `?${qs}` : ""}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to load users")
      const fetched: AdminUser[] = (data.users || []).map((u: { id: string; name: string | null; email: string; role: string; plan: string; createdAt: string | Date; emailVerified: boolean; image: string | null; suspended?: boolean }) => ({
        ...u,
        createdAt: typeof u.createdAt === "string" ? u.createdAt : new Date(u.createdAt).toISOString(),
      }))
      // Dedupe by id so cursor retries never duplicate rows.
      setUsers((prev) => {
        const base = loadCursor ? prev : []
        const seen = new Set(base.map((u) => u.id))
        return [...base, ...fetched.filter((u) => !seen.has(u.id))]
      })
      setCursor(data.nextCursor ?? null)
      setHasMore(Boolean(data.hasMore))
      if (typeof data.totalCount === "number") setTotalCount(data.totalCount)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load users"
      if (!loadCursor) setLoadError(msg)
      else showToast(msg, "error")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCursor(null)
      void loadUsers(null, debouncedSearch || undefined)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [debouncedSearch, loadUsers])

  const toggleUserStatus = async (userId: string, suspend: boolean) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: suspend }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to update user")
      showToast(suspend ? "User suspended" : "User activated", "success")
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, suspended: suspend } : u))
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update user", "error")
    } finally {
      setUpdating(null)
    }
  }

  const updatePlan = async (userId: string, plan: string) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to update plan")
      showToast("Plan updated successfully", "success")
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan } : u))
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update plan", "error")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>User Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            {totalCount != null
              ? `${totalCount} ${totalCount === 1 ? "user" : "users"} total`
              : `${users.length} ${users.length === 1 ? "user" : "users"}${hasMore ? " loaded" : ""}`}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="admin-user-search" className="sr-only">Search users by name or email</label>
        <input
          id="admin-user-search"
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card shadow-[var(--shadow-sm)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
        />
      </div>

      <div className="g-default rounded-2xl overflow-hidden bg-card border border-border shadow-[var(--shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-[rgba(0,0,0,0.02)]">
                <th scope="col" className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th scope="col" className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th scope="col" className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Plan</th>
                <th scope="col" className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th scope="col" className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="text-right p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map((i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="h-10 rounded bg-[rgba(0,0,0,0.04)] shimmer" /></td></tr>
                ))
              ) : loadError ? (
                <tr><td colSpan={6} className="p-8 text-center">
                  <p className="text-muted-foreground font-medium mb-4">{loadError}</p>
                  <Button variant="outline" size="sm" onClick={() => { setCursor(null); void loadUsers(null, debouncedSearch || undefined) }}>
                    Retry
                  </Button>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                  {debouncedSearch ? `No users match "${debouncedSearch}"` : "No users found"}
                </td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-btn flex items-center justify-center text-[#FAF8F3] text-xs font-bold shadow-[var(--shadow-sm)]">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{user.name || "Unnamed"}</p>
                          <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={user.role === "ADMIN" ? "default" : "secondary"} size="sm">{user.role}</Badge></td>
                    <td className="p-4">
                      <label htmlFor={`plan-${user.id}`} className="sr-only">Plan for {user.email}</label>
                      <select
                        id={`plan-${user.id}`}
                        value={user.plan || "FREE"}
                        onChange={(e) => updatePlan(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="bg-card border border-border rounded-lg px-2 py-1 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PROFESSIONAL">PROFESSIONAL</option>
                        <option value="BUSINESS">BUSINESS</option>
                        <option value="ENTERPRISE">ENTERPRISE</option>
                      </select>
                    </td>
                    <td className="p-4"><span className="text-sm text-muted-foreground font-medium">{formatDate(user.createdAt)}</span></td>
                    <td className="p-4">
                      <Badge variant={user.suspended ? "danger" : "success"} size="sm">
                        {user.suspended ? "Suspended" : "Active"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1 justify-end">
                        {user.role !== "ADMIN" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, !user.suspended)}
                            disabled={updating === user.id}
                            loading={updating === user.id}
                            aria-label={user.suspended ? "Activate user" : "Suspend user"}
                            className={user.suspended ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                          >
                            {user.suspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && !loading && !loadError && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => loadUsers(cursor, debouncedSearch || undefined)} disabled={loadingMore || !cursor}>
            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
