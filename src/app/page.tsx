'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Sparkles, Bot, Play, Link2, Film, Image as ImageIcon, Music, Package, Mail, MapPin, Phone, Github, Twitter, Linkedin, Award, Code, Palette, Video, Zap } from 'lucide-react';
import Link from 'next/link';

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

export default function Home() {
  const [isAIGreetingOpen, setIsAIGreetingOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    fetchPortfolios();
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
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-500 rounded-full"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
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

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Personal Profile Card Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左侧：基本信息 */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-pink-900/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  个人名片
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* 照片区域 */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
                      {/* 默认头像 */}
                      <div className="text-6xl">👨‍💻</div>
                    </div>
                    {/* 在线状态指示器 */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-purple-900" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">雷响</h3>
                  <p className="text-muted-foreground">AIGC 创作者 & 数字艺术家</p>
                </div>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                    <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">现住地</p>
                      <p className="font-medium">中国 · 北京</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">邮箱</p>
                      <p className="font-medium">leo@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                    <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">电话</p>
                      <p className="font-medium">+86 138 **** ****</p>
                    </div>
                  </div>
                </div>

                {/* 社交媒体链接 */}
                <div className="mt-8">
                  <p className="text-sm text-muted-foreground mb-3">社交媒体</p>
                  <div className="flex gap-3">
                    <Button size="icon" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* 联系按钮 */}
                <Button
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  asChild
                >
                  <Link href="/contact">
                    <Mail className="mr-2 w-5 h-5" />
                    联系我
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 右侧：履历和技能 */}
            <div className="space-y-6">
              {/* 履历 */}
              <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
                <CardHeader className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    专业履历
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-blue-500/30">
                      <div className="absolute left-0 top-0 -translate-x-1.5 w-3 h-3 rounded-full bg-blue-500" />
                      <div className="mb-1 text-sm text-blue-400">2023 - 至今</div>
                      <h4 className="font-bold mb-1">AIGC 创作者</h4>
                      <p className="text-sm text-muted-foreground mb-2">自由职业 · 远程</p>
                      <p className="text-sm text-muted-foreground">
                        专注于 AI 生成内容的创作，包括图像、视频、音频和文本。使用 Midjourney、Stable Diffusion、Runway ML 等工具。
                      </p>
                    </div>

                    <div className="relative pl-6 border-l-2 border-blue-500/30">
                      <div className="absolute left-0 top-0 -translate-x-1.5 w-3 h-3 rounded-full bg-blue-500" />
                      <div className="mb-1 text-sm text-blue-400">2021 - 2023</div>
                      <h4 className="font-bold mb-1">视觉设计师</h4>
                      <p className="text-sm text-muted-foreground mb-2">创意工作室 · 北京</p>
                      <p className="text-sm text-muted-foreground">
                        负责品牌视觉设计、UI/UX 设计和创意视觉项目。与多个知名品牌合作，完成超过 50 个项目。
                      </p>
                    </div>

                    <div className="relative pl-6 border-l-2 border-blue-500/30">
                      <div className="absolute left-0 top-0 -translate-x-1.5 w-3 h-3 rounded-full bg-blue-500" />
                      <div className="mb-1 text-sm text-blue-400">2019 - 2021</div>
                      <h4 className="font-bold mb-1">数字艺术家</h4>
                      <p className="text-sm text-muted-foreground mb-2">艺术画廊 · 上海</p>
                      <p className="text-sm text-muted-foreground">
                        创作数字艺术作品，参与多个艺术展览。作品被收录到国际数字艺术集。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 技能展示 */}
              <Card className="border-green-500/20 bg-gradient-to-br from-green-900/10 to-emerald-900/10">
                <CardHeader className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    技能专长
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* AI 工具 */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-green-400" />
                        <h4 className="font-semibold text-sm">AI 工具</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Midjourney</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Stable Diffusion</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Runway ML</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Suno AI</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">GPT-4</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Claude</Badge>
                      </div>
                    </div>

                    {/* 设计技能 */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <h4 className="font-semibold text-sm">设计技能</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">UI/UX 设计</Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">品牌设计</Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">插画创作</Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">3D 建模</Badge>
                      </div>
                    </div>

                    {/* 视频制作 */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="w-4 h-4 text-red-400" />
                        <h4 className="font-semibold text-sm">视频制作</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">Premiere Pro</Badge>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">After Effects</Badge>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">DaVinci Resolve</Badge>
                      </div>
                    </div>

                    {/* 编程技能 */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-blue-400" />
                        <h4 className="font-semibold text-sm">编程技能</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Python</Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">JavaScript</Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">TypeScript</Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Next.js</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Works Section - Categories */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              精选合集
            </h2>
            <p className="text-xl text-muted-foreground">
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
                          <img
                            src={firstPortfolio.imageUrl}
                            alt={firstPortfolio.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  关于我
                </h2>
                <p className="text-xl text-muted-foreground">
                  AIGC 创作者 & 数字艺术家
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
      </section>

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
