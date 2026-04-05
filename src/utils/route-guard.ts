import { RouteConstant } from '@/core/constants/route';

export const ADMIN_ROUTES = [
  RouteConstant.admin_dashboard,
  RouteConstant.admin_user,
  RouteConstant.admin_user_create,
  RouteConstant.admin_user_edit,
  RouteConstant.admin_role,
  RouteConstant.admin_role_create,
  RouteConstant.admin_role_edit,
  RouteConstant.admin_tour,
  RouteConstant.admin_tour_create,
  RouteConstant.admin_tour_edit,
  RouteConstant.admin_article,
  RouteConstant.admin_article_create,
  RouteConstant.admin_article_edit,
  RouteConstant.admin_order,
  RouteConstant.admin_notification,
  RouteConstant.admin_notification_create,
  RouteConstant.admin_notification_edit,
  RouteConstant.admin_report,
  RouteConstant.admin_chatbot,
  RouteConstant.admin_chatbot_create,
  RouteConstant.admin_chatbot_edit,
  RouteConstant.admin_assigned_available_dates,
];

export const PROTECTED_ROUTES = [
  RouteConstant.personal,
  RouteConstant.personal_bookmark,
  RouteConstant.personal_transaction,
  RouteConstant.personal_account,

  ...ADMIN_ROUTES,
];

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    const pattern = route.replace(/:[\w]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};

export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin');
};

export const getLoginRedirectUrl = (currentPath: string, locale: string = 'vi'): string => {
  const loginUrl = `/${locale}/`;
  const redirectParam = encodeURIComponent(currentPath);
  return `${loginUrl}?redirect=${redirectParam}`;
};
