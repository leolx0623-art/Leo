'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const quickLinks = [
  { name: '首页', path: '/' },
  { name: '作品集', path: '/portfolio' },
  { name: 'AI 交流', path: '/chat' },
  { name: '联系我', path: '/contact' },
];

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-white hover:bg-gray-700' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400 hover:bg-blue-500/10' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-500 hover:bg-blue-500/10' },
  { name: 'Email', icon: Mail, href: 'mailto:leo@example.com', color: 'hover:text-purple-400 hover:bg-purple-500/10' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-purple-500/10 bg-background/80 backdrop-blur-lg">
      {/* Top neon accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                雷响
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              AIGC创作者 & AI导演。专注于AI生成内容创作，探索人工智能在视觉艺术、视频制作和创意表达中的无限可能。
            </p>
            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-9 h-9 rounded-lg border border-purple-500/20 flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              快速导航
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm text-muted-foreground hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500/40 group-hover:bg-purple-400 group-hover:w-2 transition-all duration-200" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              关于
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              使用 AI 工具（Midjourney、Stable Diffusion、Runway ML 等）创作前沿数字内容。
            </p>
            <div className="flex flex-wrap gap-2">
              {['Midjourney', 'Stable Diffusion', 'Runway ML', 'Sora'].map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-purple-500/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {new Date().getFullYear()} 雷响. 用
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              与 AI 共同创作
            </p>
            <p className="text-xs text-muted-foreground/60">
              Powered by Next.js · Tailwind CSS · Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
