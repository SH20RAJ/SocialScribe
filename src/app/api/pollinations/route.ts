import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface RequestBody {
  text: string
  action: string
  tone: string
  platform?: string
  context?: string
  customInstructions?: string
  usePollinationsFirst?: boolean
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { text, action, tone, platform, context, customInstructions, usePollinationsFirst = true }: RequestBody = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Build the prompt based on action and parameters
    let prompt = '';

    switch (action) {
      case 'fix_grammar':
        prompt = `Correct grammar, spelling, and punctuation. Keep the original tone and meaning. Return only the corrected text:\n\n"${text}"`;
        break;
      case 'rewrite':
        prompt = `Rewrite the text in a ${tone} tone${platform ? ` for ${platform}` : ''}. Keep the meaning intact. Return only the rewritten version:\n\n"${text}"`;
        break;
      case 'shorten':
        prompt = `Make this text shorter and more concise${tone && tone !== 'professional' ? ` while maintaining a ${tone} tone` : ''}. Return only the shortened version:\n\n"${text}"`;
        break;
      case 'expand':
        prompt = `Expand this text with more detail and context${tone && tone !== 'professional' ? ` in a ${tone} tone` : ''}. Return only the expanded version:\n\n"${text}"`;
        break;
      case 'summarize':
        prompt = `Create a concise summary${tone && tone !== 'professional' ? ` in a ${tone} tone` : ''}. Return only the summary:\n\n"${text}"`;
        break;
      case 'formalize':
        prompt = `Make this text more formal and professional. Keep the original meaning. Return only the formal version:\n\n"${text}"`;
        break;
      default:
        prompt = `Improve the clarity and effectiveness of this text${tone && tone !== 'professional' ? ` in a ${tone} tone` : ''}. Return only the improved version:\n\n"${text}"`;
    }

    const prefix = 'You are an AI writing assistant. Do not explain. Just return the result.';
    prompt = `${prefix}\n\n${prompt}`;

    if (context) {
      prompt += `\n\nContext: ${context}`
    }

    if (customInstructions) {
      prompt += `\n\nAdditional instructions: ${customInstructions}`
    }

    // Try Pollinations AI first if enabled
    if (usePollinationsFirst) {
      try {
        console.log('Trying Pollinations AI first...')
        const pollinationsResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'SocialScribe/1.0'
          }
        })

        if (pollinationsResponse.ok) {
          const result = await pollinationsResponse.text()
          console.log('Pollinations AI successful')
          
          // Return as streaming response to match the original API format
          const encoder = new TextEncoder()
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: result, source: 'pollinations' })}\n\n`))
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
              controller.close()
            }
          })

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
              'Access-Control-Max-Age': '86400',
            },
          })
        } else {
          console.warn('Pollinations AI failed, falling back to OpenRouter')
        }
      } catch (error) {
        console.warn('Pollinations AI error, falling back to OpenRouter:', error)
      }
    }

    // Fallback to OpenRouter API with multiple models
    const models = [
      'meta-llama/llama-4-maverick:free',
      'mistralai/mistral-small-3.2-24b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      "qwen/qwen3-30b-a3b:free",
      'google/gemma-2-9b-it:free',
      "deepseek/deepseek-r1-0528:free",
      "mistralai/devstral-small:free",
    ]

    let response: Response | null = null
    let lastError: Error | null = null

    for (const model of models) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://socialscribe.pages.dev',
            'X-Title': 'SocialScribe'
          },
          body: JSON.stringify({
            model: model,
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

        if (response.ok) {
          console.log(`Successfully using OpenRouter model: ${model}`)
          break // Success, exit the loop
        } else {
          const errorText = await response.text()
          console.warn(`Model ${model} failed with status ${response.status}:`, errorText)
          
          // If it's a 503 (service unavailable), try the next model
          if (response.status === 503) {
            lastError = new Error(`Model ${model} temporarily unavailable (503)`)
            continue
          } else {
            // For other errors, throw immediately
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.warn(`Model ${model} failed:`, fetchError)
        lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError))
        
        // If it's an abort error or 503-related, try next model
        if (fetchError instanceof Error && 
            (fetchError.name === 'AbortError' || fetchError.message.includes('503'))) {
          continue
        } else {
          // For other errors, try next model but log the error
          continue
        }
      }
    }

    // If we get here and response is not ok, all models failed
    if (!response || !response.ok) {
      console.error('All models failed. Last error:', lastError)
      throw new Error(`All AI models are currently unavailable. Please try again later. Last error: ${lastError?.message || 'Unknown error'}`)
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
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content, source: 'openrouter' })}\n\n`))
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
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    })

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