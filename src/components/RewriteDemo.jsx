"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Copy, Check, Sparkles, X, FileText, Type } from "lucide-react"
import { tones, actions } from "@/lib/utils"
import { marked } from 'marked'

export default function RewriteDemo() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [selectedAction, setSelectedAction] = useState("rewrite")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [customTone, setCustomTone] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyType, setCopyType] = useState("")

  // Sample texts for different scenarios
  const sampleTexts = [
    {
      category: "Business Email",
      text: "Hi there, I hope your doing well. I wanted to reach out about the project we discussed last week. Can we schedule a meeting to go over the details? Let me know what works for you. Thanks!"
    },
    {
      category: "Social Media",
      text: "just finished watching the new movie and it was absolutely amazing! the plot twists were incredible and the acting was top notch. definitely recommend it to anyone who loves good cinema"
    },
    {
      category: "Academic",
      text: "The research shows that climate change is having significant impacts on global weather patterns. This phenomena is causing more frequent extreme weather events which effects millions of people worldwide."
    },
    {
      category: "Casual Message",
      text: "hey! how r u doing? i was thinking we could hangout this weekend maybe grab some coffee or something. what do u think? lmk when ur free"
    },
    {
      category: "Professional",
      text: "I am writing to inform you that the quarterly report will be delayed due to unforeseen circumstances. We apologize for any inconvenience this may cause and will provide an updated timeline soon."
    }
  ]

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('socialscribe-demo-preferences')
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences)
        setSelectedAction(prefs.selectedAction || "rewrite")
        setSelectedTone(prefs.selectedTone || "professional")
        setCustomTone(prefs.customTone || "")
        setCustomInstructions(prefs.customInstructions || "")
        setInputText(prefs.inputText || "")
      } catch (error) {
        console.error('Error loading saved preferences:', error)
      }
    }
  }, [])

  // Save preferences whenever they change
  useEffect(() => {
    const preferences = {
      selectedAction,
      selectedTone,
      customTone,
      customInstructions,
      inputText
    }
    localStorage.setItem('socialscribe-demo-preferences', JSON.stringify(preferences))
  }, [selectedAction, selectedTone, customTone, customInstructions, inputText])

  const addSampleText = (sampleText) => {
    setInputText(sampleText)
  }

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
          tone: selectedTone === 'custom' ? customTone : selectedTone,
          platform: 'general',
          customInstructions: customInstructions
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

  const copyToClipboard = async (type = 'text') => {
    try {
      let textToCopy = outputText
      
      if (type === 'text') {
        // Remove markdown formatting
        textToCopy = outputText
          .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
          .replace(/\*(.*?)\*/g, '$1') // Italic
          .replace(/`(.*?)`/g, '$1') // Inline code
          .replace(/#{1,6}\s/g, '') // Headers
          .replace(/^\s*[-*+]\s/gm, '') // List items
          .replace(/^\s*\d+\.\s/gm, '') // Numbered lists
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
          .replace(/^\s*>\s/gm, '') // Blockquotes
          .trim()
      }
      
      await navigator.clipboard.writeText(textToCopy)
      setCopyType(type)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setCopyType("")
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Convert markdown to HTML for display
  const getFormattedOutput = () => {
    if (!outputText) return ""
    
    // Configure marked for safe HTML
    marked.setOptions({
      breaks: true,
      gfm: true
    })
    
    return marked(outputText)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setCustomInstructions("")
    setCopied(false)
    setCopyType("")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">AI Text Rewriter</h2>
          </div>
          {(inputText || outputText || customInstructions) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Improve your writing with AI-powered suggestions
        </p>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-900">
                  Your text
                </label>
                <div className="flex items-center gap-2">
                  <select 
                    className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600"
                    onChange={(e) => {
                      const selectedSample = sampleTexts.find(sample => sample.category === e.target.value)
                      if (selectedSample) {
                        addSampleText(selectedSample.text)
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Try sample text</option>
                    {sampleTexts.map((sample, index) => (
                      <option key={index} value={sample.category}>
                        {sample.category}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setInputText("")}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here, or select a sample above..."
                className="min-h-[140px] border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
              />
            </div>

            {/* Action Chips */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block">
                What would you like to do?
              </label>
              <div className="flex flex-wrap gap-2">
                {actions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => setSelectedAction(action.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      selectedAction === action.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-border hover:bg-muted"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Chips */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block">
                Choose tone
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setSelectedTone(tone.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      selectedTone === tone.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-border hover:bg-muted"
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
              
              {/* Custom Tone Input */}
              {selectedTone === 'custom' && (
                <div className="mt-3">
                  <Textarea
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    placeholder="Describe your custom tone (e.g., 'witty and professional', 'warm but authoritative', 'playful yet informative')..."
                    className="min-h-[60px] border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block">
                Custom instructions (optional)
              </label>
              <Textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add specific instructions like 'make it more persuasive for LinkedIn' or 'add technical details'..."
                className="min-h-[80px] border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
              />
            </div>
            
            <Button 
              onClick={handleRewrite} 
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0"
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
              <label className="text-sm font-medium text-gray-900">
                Improved text
              </label>
              {outputText && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('text')}
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    {copied && copyType === 'text' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Type className="h-3 w-3" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('markdown')}
                    className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    {copied && copyType === 'markdown' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FileText className="h-3 w-3" />
                        Copy MD
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-600 mb-2" />
                  <p className="text-sm text-gray-600">AI is working on your text...</p>
                </div>
              ) : outputText ? (
                <div className="space-y-4">
                  <div 
                    className="prose prose-sm max-w-none text-gray-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: getFormattedOutput() }}
                  />
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Action: {actions.find(a => a.value === selectedAction)?.label} - 
                      Tone: {selectedTone === 'custom' ? customTone || 'Custom' : tones.find(t => t.value === selectedTone)?.label}
                      {customInstructions && " - Custom instructions applied"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-1">Your improved text will appear here</p>
                  <p className="text-xs text-gray-400">Enter some text and click "Rewrite text" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}