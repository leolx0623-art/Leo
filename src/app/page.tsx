'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';

/* ── 渐变预设 ──────────────────────────────────────────── */
const GRADIENT_PRESETS: [string, string][] = [
  ['#B8C5C5', '#F5F5F5'], // 鼠尾草灰
  ['#D4C5B9', '#F5F0EB'], // 暖米色
  ['#C5B8D4', '#F0EBF5'], // 柔薰衣草
  ['#B8C5D4', '#EBF0F5'], // 浅蓝
  ['#D4B8B8', '#F5EBEB'], // 柔粉
  ['#C5D4B8', '#F5F5EB'], // 柔绿
  ['#D4D4B8', '#F5F5EB'], // 暖奶油
  ['#B8D4C5', '#EBF5F0'], // 薄荷
];

/* ── 打字动画引用的语录 ─────────────────────────────────── */
const TYPING_QUOTES = [
  '用AI创造无限可能',
  '从创意到作品，AI赋能每一步',
  '让每个想法都能被看见',
  'AI + 创意 = 无限未来',
  '用技术讲述视觉故事',
];

/* ── 社交媒体配置 ───────────────────────────────────────── */
const SOCIAL_LINKS = [
  { name: '抖音', emoji: '🎵', color: '#000000' },
  { name: '小红书', emoji: '📕', color: '#FE2C55' },
  { name: 'B站', emoji: '📺', color: '#00A1D6' },
  { name: '视频号', emoji: '🎬', color: '#07C160' },
  { name: '微博', emoji: '📢', color: '#E6162D' },
  { name: 'Github', emoji: '💻', color: '#333333' },
];

/* ── 示例项目卡片数据 ───────────────────────────────────── */
const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'AI 数字人短视频',
    category: 'AI视频',
    tags: ['Runway ML', '数字人', '短视频'],
    description: '利用AI数字人技术打造系列短视频内容，单条播放量突破100万+',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    id: '2',
    title: '品牌视觉AI生成',
    category: 'AI图像',
    tags: ['Midjourney', '品牌设计', '视觉'],
    description: '为多个品牌提供AI生成的视觉设计方案，提升品牌视觉表现力',
    gradient: 'from-rose-500 via-pink-500 to-red-500',
  },
  {
    id: '3',
    title: 'AI音乐创作实验',
    category: 'AI音频',
    tags: ['Suno AI', '音乐', '创作'],
    description: '探索AI音乐生成的边界，创作多首原创AI音乐作品',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
  },
  {
    id: '4',
    title: '智能交互产品运营',
    category: 'AI产品',
    tags: ['GPT-4', '产品运营', '增长'],
    description: '负责AI产品的用户增长与运营策略，月活用户增长300%',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
  },
];

/* ── 珊瑚色主题色 ───────────────────────────────────────── */
const CORAL = '#FF6B6B';

/* ══════════════════════════════════════════════════════════
   主页面组件
   ══════════════════════════════════════════════════════════ */
export default function Home() {
  /* ── 随机渐变背景 ──────────────────────────────────────── */
  const [gradient, setGradient] = useState<[string, string]>(['#B8C5C5', '#F5F5F5']);

  /* ── 打字动画状态 ──────────────────────────────────────── */
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── 卡片轮播状态 ──────────────────────────────────────── */
  const [currentCard, setCurrentCard] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── 挂载时随机选取渐变 ────────────────────────────────── */
  useEffect(() => {
    const idx = Math.floor(Math.random() * GRADIENT_PRESETS.length);
    setGradient(GRADIENT_PRESETS[idx]);
  }, []);

  /* ── 打字效果逻辑 ──────────────────────────────────────── */
  useEffect(() => {
    const currentQuote = TYPING_QUOTES[quoteIndex];

    if (!isDeleting) {
      // 正在打字
      if (displayText.length < currentQuote.length) {
        typingRef.current = setTimeout(() => {
          setDisplayText(currentQuote.slice(0, displayText.length + 1));
        }, 80);
      } else {
        // 打完一句，暂停2秒后开始删除
        typingRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // 正在删除
      if (displayText.length > 0) {
        typingRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
      } else {
        // 删完了，切换到下一句
        setIsDeleting(false);
        setQuoteIndex((prev) => (prev + 1) % TYPING_QUOTES.length);
      }
    }

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [displayText, isDeleting, quoteIndex]);

  /* ── 卡片自动轮播逻辑 ─────────────────────────────────── */
  const startCarousel = useCallback(() => {
    if (carouselRef.current) clearInterval(carouselRef.current);
    carouselRef.current = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % SAMPLE_PROJECTS.length);
    }, 3500);
  }, []);

  const stopCarousel = useCallback(() => {
    if (carouselRef.current) {
      clearInterval(carouselRef.current);
      carouselRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startCarousel();
    } else {
      stopCarousel();
    }
    return () => stopCarousel();
  }, [isPlaying, startCarousel, stopCarousel]);

  /* ── 上/下一张卡片 ─────────────────────────────────────── */
  const goToPrev = useCallback(() => {
    setCurrentCard((prev) => (prev - 1 + SAMPLE_PROJECTS.length) % SAMPLE_PROJECTS.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentCard((prev) => (prev + 1) % SAMPLE_PROJECTS.length);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    >
      {/* 导航栏 */}
      <Navigation />

      {/* 全屏英雄区域 */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-16 lg:pt-0">
          {/* ── 左栏：文字内容区（60%） ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full lg:w-[60%] flex flex-col items-start"
          >
            {/* 小标签：Portfolio 2026 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <span
                className="inline-block w-8 h-[3px] rounded-full"
                style={{ backgroundColor: CORAL }}
              />
              <span className="text-sm font-medium tracking-widest uppercase text-gray-600">
                Portfolio 2026
              </span>
            </motion.div>

            {/* 巨型 HELLO. 文字 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[64px] sm:text-[72px] lg:text-[80px] font-extrabold leading-none tracking-tight text-gray-900 mb-2"
            >
              HELLO.
            </motion.h1>

            {/* 你好，我是雷响 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold text-gray-800 mb-2 relative inline-block"
            >
              你好，我是雷响
              {/* 珊瑚色下划线装饰 */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 w-full h-[4px] rounded-full origin-left"
                style={{ backgroundColor: CORAL }}
              />
            </motion.h2>

            {/* 你最好的AI搭子 */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-[18px] sm:text-[20px] lg:text-[24px] font-medium text-gray-700 mb-2"
            >
              你最好的AI搭子
            </motion.p>

            {/* 职位描述 */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-500 mb-6"
            >
              AIGC内容创作者丨AI产品运营
            </motion.p>

            {/* 打字动画区域 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-8 min-h-[36px] flex items-center"
            >
              <span className="text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 font-mono">
                {displayText}
              </span>
              {/* 闪烁光标 */}
              <span
                className="inline-block w-[2px] h-[22px] ml-1 align-middle"
                style={{
                  backgroundColor: CORAL,
                  animation: 'blink 1s step-end infinite',
                }}
              />
              <style jsx>{`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
              `}</style>
            </motion.div>

            {/* CTA 按钮组 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-full bg-gray-900 text-white font-medium text-base transition-colors hover:bg-gray-800 cursor-pointer"
              >
                <Link href="/portfolio">查看作品</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-full bg-white text-gray-900 font-medium text-base border-2 border-gray-900 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                <Link href="/contact">跟我聊聊</Link>
              </motion.button>
            </motion.div>

            {/* 社交媒体图标行 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              {SOCIAL_LINKS.map((social) => (
                <div key={social.name} className="relative">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    title={social.name}
                  >
                    {social.emoji}
                  </motion.button>

                  {/* 悬停弹出二维码占位 */}
                  <AnimatePresence>
                    {hoveredSocial === social.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-36 text-center">
                          {/* 二维码占位区域 */}
                          <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="text-3xl">{social.emoji}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">扫码关注</p>
                          <p className="text-xs font-bold text-gray-700 mt-0.5">{social.name}</p>
                          {/* 小三角 */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── 右栏：作品卡片轮播（40%） ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="w-full lg:w-[40%] flex flex-col items-center"
          >
            {/* 卡片轮播容器 */}
            <div className="relative w-full max-w-[380px] h-[420px] sm:h-[460px]">
              {/* 3D 堆叠卡片效果：渲染当前卡片及其相邻卡片 */}
              {SAMPLE_PROJECTS.map((project, index) => {
                // 计算每张卡片相对于当前选中卡片的偏移
                const offset = index - currentCard;
                // 只渲染当前卡片及前后各一张
                if (Math.abs(offset) > 1) return null;

                const isActive = offset === 0;
                const isNext = offset === 1;
                const isPrev = offset === -1;

                return (
                  <AnimatePresence key={project.id} mode="popLayout">
                    {isActive && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          rotateY: 0,
                          x: 0,
                          zIndex: 30,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.85,
                          y: -30,
                          x: isNext ? 60 : -60,
                          rotateY: isNext ? -8 : 8,
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{ perspective: '1000px' }}
                      >
                        <div className="w-full h-full rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100">
                          {/* 项目图片占位区域 */}
                          <div
                            className={`w-full h-[55%] bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}
                          >
                            {/* 装饰性几何图形 */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
                              <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-lg rotate-45" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full" />
                            </div>
                            {/* 分类标签 */}
                            <span className="relative z-10 px-4 py-1.5 bg-white/25 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                              {project.category}
                            </span>
                          </div>

                          {/* 卡片文字内容 */}
                          <div className="p-5 flex flex-col h-[45%]">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {project.title}
                            </h3>
                            {/* 标签 */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {/* 描述 */}
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 后方卡片（仅做装饰，不显示完整内容） */}
                    {isNext && (
                      <motion.div
                        key={`${project.id}-next`}
                        className="absolute inset-0"
                        style={{
                          zIndex: 20,
                          transform: 'perspective(1000px) rotateY(-8deg) translateX(30px) scale(0.92)',
                          opacity: 0.5,
                        }}
                      >
                        <div className="w-full h-full rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
                          <div className={`w-full h-[55%] bg-gradient-to-br ${project.gradient}`} />
                          <div className="p-5">
                            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isPrev && (
                      <motion.div
                        key={`${project.id}-prev`}
                        className="absolute inset-0"
                        style={{
                          zIndex: 10,
                          transform: 'perspective(1000px) rotateY(8deg) translateX(-30px) scale(0.92)',
                          opacity: 0.3,
                        }}
                      >
                        <div className="w-full h-full rounded-2xl bg-white shadow-md overflow-hidden border border-gray-100">
                          <div className={`w-full h-[55%] bg-gradient-to-br ${project.gradient}`} />
                          <div className="p-5">
                            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}

              {/* 左右切换箭头 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToPrev}
                className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToNext}
                className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>

            {/* 导航圆点 */}
            <div className="flex items-center gap-2 mt-6">
              {SAMPLE_PROJECTS.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setCurrentCard(index)}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: currentCard === index ? 24 : 8,
                    height: 8,
                    backgroundColor: currentCard === index ? CORAL : '#D1D5DB',
                  }}
                />
              ))}
            </div>

            {/* 暂停/播放切换按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying((prev) => !prev)}
              className="mt-4 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200 text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              {isPlaying ? (
                <>
                  {/* 暂停图标 */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <rect x="1" y="0" width="3.5" height="12" rx="1" />
                    <rect x="7.5" y="0" width="3.5" height="12" rx="1" />
                  </svg>
                  暂停播放
                </>
              ) : (
                <>
                  {/* 播放图标 */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 0.5L11 6L2 11.5V0.5Z" />
                  </svg>
                  自动播放
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
