import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/libs/i18n-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
