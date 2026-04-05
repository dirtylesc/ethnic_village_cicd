'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_DASHBOARD_READ } from '@/core/constants/permission-map';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/libs/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { SIDEBAR_NAV_ITEMS } from './side-bar-items';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('admin.sidebar');
  const { user } = useAuthStore();
  const userName =
    user?.personal?.firstName && user?.personal?.lastName
      ? `${user.personal.firstName} ${user.personal.lastName}`
      : user?.roles?.[0]
        ? `${user.roles[0]} User`
        : 'User';
  const userEmail = user?.email;

  const permissions = useMemo(() => {
    if (!user) return [];

    return user.permissions;
  }, [user]);

  const handleLogout = () => {
    router.push(RouteConstant.home);
    setTimeout(() => {
      logout();
    }, 0);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit !py-2 group-data-[collapsible=icon]:!px-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/avatar.jpg" alt={userName} />
                <AvatarFallback>SN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(SIDEBAR_NAV_ITEMS).map(([section, items]) => {
          const filteredItems = items.filter(item => {
            if (user?.roles?.includes('ROLE_TOUR_AGENCY')) {
              return item.label === 'tour_assigned_available_dates';
            }

            if (item.href.startsWith('/admin') && !permissions.includes(ADMIN_DASHBOARD_READ)) return false;

            if (!item.permission || !item.permission.some(p => permissions.includes(p))) return false;

            return true;
          });

          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={section}>
              <SidebarGroupLabel>{t(section as any)}</SidebarGroupLabel>
              <SidebarGroupContent className="flex list-none flex-col gap-2">
                <SidebarMenu>
                  {filteredItems.map(item => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        className={cn({
                          'bg-primary-500 text-sidebar-primary-foreground hover:bg-primary-500 hover:text-sidebar-primary-foreground':
                            pathname === item.href,
                        })}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="h-4 w-4" />
                        {t(item.label as any)}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenuItem className="cursor-pointer list-none">
          <SidebarMenuButton
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> {t('logout')}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
