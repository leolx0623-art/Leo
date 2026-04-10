import { NextRequest, NextResponse } from 'next/server';

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

// 缓存配置
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时

// 缓存接口
interface WeatherCache {
  data: WeatherInfo;
  timestamp: number;
}

// 全局缓存
let weatherCache: WeatherCache | null = null;

// 默认天气信息
function getDefaultWeather(): WeatherInfo {
  return {
    city: '上海',
    temperature: '25°C',
    condition: '晴',
    emoji: '☀️',
  };
}

// 获取天气信息（带缓存）
async function getWeatherInfo(): Promise<WeatherInfo> {
  const now = Date.now();

  // 检查缓存是否有效
  if (weatherCache && (now - weatherCache.timestamp) < CACHE_DURATION) {
    console.log('使用缓存的天气数据，缓存时间:', new Date(weatherCache.timestamp).toLocaleString('zh-CN'));
    return weatherCache.data;
  }

  console.log('开始获取上海实时天气...');

  try {
    const { SearchClient, Config } = await import('coze-coding-dev-sdk');
    const config = new Config();
    const searchClient = new SearchClient(config);

    // 搜索上海实时天气
    const searchQueries = [
      '上海今天实时天气温度',
      '上海市现在天气',
    ];

    let searchResults = '';

    // 尝试多个搜索查询
    for (const query of searchQueries) {
      try {
        console.log('执行搜索:', query);
        const response = await searchClient.webSearchWithSummary(query, 3);

        if (response.web_items && response.web_items.length > 0) {
          const results = response.web_items
            .map(item => item.snippet + ' ' + (item.summary || ''))
            .join(' ');
          searchResults += results + ' ';
          console.log('搜索成功，结果长度:', results.length);
        }
      } catch (searchError) {
        console.error('搜索失败:', query, searchError);
        continue;
      }
    }

    // 解析天气信息
    let temperature = '25°C';
    let condition = '晴';
    let emoji = '☀️';

    // 尝试从搜索结果中提取温度
    const tempMatch = searchResults.match(/(\d+)\s*°?\s*C/);
    if (tempMatch) {
      temperature = `${tempMatch[1]}°C`;
    }

    // 尝试识别天气状况
    const weatherPatterns = [
      { keywords: ['雷雨', '雷阵雨'], condition: '雷阵雨', emoji: '⛈️' },
      { keywords: ['暴雨', '大雨'], condition: '大雨', emoji: '⛈️' },
      { keywords: ['中雨'], condition: '中雨', emoji: '🌧️' },
      { keywords: ['小雨', '雨'], condition: '小雨', emoji: '🌦️' },
      { keywords: ['雪'], condition: '雪', emoji: '❄️' },
      { keywords: ['雾', '霾'], condition: '雾', emoji: '🌫️' },
      { keywords: ['阴'], condition: '阴', emoji: '☁️' },
      { keywords: ['多云', '少云'], condition: '多云', emoji: '⛅' },
      { keywords: ['晴', '晴朗'], condition: '晴', emoji: '☀️' },
    ];

    for (const pattern of weatherPatterns) {
      if (pattern.keywords.some(keyword => searchResults.includes(keyword))) {
        condition = pattern.condition;
        emoji = pattern.emoji;
        break;
      }
    }

    const weatherData: WeatherInfo = {
      city: '上海',
      temperature,
      condition,
      emoji,
    };

    // 更新缓存
    weatherCache = {
      data: weatherData,
      timestamp: now,
    };

    return weatherData;
  } catch (error) {
    console.error('获取天气信息失败:', error);
    const defaultWeather = getDefaultWeather();

    // 缓存默认值
    weatherCache = {
      data: defaultWeather,
      timestamp: now,
    };

    return defaultWeather;
  }
}

// 生成心情语录
async function generateMoodQuote(): Promise<string> {
  try {
    const { LLMClient, Config } = await import('coze-coding-dev-sdk');
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
        weather: getDefaultWeather(),
        moodQuote: '系统正在休眠...',
        online: true,
      } as StatusResponse,
      { status: 200 }
    );
  }
}

// POST 方法：清除缓存并重新获取数据
export async function POST(request: NextRequest) {
  try {
    // 清除缓存
    weatherCache = null;
    console.log('已清除天气缓存');

    // 重新获取数据
    const [weather, moodQuote] = await Promise.all([
      getWeatherInfo(),
      generateMoodQuote(),
    ]);

    const statusResponse: StatusResponse = {
      weather,
      moodQuote,
      online: true,
    };

    return NextResponse.json({
      ...statusResponse,
      message: '数据已刷新',
    });
  } catch (error) {
    console.error('刷新状态失败:', error);

    return NextResponse.json(
      {
        error: '刷新失败',
        weather: getDefaultWeather(),
        moodQuote: '系统正在休眠...',
        online: true,
      },
      { status: 500 }
    );
  }
}
