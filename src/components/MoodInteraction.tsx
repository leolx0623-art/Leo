'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 安全的 localStorage 辅助函数
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
};

// 心情类型定义
export type MoodType =
  | 'happy'
  | 'excited'
  | 'tipsy'
  | 'sad'
  | 'angry'
  | 'uneasy'
  | 'anxious'
  | 'confused'
  | 'smiling'
  | 'calm'
  | 'dreamy'
  | 'energetic';

// 心情配置
const MOOD_CONFIG: Record<
  MoodType,
  {
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
  }
> = {
  happy: {
    label: '开心',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-yellow-500/10',
  },
  excited: {
    label: '兴奋',
    emoji: '🎉',
    color: 'from-pink-400 to-purple-400',
    bgColor: 'bg-pink-500/10',
  },
  tipsy: {
    label: '微醺',
    emoji: '😵‍💫',
    color: 'from-purple-400 to-indigo-400',
    bgColor: 'bg-purple-500/10',
  },
  sad: {
    label: '难过',
    emoji: '😢',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-500/10',
  },
  angry: {
    label: '愤怒',
    emoji: '😠',
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-500/10',
  },
  uneasy: {
    label: '不安',
    emoji: '😰',
    color: 'from-gray-400 to-slate-400',
    bgColor: 'bg-gray-500/10',
  },
  anxious: {
    label: '焦虑',
    emoji: '😨',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
  },
  confused: {
    label: '困惑',
    emoji: '🤔',
    color: 'from-teal-400 to-emerald-400',
    bgColor: 'bg-teal-500/10',
  },
  smiling: {
    label: '微笑',
    emoji: '😄',
    color: 'from-lime-400 to-green-400',
    bgColor: 'bg-lime-500/10',
  },
  calm: {
    label: '平静',
    emoji: '😌',
    color: 'from-sky-400 to-blue-400',
    bgColor: 'bg-sky-500/10',
  },
  dreamy: {
    label: '梦幻',
    emoji: '🦄',
    color: 'from-violet-400 to-purple-400',
    bgColor: 'bg-violet-500/10',
  },
  energetic: {
    label: '活力',
    emoji: '💪',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-500/10',
  },
};

const ALL_MOODS: MoodType[] = [
  'happy',
  'excited',
  'tipsy',
  'sad',
  'angry',
  'uneasy',
  'anxious',
  'confused',
  'smiling',
  'calm',
  'dreamy',
  'energetic',
];

// 缓存键
const MOOD_CACHE_KEY = 'mood_state';
const QUOTE_CACHE_KEY = 'quote_state';
const MOOD_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

interface MoodState {
  mood: MoodType;
  timestamp: number;
}

interface QuoteState {
  quote: string;
  timestamp: number;
}

export function MoodInteraction() {
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [quote, setQuote] = useState('今天也要元气满满哦~');

  // 随机更换心情
  const randomizeMood = () => {
    const randomIndex = Math.floor(Math.random() * ALL_MOODS.length);
    const newMood = ALL_MOODS[randomIndex];
    setCurrentMood(newMood);

    // 保存到缓存
    const state: MoodState = {
      mood: newMood,
      timestamp: Date.now(),
    };
    safeLocalStorage.setItem(MOOD_CACHE_KEY, JSON.stringify(state));
  };

  // 更新座右铭
  async function updateQuote() {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        console.error('获取状态失败:', response.status);
        return;
      }
      const data = await response.json();

      if (data.moodQuote) {
        setQuote(data.moodQuote);

        // 保存到缓存
        const state: QuoteState = {
          quote: data.moodQuote,
          timestamp: Date.now(),
        };
        safeLocalStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error('更新座右铭失败:', error);
    }
  }

  // 加载缓存的心情
  function loadMoodFromCache() {
    try {
      const cached = safeLocalStorage.getItem(MOOD_CACHE_KEY);
      if (cached) {
        const state: MoodState = JSON.parse(cached);
        const now = Date.now();

        // 检查缓存是否有效
        if (now - state.timestamp < MOOD_CACHE_DURATION) {
          setCurrentMood(state.mood);
          return;
        }
      }
    } catch (error) {
      console.error('加载心情缓存失败:', error);
    }
    updateQuote();
  }

  // 加载缓存的座右铭
  function loadQuoteFromCache() {
    try {
      const cached = safeLocalStorage.getItem(QUOTE_CACHE_KEY);
      if (cached) {
        const state: QuoteState = JSON.parse(cached);
        const now = Date.now();

        // 检查缓存是否有效
        if (now - state.timestamp < MOOD_CACHE_DURATION) {
          setQuote(state.quote);
          return;
        }
      }
    } catch (error) {
      console.error('加载座右铭缓存失败:', error);
    }
    updateQuote();
  }

  useEffect(() => {
    loadMoodFromCache();
    loadQuoteFromCache();
  }, []);

  const moodConfig = MOOD_CONFIG[currentMood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={randomizeMood}
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${moodConfig.bgColor} hover:bg-opacity-20 transition-all`}
      >
        <span className="text-2xl">{moodConfig.emoji}</span>
        <span className={`bg-gradient-to-r ${moodConfig.color} bg-clip-text text-transparent font-medium`}>
          {moodConfig.label}
        </span>
      </motion.button>

      <motion.p
        key={quote}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground italic"
      >
        "{quote}"
      </motion.p>
    </motion.div>
  );
}
