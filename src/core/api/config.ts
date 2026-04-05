export const API_ROOT = process.env.NEXT_PUBLIC_SERVER_URI;

export const TIMEOUT: number = 150000;

export const API = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
  },
  USER: {
    DETAILS: '/user/details',
    UPDATE_PERSONAL: '/user/personal',
    UPDATE_PASSWORD: '/user/password',
  },
  CONTACT: {
    SEND: '/contact',
  },
  BLOG: {
    GET: '/blog',
  },
  TOUR: {
    SEARCH: '/tour',
    GET_BY_IDS: '/tour/ids',
    DETAIL: '/tour',
    FILTER_TAB: '/tour/filtered',
    GET_BOOKMARK_STATUS: '/tours/bookmark/status',
    TOGGLE_BOOKMARK: '/tours/bookmark',
  },
  LOCATION: {
    GET_ALL: '/location',
  },
  ETHNIC: {
    GET_ALL: '/ethnic',
  },
  TAG: {
    GET_ALL: '/tag',
  },
  POST: {
    GET_ALL: '/post',
  },
  REVIEW: {
    ADD: '/review',
    EDIT: '/review',
    DELETE: '/review',
    PIN: '/review/pin',
    REPORT: '/review/report',
  },
  BOOKING: {
    SEARCH: '/booking',
    GET: '/booking/{id}',
    GET_BY_ORDER_CODE: '/booking/by-order-code/{orderCode}',
    STORE: '/booking/store',
    UPDATE: '/booking/update',
    UPDATE_CONTACT: '/booking/{id}/contact',
    CONFIRM: '/booking/{id}/confirm',
    CANCEL: '/booking/{id}/cancel',
    CANCEL_BY_ORDER_CODE: '/booking/cancel-by-order-code',
  },
  PROMOTION: {
    VALIDATE: '/promotion/validate',
    BEST_DIRECT_DISCOUNT: '/promotion/best-direct-discount',
  },
  BOOKMARK: {
    BASE: '/bookmark',
    CHECK: '/bookmark/check',
  },
  PAYMENT: {
    CREATE: '/payments/create/{id}',
    GET_PAYMENT_LINK: '/payments/booking/{id}/payment-link',
  },
  CATEGORY: {
    ENABLED: '/categories/enabled',
  },
  NOTIFICATION: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: '/notifications/{id}/read',
    MARK_ALL_READ: '/notifications/read-all',
    STREAM: '/notifications/stream',
  },
};

export const AdminAPI = {
  TOUR: {
    LIST: '/admin/tour',
    SEARCH: '/admin/tour/search',
    STORE: '/admin/tour/store',
    AVAILABLE_DAYS: '/admin/tour-available-days',
  },
  BOOKING: {
    LIST: '/admin/bookings',
  },
  SERVICE_INFO: {
    ALL: '/admin/service',
  },

  TOUR_ASSIGNMENT: {
    ASSIGN: '/admin/tour-assignments/assign',
    ASSIGN_SINGLE: '/admin/tour-assignments/assign-single',
    SEARCH: '/admin/tour-assignments/search',
    ASSIGNED_AVAILABLE_DATES: '/admin/tour-assignments/assigned-available-dates',
    CALENDAR_ASSIGNMENTS: '/admin/tour-assignments/calendar',
    HISTORY: '/admin/tour-assignments/history',
    UPDATE_STATUS: '/admin/tour-assignments/update-status',
  },
  ROLE: {
    LIST: '/admin/role',
    DETAIL: '/admin/role',
    CREATE: '/admin/role',
    UPDATE: '/admin/role',
    DELETE: '/admin/role',
  },
  USER: {
    LIST: '/admin/user',
    DETAIL: '/admin/user',
    CREATE: '/admin/user',
    UPDATE: '/admin/user',
    DELETE: '/admin/user',
  },
  EMPLOYEE: {
    LIST: '/admin/employee',
    DETAIL: '/admin/employee',
    UPDATE: '/admin/employee',
    DELETE: '/admin/employee',
    AVAILABLE: '/admin/employee/available',
    AVAILABLE_BY_DATE_RANGE: '/admin/employee/available-by-date-range',
    ASSIGNED_BY_DATES: '/admin/employee/assigned-by-dates',
    ACTIVE: '/admin/employee/active',
  },
  PERMISSION: {
    LIST: '/admin/permission',
    GROUPED: '/admin/permission/grouped',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    UPCOMING_DEPARTURES: '/admin/dashboard/upcoming-departures',
    REVENUE_CHART: '/admin/dashboard/revenue-chart',
    TOP_DESTINATIONS: '/admin/dashboard/top-destinations',
    RECENT_BOOKINGS: '/admin/dashboard/recent-bookings',
  },
  CATEGORY: {
    LIST: '/admin/categories',
    DETAIL: '/admin/categories',
    CREATE: '/admin/categories',
    UPDATE: '/admin/categories',
    DELETE: '/admin/categories',
    ADD_TOURS: '/admin/categories',
    REMOVE_TOURS: '/admin/categories',
    TOGGLE_STATUS: '/admin/categories',
  },
  ARTICLE: {
    LIST: '/admin/articles',
    DETAIL: '/admin/articles',
    CREATE: '/admin/articles',
    UPDATE: '/admin/articles',
    DELETE: '/admin/articles',
    UPDATE_STATUS: '/admin/articles',
  },
  PROMOTION: {
    LIST: '/admin/promotion',
    DETAIL: '/admin/promotion',
    CREATE: '/admin/promotion/store',
    UPDATE: '/admin/promotion',
    DELETE: '/admin/promotion',
  },
};
