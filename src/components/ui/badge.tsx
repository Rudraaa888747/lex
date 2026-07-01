import { cn } from "@/lib/helpers"

const variantStyles = {
  default: "bg-[rgba(0,0,0,0.05)] text-muted-foreground border-border",
  success: "bg-[rgba(22,163,74,0.10)] text-[#16a34a] border-[rgba(22,163,74,0.20)]",
  warning: "bg-[rgba(217,119,6,0.10)] text-[#d97706] border-[rgba(217,119,6,0.20)]",
  danger: "bg-[rgba(220,38,38,0.10)] text-[#dc2626] border-[rgba(220,38,38,0.20)]",
  secondary: "bg-[rgba(0,0,0,0.04)] text-muted-foreground border-border",
  outline: "bg-transparent border-border text-foreground",
}

const sizeStyles = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-[10px]",
  lg: "px-3 py-1 text-sm",
}

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  className?: string
}

export function Badge({ children, variant = "default", size = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role="status"
    >
      {children}
    </span>
  )
}
