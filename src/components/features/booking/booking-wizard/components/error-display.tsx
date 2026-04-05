'use client';

import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type ErrorDisplayProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'inline' | 'card';
  isRetrying?: boolean;
}

export function ErrorDisplay({
  title,
  message,
  onRetry,
  retryLabel,
  variant = 'inline',
  isRetrying = false,
}: ErrorDisplayProps) {
  const t = useTranslations('booking.wizard.error');

  const content = (
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
      <div className="flex-1">
        {title && <p className="mb-1 font-semibold text-red-700">{title}</p>}
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 gap-2" disabled={isRetrying}>
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {retryLabel || t('retry')}
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    );
  }

  return <div className="rounded-lg border border-red-200 bg-red-50 p-4">{content}</div>;
}

export type OfflineIndicatorProps = {
  message?: string;
}

export function OfflineIndicator({ message }: OfflineIndicatorProps) {
  const t = useTranslations('booking.wizard.error');

  return (
    <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <WifiOff className="h-5 w-5 flex-shrink-0 text-yellow-600" />
      <div className="flex-1">
        <p className="mb-1 font-semibold text-yellow-700">{t('offline_title')}</p>
        <p className="text-sm text-yellow-700">{message || t('offline_message')}</p>
      </div>
    </div>
  );
}
