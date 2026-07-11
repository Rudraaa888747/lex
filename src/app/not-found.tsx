import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-default rounded-3xl p-8 text-center border border-border shadow-[var(--shadow-md)]">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(0,0,0,0.04)] flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-foreground" style={{ fontFamily: "var(--font-display)" }}>Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="gradient" className="px-8">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
