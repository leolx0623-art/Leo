'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodInteraction } from './MoodInteraction';

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

export function AIStatusCard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async (usePost = false) => {
    try {
      setLoading(true);
      setError(false);
      const method = usePost ? 'POST' : 'GET';
      const response = await fetch('/api/status', { method });
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('获取状态失败:', err);
      setError(true);
      setStatus({
        weather: {
          city: '上海',
          temperature: '25°C',
          condition: '晴',
          emoji: '☀️',
        },
        moodQuote: '系统正在休眠...',
        online: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 手动刷新天气数据
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus(true); // 使用 POST 方法刷新
    setRefreshing(false);
  };

  // 骨架屏加载动画
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-purple-500/5 animate-pulse" />
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-purple-500/20 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-purple-500/10 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 天气状态卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg shadow-purple-500/20 relative overflow-hidden hover:shadow-purple-500/40 transition-shadow duration-300"
      >
        {/* 背景光晕效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

        {/* 在线状态呼吸灯和刷新按钮 */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {status?.online && (
            <div className="relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
          )}

          {/* 刷新按钮 */}
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="刷新天气数据"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
            >
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          </motion.button>
        </div>

        {/* 主要内容 */}
        <div className="flex items-center gap-4 relative">
          {/* 左侧：天气信息 */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="text-4xl"
            >
              {status?.weather.emoji}
            </motion.div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-1">
              {status?.weather.temperature}
            </div>
          </div>

          {/* 分隔线 */}
          <div className="w-px h-12 bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent flex-shrink-0" />

          {/* 右侧：城市和心情语录 */}
          <div className="flex-1 min-w-0">
            {/* 城市名称 */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-purple-300 font-medium">
                📍 {status?.weather.city}
              </span>
              <span className="text-xs text-purple-300/60">
                {status?.weather.condition}
              </span>
            </div>

            {/* 心情语录 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
              className="relative"
            >
              <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
              <p className="text-sm text-gray-200 ml-2 font-medium leading-relaxed">
                {status?.moodQuote}
              </p>
            </motion.div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </motion.div>

      {/* 心情交互组件 */}
      <MoodInteraction />
    </div>
  );
}
