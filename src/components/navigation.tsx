'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: '首页', path: '/' },
  { name: '作品集', path: '/portfolio' },
  { name: 'AI 交流', path: '/chat' },
  { name: '联系我', path: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <motion.div
                className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AIGC 创作者
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} prefetch={true}>
                  <Button
                    variant={pathname === item.path ? 'default' : 'ghost'}
                    className="relative transition-colors duration-200"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative z-[60]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.svg
                    key="close"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed inset-0 z-[55] flex flex-col items-center justify-center md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-background/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl mx-6 p-8 w-[calc(100%-3rem)] max-w-sm shadow-2xl shadow-purple-500/10">
                {/* Neon glow accent */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 pointer-events-none" />

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    雷响
                  </span>
                </div>

                {/* Nav Items */}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                    >
                      <Link
                        href={item.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          pathname === item.path
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/10'
                            : 'hover:bg-purple-500/10 text-foreground hover:text-purple-300'
                        }`}
                      >
                        <span className="text-lg font-medium">{item.name}</span>
                        {pathname === item.path && (
                          <motion.div
                            className="ml-auto w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50"
                            layoutId="mobileNavIndicator"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Decorative line */}
                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

                {/* Bottom text */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  AI 驱动创意 · AIGC创作者
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
