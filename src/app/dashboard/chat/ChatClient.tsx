"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Bot, User, FileText, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface DocumentItem {
  id: string
  title: string
  type: string
}

const SUGGESTIONS = [
  "What does this document say?",
  "Summarize the key clauses",
  "What are the risks?",
  "Can this contract be terminated?",
  "What are my obligations?",
]

export function ChatClient({ initialDocuments }: { initialDocuments: DocumentItem[] }) {
  const searchParams = useSearchParams()
  const docId = searchParams.get("doc")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [documents] = useState<DocumentItem[]>(initialDocuments)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(docId)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text ?? input
    if (!messageText.trim() || sending) return

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: messageText }
    setMessages((prev) => [...prev, userMessage])
    if (!text) setInput("")
    setSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, documentId: selectedDoc }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.response }])
      } else {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I couldn't process that request. Please try again." }])
      }
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "An error occurred. Please try again." }])
    } finally {
      setSending(false)
    }
  }, [input, sending, selectedDoc])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSend(suggestion), 50)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-13rem)]">
      <div className="lg:w-72 shrink-0 space-y-3">
        <h2 className="font-semibold text-sm flex items-center gap-2 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          <MessageSquare className="w-4 h-4" />
          Documents
        </h2>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedDoc(null)}
            className={`w-full text-left p-3 rounded-xl text-sm transition-all cursor-pointer ${
              !selectedDoc ? "bg-[rgba(0,0,0,0.06)] text-foreground border border-[rgba(0,0,0,0.08)] font-semibold" : "g-default hover:bg-[rgba(0,0,0,0.04)]"
            }`}
          >
            <div className="font-medium">General Chat</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-normal">No specific document</div>
          </button>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all cursor-pointer ${
                selectedDoc === doc.id ? "bg-[rgba(0,0,0,0.06)] text-foreground border border-[rgba(0,0,0,0.08)] font-semibold" : "g-default hover:bg-[rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-medium">{doc.title}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 font-normal">{doc.type?.replace(/_/g, " ")}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col g-default rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-[rgba(0,0,0,0.02)]">
          <h2 className="font-semibold text-sm text-foreground">
            {selectedDoc ? `Chat: ${documents.find((d) => d.id === selectedDoc)?.title || "Document"}` : "AI Legal Chat"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ask questions about your legal documents</p>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-btn text-[#FAF8F3] flex items-center justify-center shadow-[var(--shadow-sm)] border border-[rgba(0,0,0,0.1)]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ask anything about your document</h3>
                <p className="text-sm text-muted-foreground mt-1">Select a document or ask a general legal question</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-[rgba(0,0,0,0.04)] hover:text-foreground transition-colors cursor-pointer bg-card"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.role === "user" ? "bg-card border-border text-foreground" : "bg-primary-btn border-[rgba(0,0,0,0.1)] text-[#FAF8F3]"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed border shadow-[var(--shadow-sm)] ${
                msg.role === "user" ? "bg-foreground text-card border-[rgba(0,0,0,0.1)]" : "bg-card border-border text-foreground"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-btn text-[#FAF8F3] flex items-center justify-center border border-[rgba(0,0,0,0.1)]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center justify-center shadow-[var(--shadow-sm)]">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-[rgba(0,0,0,0.02)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              disabled={sending}
              aria-label="Chat message"
            />
            <Button variant="gradient" size="icon" onClick={() => handleSend()} disabled={sending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Responses are AI-generated. Consult a legal professional for advice.
          </p>
        </div>
      </div>
    </div>
  )
}
