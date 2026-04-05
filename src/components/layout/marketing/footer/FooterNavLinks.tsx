import Link from 'next/link';
import { useTranslations } from 'next-intl';

type FooterLinkGroupProps = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold md:text-xl lg:text-2xl">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link, index) => (
          <li key={`${title}-${index}`}>
            <Link href={link.href} className="text-sm hover:underline md:text-base">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterNavLinks: React.FC = () => {
  const t = useTranslations('layout.footer');

  const aboutUsLinks = [
    { label: t('about.our_story'), href: '#' },
    { label: t('about.team'), href: '#' },
    { label: t('about.careers'), href: '#' },
    { label: t('about.testimonials'), href: '#' },
    { label: t('about.partners'), href: '#' },
    { label: t('about.press'), href: '#' },
    { label: t('about.blog'), href: '#' },
  ];

  const supportLinks = [
    { label: t('support.help_center'), href: '#' },
    { label: t('support.safety'), href: '#' },
    { label: t('support.cancellation'), href: '#' },
    { label: t('support.covid'), href: '#' },
    { label: t('support.accessibility'), href: '#' },
    { label: t('support.report'), href: '#' },
  ];

  const destinationLinks = [
    { label: t('destinations.ha_giang'), href: '#' },
    { label: t('destinations.sapa'), href: '#' },
    { label: t('destinations.mu_cang_chai'), href: '#' },
    { label: t('destinations.mai_chau'), href: '#' },
    { label: t('destinations.ba_be'), href: '#' },
    { label: t('destinations.kon_tum'), href: '#' },
    { label: t('destinations.dak_nong'), href: '#' },
  ];

  return (
    <div className="grid min-w-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:gap-16">
      <FooterLinkGroup title={t('about.title')} links={aboutUsLinks} />
      <FooterLinkGroup title={t('support.title')} links={supportLinks} />
      <FooterLinkGroup title={t('destinations.title')} links={destinationLinks} />
    </div>
  );
};

export default FooterNavLinks;
