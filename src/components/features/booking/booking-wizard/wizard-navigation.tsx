'use client';

import { cn } from '@/utils/classnames';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export type WizardNavigationProps = {
  onBack?: () => void;
  onContinue: () => void;
  showBack?: boolean;
  isLoading?: boolean;
  isContinueDisabled?: boolean;
  continueLabel?: string;
  backLabel?: string;
  className?: string;
};

export function WizardNavigation({
  onBack,
  onContinue,
  showBack = true,
  isLoading = false,
  isContinueDisabled = false,
  continueLabel,
  backLabel,
  className,
}: WizardNavigationProps) {
  const t = useTranslations('booking.wizard');

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {showBack && onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="gap-2"
          aria-label={backLabel || t('back')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel || t('back')}
        </Button>
      ) : (
        <div />
      )}
      <Button
        type="button"
        onClick={onContinue}
        disabled={isContinueDisabled || isLoading}
        className="min-w-[120px]"
        aria-label={continueLabel || t('continue')}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            {t('processing')}
          </>
        ) : (
          continueLabel || t('continue')
        )}
      </Button>
    </div>
  );
}
