"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface ApiConfigProps {
  onApiUrlChange: (url: string) => void
}

export function ApiConfig({ onApiUrlChange }: ApiConfigProps) {
  const [apiUrl, setApiUrl] = useState("http://localhost:8080")
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      setIsConnected(response.ok)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [apiUrl])

  const handleUrlChange = (newUrl: string) => {
    setApiUrl(newUrl)
    onApiUrlChange(newUrl)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          PwnSensei API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">API Base URL</Label>
          <div className="flex gap-2">
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="http://localhost:8080"
            />
            <Button onClick={checkConnection} disabled={isChecking} size="sm">
              <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          {isConnected === null ? (
            <Badge variant="secondary">Checking...</Badge>
          ) : isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>

        {!isConnected && (
          <div className="text-sm text-muted-foreground">
            <p>Make sure your PwnSensei Go API is running and accessible.</p>
            <p className="mt-1">Expected endpoints:</p>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>
                <code>/api/analyze</code> - Stockfish analysis
              </li>
              <li>
                <code>/api/analyze/commentary</code> - LLM commentary
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
