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
    robotPosition: string;
    boyPosition: string;
    scale: number;
  }
> = {
  happy: {
    label: '开心',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-yellow-500/10',
    animation: 'animate-bounce',
    robotPosition: 'translate-y-0 rotate-0',
    boyPosition: 'translate-y-0 rotate-0',
    scale: 1,
  },
  excited: {
    label: '兴奋',
    emoji: '🎉',
    color: 'from-pink-400 to-purple-400',
    bgColor: 'bg-pink-500/10',
    animation: 'animate-pulse',
    robotPosition: 'translate-y-[-10px] rotate-12',
    boyPosition: 'translate-y-[-15px] -rotate-12',
    scale: 1.1,
  },
  tipsy: {
    label: '微醺',
    emoji: '😵‍💫',
    color: 'from-purple-400 to-indigo-400',
    bgColor: 'bg-purple-500/10',
    animation: 'animate-pulse',
    robotPosition: 'translate-y-[-5px] -rotate-6',
    boyPosition: 'translate-y-[-5px] rotate-6',
    scale: 0.95,
  },
  sad: {
    label: '难过',
    emoji: '😢',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-500/10',
    animation: '',
    robotPosition: 'translate-y-[10px] -rotate-5',
    boyPosition: 'translate-y-[10px] rotate-5',
    scale: 0.9,
  },
  angry: {
    label: '愤怒',
    emoji: '😠',
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-500/10',
    animation: 'animate-shake',
    robotPosition: 'translate-y-[-5px] rotate-8',
    boyPosition: 'translate-y-[-5px] -rotate-8',
    scale: 1.05,
  },
  uneasy: {
    label: '不安',
    emoji: '😰',
    color: 'from-gray-400 to-slate-400',
    bgColor: 'bg-gray-500/10',
    animation: 'animate-pulse',
    robotPosition: 'translate-x-[5px] rotate-3',
    boyPosition: 'translate-x-[-5px] -rotate-3',
    scale: 0.95,
  },
  anxious: {
    label: '焦虑',
    emoji: '😬',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    animation: 'animate-bounce',
    robotPosition: 'translate-x-[-3px] rotate-0',
    boyPosition: 'translate-x-[3px] rotate-0',
    scale: 1,
  },
  confused: {
    label: '迷茫',
    emoji: '🤔',
    color: 'from-teal-400 to-green-400',
    bgColor: 'bg-teal-500/10',
    animation: '',
    robotPosition: 'rotate-0',
    boyPosition: 'rotate-0',
    scale: 0.95,
  },
  smiling: {
    label: '微笑',
    emoji: '🙂',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-500/10',
    animation: '',
    robotPosition: 'translate-y-0 rotate-0',
    boyPosition: 'translate-y-0 rotate-0',
    scale: 1,
  },
  calm: {
    label: '平静',
    emoji: '😌',
    color: 'from-cyan-400 to-blue-400',
    bgColor: 'bg-cyan-500/10',
    animation: '',
    robotPosition: 'translate-y-0 rotate-0',
    boyPosition: 'translate-y-0 rotate-0',
    scale: 1,
  },
  dreamy: {
    label: '梦幻',
    emoji: '😴',
    color: 'from-indigo-400 to-purple-400',
    bgColor: 'bg-indigo-500/10',
    animation: 'animate-pulse',
    robotPosition: 'translate-y-[-8px] rotate-0',
    boyPosition: 'translate-y-[-8px] rotate-0',
    scale: 0.9,
  },
  energetic: {
    label: '活力',
    emoji: '⚡',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-500/10',
    animation: 'animate-bounce',
    robotPosition: 'translate-y-[-20px] rotate-15',
    boyPosition: 'translate-y-[-20px] -rotate-15',
    scale: 1.15,
  },
};

// 所有心情类型
const ALL_MOODS: MoodType[] = Object.keys(MOOD_CONFIG) as MoodType[];

// 缓存键
const MOOD_CACHE_KEY = 'mood_state_v2';
const MOOD_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6小时
const CHARACTERS_CACHE_KEY = 'characters_images';

interface MoodState {
  mood: MoodType;
  timestamp: number;
}

interface CharactersImage {
  robotUrl: string;
  boyUrl: string;
  timestamp: number;
}

export function MoodInteraction() {
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characters, setCharacters] = useState<CharactersImage | null>(null);

  // 从缓存加载心情状态和角色图像
  useEffect(() => {
    loadMoodFromCache();
    loadCharactersFromCache();
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

  // 加载角色图像
  const loadCharactersFromCache = () => {
    try {
      const cached = localStorage.getItem(CHARACTERS_CACHE_KEY);
      if (cached) {
        const data: CharactersImage = JSON.parse(cached);
        setCharacters(data);
      } else {
        // 如果没有缓存，生成新的角色图像
        generateCharacters();
      }
    } catch (error) {
      console.error('加载角色图像缓存失败:', error);
    }
  };

  // 生成角色图像
  const generateCharacters = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-characters', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('生成角色图像失败');
      }

      const data: CharactersImage = await response.json();
      setCharacters(data);

      // 保存到缓存
      localStorage.setItem(CHARACTERS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('生成角色图像失败:', error);
    } finally {
      setIsGenerating(false);
    }
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

      {/* 左右分栏布局 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 左侧：角色互动区域 */}
        <div className="relative min-h-[180px] flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          {/* 背景光晕 */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          </div>

          {/* AI 机器人 */}
          <motion.div
            key={`robot-${currentMood}`}
            animate={{
              y: moodConfig.robotPosition.includes('translate-y')
                ? parseInt(moodConfig.robotPosition.match(/translate-y\[([-\d]+)px\]/)?.[1] || '0')
                : 0,
              x: moodConfig.robotPosition.includes('translate-x')
                ? parseInt(moodConfig.robotPosition.match(/translate-x\[([-\d]+)px\]/)?.[1] || '0')
                : 0,
              rotate: moodConfig.robotPosition.includes('rotate')
                ? parseInt(moodConfig.robotPosition.match(/rotate([-\d]+)/)?.[1] || '0')
                : 0,
              scale: moodConfig.scale,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-24 h-32 flex-shrink-0 z-10"
          >
            {characters?.robotUrl ? (
              <img
                src={characters.robotUrl}
                alt="AI Robot"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              // 默认机器人形象
              <div className="w-full h-full relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>
            )}
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
            className="relative z-10 text-3xl mx-2"
          >
            ✨
          </motion.div>

          {/* 皮克斯风格小男孩 */}
          <motion.div
            key={`boy-${currentMood}`}
            animate={{
              y: moodConfig.boyPosition.includes('translate-y')
                ? parseInt(moodConfig.boyPosition.match(/translate-y\[([-\d]+)px\]/)?.[1] || '0')
                : 0,
              x: moodConfig.boyPosition.includes('translate-x')
                ? parseInt(moodConfig.boyPosition.match(/translate-x\[([-\d]+)px\]/)?.[1] || '0')
                : 0,
              rotate: moodConfig.boyPosition.includes('rotate')
                ? parseInt(moodConfig.boyPosition.match(/rotate([-\d]+)/)?.[1] || '0')
                : 0,
              scale: moodConfig.scale,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-24 h-32 flex-shrink-0 z-10"
          >
            {characters?.boyUrl ? (
              <img
                src={characters.boyUrl}
                alt="Boy"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              // 默认小男孩形象
              <div className="w-full h-full relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg">
                  <span className="text-4xl">👦</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 右侧：心情图示区域 */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* 心情图标 */}
          <motion.div
            key={currentMood}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`w-20 h-20 rounded-2xl ${moodConfig.bgColor} border-2 border-purple-500/30 flex items-center justify-center shadow-lg`}
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
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${moodConfig.bgColor} border border-purple-500/20`}
          >
            <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {moodConfig.label}
            </span>
          </motion.div>

          {/* 生成角色按钮 */}
          {!characters && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                generateCharacters();
              }}
              disabled={isGenerating}
              className={`text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? '生成中...' : '生成角色形象'}
            </motion.button>
          )}

          {/* 提示文字 */}
          <motion.div
            animate={{ opacity: isInteracting ? 1 : 0.7 }}
            className="text-center mt-2"
          >
            <p className="text-xs text-purple-300/80">
              点击切换心情
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
