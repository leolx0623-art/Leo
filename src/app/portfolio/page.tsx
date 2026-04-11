'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// 珊瑚色主题色
const CORAL = '#E85A5A';

// 分类筛选标签
const FILTER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '🖼️ 图像' },
  { key: 'video', label: '🎬 视频' },
  { key: 'audio', label: '🎵 音频' },
  { key: 'website', label: '🌐 网址' },
  { key: 'other', label: '📦 其他' },
];

// 分类图标映射
const CATEGORY_ICONS: Record<string, string> = {
  image: '🖼️',
  video: '🎬',
  audio: '🎵',
  website: '🌐',
  other: '📦',
};

// 卡片渐变背景预设
const GRADIENT_PRESETS = [
  'from-rose-100 to-amber-50',
  'from-blue-100 to-cyan-50',
  'from-purple-100 to-pink-50',
  'from-green-100 to-emerald-50',
  'from-orange-100 to-yellow-50',
  'from-indigo-100 to-blue-50',
];

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  features?: string[];
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
}

// 示例数据（API 失败时使用）
const SAMPLE_PORTFOLIOS: PortfolioItem[] = [
  {
    id: '1',
    title: 'AI 数字人短片',
    description: '使用 AI 技术生成的数字人形象短片，展示未来视觉创作的可能性。',
    category: 'video',
    tags: ['AI Video', '数字人', 'Runway ML'],
    features: ['AI 数字人形象生成', '自动化视频合成', '多风格切换'],
    imageUrl: '',
  },
  {
    id: '2',
    title: '赛博朋克城市系列',
    description: 'Midjourney 创作的赛博朋克风格城市景观系列作品。',
    category: 'image',
    tags: ['Midjourney', '概念艺术', 'AI 绘画'],
    features: ['Midjourney 提示词工程', '后期精修', '系列化创作'],
    imageUrl: '',
  },
  {
    id: '3',
    title: 'AI 音乐创作实验',
    description: '探索 AI 辅助音乐创作的边界，从旋律生成到编曲混音。',
    category: 'audio',
    tags: ['Suno AI', '音乐生成', 'AI 创作'],
    features: ['AI 旋律生成', '智能编曲', '风格迁移'],
    imageUrl: '',
  },
  {
    id: '4',
    title: 'AIGC 创作者工具箱',
    description: '为 AIGC 创作者打造的一站式在线工具集合平台。',
    category: 'website',
    tags: ['Next.js', 'React', '全栈开发'],
    features: ['在线工具集合', 'AI 接口集成', '响应式设计'],
    websiteUrl: '#',
  },
  {
    id: '5',
    title: 'AI 短剧「未来日记」',
    description: '完全由 AI 辅助制作的科幻短剧，从剧本到画面全流程 AI 化。',
    category: 'video',
    tags: ['AI 短剧', 'Sora', 'Claude'],
    features: ['AI 剧本创作', 'AI 视频生成', 'AI 配音配乐'],
    imageUrl: '',
  },
  {
    id: '6',
    title: '水墨风格 AI 绘画',
    description: '将中国传统水墨画风格与 AI 绘画技术融合的创新尝试。',
    category: 'image',
    tags: ['Stable Diffusion', '水墨画', '风格迁移'],
    features: ['LoRA 模型训练', '水墨风格微调', '高分辨率输出'],
    imageUrl: '',
  },
];

// 项目卡片组件
function ProjectCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const gradientClass = GRADIENT_PRESETS[parseInt(item.id) % GRADIENT_PRESETS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* 图片占位区域 */}
      <div className={`aspect-video bg-gradient-to-br ${gradientClass} flex items-center justify-center relative`}>
        <span className="text-5xl opacity-60">{CATEGORY_ICONS[item.category] || '📦'}</span>
        <span
          className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: CORAL }}
        >
          {item.category === 'image' ? '图像' : item.category === 'video' ? '视频' : item.category === 'audio' ? '音频' : item.category === 'website' ? '网址' : '其他'}
        </span>
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 详情弹窗组件
function DetailModal({ item, isOpen, onClose }: { item: PortfolioItem; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const gradientClass = GRADIENT_PRESETS[parseInt(item.id) % GRADIENT_PRESETS.length];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-[900px] w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* 左栏：预览区域 */}
              <div className="md:col-span-2 p-6">
                <div className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4`}>
                  <span className="text-7xl opacity-50">{CATEGORY_ICONS[item.category] || '📦'}</span>
                </div>
                {/* 缩略图条 */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${GRADIENT_PRESETS[(parseInt(item.id) + i) % GRADIENT_PRESETS.length]} flex items-center justify-center`}>
                      <span className="text-lg opacity-40">{CATEGORY_ICONS[item.category] || '📦'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右栏：项目信息 */}
              <div className="md:col-span-3 p-6 md:pl-2">
                {/* 分类标签 */}
                <span
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full text-white mb-4"
                  style={{ backgroundColor: CORAL }}
                >
                  {item.category === 'image' ? '图像' : item.category === 'video' ? '视频' : item.category === 'audio' ? '音频' : item.category === 'website' ? '网址' : '其他'}
                </span>

                {/* 标题 */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>

                {/* 功能列表 */}
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-2 mb-5">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: CORAL }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* 技术标签 */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 关于项目 */}
                <div className="border-l-2 pl-4 mb-6" style={{ borderColor: CORAL }}>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">关于项目</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>

                {/* CTA 按钮 */}
                <button
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  style={{ backgroundColor: '#1A1A1A' }}
                >
                  查看详情 →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await fetch('/api/portfolios');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPortfolios(data);
            return;
          }
        }
      } catch {
        // API 请求失败，使用示例数据
      }
      setPortfolios(SAMPLE_PORTFOLIOS);
      setIsLoading(false);
    }
    fetchPortfolios();
  }, []);

  // 筛选作品
  const filteredPortfolios = activeFilter === 'all'
    ? portfolios
    : portfolios.filter((p) => p.category === activeFilter);

  // 打开详情弹窗
  const openModal = (item: PortfolioItem) => {
    setSelectedProject(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 页面头部 */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Portfolio</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">项目展示</h1>

          {/* 筛选标签 */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeFilter === tab.key ? CORAL : '#F3F4F6',
                  color: activeFilter === tab.key ? '#FFFFFF' : '#4B5563',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 项目网格 */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无该分类的作品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCard item={item} onClick={() => openModal(item)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {selectedProject && (
        <DetailModal
          item={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
