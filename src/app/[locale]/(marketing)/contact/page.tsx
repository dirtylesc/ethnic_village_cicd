import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ContactForm, ContactHero } from '@/components/features/contact';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <ContactHero />

      <section className="pt-12 md:pt-16 lg:pt-20">
        <ContactForm />
      </section>
    </div>
  );
}
