"use client"

import { toast } from "sonner"
import { useEffect, useState, useCallback, useRef } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface PremiumToastProps {
  t: string | number
  title?: string
  message: string
  type: ToastType
  duration?: number
}

const config: Record<
  ToastType,
  {
    icon: typeof CheckCircle
    iconColor: string
    iconBg: string
    iconBorder: string
    progressColor: string
    accentBorder: string
    label: string
  }
> = {
  success: {
    icon: CheckCircle,
    iconColor: "#16a34a",
    iconBg: "rgba(22,163,74,0.10)",
    iconBorder: "rgba(22,163,74,0.18)",
    progressColor: "#16a34a",
    accentBorder: "#16a34a",
    label: "Success",
  },
  error: {
    icon: XCircle,
    iconColor: "#dc2626",
    iconBg: "rgba(220,38,38,0.10)",
    iconBorder: "rgba(220,38,38,0.18)",
    progressColor: "#dc2626",
    accentBorder: "#dc2626",
    label: "Error",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "#d97706",
    iconBg: "rgba(217,119,6,0.10)",
    iconBorder: "rgba(217,119,6,0.18)",
    progressColor: "#d97706",
    accentBorder: "#d97706",
    label: "Warning",
  },
  info: {
    icon: Info,
    iconColor: "#0F0E0D",
    iconBg: "rgba(15,14,13,0.07)",
    iconBorder: "rgba(15,14,13,0.12)",
    progressColor: "#0F0E0D",
    accentBorder: "#0F0E0D",
    label: "Info",
  },
}

function PremiumToastContent({
  t,
  title,
  message,
  type,
  duration = 3000,
}: PremiumToastProps) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  const startTimeRef = useRef<number>(Date.now())
  const remainingTimeRef = useRef<number>(duration)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const c = config[type]
  const Icon = c.icon

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => toast.dismiss(t), 320)
  }, [t])

  // Mount entrance
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Auto-dismiss timer with pause/resume support
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      remainingTimeRef.current -= (Date.now() - startTimeRef.current)
    } else {
      startTimeRef.current = Date.now()
      timerRef.current = setTimeout(() => {
        dismiss()
      }, remainingTimeRef.current)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPaused, dismiss])

  const displayTitle = title ?? c.label

  return (
    <>
      <style>{`
        @keyframes toastIn {
          0%   { opacity: 0; transform: translateX(calc(100% + 24px)) scale(0.96); }
          60%  { transform: translateX(-6px) scale(1.005); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          0%   { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(calc(100% + 24px)) scale(0.95); }
        }
        @keyframes toastInMobile {
          0%   { opacity: 0; transform: translateY(20px) scale(0.96); }
          60%  { transform: translateY(-4px) scale(1.005); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOutMobile {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes toastProgress {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        .toast-wrap {
          animation: toastIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-wrap.exiting {
          animation: toastOut 0.32s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @media (max-width: 640px) {
          .toast-wrap {
            animation: toastInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .toast-wrap.exiting {
            animation: toastOutMobile 0.28s cubic-bezier(0.4, 0, 1, 1) forwards;
          }
        }
        .toast-close:hover {
          background: rgba(0,0,0,0.06) !important;
          transform: scale(1.1);
        }
        .toast-close:active {
          transform: scale(0.95);
        }
      `}</style>

      <div
        className={`toast-wrap ${exiting ? "exiting" : ""}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: "relative",
          overflow: "hidden",
          pointerEvents: "auto",
          width: "clamp(300px, 90vw, 380px)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(48px)",
          WebkitBackdropFilter: "blur(48px)",
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow:
            "0 20px 60px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
          // Left accent stripe
          borderLeft: `3px solid ${c.accentBorder}`,
          opacity: visible ? undefined : 0,
          willChange: "transform, opacity",
        }}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Body */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 14px 14px 16px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: c.iconBg,
              border: `1px solid ${c.iconBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Icon style={{ width: 17, height: 17, color: c.iconColor }} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0F0E0D",
                lineHeight: 1.3,
                marginBottom: 3,
                letterSpacing: "-0.01em",
              }}
            >
              {displayTitle}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#6B6860",
                lineHeight: 1.55,
                letterSpacing: "-0.005em",
              }}
            >
              {message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={dismiss}
            className="toast-close"
            aria-label="Dismiss notification"
            style={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6B6860",
              transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
              marginTop: 1,
            }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            width: "100%",
            background: "rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="toast-progress-fill"
            style={{
              height: "100%",
              width: "100%",
              background: c.progressColor,
              borderRadius: "0 2px 2px 0",
              opacity: 0.85,
              transformOrigin: "left",
              animation: `toastProgress ${duration}ms linear forwards`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      </div>
    </>
  )
}

// ── Public API ──────────────────────────────────────────────────────────────

export function showToast(
  message: string,
  type: ToastType = "info",
  duration = 3000,
  title?: string
) {
  toast.custom(
    (t) => (
      <PremiumToastContent
        t={t}
        message={message}
        type={type}
        duration={duration}
        title={title}
      />
    ),
    {
      duration,
      position: "top-right",
      // On mobile Sonner overrides position — handled via CSS above
    }
  )
}

// Convenience helpers
export const notify = {
  success: (message: string, title?: string, duration?: number) =>
    showToast(message, "success", duration, title),
  error: (message: string, title?: string, duration?: number) =>
    showToast(message, "error", duration, title),
  warning: (message: string, title?: string, duration?: number) =>
    showToast(message, "warning", duration, title),
  info: (message: string, title?: string, duration?: number) =>
    showToast(message, "info", duration, title),
}