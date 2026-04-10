'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-2xl font-bold text-purple-400">页面出了点问题</h2>
        <p className="text-gray-400 text-sm max-w-md">
          {error.message || '发生了未知错误'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
