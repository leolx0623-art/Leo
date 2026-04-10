'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { ArrowLeft, Play, ExternalLink, Link2, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// 分类配置
const CATEGORIES: Record<string, { label: string; icon: string; color: string }> = {
  image: { label: '图像', icon: '🖼️', color: 'from-purple-500 to-pink-500' },
  video: { label: '视频', icon: '🎬', color: 'from-blue-500 to-purple-500' },
  audio: { label: '音频', icon: '🎵', color: 'from-green-500 to-blue-500' },
  website: { label: '网址', icon: '🌐', color: 'from-pink-500 to-orange-500' },
  other: { label: '其他', icon: '📦', color: 'from-gray-500 to-gray-600' },
};

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`/api/portfolios/${id}`);
        if (!response.ok) {
          throw new Error('作品不存在');
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [params.id]);

  const categoryConfig = portfolio ? CATEGORIES[portfolio.category] || CATEGORIES.other : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-purple-400">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>加载中...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl">😕</div>
              <h2 className="text-2xl font-bold">作品不存在</h2>
              <Button onClick={() => router.push('/portfolio')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回作品集
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/portfolio')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回作品集
          </Button>
        </motion.div>

        {/* 作品详情 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* 标题区域 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {categoryConfig && (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryConfig.color} text-white text-sm font-medium`}>
                  <span>{categoryConfig.icon}</span>
                  <span>{categoryConfig.label}</span>
                </span>
              )}
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(portfolio.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {portfolio.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {portfolio.description}
            </p>
          </div>

          {/* 媒体内容 */}
          <Card className="border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden mb-8">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                {/* 优先级1: 图片 */}
                {portfolio.imageUrl && (
                  <Image
                    src={portfolio.imageUrl}
                    alt={portfolio.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                )}

                {/* 优先级2: 视频 */}
                {!portfolio.imageUrl && portfolio.videoUrl && (
                  <video
                    src={portfolio.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay={false}
                  />
                )}

                {/* 优先级3: 网站预览 */}
                {!portfolio.imageUrl && !portfolio.videoUrl && portfolio.websiteUrl && (
                  <div className="text-center p-8">
                    <Link2 className="w-24 h-24 text-white/80 mb-4 mx-auto" />
                    <p className="text-white/90 text-lg mb-4">{portfolio.title}</p>
                    <Button
                      onClick={() => window.open(portfolio.websiteUrl, '_blank')}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      访问网站
                    </Button>
                  </div>
                )}

                {/* 优先级4: 默认 */}
                {!portfolio.imageUrl && !portfolio.videoUrl && !portfolio.websiteUrl && (
                  <div className="text-9xl">🎨</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4">
            {portfolio.websiteUrl && (
              <Button
                onClick={() => window.open(portfolio.websiteUrl, '_blank')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                访问网站
              </Button>
            )}
            {portfolio.videoUrl && !portfolio.imageUrl && (
              <Button
                onClick={() => window.open(portfolio.videoUrl, '_blank')}
                variant="outline"
                className="border-purple-500/50"
              >
                <Play className="mr-2 h-4 w-4" />
                新窗口播放视频
              </Button>
            )}
            {portfolio.imageUrl && (
              <Button
                onClick={() => window.open(portfolio.imageUrl, '_blank')}
                variant="outline"
                className="border-purple-500/50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                新窗口查看图片
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
