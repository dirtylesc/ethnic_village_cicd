'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { TabType } from '@/data/apis/tour.api';
import { cn } from '@/utils/classnames';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useEnabledCategories } from '@/hooks/api/useCategory';
import { useFilteredTours } from '@/hooks/api/useTour';
import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import TourList from './tour-list';

type TabItem =
  | { type: 'fixed'; id: TabType; label: string }
  | { type: 'category'; id: string; name: string; slug: string };

const fixedTabs: TabItem[] = [
  { type: 'fixed', id: 'popular', label: 'popular' },
  { type: 'fixed', id: 'outstanding', label: 'outstanding' },
  { type: 'fixed', id: 'best_price', label: 'best_price' },
];

const TourSection = () => {
  const [activeTab, setActiveTab] = useState<string>('popular');
  const t = useTranslations('common');
  const tTour = useTranslations('home.tour' as any) as any;

  const { data: categoryData, isLoading: isCategoriesLoading } = useEnabledCategories();
  const categories = categoryData?.data || [];

  const isFixedTab = fixedTabs.some(tab => tab.id === activeTab);
  const activeFixedTabType = isFixedTab ? (activeTab as TabType) : 'popular';

  const { data: filteredTourData, isLoading: isToursLoading } = useFilteredTours(activeFixedTabType);

  const allTabs: TabItem[] = useMemo(() => {
    const categoryTabs: TabItem[] = categories.map(cat => ({
      type: 'category' as const,
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    }));
    return [...fixedTabs, ...categoryTabs];
  }, [categories]);

  const activeCategory = useMemo(() => {
    if (isFixedTab) return null;
    return categories.find(c => c.id === activeTab);
  }, [categories, activeTab, isFixedTab]);

  const tours: Tour[] = useMemo(() => {
    if (isFixedTab) {
      return filteredTourData?.data || [];
    }

    const categoryTours = activeCategory?.tours || [];
    return categoryTours.map(tour => ({
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      imageUrl: tour.imageUrl || '/images/placeholder-tour.jpg',
      duration: tour.duration,
      adultPrice: tour.adultPrice,
    })) as Tour[];
  }, [isFixedTab, filteredTourData, activeCategory]);

  const isLoading = isCategoriesLoading || (isFixedTab && isToursLoading);

  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection title={tTour('title')} description={tTour('description')} />

      <div className="flex w-full flex-wrap gap-3">
        {allTabs.map(tab => {
          const tabId = tab.type === 'fixed' ? tab.id : tab.id;
          return (
            <button
              key={tabId}
              className={cn(
                'rounded-3xl bg-gray-10 px-4 py-2 text-sm text-dark transition-all duration-300',
                'hover:bg-primary hover:text-white',
                {
                  'bg-primary text-white': activeTab === tabId,
                },
              )}
              onClick={() => setActiveTab(tabId)}
            >
              {tab.type === 'fixed' ? (tTour as any)(tab.id) : tab.name}
            </button>
          );
        })}
      </div>

      <TourList tours={tours} isLoading={isLoading} isError={false} />

      <Button asChild>
        <Link href={`${RouteConstant.tour}${activeCategory ? `?category=${activeCategory.slug}` : ''}`}>
          {t('view_more')}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default TourSection;
