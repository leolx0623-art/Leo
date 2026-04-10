'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Link2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export interface PortfolioCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
}

interface PortfolioCardProps {
  portfolio: PortfolioCardData;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/portfolio/${portfolio.id}`);
  };

  const getMediaType = () => {
    if (portfolio.websiteUrl) return 'website';
    if (portfolio.videoUrl) return 'video';
    if (portfolio.imageUrl) return 'image';
    return 'other';
  };

  const mediaType = getMediaType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mt-3 cursor-pointer"
      onClick={handleClick}
    >
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border-purple-500/30 hover:border-purple-500/60 group relative">
        <div className="flex gap-4">
          {/* Image preview with enhanced hover */}
          <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center overflow-hidden relative">
            {portfolio.imageUrl ? (
              <img
                src={portfolio.imageUrl}
                alt={portfolio.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : portfolio.videoUrl ? (
              <div className="flex flex-col items-center justify-center w-full h-full relative">
                {/* Video play button overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center"
                  initial={false}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-purple-500/60 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  </motion.div>
                </motion.div>
                <Play className="w-8 h-8 text-white/30" />
              </div>
            ) : portfolio.websiteUrl ? (
              <div className="flex flex-col items-center justify-center">
                <Link2 className="w-8 h-8 text-white/80 group-hover:text-purple-300 transition-colors" />
              </div>
            ) : (
              <div className="text-3xl">🎨</div>
            )}

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          {/* Content */}
          <CardContent className="flex-1 py-3 px-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm mb-1 truncate group-hover:text-purple-300 transition-colors duration-300">
                  {portfolio.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {portfolio.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                    {portfolio.category}
                  </span>
                  {mediaType === 'video' && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5" /> 视频
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 gap-1 text-xs h-7 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" />
                查看详情
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
