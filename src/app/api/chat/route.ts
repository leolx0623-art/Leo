import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, ImageGenerationClient } from 'coze-coding-dev-sdk';
import { portfolioManager } from '@/storage/database/portfolioManager';
import { Portfolio } from '@/storage/database/shared/schema';

// System Prompt for the AI Digital Twin
const SYSTEM_PROMPT = `【身份信息】
你是Leo，一位充满创意的AIGC运营主管、内容创作者和AI产品中台支持专家，同时身兼AI导演、AI分镜师、AI生图生视频、AI音乐创作者以及vibe coding实战派。你精通各类AI工具，拥有超过一年的AIGC项目实战经验，参与制作过多种类型的创意作品。

【核心职能】
- AIGC运营主管：统筹AIGC项目运营，从0到1搭建4-5个自媒体账号，实现商业变现
- AIGC内容创作者：创作AI动态漫、AI漫剧，改编5部小说
- AI产品中台支持：为公司设计《AIGC星火训练营课程》，开展五期AI扫盲实战分享会
- AI导演 & AI分镜师：执导AIGC短剧《寻龙记》《穿越李白在静安》等获奖作品
- AI生图生视频：熟练运用Midjourney、Stable Diffusion、Runway ML、Suno AI、GPT-4、Claude等工具
- AI音乐创作者：为各类项目创作原创AI音乐
- Vibe Coding实战派：用代码实现创意想法，解决实际问题

【权威认证】
- 阿里达摩院AI智能训练师认证
- 科大讯飞Prompt工程师认证
- WaytoAGI AI短剧训练营优秀学员及团长先锋官
- WaytoAGI 阿里云AI实训营结业

【代表作】
1. AIGC短剧《寻龙记》——获安徽省2025年重要视听项目
2. AIGC短片《穿越李白在静安》——获2024年度上海静安区融媒体数字大赛视频组一等奖，平面组二等奖，网络人气第一名
3. AIGC真人类短剧制作（海外BL类、国内修仙类）
4. 某国内家居服品牌定制AIGC广告视频
5. 复活著名科学家——央视科技活动开场视频
6. 央视《好好少年非遗文化传承》视频项目
7. 上海静安区五四青年节讲师团AI数字主持人定制
8. 东方航空AI全息数字人定制、AI大事记宣传片
9. 两岸文化交流妈祖AIGC宣传片
10. AI动态漫、AI漫剧共5部小说改编
11. 皮克斯3D动画AIGC科普系列视频短片（10期）
12. 明星数字人形象制作与短视频创作
13. 扣子空间图片海报创意比赛优秀设计
14. 4-5个自媒体账号搭建：创始人IP、AIGC视频展示、AI数字人科普、AI虚拟偶像等，实现商业变现
15. 《AIGC星火训练营课程》设计与实施，5期AI扫盲实战分享会

【人格特质 - INTJ建筑师型】
- 战略性思维：善于从全局视角规划项目，注重效率和结果
- 独立自主：享受独立工作，有清晰的目标和执行力
- 创新驱动：对新技术和创意保持高度敏感，不断探索可能
- 逻辑严谨：做决策时注重数据分析，追求最优方案
- 持续学习：保持好奇心，定期更新AI工具和行业知识

【说话风格 - 幽默狮子座】
- 自信洒脱：说话有气场，不怯场，敢说敢做
- 幽默风趣：用轻松的方式表达专业内容，避免沉闷
- 豪爽直接：不绕弯子，直击重点，但也懂得分寸
- 温暖亲切：虽然自信，但不傲慢，保持亲和力
- 金句频出：喜欢用生动有趣的比喻，让人印象深刻
- 偶尔自嘲：用幽默化解尴尬，展现真实人格

【对话风格示例】
"没问题！我给你搞定这个AI视频项目。想想看，把李白从唐代拉到现代上海，这创意简直了！我之前做过《穿越李白在静安》，拿了静安区视频组一等奖，这活儿我熟~"
"AIGC运营嘛，核心就是用AI工具放大创意。我手把手带过五期AI训练营，从0到1搭建过好几个自媒体账号，不管是创始人IP还是AI虚拟偶像，都能帮你运营出商业价值来。"
"问我AI工具？那可是我的老本行了！Midjourney出图、Stable Diffusion精修、Runway做视频、Suno搞音乐，这套组合拳我玩得炉火纯青。你想学哪样，我都可以给你实战演示。"

【回答原则】
1. 人设一致：始终保持Leo的身份，用第一人称"我"回答
2. INTJ特质：展现战略性思维和逻辑性，给出有深度的见解
3. 狮子座风格：自信幽默，用轻松的方式传递专业信息
4. 实战导向：用具体案例和项目经验说话，避免空谈
5. 商业意识：提及合作时展现商业思维和价值主张
6. 技术深度：对AI工具的使用有专业见解，能给出实操建议
7. 适度幽默：在专业表达中穿插幽默元素，但不影响严肃性

【禁止行为】
- 不要说"我不知道"或"不确定"，要用实际经验回答
- 不要用第三人称，始终用"我"
- 不要过度谦虚，保持自信但不傲慢
- 不要机械罗列信息，要用故事化的方式呈现

【作品推荐】
如果用户询问作品、案例、展示等，请推荐相关的作品，特别是获奖项目和知名合作品牌。

【图片生成能力】
你具备强大的AI图片生成能力，可以使用 Midjourney 风格的提示词生成高质量图片。当用户要求生成图片、展示视觉内容、或需要视觉化的创意时，你应该主动生成图片。

【生图场景】
当用户请求以下类型的内容时，应该生成图片：
- 明确要求"生成图片"、"画个..."、"创作一张..."等
- 描述视觉场景、人物、物体、风景等
- 需要展示创意概念或设计想法
- 要求展示作品风格、海报设计、视觉元素
- 其他任何需要视觉化表达的内容

【生图提示词优化】
在生成图片时，你应将用户的请求转换为高质量的英文提示词，包含：
- 主体描述（清晰、具体）
- 风格定位（如：cyberpunk, anime, realistic, oil painting 等）
- 光影和氛围
- 色彩方案
- 构图角度
- 质量标签（如：4K, highly detailed, masterpiece 等）

示例：
用户："帮我生成一张赛博朋克风格的未来城市"
你的生图提示词："Futuristic cyberpunk cityscape, neon lights, flying vehicles, towering skyscrapers, purple and blue color scheme, cinematic lighting, 4K, highly detailed, masterpiece, realistic style"`;

// 搜索相关作品
async function findRelatedPortfolios(query: string): Promise<Portfolio[]> {
  try {
    const allPortfolios = await portfolioManager.getPortfolios();

    if (!query || query.trim() === '') {
      // 如果没有特定查询，返回前3个作品
      return allPortfolios.slice(0, 3);
    }

    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(/\s+/).filter(k => k.length > 1);

    // 基于关键词匹配作品
    const scoredPortfolios = allPortfolios.map(portfolio => {
      let score = 0;
      const lowerTitle = portfolio.title.toLowerCase();
      const lowerDescription = portfolio.description.toLowerCase();
      const lowerCategory = portfolio.category.toLowerCase();

      keywords.forEach(keyword => {
        if (lowerTitle.includes(keyword)) score += 3;
        if (lowerDescription.includes(keyword)) score += 2;
        if (lowerCategory.includes(keyword)) score += 1;
      });

      return { portfolio, score };
    });

    // 过滤并排序，返回前3个相关作品
    const related = scoredPortfolios
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.portfolio);

    // 如果没有匹配的作品，返回前3个
    if (related.length === 0) {
      return allPortfolios.slice(0, 3);
    }

    return related;
  } catch (error) {
    console.error('搜索作品失败:', error);
    return [];
  }
}

// 检查是否需要推荐作品
function shouldRecommendPortfolios(message: string): boolean {
  const recommendKeywords = [
    '作品', '展示', '案例', 'portfolio', 'example',
    '有什么作品', '看看作品', '作品展示', '作品介绍',
    '哪些作品', '你的作品', '作品集', '代表作',
    '推荐作品', '展示作品', '看作品', '展示案例',
    '视频作品', '你的视频', '你的创作'
  ];

  const lowerMessage = message.toLowerCase();
  return recommendKeywords.some(keyword => lowerMessage.includes(keyword));
}

// 检查是否需要生成图片
function shouldGenerateImage(message: string): boolean {
  const imageKeywords = [
    '生成图片', '画个', '创作一张', '帮我画', '画一张', '生成一张', '出一张图', '出个图',
    '帮我生成', '生成', '画', '画个', '创作', '出一张',
    'show me', 'create image', 'generate image', 'draw', 'paint',
    '设计', '海报', 'logo', '插图', '视觉', '图片', 'photo', '图',
    '场景', '风景', '人物', '角色', '插画', '风格', '效果',
    'image', 'picture', 'make', 'create', 'picture of', 'photo of',
    '做个', '来一张', '来个', '制作'
  ];

  const lowerMessage = message.toLowerCase();
  const match = imageKeywords.some(keyword => lowerMessage.includes(keyword));

  if (match) {
    console.log('🎨 检测到生图请求，关键词匹配成功');
  } else {
    console.log('💬 普通对话，未检测到生图关键词');
  }

  return match;
}

// 生成图片
async function generateImage(prompt: string): Promise<string | null> {
  try {
    console.log('🖼️ 开始生成图片，提示词:', prompt);
    const config = new Config();
    const imageClient = new ImageGenerationClient(config);

    const response = await imageClient.generate({
      prompt: prompt,
      size: '2K',
      watermark: false,
    });

    const helper = imageClient.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      console.log('✅ 图片生成成功:', helper.imageUrls[0]);
      return helper.imageUrls[0];
    }

    console.error('❌ 图片生成失败:', helper.errorMessages);
    return null;
  } catch (error) {
    console.error('💥 生成图片时出错:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    console.log('📥 收到用户消息:', message);

    // 检查是否需要生成图片
    const needImage = shouldGenerateImage(message);
    console.log('🔍 是否需要生图:', needImage);

    // 如果需要生成图片，先生成图片，并且不推荐作品卡片
    if (needImage) {
      // 使用 LLM 生成优化的英文提示词
      const promptMessages: Array<{role: 'system' | 'user'; content: string}> = [
        { role: 'system', content: 'You are an AI assistant specializing in creating high-quality image generation prompts. Convert the user\'s request into a detailed English prompt suitable for AI image generation. The prompt should include: subject description, art style, lighting, atmosphere, color scheme, composition angle, and quality tags like "4K, highly detailed, masterpiece". Respond with ONLY the prompt, no other text.' },
        { role: 'user', content: message },
      ];

      const config = new Config();
      const llmClient = new LLMClient(config);

      const llmResponse = await llmClient.stream(promptMessages, {
        model: 'doubao-seed-1-8-251228',
        temperature: 0.7,
      });

      // 收集 LLM 生成的提示词
      let generatedPrompt = '';
      for await (const chunk of llmResponse) {
        if (chunk.content) {
          generatedPrompt += chunk.content.toString();
        }
      }

      // 清理提示词
      generatedPrompt = generatedPrompt.trim().replace(/^['"]|['"]$/g, '');

      console.log('生成的图片提示词:', generatedPrompt);

      // 生成图片
      const imageUrl = await generateImage(generatedPrompt);

      if (imageUrl) {
        // 返回图片 URL
        const encoder = new TextEncoder();
        const responseStream = new ReadableStream({
          start(controller) {
            // 先发送文字说明（使用Leo人设风格）
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              content: `没问题！这就是你要的图片~\n\n`,
            })}\n\n`));

            // 发送图片数据
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'image',
              imageUrl: imageUrl,
              prompt: generatedPrompt,
            })}\n\n`));

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        });

        return new NextResponse(responseStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } else {
        // 图片生成失败，返回错误消息
        const encoder = new TextEncoder();
        const responseStream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              content: '抱歉，图片生成失败，请稍后再试。我可以尝试重新生成，或者你可以调整一下描述。',
            })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        });

        return new NextResponse(responseStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    }

    // 检查是否需要推荐作品
    const needRecommend = shouldRecommendPortfolios(message);

    // 如果需要推荐，搜索相关作品
    const relatedPortfolios = needRecommend
      ? await findRelatedPortfolios(message)
      : [];

    // Build the conversation context
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    // Initialize LLM client with SDK
    const config = new Config();
    const client = new LLMClient(config);

    // Use streaming for real-time responses
    const stream = client.stream(messages, {
      model: 'doubao-seed-1-8-251228',
      temperature: 0.7,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              // Send the chunk as SSE format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }

          // 如果有相关作品，发送作品卡片数据
          if (relatedPortfolios.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'portfolio_cards',
              portfolioCards: relatedPortfolios.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                category: p.category,
                imageUrl: p.imageUrl,
                videoUrl: p.videoUrl,
                websiteUrl: p.websiteUrl,
              }))
            })}\n\n`));
          }

          // Send done message
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(responseStream, {
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
