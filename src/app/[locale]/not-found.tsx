'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <main className="flex w-full max-w-lg flex-col items-center justify-center text-center">
        <h1 className="mb-4 font-mono text-6xl font-bold text-fuchsia-500 sm:text-8xl">404</h1>

        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Oops! Trang không tồn tại</h2>
          <p className="text-gray-400">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-white/10 text-white hover:bg-white/20">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Trang chủ
            </Link>
          </Button>

          <Button variant="secondary" size="lg" className="border-fuchsia-500/40 text-white hover:bg-fuchsia-950/30" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </main>
    </div>
  );
}
