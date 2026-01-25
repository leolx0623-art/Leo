'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    animation: string;
    robotAnimation: string;
    boyAnimation: string;
  }
> = {
  happy: {
    label: '开心',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-yellow-500/10',
    animation: 'animate-bounce',
    robotAnimation: 'rotate-0',
    boyAnimation: 'scale-100',
  },
  excited: {
    label: '兴奋',
    emoji: '🎉',
    color: 'from-pink-400 to-purple-400',
    bgColor: 'bg-pink-500/10',
    animation: 'animate-pulse',
    robotAnimation: 'rotate-12',
    boyAnimation: 'scale-110',
  },
  tipsy: {
    label: '微醺',
    emoji: '😵‍💫',
    color: 'from-purple-400 to-indigo-400',
    bgColor: 'bg-purple-500/10',
    animation: 'animate-spin',
    robotAnimation: '-rotate-6',
    boyAnimation: 'translate-y-2',
  },
  sad: {
    label: '难过',
    emoji: '😢',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-500/10',
    animation: '',
    robotAnimation: '-rotate-12',
    boyAnimation: 'scale-90',
  },
  angry: {
    label: '愤怒',
    emoji: '😠',
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-500/10',
    animation: 'animate-shake',
    robotAnimation: 'rotate-6',
    boyAnimation: 'scale-105',
  },
  uneasy: {
    label: '不安',
    emoji: '😰',
    color: 'from-gray-400 to-slate-400',
    bgColor: 'bg-gray-500/10',
    animation: 'animate-pulse',
    robotAnimation: 'rotate-3',
    boyAnimation: 'translate-x-1',
  },
  anxious: {
    label: '焦虑',
    emoji: '😬',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    animation: 'animate-bounce',
    robotAnimation: '-rotate-3',
    boyAnimation: 'translate-x-[-1px]',
  },
  confused: {
    label: '迷茫',
    emoji: '🤔',
    color: 'from-teal-400 to-green-400',
    bgColor: 'bg-teal-500/10',
    animation: '',
    robotAnimation: 'rotate-0',
    boyAnimation: 'scale-95',
  },
  smiling: {
    label: '微笑',
    emoji: '🙂',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-500/10',
    animation: '',
    robotAnimation: 'rotate-0',
    boyAnimation: 'scale-100',
  },
  calm: {
    label: '平静',
    emoji: '😌',
    color: 'from-cyan-400 to-blue-400',
    bgColor: 'bg-cyan-500/10',
    animation: '',
    robotAnimation: 'rotate-0',
    boyAnimation: 'scale-100',
  },
  dreamy: {
    label: '梦幻',
    emoji: '😴',
    color: 'from-indigo-400 to-purple-400',
    bgColor: 'bg-indigo-500/10',
    animation: 'animate-pulse',
    robotAnimation: 'rotate-0',
    boyAnimation: 'translate-y-[-2px]',
  },
  energetic: {
    label: '活力',
    emoji: '⚡',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-500/10',
    animation: 'animate-bounce',
    robotAnimation: 'rotate-180',
    boyAnimation: 'scale-115',
  },
};

// 所有心情类型
const ALL_MOODS: MoodType[] = Object.keys(MOOD_CONFIG) as MoodType[];

// 缓存键
const MOOD_CACHE_KEY = 'mood_state';
const MOOD_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6小时

interface MoodState {
  mood: MoodType;
  timestamp: number;
}

export function MoodInteraction() {
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [isInteracting, setIsInteracting] = useState(false);

  // 从缓存加载心情状态
  useEffect(() => {
    loadMoodFromCache();
  }, []);

  // 定时更新心情（每6小时）
  useEffect(() => {
    const interval = setInterval(() => {
      updateMood();
    }, MOOD_CACHE_DURATION);

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
      className={`mt-4 bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 ${isInteracting ? 'scale-95' : 'hover:scale-[1.02]'}`}
      onClick={handleClick}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      {/* 标题 */}
      <div className="text-center mb-3 relative">
        <motion.div
          key={currentMood}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${moodConfig.bgColor} border border-purple-500/20`}
        >
          <span className="text-2xl">{moodConfig.emoji}</span>
          <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {moodConfig.label}
          </span>
        </motion.div>
      </div>

      {/* 角色交互区域 */}
      <div className="flex items-center justify-center gap-6 py-2">
        {/* AI 机器人 */}
        <motion.div
          key={`robot-${currentMood}`}
          initial={{ rotate: 0, scale: 0.8 }}
          animate={{
            rotate: moodConfig.robotAnimation.includes('rotate')
              ? parseInt(moodConfig.robotAnimation.replace(/[^-0-9]/g, ''))
              : 0,
            scale: 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-16 h-16 flex-shrink-0"
        >
          {/* 机器人身体 */}
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
            {/* 眼睛 */}
            <div className="flex gap-2">
              <motion.div
                animate={{
                  scale: isInteracting ? 1.2 : 1,
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
              <motion.div
                animate={{
                  scale: isInteracting ? 1.2 : 1,
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            </div>

            {/* 光晕 */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          </div>

          {/* 天线 */}
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-purple-400"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          </motion.div>
        </motion.div>

        {/* 互动符号 */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-2xl"
        >
          ✨
        </motion.div>

        {/* 皮克斯风格小男孩 */}
        <motion.div
          key={`boy-${currentMood}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: moodConfig.boyAnimation.includes('scale')
              ? parseInt(moodConfig.boyAnimation.replace(/[^0-9]/g, '')) / 100
              : 1,
            opacity: 1,
            x: moodConfig.boyAnimation.includes('translate-x')
              ? parseInt(moodConfig.boyAnimation.replace(/[^-0-9]/g, ''))
              : 0,
            y: moodConfig.boyAnimation.includes('translate-y')
              ? parseInt(moodConfig.boyAnimation.replace(/[^-0-9]/g, ''))
              : 0,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-16 h-16 flex-shrink-0"
        >
          {/* 头部 */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-lg relative overflow-hidden">
            {/* 头发 */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-full" />

            {/* 眼睛 */}
            <div className="relative z-10 flex gap-3 mt-1">
              <motion.div
                animate={{
                  scale: isInteracting ? 0.8 : 1,
                }}
                className="w-3 h-4 bg-gray-800 rounded-full"
              />
              <motion.div
                animate={{
                  scale: isInteracting ? 0.8 : 1,
                }}
                className="w-3 h-4 bg-gray-800 rounded-full"
              />
            </div>

            {/* 嘴巴 */}
            <motion.div
              key={`mouth-${currentMood}`}
              animate={{
                d: currentMood === 'happy' || currentMood === 'smiling'
                  ? 'M 10 14 Q 16 18 22 14'
                  : currentMood === 'sad'
                  ? 'M 10 18 Q 16 14 22 18'
                  : 'M 10 16 L 22 16',
              }}
              className="absolute bottom-3 w-8 h-2"
            >
              <svg
                viewBox="0 0 32 24"
                className="w-full h-full"
              >
                <motion.path
                  d={
                    currentMood === 'happy' ||
                    currentMood === 'smiling' ||
                    currentMood === 'excited'
                      ? 'M 4 16 Q 16 24 28 16'
                      : currentMood === 'sad' ||
                        currentMood === 'anxious' ||
                        currentMood === 'uneasy'
                      ? 'M 4 20 Q 16 12 28 20'
                      : currentMood === 'angry'
                      ? 'M 4 20 L 28 20'
                      : 'M 8 16 L 24 16'
                  }
                  stroke="#78350f"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* 腮红 */}
            <div className="absolute top-1/2 left-2 w-2 h-2 bg-pink-400/60 rounded-full" />
            <div className="absolute top-1/2 right-2 w-2 h-2 bg-pink-400/60 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* 提示文字 */}
      <motion.div
        animate={{
          opacity: isInteracting ? 1 : 0.7,
        }}
        className="text-center mt-2"
      >
        <p className="text-xs text-purple-300/80">
          点击切换心情 · 每6小时自动更新
        </p>
      </motion.div>
    </motion.div>
  );
}
