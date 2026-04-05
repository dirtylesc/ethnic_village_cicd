import { useTransition } from 'react';
import { TabType } from '@/data/apis/tour.api';
import { cn } from '@/utils/classnames';
import { useTranslations } from 'next-intl';

type TabsListProps = {
  tabs: {
    id: TabType;
    label: string;
  }[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabsList = ({ tabs, activeTab, setActiveTab }: TabsListProps) => {
  const t = useTranslations('home.tour' as any) as any;
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: TabType) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  return (
    <div className="flex w-full gap-3">
      {tabs.map(tab => (
        <button
          key={tab.id}
          disabled={isPending}
          className={cn(
            'padding-[10px] rounded-3xl bg-gray-10 px-4 py-2 text-sm text-dark transition-all duration-300',
            'hover:bg-primary hover:text-white',
            {
              'bg-primary text-white': activeTab === tab.id,
              'cursor-not-allowed opacity-70': isPending,
            },
          )}
          onClick={() => handleTabChange(tab.id)}
        >
          {t(tab.id)}
        </button>
      ))}
    </div>
  );
};

export default TabsList;
