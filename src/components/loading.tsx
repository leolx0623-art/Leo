'use client';

import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-80" />
          <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 blur-xl opacity-40" />
        </motion.div>

        {/* Pulse rings */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute h-24 w-24 rounded-full border border-purple-500/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute h-24 w-24 rounded-full border border-pink-500/20"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-muted-foreground">加载中</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.2 }}
          >
            ...
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
