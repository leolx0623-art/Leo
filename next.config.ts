import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
      // 抖音图片
      {
        protocol: 'https',
        hostname: '*.douyinpic.com',
        pathname: '/**',
      },
      // 小红书图片
      {
        protocol: 'https',
        hostname: '*.xhscdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.xiaohongshu.com',
        pathname: '/**',
      },
      // B站图片
      {
        protocol: 'https',
        hostname: '*.bilibili.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.hdslb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i2.hdslb.com',
        pathname: '/**',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // 占位图
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // 本地开发
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
