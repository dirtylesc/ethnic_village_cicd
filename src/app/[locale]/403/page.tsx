'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, ShieldX } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md text-center">
        
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mb-4 text-6xl font-bold text-red-600">403</h1>

        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Truy cập bị từ chối</h2>

        <p className="mb-8 text-gray-600">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.back()} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          <p className="font-medium">Cần hỗ trợ?</p>
          <p>
            Liên hệ với đội ngũ hỗ trợ qua email:{' '}
            <a href="mailto:support@example.com" className="underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
