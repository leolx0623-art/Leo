import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AIGC Creator Portfolio',
    template: '%s | AIGC Creator Portfolio',
  },
  description: 'A high-performance personal website for an AIGC creator featuring an immersive portfolio and a personalized AI digital twin agent.',
  keywords: [
    'AIGC',
    'AI Generated Content',
    'Digital Art',
    'AI Art',
    'Portfolio',
    'AI Creator',
    'Midjourney',
    'Stable Diffusion',
    'Runway ML',
    'Digital Twin',
    'AI Chat',
  ],
  authors: [{ name: 'AIGC Creator' }],
  openGraph: {
    title: 'AIGC Creator Portfolio - AI-Powered Creativity',
    description: 'Explore AI-generated artworks, videos, audio, and creative writing. Chat with my AI digital twin!',
    url: 'https://aigccreator.com',
    siteName: 'AIGC Creator Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIGC Creator Portfolio',
    description: 'Exploring the boundaries of AI-generated creativity',
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
    <html lang="en" suppressHydrationWarning>
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
