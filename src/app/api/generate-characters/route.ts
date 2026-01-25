import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

// 缓存配置
const CHARACTERS_CACHE_KEY = 'characters_images_cache';
const CHARACTERS_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天

interface CharacterImage {
  robotUrl: string;
  boyUrl: string;
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

    // 生成机器人图像
    const robotPrompt = `A high-quality, stylish full-body AI robot character, cyberpunk style, purple and blue color scheme, sleek and modern design, metallic texture with glowing LED lights, futuristic technology details, standing pose, confident and friendly expression, clean white background, 4K ultra HD resolution`;

    // 生成皮克斯风格小男孩图像
    const boyPrompt = `A handsome full-body cartoon boy character in Pixar animation style, cute and charming face, short brown hair, cheerful smile, wearing casual modern clothes, bright and vivid colors, expressive eyes, dynamic standing pose, full body visible, clean white background, 4K ultra HD resolution`;

    console.log('开始生成机器人图像...');
    const robotResponse = await client.generate({
      prompt: robotPrompt,
      size: '2K',
      watermark: false,
    });

    const robotHelper = client.getResponseHelper(robotResponse);
    if (!robotHelper.success || robotHelper.imageUrls.length === 0) {
      throw new Error('机器人图像生成失败');
    }

    console.log('机器人图像生成成功:', robotHelper.imageUrls[0]);

    console.log('开始生成小男孩图像...');
    const boyResponse = await client.generate({
      prompt: boyPrompt,
      size: '2K',
      watermark: false,
    });

    const boyHelper = client.getResponseHelper(boyResponse);
    if (!boyHelper.success || boyHelper.imageUrls.length === 0) {
      throw new Error('小男孩图像生成失败');
    }

    console.log('小男孩图像生成成功:', boyHelper.imageUrls[0]);

    // 更新缓存
    charactersCache = {
      robotUrl: robotHelper.imageUrls[0],
      boyUrl: boyHelper.imageUrls[0],
      timestamp: now,
    };

    return NextResponse.json(charactersCache);
  } catch (error) {
    console.error('生成角色图像失败:', error);

    // 返回默认图像（使用占位符）
    return NextResponse.json({
      robotUrl: 'https://via.placeholder.com/512x512/6366f1/ffffff?text=AI+Robot',
      boyUrl: 'https://via.placeholder.com/512x512/f59e0b/ffffff?text=Boy',
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
    robotUrl: 'https://via.placeholder.com/512x512/6366f1/ffffff?text=AI+Robot',
    boyUrl: 'https://via.placeholder.com/512x512/f59e0b/ffffff?text=Boy',
    timestamp: Date.now(),
  });
}
