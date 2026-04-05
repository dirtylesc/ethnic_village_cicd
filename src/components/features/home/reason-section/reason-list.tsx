'use client';

import { useTranslations } from 'next-intl';

import ReasonCard from './reason-card';

type Reason = {
  icon: string;
  title: string;
  description: string;
}

const ReasonList = () => {
  const t = useTranslations('home');
  const reasons = t.raw('reasons') as Reason[];

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      {reasons.map((reason, index) => (
        <ReasonCard key={index} icon={reason.icon} title={reason.title} description={reason.description} />
      ))}
    </div>
  );
};

export default ReasonList;
