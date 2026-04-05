import { useTranslations } from 'next-intl';

import { Location } from '@/types/location.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PickDropLocationCardProps = {
  location: Location;
}

const PickDropLocationCard = ({ location }: PickDropLocationCardProps) => {
  const t = useTranslations('order.pick_drop_location');

  return (
    <Card className="xl:flex-0 grid gap-4 rounded-[20px] border border-gray-20 bg-white px-[30px] py-5 shadow-custom-gray lg:w-[360px]">
      <CardHeader className="flex flex-row items-center justify-center space-y-0 p-0">
        <CardTitle className="text-xl">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t('location')}:</span>
            <span>{location.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t('address')}:</span>
            <span>{location.address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickDropLocationCard;
