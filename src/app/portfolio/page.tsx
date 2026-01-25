'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/navigation';
import { Plus, Edit2, Trash2, Upload, X, Play, ExternalLink, Link2, Filter, GripVertical } from 'lucide-react';

// 分类常量
const CATEGORIES = [
  { value: 'all', label: '全部', icon: '🎨' },
  { value: 'image', label: '图像', icon: '🖼️' },
  { value: 'video', label: '视频', icon: '🎬' },
  { value: 'audio', label: '音频', icon: '🎵' },
  { value: 'website', label: '网址', icon: '🌐' },
  { value: 'other', label: '其他', icon: '📦' },
] as const;

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

// 可拖拽的作品卡片组件
function SortablePortfolioCard({
  portfolio,
  onEdit,
  onDelete,
}: {
  portfolio: Portfolio;
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: portfolio.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
        {/* 媒体内容预览 */}
        <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center overflow-hidden">
          {/* 拖拽手柄 */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-10 p-2 bg-black/50 rounded-md cursor-grab hover:bg-black/70 transition-colors"
          >
            <GripVertical className="w-5 h-5 text-white" />
          </div>

          {/* 优先级1: 图片预览 */}
          {portfolio.imageUrl && (
            <img
              src={portfolio.imageUrl}
              alt={portfolio.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {/* 优先级2: 视频预览 */}
          {!portfolio.imageUrl && portfolio.videoUrl && (
            <video
              src={portfolio.videoUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
          )}

          {/* 优先级3: 网站预览 */}
          {!portfolio.imageUrl && !portfolio.videoUrl && portfolio.websiteUrl && (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
              <Link2 className="w-16 h-16 text-white/80 mb-3" />
              <p className="text-white/90 text-sm font-medium text-center line-clamp-2">
                {portfolio.title}
              </p>
              <p className="text-white/60 text-xs mt-2 truncate max-w-full">
                {portfolio.websiteUrl.replace(/^https?:\/\//, '')}
              </p>
            </div>
          )}

          {/* 优先级4: 默认图案 */}
          {!portfolio.imageUrl && !portfolio.videoUrl && !portfolio.websiteUrl && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-8xl animate-pulse">🎨</div>
              <span className="text-white/80 text-lg">创意作品</span>
            </div>
          )}

          {/* 视频播放按钮遮罩 */}
          {!portfolio.imageUrl && portfolio.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit(portfolio)}
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onDelete(portfolio.id)}
              className="h-8 w-8 bg-black/50 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">{portfolio.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{portfolio.description}</p>

          <div className="flex flex-wrap gap-2">
            {portfolio.websiteUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(portfolio.websiteUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                查看网站
              </Button>
            )}
            {portfolio.videoUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(portfolio.videoUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                播放视频
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 拖拽结束处理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = portfolios.findIndex((p) => p.id === active.id);
      const newIndex = portfolios.findIndex((p) => p.id === over.id);

      const newPortfolios = arrayMove(portfolios, oldIndex, newIndex);
      setPortfolios(newPortfolios);

      // 更新服务器端排序
      try {
        const updates = newPortfolios.map((portfolio, index) => ({
          id: portfolio.id,
          sortOrder: index,
        }));

        const response = await fetch('/api/portfolios/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          // 成功后重新加载作品集以确保数据同步
          await fetchPortfolios();
        } else {
          console.error('更新排序失败:', await response.text());
          // 恢复原序
          setPortfolios(portfolios);
        }
      } catch (error) {
        console.error('更新排序失败:', error);
        // 恢复原序
        setPortfolios(portfolios);
      }
    }
  };

  // 表单状态
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    imageUrl: '',
    videoUrl: '',
    websiteUrl: '',
  });

  // 加载作品集
  useEffect(() => {
    fetchPortfolios();
  }, [selectedCategory]);

  const fetchPortfolios = async () => {
    try {
      const url = selectedCategory === 'all'
        ? '/api/portfolios'
        : `/api/portfolios?category=${selectedCategory}`;
      const response = await fetch(url);
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('获取作品集失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 打开添加对话框
  const handleAdd = () => {
    setEditingPortfolio(null);
    setPortfolioFormData({
      title: '',
      description: '',
      category: 'other',
      imageUrl: '',
      videoUrl: '',
      websiteUrl: '',
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setPortfolioFormData({
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      imageUrl: portfolio.imageUrl || '',
      videoUrl: portfolio.videoUrl || '',
      websiteUrl: portfolio.websiteUrl || '',
    });
    setDialogOpen(true);
  };

  // 上传文件
  const handleUpload = async (file: File, type: 'image' | 'video') => {
    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (type === 'image') {
        setPortfolioFormData({ ...portfolioFormData, imageUrl: data.key });
      } else {
        setPortfolioFormData({ ...portfolioFormData, videoUrl: data.key });
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 保存作品集
  const handleSave = async () => {
    try {
      const url = editingPortfolio
        ? `/api/portfolios/${editingPortfolio.id}`
        : '/api/portfolios';

      const response = await fetch(url, {
        method: editingPortfolio ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioFormData),
      });

      if (response.ok) {
        await fetchPortfolios();
        setDialogOpen(false);
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  // 删除作品集
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个作品集吗？')) return;

    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPortfolios();
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

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
            雷响的AI数字分身
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            leo的AI数字分身
          </p>
        </motion.div>

        {/* 添加按钮 */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="mr-2 h-5 w-5" />
            添加作品集
          </Button>

          {/* 分类选择器 */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full gap-2"
                size="sm"
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                {selectedCategory === category.value && (
                  <Badge className="ml-1 bg-primary/20 text-primary">
                    {category.value === 'all'
                      ? portfolios.length
                      : portfolios.filter((p) => p.category === category.value).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-20 text-muted-foreground">
            加载中...
          </div>
        )}

        {/* 作品集列表 */}
        {!loading && portfolios.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            还没有作品集，点击上方按钮添加第一个作品
          </div>
        )}

        {!loading && portfolios.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={portfolios.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <SortablePortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* 编辑对话框 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPortfolio ? '编辑作品集' : '添加作品集'}
              </DialogTitle>
              <DialogDescription>
                {editingPortfolio ? '编辑您的作品集信息' : '创建一个新的作品集'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={portfolioFormData.title}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, title: e.target.value })}
                  placeholder="输入作品标题"
                />
              </div>

              <div>
                <Label htmlFor="description">描述 *</Label>
                <Textarea
                  id="description"
                  value={portfolioFormData.description}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, description: e.target.value })}
                  placeholder="描述您的作品"
                  rows={3}
                />
              </div>

              <div>
                <Label>分类 *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORIES.filter(c => c.value !== 'all').map((category) => (
                    <Button
                      key={category.value}
                      variant={portfolioFormData.category === category.value ? 'default' : 'outline'}
                      onClick={() => setPortfolioFormData({ ...portfolioFormData, category: category.value })}
                      className="rounded-full gap-2"
                      size="sm"
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>图片</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, 'image');
                    }}
                    disabled={uploading}
                  />
                  {portfolioFormData.imageUrl && (
                    <div className="relative">
                      <img
                        src={portfolioFormData.imageUrl}
                        alt="预览"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setPortfolioFormData({ ...portfolioFormData, imageUrl: '' })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>视频</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, 'video');
                    }}
                    disabled={uploading}
                  />
                  {portfolioFormData.videoUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Play className="h-4 w-4" />
                      <span className="text-sm flex-1 truncate">视频已上传</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setPortfolioFormData({ ...portfolioFormData, videoUrl: '' })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="website">网站链接</Label>
                <Input
                  id="website"
                  value={portfolioFormData.websiteUrl}
                  onChange={(e) => setPortfolioFormData({ ...portfolioFormData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSave}
                disabled={!portfolioFormData.title || !portfolioFormData.description || uploading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {uploading ? '上传中...' : '保存'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
