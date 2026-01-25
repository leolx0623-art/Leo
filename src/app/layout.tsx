import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AIGC 创作者作品集',
    template: '%s | AIGC 创作者作品集',
  },
  description: 'AIGC 创作者的高性能个人网站，展示沉浸式作品集和个性化 AI 数字分身。',
  keywords: [
    'AIGC',
    'AI 生成内容',
    '数字艺术',
    'AI 艺术',
    '作品集',
    'AI 创作者',
    'Midjourney',
    'Stable Diffusion',
    'Runway ML',
    '数字分身',
    'AI 聊天',
  ],
  authors: [{ name: 'AIGC 创作者' }],
  openGraph: {
    title: 'AIGC 创作者作品集 - AI 驱动创意',
    description: '探索 AI 生成的艺术、视频、音频和创意写作。与我的 AI 数字分身聊天！',
    url: 'https://aigccreator.com',
    siteName: 'AIGC 创作者作品集',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIGC 创作者作品集',
    description: '探索 AI 生成创意的边界',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {isDev && <Inspector />}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
