import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18n-navigation';
import { getBaseUrl } from '@/libs/i18n-url';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Toaster } from '@/components/ui/toaster';
import Loading from '@/components/shared/loading';
import { StructuredData } from '@/components/shared/structured-data';

import Providers from './providers';

import '@/styles/globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  preload: true,
});

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  const canonicalUrl = locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: {
      template: '%s | Ethnic Village Travel',
      default: 'Ethnic Village Travel',
    },
    description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
    keywords: [
      'du lịch dân tộc',
      'làng dân tộc Việt Nam',
      'tour dân tộc',
      'văn hóa dân tộc',
      'ethnic village travel',
      'vietnam ethnic tourism',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        vi: `${baseUrl}/vi`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: canonicalUrl,
      siteName: 'Ethnic Village Travel',
      title: 'Ethnic Village Travel',
      description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ethnic Village Travel',
      description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const baseUrl = getBaseUrl();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI;

  return (
    <html>
      <head>
        <StructuredData type="Organization" data={{ url: baseUrl }} />
        {apiUrl && (
          <>
            <link rel="preconnect" href={apiUrl} />
            <link rel="dns-prefetch" href={apiUrl} />
          </>
        )}
        <link rel="preload" href="/images/homepage_hero.jpg" as="image" />
      </head>
      <body className={`${roboto.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Suspense fallback={<Loading fullScreen text="Đang tải trang..." />}>
              {children}

              <Toaster />
            </Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
