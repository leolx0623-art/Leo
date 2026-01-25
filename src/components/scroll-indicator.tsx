'use client';

import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  color?: 'purple' | 'blue' | 'green' | 'pink';
}

export function ScrollIndicator({ color = 'purple' }: ScrollIndicatorProps) {
  const colorClasses = {
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500',
    },
    blue: {
      border: 'border-blue-500/50',
      bg: 'bg-blue-500',
    },
    green: {
      border: 'border-green-500/50',
      bg: 'bg-green-500',
    },
    pink: {
      border: 'border-pink-500/50',
      bg: 'bg-pink-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className={`w-6 h-10 border-2 ${colors.border} rounded-full flex items-start justify-center p-2 bg-background/80 backdrop-blur-sm`}>
        <div className={`w-1.5 h-3 ${colors.bg} rounded-full animate-pulse`} />
      </div>
    </motion.div>
  );
}
