'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    emoji: '😬',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
  },
  confused: {
    label: '迷茫',
    emoji: '🤔',
    color: 'from-teal-400 to-green-400',
    bgColor: 'bg-teal-500/10',
  },
  smiling: {
    label: '微笑',
    emoji: '🙂',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-500/10',
  },
  calm: {
    label: '平静',
    emoji: '😌',
    color: 'from-cyan-400 to-blue-400',
    bgColor: 'bg-cyan-500/10',
  },
  dreamy: {
    label: '梦幻',
    emoji: '😴',
    color: 'from-indigo-400 to-purple-400',
    bgColor: 'bg-indigo-500/10',
  },
  energetic: {
    label: '活力',
    emoji: '⚡',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-500/10',
  },
};

// 所有心情类型
const ALL_MOODS: MoodType[] = Object.keys(MOOD_CONFIG) as MoodType[];

// 缓存键
const MOOD_CACHE_KEY = 'mood_state_v3';
const MOOD_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6小时
const QUOTE_CACHE_KEY = 'daily_quote_v2';
const QUOTE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时（1天）

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
  const [quote, setQuote] = useState('创意无限，探索不止');
  const [isInteracting, setIsInteracting] = useState(false);

  // 从缓存加载心情状态
  useEffect(() => {
    loadMoodFromCache();
    loadQuoteFromCache();
  }, []);

  // 定时更新心情（每6小时）
  useEffect(() => {
    const interval = setInterval(() => {
      updateMood();
    }, MOOD_CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // 定时更新座右铭（每天）
  useEffect(() => {
    const interval = setInterval(() => {
      updateQuote();
    }, QUOTE_CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // 加载缓存的心情
  const loadMoodFromCache = () => {
    try {
      const cached = localStorage.getItem(MOOD_CACHE_KEY);
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

    // 如果没有缓存或缓存过期，使用随机心情
    updateMood();
  };

  // 加载缓存的座右铭
  const loadQuoteFromCache = () => {
    try {
      const cached = localStorage.getItem(QUOTE_CACHE_KEY);
      if (cached) {
        const state: QuoteState = JSON.parse(cached);
        const now = Date.now();

        // 检查缓存是否有效
        if (now - state.timestamp < QUOTE_CACHE_DURATION) {
          setQuote(state.quote);
          return;
        }
      }
    } catch (error) {
      console.error('加载座右铭缓存失败:', error);
    }

    // 如果没有缓存或缓存过期，更新座右铭
    updateQuote();
  };

  // 更新心情
  const updateMood = () => {
    const randomIndex = Math.floor(Math.random() * ALL_MOODS.length);
    const newMood = ALL_MOODS[randomIndex];
    setCurrentMood(newMood);

    // 保存到缓存
    const state: MoodState = {
      mood: newMood,
      timestamp: Date.now(),
    };
    localStorage.setItem(MOOD_CACHE_KEY, JSON.stringify(state));
  };

  // 更新座右铭
  const updateQuote = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();

      if (data.moodQuote) {
        setQuote(data.moodQuote);

        // 保存到缓存
        const state: QuoteState = {
          quote: data.moodQuote,
          timestamp: Date.now(),
        };
        localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error('更新座右铭失败:', error);
    }
  };

  // 点击切换心情
  const handleClick = () => {
    setIsInteracting(true);
    updateMood();

    // 添加点击反馈动画
    setTimeout(() => {
      setIsInteracting(false);
    }, 500);
  };

  const moodConfig = MOOD_CONFIG[currentMood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      {/* 左右分栏布局 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 左边：心情状态区域 */}
        <div
          className="relative min-h-[160px] flex flex-col items-center justify-center gap-3 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={handleClick}
        >
          {/* 背景光晕 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
          </div>

          {/* 心情图标 */}
          <motion.div
            key={currentMood}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`w-20 h-20 rounded-2xl ${moodConfig.bgColor} border-2 border-purple-500/30 flex items-center justify-center shadow-lg relative z-10`}
          >
            <motion.span
              className="text-5xl"
              animate={{ scale: isInteracting ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {moodConfig.emoji}
            </motion.span>
          </motion.div>

          {/* 心情标签 */}
          <motion.div
            key={`label-${currentMood}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10"
          >
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {moodConfig.label}
            </span>
          </motion.div>

          {/* 提示文字 */}
          <motion.div
            animate={{ opacity: isInteracting ? 1 : 0.6 }}
            className="text-center relative z-10"
          >
            <p className="text-xs text-purple-300/70">
              点击切换心情
            </p>
          </motion.div>
        </div>

        {/* 右边：每日座右铭区域 */}
        <div className="relative min-h-[160px] flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
          </div>

          {/* 座右铭图标 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="text-3xl relative z-10"
          >
            ✨
          </motion.div>

          {/* 座右铭内容 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center relative z-10"
          >
            <p className="text-sm text-gray-200 font-medium leading-relaxed px-2">
              "{quote}"
            </p>
          </motion.div>

          {/* 更新提示 */}
          <div className="text-center relative z-10">
            <p className="text-xs text-purple-300/50">
              每日更新
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
