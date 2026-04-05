'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import logger from '@/libs/logger';

import { Button } from '@/components/ui/button';

import '../styles/globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error('Global error:', error);
  }, [error]);

  return (
    <html lang="vi">
      <head>
        <style>{`
          nextjs-portal {
            display: none !important;
          }
        `}</style>
      </head>
      <body className="bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <main className="flex w-full max-w-lg flex-col items-center justify-center text-center">
            <div className="mb-6">
              <AlertTriangle className="h-24 w-24 text-red-500 sm:h-32 sm:w-32" />
            </div>

            <h1 className="mb-4 font-mono text-6xl font-bold text-red-500 sm:text-8xl">ERROR</h1>

            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-bold sm:text-3xl">Đã xảy ra lỗi nghiêm trọng</h2>
              <p className="text-gray-400">
                Hệ thống đã gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi này và đang khắc phục.
              </p>
              {error.digest && (
                <p className="mt-2 rounded-md bg-red-950/30 p-2 font-mono text-sm text-red-200">
                  Mã lỗi: {error.digest}
                </p>
              )}
            </div>

            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700" onClick={() => reset()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </main>
        </div>
      </body>
    </html>
  );
}
