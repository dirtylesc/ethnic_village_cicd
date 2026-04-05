import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/separator';

const FooterCopyright: React.FC = () => {
  const t = useTranslations('layout.footer');

  return (
    <>
      <Separator className="bg-[#D9E1E1]" />
      <div className="py-3 text-center">
        <p className="text-base font-bold md:text-lg">{t('copyright')}</p>
      </div>
    </>
  );
};

export default FooterCopyright;
