import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface RequestBody {
  prompt: string
  width?: number
  height?: number
  seed?: number
  model?: string
  enhance?: boolean
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
    const { prompt, width = 512, height = 512, seed, model, enhance = false }: RequestBody = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Build the Pollinations AI image URL
    const params = new URLSearchParams()
    params.append('width', width.toString())
    params.append('height', height.toString())
    
    if (seed) {
      params.append('seed', seed.toString())
    }
    
    if (model) {
      params.append('model', model)
    }
    
    if (enhance) {
      params.append('enhance', 'true')
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`

    // Return the image URL and metadata
    return NextResponse.json({
      success: true,
      imageUrl,
      metadata: {
        prompt,
        width,
        height,
        seed,
        model,
        enhance,
        timestamp: new Date().toISOString(),
        source: 'pollinations'
      }
    })

  } catch (error) {
    console.error('Image Generation Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET endpoint for direct image generation
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const prompt = url.searchParams.get('prompt')
    const width = parseInt(url.searchParams.get('width') || '512')
    const height = parseInt(url.searchParams.get('height') || '512')
    const seed = url.searchParams.get('seed')
    const model = url.searchParams.get('model')
    const enhance = url.searchParams.get('enhance') === 'true'

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Build the Pollinations AI image URL
    const params = new URLSearchParams()
    params.append('width', width.toString())
    params.append('height', height.toString())
    
    if (seed) {
      params.append('seed', seed)
    }
    
    if (model) {
      params.append('model', model)
    }
    
    if (enhance) {
      params.append('enhance', 'true')
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`

    // Fetch the image and return it directly
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to generate image: ${imageResponse.status}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('Image Generation Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}