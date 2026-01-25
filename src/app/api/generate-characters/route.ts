import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

// 缓存配置
const CHARACTERS_CACHE_KEY = 'characters_images_cache';
const CHARACTERS_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天

interface CharacterImage {
  creatorUrl: string;
  assistantUrl: string;
  timestamp: number;
}

// 全局缓存
let charactersCache: CharacterImage | null = null;

export async function POST(request: NextRequest) {
  try {
    const now = Date.now();

    // 检查缓存
    if (charactersCache && (now - charactersCache.timestamp) < CHARACTERS_CACHE_DURATION) {
      console.log('使用缓存的角色图像');
      return NextResponse.json(charactersCache);
    }

    const config = new Config();
    const client = new ImageGenerationClient(config);

    // 生成AIGC创作者小男孩图像 - 办公室创作场景
    const boyPrompt = `A cute Pixar 3D style boy character working at a modern creative studio desk with a computer, focused and passionate expression, creating digital art, red and purple neon color scheme, cyberpunk aesthetic, wearing modern casual clothes, creative workspace setup with glowing screens, high-quality 3D render, stylized sticker design, isolated on transparent background, 4K ultra HD resolution, PNG format`;

    // 生成AI助手形象 - 陪伴创作的智能伙伴
    const robotPrompt = `A friendly AI robot assistant character in Pixar 3D style, floating beside the creator, holographic interface, glowing purple and pink neon lights, sleek futuristic design, helpful and supportive pose, high-quality 3D render, stylized sticker design, isolated on transparent background, 4K ultra HD resolution, PNG format`;

    console.log('开始生成创作者图像...');
    const boyResponse = await client.generate({
      prompt: boyPrompt,
      size: '2K',
      watermark: false,
    });

    const boyHelper = client.getResponseHelper(boyResponse);
    if (!boyHelper.success || boyHelper.imageUrls.length === 0) {
      throw new Error('创作者图像生成失败');
    }

    console.log('创作者图像生成成功:', boyHelper.imageUrls[0]);

    console.log('开始生成AI助手图像...');
    const robotResponse = await client.generate({
      prompt: robotPrompt,
      size: '2K',
      watermark: false,
    });

    const robotHelper = client.getResponseHelper(robotResponse);
    if (!robotHelper.success || robotHelper.imageUrls.length === 0) {
      throw new Error('AI助手图像生成失败');
    }

    console.log('AI助手图像生成成功:', robotHelper.imageUrls[0]);

    // 更新缓存
    charactersCache = {
      creatorUrl: boyHelper.imageUrls[0],
      assistantUrl: robotHelper.imageUrls[0],
      timestamp: now,
    };

    return NextResponse.json(charactersCache);
  } catch (error) {
    console.error('生成角色图像失败:', error);

    // 返回默认图像（使用占位符）
    return NextResponse.json({
      creatorUrl: 'https://via.placeholder.com/512x512/ef4444/ffffff?text=Creator',
      assistantUrl: 'https://via.placeholder.com/512x512/8b5cf6/ffffff?text=AI+Assistant',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // GET 请求返回缓存数据或默认数据
  const now = Date.now();

  if (charactersCache && (now - charactersCache.timestamp) < CHARACTERS_CACHE_DURATION) {
    return NextResponse.json(charactersCache);
  }

  // 如果没有缓存，返回默认数据
  return NextResponse.json({
    creatorUrl: 'https://via.placeholder.com/512x512/ef4444/ffffff?text=Creator',
    assistantUrl: 'https://via.placeholder.com/512x512/8b5cf6/ffffff?text=AI+Assistant',
    timestamp: Date.now(),
  });
}
