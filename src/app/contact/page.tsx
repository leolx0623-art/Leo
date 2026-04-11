'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CORAL = '#E85A5A';

// 社交媒体配置
const SOCIAL_LINKS = [
  { name: '抖音', handle: '@雷响AIGC', icon: '🎵', color: '#000000' },
  { name: '小红书', handle: '@雷响的AI创作', icon: '📕', color: '#FE2C55' },
  { name: 'B站', handle: '@雷响AIGC', icon: '📺', color: '#00A1D6' },
  { name: '视频号', handle: '@雷响AI导演', icon: '📹', color: '#07C160' },
  { name: '微博', handle: '@雷响AIGC', icon: '📢', color: '#E6162D' },
  { name: 'Github', handle: '@leolx0623-art', icon: '💻', color: '#24292F' },
];

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestMessages, setGuestMessages] = useState<GuestbookMessage[]>([
    { id: '1', name: '访客小明', message: '作品太棒了，期待更多创作！', timestamp: '2026-03-15' },
    { id: '2', name: 'AI爱好者', message: 'AI数字人短片真的很震撼，请问用什么工具做的？', timestamp: '2026-03-10' },
    { id: '3', name: '设计师小王', message: '风格很独特，想合作交流一下~', timestamp: '2026-03-05' },
  ]);

  // 提交联系表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch {
      // 静默处理错误
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提交留言
  const handleGuestSubmit = () => {
    if (!guestMessage.trim()) return;
    const newMsg: GuestbookMessage = {
      id: Date.now().toString(),
      name: guestName.trim() || '匿名访客',
      message: guestMessage.trim(),
      timestamp: new Date().toLocaleDateString('zh-CN'),
    };
    setGuestMessages((prev) => [newMsg, ...prev]);
    setGuestName('');
    setGuestMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-24">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Contact</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">联系我</h1>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: CORAL }} />
        </motion.div>

        {/* 两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* 左栏：联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">发送消息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="您的姓名"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主题</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="项目咨询、合作等"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">留言内容</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="告诉我关于您的项目..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                  style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                {isSubmitting ? '发送中...' : '发送消息'}
              </button>
              {submitSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center"
                  style={{ color: CORAL }}
                >
                  ✓ 消息发送成功！
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* 右栏：社交媒体 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">社交媒体</h2>
            <div className="space-y-3">
              {SOCIAL_LINKS.map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="text-2xl">{social.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{social.name}</p>
                    <p className="text-sm text-gray-500">{social.handle}</p>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500">
                📧 邮箱联系：<span className="text-gray-900 font-medium">leo@example.com</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* 留言板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">留言板</h2>
          <p className="text-sm text-gray-500 mb-6">欢迎留下你的想法和建议 ✨</p>

          {/* 留言输入 */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="你的名字（选填）"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
              />
              <button
                onClick={handleGuestSubmit}
                disabled={!guestMessage.trim()}
                className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: CORAL }}
              >
                留言
              </button>
            </div>
            <textarea
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              placeholder="留下一条消息..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none"
              style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
            />
          </div>

          {/* 留言列表 */}
          <div className="space-y-4">
            <AnimatePresence>
              {guestMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
