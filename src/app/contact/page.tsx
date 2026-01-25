'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Mail, Phone, MapPin, Download, MessageSquare, ExternalLink } from 'lucide-react';

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟表单提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('消息发送成功！我会尽快回复您。');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
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

  const downloadResume = () => {
    // 模拟简历下载
    alert('简历下载已开始！（生产环境中会下载 PDF 文件）');
    // 在生产环境中，这将跟踪分析并下载实际文件
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            联系我
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            有项目想法吗？让我们一起创造一些惊人的东西吧！
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-green-500/20 shadow-2xl shadow-green-500/10">
              <CardHeader className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b flex items-center justify-center">
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
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Resume Download */}
            <Card className="border-purple-500/20 shadow-xl shadow-purple-500/10">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b flex items-center justify-center">
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-purple-400" />
                  简历
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  下载我的完整简历，了解更多关于我的经验和技能。
                </p>
                <Button
                  onClick={downloadResume}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载简历
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  234 次下载
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="flex items-center justify-center">
                <CardTitle>联系信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span>hello@aigccreator.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+86 138-8888-8888</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>中国，北京</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader className="flex items-center justify-center">
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
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <CardHeader className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b flex items-center justify-center">
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
    </div>
  );
}
