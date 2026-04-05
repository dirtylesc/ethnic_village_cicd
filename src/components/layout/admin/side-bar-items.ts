import { PermissionMap } from '@/core/constants/permission-map';
import { RouteConstant } from '@/core/constants/route';
import {
  Briefcase,
  Calendar,
  CalendarCheck,
  Compass,
  LayoutGrid,
  Newspaper,
  Percent,
  ShieldCheck,
  Tags,
  User,
} from 'lucide-react';

export type SIDEBAR_NAV_ITEM_PROP = {
  label: string;
  icon: React.ElementType;
  href: string;
  permission: string[];
};

export const SIDEBAR_NAV_ITEMS: Record<string, SIDEBAR_NAV_ITEM_PROP[]> = {
  'section.general': [
    {
      label: 'dashboard',
      icon: LayoutGrid,
      href: RouteConstant.admin_dashboard,
      permission: PermissionMap[RouteConstant.admin_dashboard],
    },
  ],
  'section.users': [
    {
      label: 'user',
      icon: User,
      href: RouteConstant.admin_user,
      permission: PermissionMap[RouteConstant.admin_user],
    },
    {
      label: 'employee',
      icon: Briefcase,
      href: RouteConstant.admin_employee,
      permission: PermissionMap[RouteConstant.admin_employee],
    },
    {
      label: 'role',
      icon: ShieldCheck,
      href: RouteConstant.admin_role,
      permission: PermissionMap[RouteConstant.admin_role],
    },
  ],
  'section.business': [
    {
      label: 'tour',
      icon: Compass,
      href: RouteConstant.admin_tour,
      permission: PermissionMap[RouteConstant.admin_tour],
    },
    {
      label: 'category',
      icon: Tags,
      href: RouteConstant.admin_category,
      permission: PermissionMap[RouteConstant.admin_category],
    },
    {
      label: 'promotion',
      icon: Percent,
      href: RouteConstant.admin_promotion,
      permission: PermissionMap[RouteConstant.admin_promotion],
    },
    {
      label: 'tour_assigned_available_dates',
      icon: CalendarCheck,
      href: RouteConstant.admin_assigned_available_dates,
      permission: PermissionMap[RouteConstant.admin_assigned_available_dates],
    },
    {
      label: 'booking',
      icon: Calendar,
      href: RouteConstant.admin_booking,
      permission: PermissionMap[RouteConstant.admin_booking],
    },
  ],
  'section.content': [
    {
      label: 'article',
      icon: Newspaper,
      href: RouteConstant.admin_article,
      permission: PermissionMap[RouteConstant.admin_article],
    },
  ],
} as const;
