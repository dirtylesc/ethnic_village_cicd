export const RouteConstant = {
  home: '/',
  about: '/about',
  services: '/services',
  blog: '/article',
  contact: '/contact',

  login: '/login',
  signup: '/signup',

  tour: '/tour',
  tour_detail: '/tour/:slug',

  article: '/article',
  article_detail: '/article/:slug',

  order: '/order',
  order_detail: '/order/:id',

  payment: '/payment/:id',
  payment_success: '/payment/success',
  payment_cancel: '/payment/cancel',

  personal: '/personal',
  personal_bookmark: '/personal/bookmark',
  personal_transaction: '/personal/transaction',
  personal_transaction_detail: '/personal/transaction/:id',
  personal_account: '/personal/account',

  admin_auth: '/admin/auth',
  admin_dashboard: '/admin',

  admin_user: '/admin/user',
  admin_user_create: '/admin/user/create',
  admin_user_edit: '/admin/user/edit/:username',

  admin_employee: '/admin/employee',
  admin_employee_create: '/admin/employee/create',
  admin_employee_edit: '/admin/employee/edit/:username',

  admin_role: '/admin/role',
  admin_role_create: '/admin/role/create',
  admin_role_edit: '/admin/role/edit/:id',

  admin_tour: '/admin/tour',
  admin_tour_create: '/admin/tour/create',
  admin_tour_edit: '/admin/tour/:id/edit',

  admin_assigned_available_dates: '/admin/assigned-available-dates',

  admin_article: '/admin/article',
  admin_article_create: '/admin/article/create',
  admin_article_edit: '/admin/article/:id/edit',

  admin_booking: '/admin/booking',

  admin_category: '/admin/category',
  admin_category_create: '/admin/category/create',
  admin_category_edit: '/admin/category/:id/edit',

  admin_promotion: '/admin/promotion',
  admin_promotion_create: '/admin/promotion/create',
  admin_promotion_edit: '/admin/promotion/:id/edit',

  admin_order: '/admin/order',

  admin_notification: '/admin/notification',
  admin_notification_create: '/admin/notification/create',
  admin_notification_edit: '/admin/notification/edit/:id',

  admin_report: '/admin/report',

  admin_chatbot: '/admin/chatbot',
  admin_chatbot_create: '/admin/chatbot/create',
  admin_chatbot_edit: '/admin/chatbot/edit/:slug',
};
