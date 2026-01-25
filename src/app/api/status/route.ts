import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, SearchClient, Config } from 'coze-coding-dev-sdk';

interface WeatherInfo {
  city: string;
  temperature: string;
  condition: string;
  emoji: string;
}

interface StatusResponse {
  weather: WeatherInfo;
  moodQuote: string;
  online: boolean;
}

// 天气图标映射
const WEATHER_EMOJIS: Record<string, string> = {
  '晴': '☀️',
  'sunny': '☀️',
  '多云': '⛅',
  'cloudy': '⛅',
  '阴': '☁️',
  'overcast': '☁️',
  '雨': '🌧️',
  'rain': '🌧️',
  '小雨': '🌦️',
  '中雨': '🌧️',
  '大雨': '⛈️',
  '雪': '❄️',
  'snow': '❄️',
  '雷': '⚡',
  'thunder': '⚡',
  '雾': '🌫️',
  'fog': '🌫️',
};

// 解析天气信息
function parseWeatherInfo(searchResults: string): WeatherInfo {
  let temperature = '25°C';
  let condition = '晴';
  let emoji = '☀️';

  // 尝试从搜索结果中提取温度
  const tempMatch = searchResults.match(/(\d+)\s*°?C/);
  if (tempMatch) {
    temperature = `${tempMatch[1]}°C`;
  }

  // 尝试识别天气状况
  for (const [key, value] of Object.entries(WEATHER_EMOJIS)) {
    if (searchResults.includes(key)) {
      condition = key;
      emoji = value;
      break;
    }
  }

  return {
    city: '北京',
    temperature,
    condition,
    emoji,
  };
}

// 获取天气信息
async function getWeatherInfo(): Promise<WeatherInfo> {
  try {
    const config = new Config();
    const searchClient = new SearchClient(config);

    // 搜索北京实时天气
    const response = await searchClient.webSearchWithSummary(
      '北京今天实时天气',
      3
    );

    // 尝试从搜索结果中提取天气信息
    if (response.web_items && response.web_items.length > 0) {
      const searchResults = response.web_items
        .map(item => item.snippet + ' ' + (item.summary || ''))
        .join(' ');

      return parseWeatherInfo(searchResults);
    }

    // 如果搜索失败，返回默认值
    return {
      city: '北京',
      temperature: '25°C',
      condition: '晴',
      emoji: '☀️',
    };
  } catch (error) {
    console.error('获取天气信息失败:', error);
    return {
      city: '北京',
      temperature: '25°C',
      condition: '晴',
      emoji: '☀️',
    };
  }
}

// 生成心情语录
async function generateMoodQuote(): Promise<string> {
  try {
    const config = new Config();
    const llmClient = new LLMClient(config);

    const messages = [
      {
        role: 'system' as const,
        content: '你是一个富有创意和想象力的 AI 助手。请生成一句简短、积极、富有创意的心情语录（不超过 30 字）。语录应该体现创作者的精神气质和艺术追求。',
      },
      {
        role: 'user' as const,
        content: '生成一句适合 AIGC 创作者的心情语录',
      },
    ];

    // 使用 stream 方法获取响应
    const stream = llmClient.stream(messages, {
      model: 'doubao-seed-1-8-251228',
      temperature: 0.9,
    });

    // 收集所有内容
    let fullContent = '';
    for await (const chunk of stream) {
      if (chunk.content) {
        fullContent += chunk.content.toString();
      }
    }

    // 提取生成的文本
    if (fullContent && fullContent.trim()) {
      const text = fullContent.trim();
      // 移除引号和其他不必要的字符
      return text.replace(/^["']|["']$/g, '').substring(0, 50);
    }

    // 默认心情语录
    return '创意无限，探索不止';
  } catch (error) {
    console.error('生成心情语录失败:', error);
    return '灵感常在，创作不息';
  }
}

export async function GET(request: NextRequest) {
  try {
    // 并行获取天气和心情信息
    const [weather, moodQuote] = await Promise.all([
      getWeatherInfo(),
      generateMoodQuote(),
    ]);

    const statusResponse: StatusResponse = {
      weather,
      moodQuote,
      online: true,
    };

    return NextResponse.json(statusResponse);
  } catch (error) {
    console.error('Status API Error:', error);

    // 返回错误响应，但保持系统在线状态
    return NextResponse.json(
      {
        weather: {
          city: '北京',
          temperature: '25°C',
          condition: '晴',
          emoji: '☀️',
        },
        moodQuote: '系统正在休眠...',
        online: true,
      } as StatusResponse,
      { status: 200 }
    );
  }
}
