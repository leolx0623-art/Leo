'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { ProfileEditor } from '@/components/profile-editor';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { AIStatusCard } from '@/components/AIStatusCard';
import { ArrowRight, Sparkles, Bot, Link2, Film, Image as ImageIcon, Music, Package, Mail, MapPin, Phone, Github, Twitter, Linkedin, Award, Zap, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// 分类配置
const CATEGORY_CONFIG = {
  image: { label: '图像', icon: ImageIcon, emoji: '🖼️', color: 'from-purple-500 to-pink-500' },
  video: { label: '视频', icon: Film, emoji: '🎬', color: 'from-red-500 to-orange-500' },
  audio: { label: '音频', icon: Music, emoji: '🎵', color: 'from-blue-500 to-cyan-500' },
  website: { label: '网址', icon: Link2, emoji: '🌐', color: 'from-green-500 to-teal-500' },
  other: { label: '其他', icon: Package, emoji: '📦', color: 'from-gray-500 to-slate-500' },
} as const;

interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
}

// 默认个人资料数据
const DEFAULT_PROFILE_DATA = {
  personalInfo: {
    name: '雷响',
    title: 'AIGC 运营主管 & AI 导演',
    avatar: '👨‍💻',
    location: '中国 · 北京',
    email: 'leo@example.com',
    phone: '+86 138 **** ****',
    github: '',
    twitter: '',
    linkedin: '',
    douyin: '',
    xiaohongshu: '',
    bilibili: '',
    weixin: '',
  },
  experiences: [
    {
      id: '1',
      year: '2023 - 至今',
      position: 'AIGC 创作者',
      company: '自由职业',
      location: '远程',
      description: '专注于 AI 生成内容的创作，包括图像、视频、音频和文本。使用 Midjourney、Stable Diffusion、Runway ML 等工具。',
    },
    {
      id: '2',
      year: '2021 - 2023',
      position: '视觉设计师',
      company: '创意工作室',
      location: '北京',
      description: '负责品牌视觉设计、UI/UX 设计和创意视觉项目。与多个知名品牌合作，完成超过 50 个项目。',
    },
    {
      id: '3',
      year: '2019 - 2021',
      position: '数字艺术家',
      company: '艺术画廊',
      location: '上海',
      description: '创作数字艺术作品，参与多个艺术展览。作品被收录到国际数字艺术集。',
    },
  ],
  skillCategories: [
    {
      id: 'ai-tools',
      name: 'AI 工具',
      icon: '🤖',
      skills: ['Midjourney', 'Stable Diffusion', 'Runway ML', 'Suno AI', 'GPT-4', 'Claude'],
    },
    {
      id: 'design',
      name: '设计技能',
      icon: '🎨',
      skills: ['UI/UX 设计', '品牌设计', '插画创作', '3D 建模'],
    },
    {
      id: 'video',
      name: '视频制作',
      icon: '🎬',
      skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    },
    {
      id: 'coding',
      name: '编程技能',
      icon: '💻',
      skills: ['Python', 'JavaScript', 'TypeScript', 'Next.js'],
    },
  ],
};

// ── Particle System with connection lines ──────────────────────────────────
const PARTICLE_COUNT = 15;

interface Particle {
  id: number;
  x: number; // percent
  y: number; // percent
  size: number;
  color: string;
  duration: number;
  delay: number;
  dx: number; // drift direction
  dy: number;
  opacity: number;
}

const PARTICLE_COLORS = [
  'bg-purple-400',
  'bg-purple-500',
  'bg-pink-400',
  'bg-pink-500',
  'bg-blue-400',
  'bg-blue-500',
];

// 使用确定性种子随机数，确保SSR和客户端渲染一致
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: seededRandom(i * 7 + 1) * 100,
    y: seededRandom(i * 13 + 2) * 100,
    size: 1 + seededRandom(i * 17 + 3) * 3,
    color: PARTICLE_COLORS[Math.floor(seededRandom(i * 23 + 4) * PARTICLE_COLORS.length)],
    duration: 6 + seededRandom(i * 29 + 5) * 8,
    delay: seededRandom(i * 31 + 6) * 5,
    dx: (seededRandom(i * 37 + 7) - 0.5) * 60,
    dy: (seededRandom(i * 41 + 8) - 0.5) * 60,
    opacity: 0.4 + seededRandom(i * 43 + 9) * 0.4,
  }));
}

function ParticleField() {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.color}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            x: [0, p.dx, 0],
            y: [0, p.dy, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Connection lines – limited count to prevent stack overflow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {(() => {
          const lines: { key: string; x1: string; y1: string; x2: string; y2: string; opacity: number; dur: number }[] = [];
          for (let i = 0; i < particles.length && lines.length < 30; i++) {
            for (let j = i + 1; j < particles.length && lines.length < 30; j++) {
              const p = particles[i], q = particles[j];
              const dist = Math.hypot(p.x - q.x, p.y - q.y);
              if (dist < 15) {
                const opacity = Math.max(0, 0.15 * (1 - dist / 15));
                lines.push({
                  key: `${p.id}-${q.id}`,
                  x1: `${p.x}%`, y1: `${p.y}%`,
                  x2: `${q.x}%`, y2: `${q.y}%`,
                  opacity,
                  dur: 4 + seededRandom(p.id * 53 + q.id * 59) * 4,
                });
              }
            }
          }
          return lines.map((l) => (
            <motion.line
              key={l.key}
              x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="url(#lineGrad)"
              strokeWidth={0.5}
              strokeOpacity={l.opacity}
              animate={{ strokeOpacity: [l.opacity * 0.5, l.opacity, l.opacity * 0.5] }}
              transition={{ duration: l.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ));
        })()}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  const [isAIGreetingOpen, setIsAIGreetingOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE_DATA);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    fetchPortfolios();
    // 从 localStorage 加载个人资料
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('userProfile') : null;
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (e) {
        console.error('加载个人资料失败:', e);
      }
    }
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios');
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('获取作品集失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = (newData: typeof DEFAULT_PROFILE_DATA) => {
    setProfileData(newData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(newData));
    }
  };

  // 按分类整理作品集
  const categorizedPortfolios = portfolios.reduce((acc, portfolio) => {
    if (!acc[portfolio.category]) {
      acc[portfolio.category] = [];
    }
    acc[portfolio.category].push(portfolio);
    return acc;
  }, {} as Record<string, Portfolio[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      {/* Hero Section with Video Background Effect */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background with Particles + Connection Lines */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
          <ParticleField />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">AI 驱动创意</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                AIGC
              </span>
              <br />
              <span className="text-foreground">创作者作品集</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              探索 AI 生成的艺术、视频、音频和创意写作的无限可能
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
                asChild
              >
                <Link href="/portfolio">
                  浏览作品集
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-purple-500/30 hover:bg-purple-500/10"
                asChild
              >
                <Link href="/chat">
                  <Bot className="mr-2 w-5 h-5" />
                  与 AI 交流
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Personal Profile Card Section */}
      <section className="py-20 container mx-auto px-4 relative overflow-hidden">
        {/* 科技感背景 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto relative"
        >
          {/* 标题居中优化 - 科技感装饰 */}
          <div className="text-center mb-12 relative flex flex-col items-center justify-center min-h-[140px]">
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            <h2 className="text-4xl md:text-5xl font-bold text-center relative flex items-center justify-center">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent relative inline-block">
                个人名片
                {/* 光晕效果 */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 blur-xl" />
              </span>
            </h2>

            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto relative mt-4">
              了解我的专业背景、技能专长和工作经历
            </p>

            {/* 底部装饰线 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            {/* 角落装饰 */}
            <div className="absolute top-1/2 left-0 w-4 h-4 border-l-2 border-t-2 border-purple-500/50 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-500/50 -translate-y-1/2" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* 编辑按钮 */}
            <Button
              size="sm"
              variant="outline"
              className="absolute -top-4 right-0 z-10 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              onClick={() => setIsEditorOpen(true)}
            >
              <Edit className="w-4 h-4" />
              编辑资料
            </Button>

            {/* 左侧：基本信息 */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-pink-900/10 overflow-hidden relative backdrop-blur-sm">
              {/* 卡片光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
              
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b text-center relative overflow-hidden py-6">
                {/* 流光效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

                <CardTitle className="text-2xl flex items-center justify-center gap-2 relative min-h-[40px]">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                  基本信息
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 relative">
                {/* 照片区域 - 增强科技感 */}
                <div className="flex flex-col items-center mb-8 relative">
                  {/* 外层光晕 */}
                  <div className="absolute inset-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                  
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 mb-4 group">
                    {/* 外层光圈 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-md animate-[spin_10s_linear_infinite]" />
                    
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center overflow-hidden relative z-10 border-2 border-purple-500/30">
                      {/* 网格背景 */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, #a855f7 1px, transparent 1px)',
                        backgroundSize: '10px 10px'
                      }} />
                      
                      {/* 头像 */}
                      <div className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {profileData.personalInfo.avatar}
                      </div>
                    </div>
                    
                    {/* 在线状态指示器 - 增强光晕 */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-purple-900 animate-pulse shadow-lg shadow-green-500/50" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {profileData.personalInfo.name}
                  </h3>
                  <p className="text-muted-foreground text-center relative">
                    {profileData.personalInfo.title}
                    {/* 下划线装饰 */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                  </p>
                </div>

                {/* 基本信息 - 增强科技感 */}
                <div className="space-y-4">
                  <div className="group flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 hover:border-purple-500/30 relative overflow-hidden">
                    {/* 悬停光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                    
                    <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 relative z-10" />
                    <div className="relative z-10">
                      <p className="text-sm text-muted-foreground">现住地</p>
                      <p className="font-medium">{profileData.personalInfo.location}</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 hover:border-purple-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                    
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 relative z-10" />
                    <div className="relative z-10">
                      <p className="text-sm text-muted-foreground">邮箱</p>
                      <p className="font-medium">{profileData.personalInfo.email}</p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 border border-purple-500/10 hover:border-purple-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                    
                    <Phone className="w-5 h-5 text-purple-400 flex-shrink-0 relative z-10" />
                    <div className="relative z-10">
                      <p className="text-sm text-muted-foreground">电话</p>
                      <p className="font-medium">{profileData.personalInfo.phone}</p>
                    </div>
                  </div>
                </div>

                {/* 社交媒体链接 - 增强效果 */}
                {(profileData.personalInfo.github || profileData.personalInfo.twitter || profileData.personalInfo.linkedin || profileData.personalInfo.douyin || profileData.personalInfo.xiaohongshu || profileData.personalInfo.bilibili || profileData.personalInfo.weixin) && (
                  <div className="mt-8">
                    <p className="text-sm text-muted-foreground mb-3 text-center relative">
                      社交媒体
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {profileData.personalInfo.github && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          onClick={() => window.open(profileData.personalInfo.github.startsWith('http') ? profileData.personalInfo.github : `https://github.com/${profileData.personalInfo.github}`, '_blank')}
                        >
                          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Button>
                      )}
                      {profileData.personalInfo.twitter && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          onClick={() => window.open(profileData.personalInfo.twitter.startsWith('http') ? profileData.personalInfo.twitter : `https://twitter.com/${profileData.personalInfo.twitter}`, '_blank')}
                        >
                          <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Button>
                      )}
                      {profileData.personalInfo.linkedin && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          onClick={() => window.open(profileData.personalInfo.linkedin.startsWith('http') ? profileData.personalInfo.linkedin : `https://linkedin.com/in/${profileData.personalInfo.linkedin}`, '_blank')}
                        >
                          <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Button>
                      )}
                      {profileData.personalInfo.douyin && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          title="抖音"
                          onClick={() => {
                            const val = profileData.personalInfo.douyin;
                            if (val.startsWith('http')) window.open(val, '_blank');
                          }}
                        >
                          <span className="text-lg">🎵</span>
                        </Button>
                      )}
                      {profileData.personalInfo.xiaohongshu && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          title="小红书"
                          onClick={() => {
                            const val = profileData.personalInfo.xiaohongshu;
                            if (val.startsWith('http')) window.open(val, '_blank');
                          }}
                        >
                          <span className="text-lg">📕</span>
                        </Button>
                      )}
                      {profileData.personalInfo.bilibili && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          title="B站"
                          onClick={() => {
                            const val = profileData.personalInfo.bilibili;
                            if (val.startsWith('http')) window.open(val, '_blank');
                          }}
                        >
                          <span className="text-lg">📺</span>
                        </Button>
                      )}
                      {profileData.personalInfo.weixin && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          title={`微信: ${profileData.personalInfo.weixin}`}
                        >
                          <span className="text-lg">💬</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* 联系按钮 - 增强效果 */}
                <Button
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group"
                  asChild
                >
                  <Link href="/contact">
                    <Mail className="mr-2 w-5 h-5" />
                    联系我
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </Link>
                </Button>

                {/* AI 状态卡片 */}
                <div className="mt-4">
                  <AIStatusCard />
                </div>
              </CardContent>
            </Card>

            {/* 右侧：履历和技能 */}
            <div className="space-y-6">
              {/* 履历 - 增强科技感 */}
              <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-cyan-900/10 overflow-hidden relative backdrop-blur-sm">
                {/* 卡片光晕效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                
                <CardHeader className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-b relative overflow-hidden py-6">
                  {/* 流光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

                  <CardTitle className="text-xl flex items-center justify-center gap-2 relative min-h-[40px]">
                    <Award className="w-5 h-5 text-blue-400 animate-pulse" />
                    专业履历
                    <Award className="w-5 h-5 text-blue-400 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 relative">
                  <div className="space-y-6">
                    {profileData.experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-blue-500/30 group">
                        {/* 时间轴节点 - 增强发光效果 */}
                        <div className="absolute left-0 top-0 -translate-x-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 group-hover:scale-125 transition-transform duration-300" />
                        
                        <div className="mb-1 text-sm text-blue-400 font-medium">{exp.year}</div>
                        <h4 className="font-bold mb-1">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{exp.company} · {exp.location}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 技能展示 - 增强科技感 */}
              <Card className="border-green-500/20 bg-gradient-to-br from-green-900/10 to-emerald-900/10 overflow-hidden relative backdrop-blur-sm">
                {/* 卡片光晕效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
                
                <CardHeader className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b relative overflow-hidden py-6">
                  {/* 流光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

                  <CardTitle className="text-xl flex items-center justify-center gap-2 relative min-h-[40px]">
                    <Zap className="w-5 h-5 text-green-400 animate-pulse" />
                    技能专长
                    <Zap className="w-5 h-5 text-green-400 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 relative">
                  <div className="space-y-4">
                    {profileData.skillCategories.map((category) => (
                      <div key={category.id} className="group">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                          <h4 className="font-semibold text-sm">{category.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-default"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 编辑模态框 */}
          <ProfileEditor
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
            initialData={profileData}
            onSave={handleProfileSave}
          />
        </motion.div>
        
        {/* 滚动指示器 */}
        <ScrollIndicator color="purple" />
      </section>

      {/* Featured Works Section - Categories */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 flex flex-col items-center justify-center min-h-[140px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                精选合集
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              按分类探索我的创作作品
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              加载中...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.entries(CATEGORY_CONFIG).map(([categoryKey, config]) => {
                const categoryPortfolios = categorizedPortfolios[categoryKey] || [];
                const count = categoryPortfolios.length;
                const firstPortfolio = categoryPortfolios[0];

                return (
                  <Link key={categoryKey} href={`/portfolio?category=${categoryKey}`}>
                    <Card className="group overflow-hidden border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                      {/* 预览图区域 */}
                      <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center overflow-hidden">
                        {/* 显示第一个作品的预览图 */}
                        {firstPortfolio?.imageUrl && (
                          <Image
                            src={firstPortfolio.imageUrl}
                            alt={firstPortfolio.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        {firstPortfolio?.videoUrl && !firstPortfolio.imageUrl && (
                          <video
                            src={firstPortfolio.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        )}
                        {firstPortfolio?.websiteUrl && !firstPortfolio.imageUrl && !firstPortfolio.videoUrl && (
                          <div className="w-full h-full p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                            <Link2 className="w-16 h-16 text-white/80 mb-3" />
                            <p className="text-white/90 text-sm font-medium text-center line-clamp-2">
                              {firstPortfolio.title}
                            </p>
                          </div>
                        )}
                        {!firstPortfolio && (
                          <div className="text-8xl opacity-50">{config.emoji}</div>
                        )}

                        {/* 渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* 分类标签 */}
                        <div className="absolute bottom-4 left-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.color} text-white font-medium text-sm shadow-lg`}>
                            <span>{config.emoji}</span>
                            <span>{config.label}</span>
                          </div>
                        </div>

                        {/* 作品数量徽章 */}
                        {count > 0 && (
                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                              {count} 个作品
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 内容区域 */}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{config.label}合集</h3>
                            <p className="text-muted-foreground">
                              {count > 0
                                ? `包含 ${count} 件${config.label}作品`
                                : `暂无${config.label}作品`}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
        
        {/* 滚动指示器 */}
        <ScrollIndicator color="blue" />
      </section>

      {/* About Preview Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8 flex flex-col items-center justify-center min-h-[140px]">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                  关于我
                </h2>
                <p className="text-xl text-muted-foreground">
                  AIGC 运营主管 & AI 导演
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    我是一名 AI 生成内容创作者，热衷于探索人工智能的无限可能。
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    从令人惊叹的视觉作品到沉浸式视频，从电子音乐到引人入胜的叙事——我探索一切。
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    我的作品曾在画廊、数字展览和全球创意平台上展出。
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    让我们合作，一起创造非凡的作品吧！
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/10"
                  asChild
                >
                  <Link href="/contact">
                    联系我
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 滚动指示器 */}
        <ScrollIndicator color="green" />
      </section>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <Button
          size="lg"
          variant="outline"
          className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 gap-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          回到顶部
          <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
        </Button>
      </motion.div>

      {/* AI Greeting Floating Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          size="lg"
          className="rounded-full h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/30"
          onClick={() => setIsAIGreetingOpen(!isAIGreetingOpen)}
        >
          <Bot className="w-8 h-8" />
        </Button>
        
        {isAIGreetingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80"
          >
            <Card className="border-purple-500/20 shadow-2xl shadow-purple-500/20">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI 助手
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  嗨！我是 AI 数字分身。今天我能为你做些什么？
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  asChild
                >
                  <Link href="/chat">
                    开始对话
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
