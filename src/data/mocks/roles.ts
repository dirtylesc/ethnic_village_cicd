import { PermissionCategory } from '@/types/role.type';

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'tour',
    name: 'Tour',
    permissions: [
      { id: 'tour_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'tour' },
      { id: 'tour_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'tour' },
    ],
  },
  {
    id: 'article',
    name: 'Bài viết',
    permissions: [
      { id: 'article_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'article' },
      { id: 'article_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'article' },
    ],
  },
  {
    id: 'user',
    name: 'Người dùng',
    permissions: [
      { id: 'user_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'user' },
      { id: 'user_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'user' },
    ],
  },
  {
    id: 'booking',
    name: 'Đặt chỗ',
    permissions: [
      { id: 'booking_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'booking' },
      { id: 'booking_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'booking' },
    ],
  },
  {
    id: 'payment',
    name: 'Thanh toán',
    permissions: [
      { id: 'payment_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'payment' },
      { id: 'payment_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'payment' },
    ],
  },
  {
    id: 'report',
    name: 'Báo cáo',
    permissions: [
      { id: 'report_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'report' },
      { id: 'report_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'report' },
    ],
  },
  {
    id: 'system',
    name: 'Hệ thống',
    permissions: [
      { id: 'system_full', name: 'Full quyền quản lý', code: 'FULL00', category: 'system' },
      { id: 'system_dashboard', name: 'Truy cập dashboard', code: 'ACS00', category: 'system' },
    ],
  },
] as const;

export const VALIDATION_RULES = {
  ROLE_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\s\u00C0-\u017F\u1EA0-\u1EF9]+$/,
  },
} as const;
