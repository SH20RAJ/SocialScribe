import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface RequestBody {
  text: string
  action: string
  tone: string
  platform?: string
  context?: string
  customInstructions?: string
}

export async function POST(request: Request) {
  try {
    const { text, action, tone, platform, context, customInstructions }: RequestBody = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Build the prompt based on action and parameters
    let prompt = ''
    
    switch (action) {
      case 'fix_grammar':
        prompt = `Fix the grammar, spelling, and punctuation in the following text while maintaining the original meaning and tone:\n\n"${text}"`
        break
      case 'rewrite':
        prompt = `Rewrite the following text in a ${tone} tone${platform ? ` for ${platform}` : ''}:\n\n"${text}"`
        break
      case 'shorten':
        prompt = `Make the following text more concise while keeping the key message:\n\n"${text}"`
        break
      case 'expand':
        prompt = `Expand the following text with more detail and context:\n\n"${text}"`
        break
      case 'summarize':
        prompt = `Create a concise summary of the following text:\n\n"${text}"`
        break
      case 'formalize':
        prompt = `Rewrite the following text in a more formal and professional tone:\n\n"${text}"`
        break
      default:
        prompt = `Improve the following text:\n\n"${text}"`
    }

    if (context) {
      prompt += `\n\nContext: ${context}`
    }

    if (customInstructions) {
      prompt += `\n\nAdditional instructions: ${customInstructions}`
    }

    // Call OpenRouter API with better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://socialscribe.pages.dev',
          'X-Title': 'SocialScribe'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 1000
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API error:', response.status, errorText)
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      // Return streaming response with better error handling
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const stream = new ReadableStream({
        async start(controller) {
          if (!response.body) {
            controller.error(new Error('No response body'))
            return
          }

          const reader = response.body.getReader()
          
          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) {
                controller.close()
                break
              }
              
              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n')
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim()
                  
                  if (data === '[DONE]') {
                    controller.close()
                    return
                  }
                  
                  if (data) {
                    try {
                      const parsed = JSON.parse(data)
                      const content = parsed.choices?.[0]?.delta?.content
                      
                      if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                      }
                    } catch (e) {
                      // Skip invalid JSON
                      console.warn('Failed to parse JSON:', data)
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error)
            controller.error(error)
          } finally {
            try {
              reader.releaseLock()
            } catch (e) {
              // Reader might already be released
            }
          }
        },
        cancel() {
          // Clean up when stream is cancelled
          controller.abort()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }

  } catch (error) {
    console.error('API Error:', error)
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}