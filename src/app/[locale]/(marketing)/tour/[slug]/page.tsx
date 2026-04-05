import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_ROOT } from '@/core/api';
import { routing } from '@/libs/i18n-navigation';
import { getBaseUrl } from '@/libs/i18n-url';

import { ApiResponse } from '@/types/api.type';
import { Tour } from '@/types/tour.type';
import { StructuredData } from '@/components/shared/structured-data';
import TourDetail from '@/components/features/tour/tour-detail';

type TourDetailPageProps = {
  params: {
    slug: string;
    locale: string;
  };
}

async function fetchTourDetail(slug: string): Promise<Tour | null> {
  try {
    const url = `${API_ROOT}/api/v1/tour/${slug}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as ApiResponse<Tour>;
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug } = params;

  const tour = await fetchTourDetail(slug);

  if (!tour) {
    return {};
  }

  const title = tour.title || 'Tour';
  const description = tour.overview || `Khám phá tour ${tour.title} - ${tour.duration} ngày`;
  const imageUrl = tour.imageUrl;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/tour/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug, locale } = params;

  const tour = await fetchTourDetail(slug);

  if (!tour) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const breadcrumbs = [
    { name: 'Trang chủ', url: `${baseUrl}${localePrefix}` },
    { name: 'Tours', url: `${baseUrl}${localePrefix}/tour` },
    { name: tour.title, url: `${baseUrl}${localePrefix}/tour/${slug}` },
  ];

  return (
    <>
      <StructuredData type="Tour" data={{ ...tour, baseUrl, slug }} />
      <StructuredData type="BreadcrumbList" data={breadcrumbs} />
      <TourDetail slug={slug} initialTour={tour} />
    </>
  );
}
