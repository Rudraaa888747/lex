import * as React from "react"
import { cn } from "@/lib/helpers"

const variantStyles = {
  default: "bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3] border border-[rgba(255,255,255,0.08)] shadow-[var(--shadow-sm)] active:scale-[0.98] transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
  destructive: "bg-[rgba(220,38,38,0.08)] hover:bg-[rgba(220,38,38,0.12)] text-[#dc2626] border border-[rgba(220,38,38,0.15)] active:scale-[0.98] transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
  outline: "bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.06)] text-foreground border border-border shadow-[var(--shadow-sm)] active:scale-[0.98] transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
  secondary: "bg-secondary text-foreground hover:bg-secondary/80 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  ghost: "bg-transparent hover:bg-[rgba(0,0,0,0.04)] text-muted-foreground hover:text-foreground border border-transparent active:scale-[0.98] transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
  link: "text-foreground underline-offset-4 hover:underline",
  gradient: "bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3] border border-[rgba(255,255,255,0.08)] shadow-[var(--shadow-sm)] active:scale-[0.98] transition-all duration-200 cubic-bezier(0.16,1,0.3,1)",
}

const sizeStyles = {
  default: "h-11 px-5 py-2.5",
  sm: "h-10 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-xl px-8 text-base",
  xl: "h-14 rounded-2xl px-10 text-lg",
  icon: "h-11 w-11",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  loading?: boolean
}

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] z-0",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
