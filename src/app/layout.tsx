import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { LayoutWrapper } from '@/components/layout-wrapper';
import './globals.css';

// Inspector 仅开发环境使用，生产环境直接渲染子组件
function Inspector({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

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
    'Midjourney',
    'Stable Diffusion',
    'Runway ML',
    '数字艺术',
    'AI艺术',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Inspector>
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
        </Inspector>
      </body>
    </html>
  );
}
