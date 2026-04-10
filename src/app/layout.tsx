import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { LayoutWrapper } from '@/components/layout-wrapper';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '雷响 | AIGC创作者 & AI导演',
    template: '%s | 雷响',
  },
  description:
    '雷响 - AIGC创作者与AI导演，专注于AI生成内容创作。探索AI图像生成、AI视频制作、数字艺术和创意表达的无限可能。使用Midjourney、Stable Diffusion、Runway ML等前沿AI工具。',
  keywords: [
    '雷响',
    'AIGC',
    'AIGC创作者',
    'AI导演',
    'AI生成内容',
    '数字艺术',
    'AI艺术',
    '作品集',
    'Midjourney',
    'Stable Diffusion',
    'Runway ML',
    'AI视频',
    '数字分身',
    'AI聊天',
    'AI创作',
    '创意设计',
    '视觉艺术',
  ],
  authors: [{ name: '雷响' }],
  openGraph: {
    title: '雷响 | AIGC创作者 & AI导演',
    description:
      '探索AI生成的艺术、视频、音频和创意写作的无限可能。与我的AI数字分身聊天，了解AIGC创作的前沿实践。',
    url: 'https://aigccreator.com',
    siteName: '雷响 - AIGC创作者',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '雷响 | AIGC创作者 & AI导演',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '雷响 | AIGC创作者 & AI导演',
    description: '探索AI生成的艺术、视频、音频和创意写作的无限可能',
    images: ['/og-image.png'],
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
          <Suspense fallback={<Loading />}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
