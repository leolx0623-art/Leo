'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { ContactInfoEditor } from '@/components/contact-info-editor';
import { Mail, Phone, MapPin, Download, MessageSquare, ExternalLink, Edit } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [guestbookMessages, setGuestbookMessages] = useState([
    { id: 1, name: '陈小伟', message: '太棒了的作品集！喜欢这种赛博朋克美学。', date: '2024-01-15' },
    { id: 2, name: '李小红', message: '你的 AI 生成艺术太令人惊叹了。非常期待合作！', date: '2024-01-14' },
    { id: 3, name: '张小明', message: '视频项目做得太好了。非常受启发！', date: '2024-01-13' },
  ]);
  const [guestbookInput, setGuestbookInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 联系信息状态
  const [contactInfo, setContactInfo] = useState({
    id: '',
    email: 'hello@aigccreator.com',
    phone: '+86 138-8888-8888',
    location: '中国，北京',
    resumeKey: null as string | null,
    resumeFileName: null as string | null,
    downloadCount: 234,
    downloadUrl: null as string | null,
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [loadingContactInfo, setLoadingContactInfo] = useState(false);

  // 加载联系信息
  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoadingContactInfo(true);
    try {
      const response = await fetch('/api/contact/info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('加载联系信息失败:', error);
    } finally {
      setLoadingContactInfo(false);
    }
  };

  const handleContactInfoSave = async (data: any) => {
    try {
      const response = await fetch('/api/contact/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setContactInfo(updatedData);
        alert('联系信息保存成功！');
      } else {
        const errorData = await response.json();
        alert(`保存失败：${errorData.error}`);
      }
    } catch (error) {
      console.error('保存联系信息失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleResumeDownload = async () => {
    if (!contactInfo.downloadUrl) {
      alert('暂无简历文件');
      return;
    }

    try {
      // 使用fetch + blob模式下载文件
      const response = await fetch(contactInfo.downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = contactInfo.resumeFileName || 'resume';
      link.click();
      window.URL.revokeObjectURL(blobUrl);

      // 更新下载次数
      await fetch('/api/contact/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactInfo.id,
          email: contactInfo.email,
          phone: contactInfo.phone,
          location: contactInfo.location,
          resumeKey: contactInfo.resumeKey,
          resumeFileName: contactInfo.resumeFileName,
        }),
      });
    } catch (error) {
      console.error('下载简历失败:', error);
      alert('下载失败，请重试');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || '消息发送成功！我会尽快回复您。');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert(result.error || '消息发送失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('消息发送失败，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      name: '访客',
      message: guestbookInput,
      date: new Date().toISOString().split('T')[0],
    };

    setGuestbookMessages([newMessage, ...guestbookMessages]);
    setGuestbookInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            联系我
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            有项目想法吗？让我们一起创造一些惊人的东西吧！
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12 items-stretch">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1"
          >
            <Card className="border-green-500/20 shadow-2xl shadow-green-500/10 h-full">
              <CardHeader className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b !flex !flex-row !items-center !justify-center !min-h-[64px] !px-6">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-green-400" />
                  发送消息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">姓名</label>
                    <Input
                      placeholder="您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">邮箱</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">主题</label>
                    <Input
                      placeholder="项目咨询、合作等"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">消息</label>
                    <Textarea
                      placeholder="告诉我关于您的项目..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '发送中...' : '发送消息'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col space-y-6"
          >
            {/* Resume Download */}
            <Card className="border-purple-500/20 shadow-xl shadow-purple-500/10">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b !flex !flex-row !items-center !justify-center !min-h-[64px] !px-6">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-purple-400" />
                  简历
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  {contactInfo.resumeFileName
                    ? `当前简历：${contactInfo.resumeFileName}`
                    : '暂无简历文件'}
                </p>
                <Button
                  onClick={handleResumeDownload}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!contactInfo.downloadUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载简历
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {contactInfo.downloadCount} 次下载
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="flex-1">
              <CardHeader className="!flex !flex-row !items-center !justify-between !min-h-[64px] !px-6">
                <CardTitle>联系信息</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditorOpen(true)}
                  disabled={loadingContactInfo}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>{contactInfo.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="flex-1">
              <CardHeader className="!flex !flex-row !items-center !justify-center !min-h-[64px] !px-6">
                <CardTitle>关注我</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      微博
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      领英
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      抖音
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Guestbook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <CardHeader className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b !flex !flex-row !items-center !justify-center !min-h-[64px] !px-6">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                访客留言
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleGuestbookSubmit} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="留下一条消息..."
                    value={guestbookInput}
                    onChange={(e) => setGuestbookInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    发布
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {guestbookMessages.map((msg) => (
                  <div key={msg.id} className="border-l-2 border-blue-500/50 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="text-muted-foreground">{msg.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* 联系信息编辑弹窗 */}
      <ContactInfoEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initialData={contactInfo}
        onSave={handleContactInfoSave}
      />
    </div>
  );
}
