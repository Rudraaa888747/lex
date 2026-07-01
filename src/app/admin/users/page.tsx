"use client"

import { useState, useEffect } from "react"
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
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => showToast("Failed to load users", "error"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleUserStatus = async (userId: string, suspend: boolean) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: suspend }),
      })
      if (res.ok) {
        showToast(suspend ? "User suspended" : "User activated", "success")
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, suspended: suspend } : u))
      } else {
        showToast("Failed to update user", "error")
      }
    } catch {
      showToast("Failed to update user", "error")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>User Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">{users.length} total users</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
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
                <th className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Plan</th>
                <th className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="text-left p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map((i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="h-10 rounded bg-[rgba(0,0,0,0.04)] shimmer" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">No users found</td></tr>
              ) : (
                filtered.map((user) => (
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
                    <td className="p-4"><span className="text-sm font-medium text-foreground">{user.plan || "FREE"}</span></td>
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
    </div>
  )
}
