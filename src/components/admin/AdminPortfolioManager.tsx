'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image, Plus, Pencil, Trash2, Save, RefreshCw, X } from 'lucide-react';
import NextImage from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  websiteUrl?: string;
  tags?: string;
  viewCount?: number;
  featured?: boolean;
  sort?: number;
  link?: string;
  createdAt: string;
}

export default function AdminPortfolioManager() {
  const [works, setWorks] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<PortfolioItem | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web',
    imageUrl: '',
    videoUrl: '',
    websiteUrl: '',
    tags: '',
    featured: false,
    sort: 0,
    link: '',
  });

  // 加载作品集
  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/works');
      if (response.ok) {
        const data = await response.json();
        setWorks(data);
      }
    } catch (error) {
      console.error('加载作品集失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWork = () => {
    setEditingWork(null);
    setFormData({
      title: '',
      description: '',
      category: 'web',
      imageUrl: '',
      videoUrl: '',
      websiteUrl: '',
      tags: '',
      featured: false,
      sort: 0,
      link: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditWork = (work: PortfolioItem) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description,
      category: work.category,
      imageUrl: work.imageUrl,
      videoUrl: work.videoUrl || '',
      websiteUrl: work.websiteUrl || '',
      tags: work.tags || '',
      featured: work.featured || false,
      sort: work.sort || 0,
      link: work.link || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteWork = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorks(works.filter(w => w.id !== id));
        setMessage('作品删除成功！');
      } else {
        setMessage('删除失败，请重试');
      }
    } catch (error) {
      setMessage('删除失败，请重试');
      console.error('删除失败:', error);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingWork
        ? `/api/works/${editingWork.id}`
        : '/api/works';

      const method = editingWork ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadWorks();
        setIsDialogOpen(false);
        setMessage(editingWork ? '作品更新成功！' : '作品添加成功！');
      } else {
        setMessage('保存失败，请重试');
      }
    } catch (error) {
      setMessage('保存失败，请重试');
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-red-900/50 bg-black/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-red-500 flex items-center gap-2">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="w-5 h-5" aria-hidden="true" />
          作品集管理
        </CardTitle>
        <CardDescription className="text-gray-400">
          管理您的作品集，包括添加、编辑和删除作品
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 操作栏 */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            共 {works.length} 个作品
          </div>
          <Button
            onClick={handleAddWork}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加作品
          </Button>
        </div>

        {/* 作品列表 */}
        {works.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p>暂无作品，点击「添加作品」开始创建</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <div
                key={work.id}
                className="group relative bg-black/40 border border-red-900/30 rounded-lg overflow-hidden hover:border-red-500/50 transition-all"
              >
                {/* 作品图片 */}
                {work.imageUrl && (
                  <div className="aspect-video w-full bg-black/60">
                    <NextImage
                      src={work.imageUrl}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* 作品信息 */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold line-clamp-1">
                      {work.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded">
                      {work.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {work.description}
                  </p>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditWork(work)}
                      className="flex-1 border-red-900/50 text-red-500 hover:bg-red-600/20"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteWork(work.id)}
                      className="border-red-900/50 text-red-500 hover:bg-red-600/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 添加/编辑对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-black/95 border-red-900/50">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingWork ? '编辑作品' : '添加作品'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingWork ? '修改作品信息' : '填写作品信息'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveWork} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  作品标题 *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="请输入作品标题"
                  className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  作品描述 *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="请输入作品描述"
                  rows={3}
                  className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">
                  分类 *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-red-900/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-red-900/50">
                    <SelectItem value="web">Web 应用</SelectItem>
                    <SelectItem value="design">设计作品</SelectItem>
                    <SelectItem value="art">艺术创作</SelectItem>
                    <SelectItem value="ai">AI 作品</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-gray-300">
                  图片 URL *
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="请输入图片 URL"
                  className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <NextImage
                      src={formData.imageUrl}
                      alt="预览"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded border border-red-900/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-gray-300">
                  作品链接（可选）
                </Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-300">
                  标签（JSON数组格式，如 [&quot;AIGC&quot;,&quot;视频&quot;,&quot;AI导演&quot;]）
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder='["AIGC","视频"]'
                  className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort" className="text-gray-300">
                    排序权重
                  </Label>
                  <Input
                    id="sort"
                    type="number"
                    value={formData.sort}
                    onChange={(e) =>
                      setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="bg-black/50 border-red-900/50 focus:border-red-500 text-white"
                  />
                </div>
                <div className="space-y-2 flex items-center gap-3 pt-6">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-red-500"
                  />
                  <Label htmlFor="featured" className="text-gray-300">
                    精选作品
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-red-900/50 text-red-500 hover:bg-red-600/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? '保存中...' : '保存'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 消息提示 */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('成功')
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
