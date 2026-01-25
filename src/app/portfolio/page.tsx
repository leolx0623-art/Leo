'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/navigation';

const categories = ['Visuals', 'Video', 'Audio', 'Writing'];

const portfolioItems = {
  Visuals: [
    { id: 1, title: 'Neon Dreams', tool: 'Midjourney', image: '🎨', description: 'Futuristic cityscape with neon lights' },
    { id: 2, title: 'Cyber Portrait', tool: 'Stable Diffusion', image: '👤', description: 'Digital portrait with cyberpunk aesthetics' },
    { id: 3, title: 'Abstract AI', tool: 'Midjourney', image: '🌌', description: 'Abstract representation of AI consciousness' },
    { id: 4, title: 'Nature Reimagined', tool: 'DALL-E 3', image: '🌿', description: 'Nature mixed with technology' },
  ],
  Video: [
    { id: 5, title: 'Motion Loop', tool: 'Runway ML', image: '🎬', description: 'Infinite loop animation' },
    { id: 6, title: 'AI Animation', tool: 'Pika Labs', image: '✨', description: 'AI-generated character animation' },
  ],
  Audio: [
    { id: 7, title: 'Synthwave Track', tool: 'Suno AI', image: '🎵', description: 'Electronic music composition' },
    { id: 8, title: 'Ambient Sounds', tool: 'Udio', image: '🎶', description: 'Relaxing ambient music' },
  ],
  Writing: [
    { id: 9, title: 'Prompt Engineering', tool: 'GPT-4', image: '📝', description: 'Advanced prompt collection' },
    { id: 10, title: 'AI Stories', tool: 'Claude', image: '📖', description: 'AI-generated short stories' },
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
            Creative Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my collection of AI-generated artworks, videos, audio, and writings
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
                  All Tools
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
                  No items found for this filter
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
