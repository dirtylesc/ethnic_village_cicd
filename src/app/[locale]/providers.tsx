'use client';

import * as React from 'react';
import { useProgressStore } from '@/stores/useProgressStore';
import { useNProgress } from '@tanem/react-nprogress';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { UserDetailsLoader } from '@/components/features/auth';

export type ProgressProps = {
  isAnimating: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });
  return (
    <div
      className="pointer-events-none"
      style={{ opacity: isFinished ? 0 : 1, transition: `opacity ${animationDuration}ms linear` }}
    >
      <div
        className="fixed left-0 top-0 z-50 h-0.5 w-full bg-[#3399dd]"
        style={{ marginLeft: `${(-1 + progress) * 100}%`, transition: `margin-left ${animationDuration}ms linear` }}
      />
    </div>
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const setIsAnimating = useProgressStore(state => state.setIsAnimating);
  const isAnimating = useProgressStore(state => state.isAnimating);

  React.useEffect(() => {
    if (!document) return;

    const handleStart = () => {
      setIsAnimating(true);
    };

    const handleStop = () => {
      setIsAnimating(false);
    };

    document.addEventListener('navigationStart', handleStart);
    document.addEventListener('navigationEnd', handleStop);
    document.addEventListener('navigationError', handleStop);

    return () => {
      document.removeEventListener('navigationStart', handleStart);
      document.removeEventListener('navigationEnd', handleStop);
      document.removeEventListener('navigationError', handleStop);
    };
  }, [setIsAnimating]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60 * 1000 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: 'always',
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Progress isAnimating={isAnimating} />
      <UserDetailsLoader />
      {children}
      
    </QueryClientProvider>
  );
}
