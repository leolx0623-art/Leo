'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactInfoData {
  id: string;
  email: string;
  phone: string;
  location: string;
  resumeKey: string | null;
  resumeFileName: string | null;
}

interface ContactInfoEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ContactInfoData;
  onSave: (data: ContactInfoData) => void;
}

export function ContactInfoEditor({ open, onOpenChange, initialData, onSave }: ContactInfoEditorProps) {
  const [data, setData] = useState<ContactInfoData>(initialData);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  const updateField = (field: keyof ContactInfoData, value: string | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('仅支持PDF和JPG格式');
      return;
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('文件大小不能超过10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const result = await response.json();
      setData(prev => ({
        ...prev,
        resumeKey: result.key,
        resumeFileName: result.fileName,
      }));

      alert('简历上传成功！');
    } catch (error) {
      console.error('简历上传失败:', error);
      alert('简历上传失败，请重试');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeResume = () => {
    setData(prev => ({
      ...prev,
      resumeKey: null,
      resumeFileName: null,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="!flex !flex-row !items-center !justify-center !min-h-[64px] !px-6">
          <DialogTitle className="text-2xl font-bold">编辑联系信息</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱 *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="hello@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">电话 *</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+86 138-8888-8888"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">现住地 *</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="中国，北京"
            />
          </div>

          <div className="space-y-2">
            <Label>简历（支持PDF或JPG格式，最大10MB）</Label>

            {data.resumeKey ? (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-blue-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{data.resumeFileName}</p>
                      <p className="text-sm text-muted-foreground">已上传</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeResume}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  点击或拖拽上传简历文件
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    asChild
                  >
                    <span>选择文件</span>
                  </Button>
                </label>
              </div>
            )}

            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">上传中...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            disabled={uploading}
          >
            保存更改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
