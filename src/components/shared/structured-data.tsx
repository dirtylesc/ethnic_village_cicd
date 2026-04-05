import { Article } from '@/types/article.type';
import { Tour } from '@/types/tour.type';

type StructuredDataProps = {
  type: 'Organization' | 'Tour' | 'Article' | 'BreadcrumbList';
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let jsonLd: object;

  switch (type) {
    case 'Organization': {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ethnic Village Travel',
        description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
        url: data?.url || 'https://ethnicvillagetravel.com',
      };
      break;
    }
    case 'Tour': {
      const tour = data as Tour;
      const { baseUrl, slug } = data;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: tour.overview || tour.title,
        image: tour.imageUrl,
        url: slug ? `${baseUrl}/tour/${slug}` : undefined,
        duration: `P${tour.duration}D`,
        ...(tour.adultPrice && {
          offers: {
            '@type': 'Offer',
            price: tour.adultPrice,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
          },
        }),
        ...(tour.locations && tour.locations.length > 0 && {
          destination: tour.locations.map(location => ({
            '@type': 'Place',
            name: location.city || location.province || '',
            address: location.address || `${location.city}, ${location.province}`,
          })),
        }),
      };
      break;
    }
    case 'Article': {
      const article = data.article as Article;
      const { baseUrl, slug } = data;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.summary || article.title,
        image: article.imageUrl,
        url: `${baseUrl}/article/${slug}`,
        datePublished: article.publishedDate || undefined,
        author: {
          '@type': 'Organization',
          name: 'Ethnic Village Travel',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Ethnic Village Travel',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/icons/logo.svg`,
          },
        },
        ...(article.tags && article.tags.length > 0 && {
          keywords: article.tags.map(tag => tag.name).join(', '),
        }),
      };
      break;
    }
    case 'BreadcrumbList': {
      const items = data as Array<{ name: string; url: string }>;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      break;
    }
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
