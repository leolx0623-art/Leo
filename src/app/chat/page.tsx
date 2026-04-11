'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CORAL = '#E85A5A';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imagePrompt?: string;
  portfolioCards?: Array<{ title: string; description: string; category: string }>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '嘿，我是Leo！🎨 作为AIGC内容创作者和AI产品运营，我用AI工具玩出了各种花样——从央视合作的宣传片到AIGC短剧，从AI数字人到自媒体运营。你想了解我的作品、合作方式，还是想聊聊AI技术？尽管问！',
      timestamp: new Date(0),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 客户端 mount 后修正初始消息时间戳
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === '1' ? { ...msg, timestamp: new Date() } : msg
      )
    );
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自适应 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 添加占位助手消息
    const placeholderMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, placeholderMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('请求失败');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg && lastMsg.role === 'assistant') {
                    newMessages[newMessages.length - 1] = { ...lastMsg, content: assistantMessage };
                  }
                  return newMessages;
                });
              }
            } catch {
              // 跳过无效 JSON
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          newMessages[newMessages.length - 1] = { ...lastMsg, content: '抱歉，我遇到了一个错误。请稍后再试。' };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-white">
      {/* 聊天头部 */}
      <div className="flex-shrink-0 border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-2xl">👨‍💻</span>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Leo的AI数字分身</h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: CORAL }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: CORAL }} />
              </span>
              <span className="text-xs text-gray-400">在线</span>
            </div>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* 头像 */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: message.role === 'user' ? CORAL : '#F3F4F6' }}
                >
                  {message.role === 'user' ? '😊' : '👨‍💻'}
                </div>

                {/* 消息内容 */}
                <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className="inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      backgroundColor: message.role === 'user' ? CORAL : '#F5F5F5',
                      color: message.role === 'user' ? '#FFFFFF' : '#1A1A1A',
                      borderRadius: message.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    }}
                  >
                    {message.content || (
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>
                  {message.content && (
                    <p className="text-xs text-gray-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="问点啥都行..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm"
              style={{ '--tw-ring-color': CORAL } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: CORAL }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-2">
            Leo 的 AI 数字分身 · 回复仅供参考
          </p>
        </div>
      </div>
    </div>
  );
}
