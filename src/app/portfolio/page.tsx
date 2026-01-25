'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/navigation';

const categories = ['视觉', '视频', '音频', '写作'];

const portfolioItems = {
  视觉: [
    { id: 1, title: '霓虹梦境', tool: 'Midjourney', image: '🎨', description: '未来主义城市景观，霓虹灯光闪烁' },
    { id: 2, title: '赛博肖像', tool: 'Stable Diffusion', image: '👤', description: '具有赛博朋克美学的数字肖像' },
    { id: 3, title: '抽象 AI', tool: 'Midjourney', image: '🌌', description: 'AI 意识的抽象表现' },
    { id: 4, title: '自然重现', tool: 'DALL-E 3', image: '🌿', description: '自然与科技的融合' },
  ],
  视频: [
    { id: 5, title: '动态循环', tool: 'Runway ML', image: '🎬', description: '无限循环动画' },
    { id: 6, title: 'AI 动画', tool: 'Pika Labs', image: '✨', description: 'AI 生成的角色动画' },
  ],
  音频: [
    { id: 7, title: '合成波音轨', tool: 'Suno AI', image: '🎵', description: '电子音乐作品' },
    { id: 8, title: '环境音效', tool: 'Udio', image: '🎶', description: '舒缓的环境音乐' },
  ],
  写作: [
    { id: 9, title: '提示工程', tool: 'GPT-4', image: '📝', description: '高级提示词集合' },
    { id: 10, title: 'AI 故事', tool: 'Claude', image: '📖', description: 'AI 生成的短篇小说' },
  ],
};

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Visuals');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const currentItems = portfolioItems[selectedCategory as keyof typeof portfolioItems] || [];
  const tools = [...new Set(currentItems.map(item => item.tool))];

  const filteredItems = selectedTool
    ? currentItems.filter(item => item.tool === selectedTool)
    : currentItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            创意作品集
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索我的 AI 生成艺术、视频、音频和写作作品集
          </p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="relative">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {/* Tool Filters */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                <Button
                  variant={selectedTool === null ? 'default' : 'outline'}
                  onClick={() => setSelectedTool(null)}
                  className="rounded-full"
                >
                  所有工具
                </Button>
                {tools.map((tool) => (
                  <Button
                    key={tool}
                    variant={selectedTool === tool ? 'default' : 'outline'}
                    onClick={() => setSelectedTool(tool)}
                    className="rounded-full"
                  >
                    {tool}
                  </Button>
                ))}
              </div>

              {/* Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
                          {item.image}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <Badge variant="secondary" className="ml-2">
                              {item.tool}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground"
                >
                  没有找到符合该筛选的作品
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
