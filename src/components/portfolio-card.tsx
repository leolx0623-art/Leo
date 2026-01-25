import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Link2 } from 'lucide-react';
import { Button } from './ui/button';

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
  const getLinkUrl = () => {
    if (portfolio.websiteUrl) return portfolio.websiteUrl;
    if (portfolio.videoUrl) return portfolio.videoUrl;
    if (portfolio.imageUrl) return portfolio.imageUrl;
    return '#';
  };

  const getLinkText = () => {
    if (portfolio.websiteUrl) return '访问网站';
    if (portfolio.videoUrl) return '观看视频';
    if (portfolio.imageUrl) return '查看图片';
    return '查看作品';
  };

  const getIcon = () => {
    if (portfolio.websiteUrl) return <Link2 className="w-4 h-4" />;
    if (portfolio.videoUrl) return <Play className="w-4 h-4 ml-1" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-3"
    >
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border-purple-500/30">
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
                onClick={() => window.open(getLinkUrl(), '_blank')}
                className="flex-shrink-0 gap-1 text-xs h-7"
              >
                {getIcon()}
                {getLinkText()}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
