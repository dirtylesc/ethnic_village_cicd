'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { Calendar, CalendarCheck, Compass, LayoutGrid, Search, ShieldCheck, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const COMMAND_SECTIONS = ['general', 'management'] as const;

type CommandSectionKey = (typeof COMMAND_SECTIONS)[number];

type CommandItem = {
  labelKey: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

type CommandConfig = Record<CommandSectionKey, CommandItem[]>;

const COMMAND_ITEMS: CommandConfig = {
  general: [
    { labelKey: 'general.dashboard', icon: LayoutGrid, href: RouteConstant.admin_dashboard },
    { labelKey: 'general.user', icon: User, href: RouteConstant.admin_user },
    { labelKey: 'general.employee', icon: User, href: RouteConstant.admin_employee },
    { labelKey: 'general.role', icon: ShieldCheck, href: RouteConstant.admin_role },
  ],
  management: [
    { labelKey: 'management.tour', icon: Compass, href: RouteConstant.admin_tour },
    { labelKey: 'management.category', icon: LayoutGrid, href: RouteConstant.admin_category },
    {
      labelKey: 'management.tour_assignment',
      icon: CalendarCheck,
      href: RouteConstant.admin_assigned_available_dates,
    },
    { labelKey: 'management.booking', icon: Calendar, href: RouteConstant.admin_booking },
  ],
};

export default function SearchCommand() {
  const t = useTranslations('admin.search_command');
  const router = useRouter();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex w-64 cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2"
      >
        <div className="flex items-center gap-2">
          <Search className="!h-4 !w-4" />
          {t('trigger_placeholder')}
        </div>
        <p className="text-sm text-muted-foreground">
          {' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {' '}
            <span className="text-xs">⌘</span>K{' '}
          </kbd>{' '}
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder={t('input_placeholder')} />
          <CommandList>
            <CommandEmpty>{t('empty')}</CommandEmpty>
            {COMMAND_SECTIONS.map(sectionKey => {
              const items = COMMAND_ITEMS[sectionKey].filter(item => {
                if (user?.roles?.includes('ROLE_TOUR_AGENCY')) {
                  return item.labelKey === 'management.tour_assignment';
                }
                return true;
              });

              if (items.length === 0) return null;

              return (
                <CommandGroup className="border-b py-2" heading={t(`sections.${sectionKey}`)} key={sectionKey}>
                  {items.map(item => (
                    <CommandItem
                      key={item.labelKey}
                      onSelect={() => {
                        router.push(item.href);
                        setOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {t(`items.${item.labelKey}` as any)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
