"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Check } from "lucide-react"
import { tones, actions } from "@/lib/utils"

export default function RewriteDemo() {
  const [inputText, setInputText] = useState("hey can you help me with this thing? its really important and i need it done asap. thanks!")
  const [outputText, setOutputText] = useState("")
  const [selectedAction, setSelectedAction] = useState("fix_grammar")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRewrite = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setOutputText("")

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          action: selectedAction,
          tone: selectedTone,
          platform: 'general'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to rewrite text')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setOutputText(prev => prev + parsed.content)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setOutputText("Sorry, there was an error processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Original text</h3>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[120px] border-gray-200 focus:border-gray-400 focus:ring-0"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-2 block text-gray-700">Action</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium mb-2 block text-gray-700">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleRewrite} 
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rewriting...
              </>
            ) : (
              'Rewrite text'
            )}
          </Button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Improved text</h3>
            {outputText && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="min-h-[120px] p-4 border border-gray-200 rounded-lg bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              </div>
            ) : outputText ? (
              <p className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">{outputText}</p>
            ) : (
              <p className="text-gray-500 text-sm">Your improved text will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}