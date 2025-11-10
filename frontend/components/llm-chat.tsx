"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Zap, Brain, AlertCircle } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  analysisData?: any
}

interface LLMChatProps {
  pgn: string
  currentPosition: number
  analysis?: any
  onAnalysisUpdate: (analysis: any) => void
  apiUrl: string
}

const renderMarkdown = (text: string) => {
  return text.split("\n").map((line, lineIndex) => {
    const rendered = line
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italics
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Code
      .replace(/`(.+?)`/g, "<code>$1</code>")

    return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: rendered }} />
  })
}

export function LLMChat({ pgn, currentPosition, analysis, onAnalysisUpdate, apiUrl }: LLMChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzePosition = async () => {
    if (!pgn) {
      alert("Please import a PGN first")
      return
    }

    setIsAnalyzing(true)
    try {
      console.log("[v0] Starting position analysis with /api/analyze endpoint")

      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pgn,
        }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Received Stockfish analysis:", data)

      onAnalysisUpdate(data)

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Position analyzed! You can now ask questions about this position or use the quick action buttons below.",
        timestamp: new Date(),
        analysisData: data,
      }

      setMessages((prev) => [...prev, newMessage])
    } catch (error) {
      console.error("[v0] Analysis error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Please check that your PwnSensei API is running at ${apiUrl}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !pgn) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending chat message to /api/generate endpoint:", currentInput)

      const response = await fetch(`${apiUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pgn,
          userPrompt: currentInput,
        }),
      })

      if (!response.ok) {
        throw new Error(`Generate failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Received chat response:", data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.commentary || data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure your PwnSensei API is running at ${apiUrl}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      label: "Explain this position",
      prompt: "Explain the current position and what both sides should be thinking about.",
    },
    { label: "Find tactics", prompt: "Are there any tactical opportunities in this position?" },
    { label: "Suggest improvements", prompt: "What could have been played better in the last few moves?" },
    { label: "Opening analysis", prompt: "Analyze the opening choices and their strategic implications." },
  ]

  const sendQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Chess Analysis Chat
          {analysis && <Badge variant="secondary">Analysis Ready</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Analyze Button */}
        <div className="flex gap-2">
          <Button onClick={analyzePosition} disabled={!pgn || isAnalyzing} className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing Position..." : "Analyze Current Position"}
          </Button>
          {!pgn && (
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        {pgn && !isLoading && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Quick Actions:</span>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickAction(action.prompt)}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Import a PGN and click "Analyze Current Position" to start!</p>
              <p className="text-sm mt-2">Or use the quick action buttons for common questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{renderMarkdown(message.content)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                      {message.analysisData && (
                        <Badge variant="secondary" className="text-xs">
                          Engine Data
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about the position, moves, strategy, or request specific analysis..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              rows={2}
              disabled={!pgn}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || !pgn || isLoading} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!pgn && <p className="text-xs text-muted-foreground">Import a PGN to start chatting</p>}
        </div>
      </CardContent>
    </Card>
  )
}
