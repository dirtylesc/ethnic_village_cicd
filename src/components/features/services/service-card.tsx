'use client';

import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type ServiceCardProps = {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  featuresKey?: string;
  ctaLink?: string;
  ctaTextKey?: string;
}

export function ServiceCard({
  icon: Icon,
  titleKey,
  descriptionKey,
  featuresKey,
  ctaLink,
  ctaTextKey,
}: ServiceCardProps) {
  const t = useTranslations('services');
  const features = featuresKey ? t.raw(featuresKey as any) : [];

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="bg-primary-500/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="h-8 w-8 text-primary-500" />
      </div>

      <h3 className="mb-3 text-xl font-semibold text-dark">{t(titleKey as any)}</h3>
      <p className="mb-4 flex-grow text-gray-600">{t(descriptionKey as any)}</p>

      {features && Array.isArray(features) && features.length > 0 && (
        <ul className="mb-4 space-y-2">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <span className="mr-2 text-primary-500">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {ctaLink && ctaTextKey && (
        <Link href={ctaLink}>
          <Button variant="outline" className="group w-full">
            {t(ctaTextKey as any)}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      )}
    </div>
  );
}
