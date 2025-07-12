'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Image, MessageSquare, Download, Copy, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PollinationsDemo() {
  const [textInput, setTextInput] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [textResult, setTextResult] = useState('')
  const [imageResult, setImageResult] = useState('')
  const [isTextLoading, setIsTextLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [textAction, setTextAction] = useState('rewrite')
  const [tone, setTone] = useState('professional')
  const [imageWidth, setImageWidth] = useState('512')
  const [imageHeight, setImageHeight] = useState('512')
  const [usePollinationsFirst, setUsePollinationsFirst] = useState(true)
  const [resultSource, setResultSource] = useState('')

  const handleTextRewrite = async () => {
    if (!textInput.trim()) return

    setIsTextLoading(true)
    setTextResult('')
    setResultSource('')

    try {
      const response = await fetch('/api/pollinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textInput,
          action: textAction,
          tone: tone,
          usePollinationsFirst: usePollinationsFirst
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process text')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let result = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') break
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  result += parsed.content
                  setTextResult(result)
                }
                if (parsed.source) {
                  setResultSource(parsed.source)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setTextResult('Error processing text. Please try again.')
    } finally {
      setIsTextLoading(false)
    }
  }

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return

    setIsImageLoading(true)
    setImageResult('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          width: parseInt(imageWidth),
          height: parseInt(imageHeight),
          enhance: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const result = await response.json()
      setImageResult(result.imageUrl)
    } catch (error) {
      console.error('Error:', error)
      alert('Error generating image. Please try again.')
    } finally {
      setIsImageLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const downloadImage = () => {
    if (imageResult) {
      const link = document.createElement('a')
      link.href = imageResult
      link.download = `pollinations-${Date.now()}.jpg`
      link.click()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pollinations AI Demo</h1>
        <p className="text-muted-foreground">
          Experience free AI text rewriting and image generation powered by Pollinations AI
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Free API</Badge>
          <Badge variant="secondary">No API Key Required</Badge>
          <Badge variant="secondary">Open Source</Badge>
        </div>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Text Rewriting
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Text Rewriter</CardTitle>
              <CardDescription>
                Rewrite, improve, or transform your text using Pollinations AI or OpenRouter fallback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Action</label>
                  <Select value={textAction} onValueChange={setTextAction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rewrite">Rewrite</SelectItem>
                      <SelectItem value="fix_grammar">Fix Grammar</SelectItem>
                      <SelectItem value="shorten">Shorten</SelectItem>
                      <SelectItem value="expand">Expand</SelectItem>
                      <SelectItem value="summarize">Summarize</SelectItem>
                      <SelectItem value="formalize">Formalize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={usePollinationsFirst}
                      onChange={(e) => setUsePollinationsFirst(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Try Pollinations first</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Input Text</label>
                <Textarea
                  placeholder="Enter your text to rewrite..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleTextRewrite} 
                disabled={isTextLoading || !textInput.trim()}
                className="w-full"
              >
                {isTextLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rewrite Text
                  </>
                )}
              </Button>

              {textResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Result</label>
                    <div className="flex items-center gap-2">
                      {resultSource && (
                        <Badge variant="outline" className="text-xs">
                          {resultSource === 'pollinations' ? '🌸 Pollinations' : '🤖 OpenRouter'}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(textResult)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{textResult}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Image Generator</CardTitle>
              <CardDescription>
                Generate images from text prompts using Pollinations AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Width</label>
                  <Select value={imageWidth} onValueChange={setImageWidth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256px</SelectItem>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Height</label>
                  <Select value={imageHeight} onValueChange={setImageHeight}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256px</SelectItem>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Image Prompt</label>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleImageGeneration} 
                disabled={isImageLoading || !imagePrompt.trim()}
                className="w-full"
              >
                {isImageLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>

              {imageResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Generated Image</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadImage}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={imageResult} 
                      alt="Generated image"
                      className="w-full h-auto"
                      onLoad={() => console.log('Image loaded successfully')}
                      onError={() => console.error('Failed to load image')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Powered by Pollinations AI • {imageWidth}x{imageHeight}px
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}