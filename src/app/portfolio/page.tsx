'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Plus, Edit2, Trash2, Upload, X, Play, ExternalLink } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [uploading, setUploading] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    websiteUrl: '',
  });

  // 加载作品集
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

  // 打开添加对话框
  const handleAdd = () => {
    setEditingPortfolio(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      websiteUrl: '',
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (type === 'image') {
        setFormData({ ...formData, imageUrl: data.key });
      } else {
        setFormData({ ...formData, videoUrl: data.key });
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
        body: JSON.stringify(formData),
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
            创意作品集
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索我的 AI 生成艺术、视频和创意作品
          </p>
        </motion.div>

        {/* 添加按钮 */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="mr-2 h-5 w-5" />
            添加作品集
          </Button>
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

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {portfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
                  {/* 媒体内容 */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    {portfolio.imageUrl && (
                      <img
                        src={portfolio.imageUrl}
                        alt={portfolio.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {portfolio.videoUrl && !portfolio.imageUrl && (
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Play className="w-16 h-16 text-white/80" />
                        <span className="text-white/80">视频作品</span>
                      </div>
                    )}
                    {!portfolio.imageUrl && !portfolio.videoUrl && (
                      <div className="text-8xl">🎨</div>
                    )}

                    {/* 操作按钮 */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleEdit(portfolio)}
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDelete(portfolio.id)}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入作品标题"
                />
              </div>

              <div>
                <Label htmlFor="description">描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述您的作品"
                  rows={3}
                />
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
                  {formData.imageUrl && (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="预览"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
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
                  {formData.videoUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Play className="h-4 w-4" />
                      <span className="text-sm flex-1 truncate">视频已上传</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFormData({ ...formData, videoUrl: '' })}
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
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
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
                disabled={!formData.title || !formData.description || uploading}
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
