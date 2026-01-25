'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { PortfolioCard, PortfolioCardData } from '@/components/portfolio-card';
import { Send, Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  portfolioCards?: PortfolioCardData[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "嘿，我是Leo！🎨 作为AIGC运营主管、AI导演，还有各种AI创作者的身份，我用AI工具玩出了各种花样——从央视合作的宣传片到AIGC短剧，从AI数字人到自媒体运营，这些项目我都做过。你想了解我的作品、合作方式，还是想聊聊AI技术？尽管问，我来给你点实在的！",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const initialMessageCount = useRef(1); // 初始有1条消息

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 首次加载时，强制滚动到顶部
    if (isFirstLoad.current) {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      isFirstLoad.current = false;
    } else {
      // 只有在消息数量增加时才滚动到底部
      if (messages.length > initialMessageCount.current) {
        scrollToBottom();
        initialMessageCount.current = messages.length;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // Add a placeholder assistant message for streaming
    const placeholderMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, placeholderMessage]);

    try {
      // Call the AI chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let portfolioCards: PortfolioCardData[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;

                // Update the last message with accumulated content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = assistantMessage;
                  }
                  return newMessages;
                });
              } else if (parsed.type === 'portfolio_cards' && parsed.portfolioCards) {
                // 保存作品卡片数据
                portfolioCards = parsed.portfolioCards;

                // 更新消息，附加作品卡片
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.portfolioCards = portfolioCards;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      // Update the placeholder message with error
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = '抱歉，我遇到了一个错误。请稍后再试。';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leo的AI数字分身
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            与由 RAG 技术驱动的 AI 助手交流
          </p>
        </motion.div>

        {/* Chat Container */}
        <Card className="border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <CardContent className="p-6">
            {/* Messages Area */}
            <div ref={messagesContainerRef} className="h-[60vh] overflow-y-auto mb-6 space-y-4 pr-2">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-2xl">👦🏻</span>
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {/* 附加的作品卡片 */}
                        {message.portfolioCards && message.portfolioCards.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.portfolioCards.map((portfolio) => (
                              <PortfolioCard
                                key={portfolio.id}
                                portfolio={portfolio}
                              />
                            ))}
                          </div>
                        )}

                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-muted-foreground'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                      <span className="text-2xl">👦🏻</span>
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                          animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                        <motion.span
                          className="text-sm text-muted-foreground"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        >
                          正在思考...
                        </motion.span>
                      </div>
                      <div className="flex gap-1 mt-2 justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{
                              y: [0, -8, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="问点啥都行：我的作品、AI技术、合作方式..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Prompt Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>Leo 的 AI 数字分身 · AIGC运营主管 & AI导演</p>
          <p className="mt-1">INTJ建筑师型人格 · 幽默狮子座风格</p>
        </motion.div>
      </main>
    </div>
  );
}
