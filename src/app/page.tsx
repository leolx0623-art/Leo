'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Sparkles, Bot, Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isAIGreetingOpen, setIsAIGreetingOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const featuredWorks = [
    { id: 1, title: '霓虹都市', category: '视觉', image: '🌃' },
    { id: 2, title: '赛博动画', category: '视频', image: '🎬' },
    { id: 3, title: '电子梦境', category: '音频', image: '🎵' },
  ];

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

      {/* Featured Works Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              精选作品
            </h2>
            <p className="text-xl text-muted-foreground">
              我的创作之旅中的精彩瞬间
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {featuredWorks.map((work, index) => (
                <CarouselItem key={work.id}>
                  <Card className="border-purple-500/20 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center text-9xl">
                      {work.image}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{work.title}</h3>
                          <p className="text-muted-foreground">{work.category}</p>
                        </div>
                        <Button variant="outline" size="icon" asChild>
                          <Link href="/portfolio">
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
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
