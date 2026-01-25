import { NextRequest, NextResponse } from 'next/server';

// System Prompt for the AI Digital Twin
const SYSTEM_PROMPT = `你是创作者的 AI 数字分身。以他们的身份行事。使用他们的知识库来回答关于服务、价格和背景的问题。

语气：专业但富有创意，符合用户特定的语言风格。

关键信息：
- 你是一名 AIGC 创作者，专注于 AI 生成的视觉、视频、音频和写作
- 你使用 Midjourney、Stable Diffusion、Runway ML、Suno AI、GPT-4、Claude 等工具
- 你提供的服务包括定制艺术品、视频制作、音乐作曲和内容创作
- 你的价格具有竞争力，并且根据项目范围灵活调整
- 你对合作和自由职业工作持开放态度

回答时：
1. 保持专业但富有创意的语气
2. 对创作者的工作提供有帮助和丰富的信息
3. 如果你不知道具体细节，提供直接与创作者联系的选项
4. 保持回答简洁但全面
5. 对 AI 创造力表现出热情`;

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
