import { RouteConstant } from './route';

export const ACCOUNT_LOCKED = 'ACCOUNT_LOCKED';
export const ADMIN_DASHBOARD_READ = 'ADMIN_DASHBOARD_READ';

export const PermissionMap: { [key: string]: string[] } = {

  [RouteConstant.admin_dashboard]: [ADMIN_DASHBOARD_READ],
  [RouteConstant.admin_user]: ['ADMIN_USER_READ'],
  [RouteConstant.admin_user_create]: ['ADMIN_USER_WRITE'],
  [RouteConstant.admin_user_edit]: ['ADMIN_USER_WRITE'],
  [RouteConstant.admin_role]: ['ADMIN_ROLE_READ'],
  [RouteConstant.admin_role_create]: ['ADMIN_ROLE_WRITE'],
  [RouteConstant.admin_role_edit]: ['ADMIN_ROLE_WRITE'],
  [RouteConstant.admin_tour]: ['ADMIN_TOUR_READ'],
  [RouteConstant.admin_tour_create]: ['ADMIN_TOUR_WRITE'],
  [RouteConstant.admin_tour_edit]: ['ADMIN_TOUR_WRITE'],
  [RouteConstant.admin_assigned_available_dates]: ['ADMIN_TOUR_ASSIGNMENT_READ'],
  [RouteConstant.admin_article]: ['ADMIN_ARTICLE_READ'],
  [RouteConstant.admin_article_create]: ['ADMIN_ARTICLE_WRITE'],
  [RouteConstant.admin_article_edit]: ['ADMIN_ARTICLE_WRITE'],
  [RouteConstant.admin_booking]: ['ADMIN_BOOKING_READ'],
  [RouteConstant.admin_order]: ['ADMIN_ORDER_READ'],
  [RouteConstant.admin_notification]: ['ADMIN_NOTIFICATION_READ'],
  [RouteConstant.admin_notification_create]: ['ADMIN_NOTIFICATION_WRITE'],
  [RouteConstant.admin_notification_edit]: ['ADMIN_NOTIFICATION_WRITE'],
  [RouteConstant.admin_report]: ['ADMIN_REPORT_READ'],
  [RouteConstant.admin_chatbot]: ['ADMIN_CHATBOT_READ'],
  [RouteConstant.admin_chatbot_create]: ['ADMIN_CHATBOT_WRITE'],
  [RouteConstant.admin_chatbot_edit]: ['ADMIN_CHATBOT_WRITE'],

  [RouteConstant.admin_employee]: ['ADMIN_EMPLOYEE_READ'],
  [RouteConstant.admin_category]: ['ADMIN_CATEGORY_READ'],
  [RouteConstant.admin_category_create]: ['ADMIN_CATEGORY_WRITE'],
  [RouteConstant.admin_category_edit]: ['ADMIN_CATEGORY_WRITE'],
  [RouteConstant.admin_promotion]: ['ADMIN_PROMOTION_READ'],
  [RouteConstant.admin_promotion_create]: ['ADMIN_PROMOTION_WRITE'],
  [RouteConstant.admin_promotion_edit]: ['ADMIN_PROMOTION_WRITE'],
};

export const DeniedPermissionMap: { [key: string]: string } = {
  [RouteConstant.tour]: 'DENIED_TOUR_READ',
  [RouteConstant.tour_detail]: 'DENIED_TOUR_READ',
  [RouteConstant.article]: 'DENIED_ARTICLE_READ',
  [RouteConstant.article_detail]: 'DENIED_ARTICLE_READ',
  [RouteConstant.personal]: 'DENIED_PERSONAL_READ',
  [RouteConstant.personal_bookmark]: 'DENIED_PERSONAL_READ',
  [RouteConstant.personal_transaction]: 'DENIED_PERSONAL_READ',
  [RouteConstant.personal_account]: 'DENIED_PERSONAL_READ',
  [RouteConstant.order]: 'DENIED_ORDER_READ',
  [RouteConstant.order_detail]: 'DENIED_ORDER_READ',
  [RouteConstant.payment]: 'DENIED_ORDER_WRITE',
};
