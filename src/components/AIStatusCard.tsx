'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('获取状态失败:', err);
      setError(true);
      setStatus({
        weather: {
          city: '北京',
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

  // 骨架屏加载动画
  if (loading) {
    return (
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg shadow-purple-500/20 relative overflow-hidden hover:shadow-purple-500/40 transition-shadow duration-300"
    >
      {/* 背景光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

      {/* 在线状态呼吸灯 */}
      {status?.online && (
        <div className="absolute top-3 right-3">
          <div className="relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </div>
        </div>
      )}

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
  );
}
