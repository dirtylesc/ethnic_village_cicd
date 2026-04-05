import { Suspense } from 'react';

import { HeroSection } from '@/components/features/home/hero-section';
import ArticleSection from '@/components/features/home/article-section';
import ReasonSection from '@/components/features/home/reason-section';
import TourSection from '@/components/features/home/tour-section';
import Loading from '@/components/shared/loading';

export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <HeroSection />

      <Suspense fallback={<Loading text="Đang tải tours..." />}>
        <TourSection />
      </Suspense>

      <Suspense fallback={<Loading text="Đang tải bài viết..." />}>
        <ArticleSection />
      </Suspense>

      <Suspense fallback={null}>
        <ReasonSection />
      </Suspense>
    </div>
  );
}
