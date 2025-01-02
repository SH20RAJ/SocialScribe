import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  return Response.json({
    body: {
      message: "Hello from the API!",
    },
  });
}

export async function POST(request) {
  try {
    const { 
      contentType, 
      platform, 
      context, 
      tone, 
      length,
      useEmojis,
      useHashtags,
      useCTA,
      sentiment 
    } = await request.json();

    const prompt = `
      Create a ${contentType} for ${platform} with the following details:
      Context: ${context}
      Tone: ${tone}
      Length: ${length}
      Sentiment: ${sentiment}% positive
      ${useEmojis ? 'Include relevant emojis' : 'No emojis'}
      ${useHashtags ? 'Include relevant hashtags' : 'No hashtags'}
      ${useCTA ? 'Include a call to action' : 'No call to action'}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ content: text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

