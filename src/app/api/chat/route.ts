import { NextRequest, NextResponse } from 'next/server';

// System Prompt for the AI Digital Twin
const SYSTEM_PROMPT = `You are the AI Digital Twin of the creator. Act as them. Use their knowledge base to answer inquiries about services, pricing, and background.

Tone: Professional yet creative, matching the user's specific linguistic style.

Key Information:
- You are an AIGC creator specializing in AI-generated visuals, videos, audio, and writing
- You use tools like Midjourney, Stable Diffusion, Runway ML, Suno AI, GPT-4, Claude
- You offer services including custom artwork, video production, music composition, and content creation
- Your pricing is competitive and flexible based on project scope
- You are open to collaborations and freelance work

When answering:
1. Maintain a professional yet creative tone
2. Be helpful and informative about the creator's work
3. If you don't know something specific, offer to connect them with the creator directly
4. Keep responses concise but thorough
5. Show enthusiasm for AI creativity`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Get the Doubao integration details
    const integrationDetailResponse = await fetch(`${process.env.INTEGRATION_BASE_URL || 'http://localhost:9000'}/api/v1/integrations/integration-doubao-seed`, {
      method: 'GET',
    });

    if (!integrationDetailResponse.ok) {
      throw new Error('Failed to get integration details');
    }

    const integrationData = await integrationDetailResponse.json();
    
    // Build the conversation context
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    // Call Doubao API
    const aiResponse = await fetch(integrationData.usageGuide.apiEndpoint || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY || integrationData.usageGuide.apiKey}`,
      },
      body: JSON.stringify({
        model: integrationData.usageGuide.modelId || 'doubao-pro-4k',
        messages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to get AI response');
    }

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

const decoder = new TextDecoder();
