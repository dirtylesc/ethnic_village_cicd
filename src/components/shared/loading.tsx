'use client';

import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type LoadingProps = {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
};

export default function Loading({ className, text = 'Đang tải...', size = 'md', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex h-full w-full items-center justify-center py-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center justify-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-sm font-medium text-muted-foreground"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
}
