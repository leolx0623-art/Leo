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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-3 cursor-pointer"
      onClick={handleClick}
    >
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border-purple-500/30 hover:border-purple-500/60">
        <div className="flex gap-4">
          {/* 图片预览 */}
          <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center overflow-hidden">
            {portfolio.imageUrl ? (
              <img
                src={portfolio.imageUrl}
                alt={portfolio.title}
                className="w-full h-full object-cover"
              />
            ) : portfolio.videoUrl ? (
              <div className="flex flex-col items-center justify-center">
                <Play className="w-8 h-8 text-white/80" />
              </div>
            ) : portfolio.websiteUrl ? (
              <div className="flex flex-col items-center justify-center">
                <Link2 className="w-8 h-8 text-white/80" />
              </div>
            ) : (
              <div className="text-3xl">🎨</div>
            )}
          </div>

          {/* 内容 */}
          <CardContent className="flex-1 py-3 px-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm mb-1 truncate">{portfolio.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {portfolio.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                    {portfolio.category}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 gap-1 text-xs h-7"
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
