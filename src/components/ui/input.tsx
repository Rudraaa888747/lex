import * as React from "react"
import { cn } from "@/lib/helpers"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    // Stable unique id — label-derived ids collide with duplicate labels.
    const autoId = React.useId()
    const inputId = id || autoId
    const errorId = error ? `${inputId}-error` : undefined
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <input
          {...props}
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error && "border-danger focus-visible:ring-danger",
            className
          )}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        {error && <p id={errorId} className="mt-1 text-sm text-danger" role="alert">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
