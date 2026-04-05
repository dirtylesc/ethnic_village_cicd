import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {
  ACCOUNT_LOCKED,
  ADMIN_DASHBOARD_READ,
  DeniedPermissionMap,
  PermissionMap,
} from './core/constants/permission-map';
import { routing } from './libs/i18n-navigation';
import { normalizePath } from './utils';
import { PROTECTED_ROUTES } from './utils/route-guard';

const intlMiddleware = createMiddleware(routing);

function extractLocaleFromPath(pathname: string): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (['en', 'vi'].includes(locale)) {
    return {
      locale,
      pathWithoutLocale: '/' + segments.slice(1).join('/') || '/',
    };
  }

  return {
    locale: 'vi',
    pathWithoutLocale: pathname,
  };
}

function hasAccess(userPermissions: string[], path: string): boolean {
  if (userPermissions.includes(ACCOUNT_LOCKED)) {
    return false;
  }

  const matchedDeniedPermission = Object.keys(DeniedPermissionMap).find(route => {
    const normalizedRoute = normalizePath(route);
    const regex = new RegExp(`^${normalizedRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
    return regex.test(normalizePath(path));
  });

  if (matchedDeniedPermission && userPermissions.includes(DeniedPermissionMap[matchedDeniedPermission])) {
    return false;
  }

  if (path.startsWith('/admin') && !userPermissions.includes(ADMIN_DASHBOARD_READ)) {
    return false;
  }

  const matchedRoute = Object.keys(PermissionMap).find(route => {
    const normalizedRoute = normalizePath(route);
    const regex = new RegExp(`^${normalizedRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
    const isMatch = regex.test(normalizePath(path));
    return isMatch;
  });

  if (!matchedRoute) {
    const result = !path.startsWith('/admin') || userPermissions.includes(ADMIN_DASHBOARD_READ);
    return result;
  }

  const requiredPermissions = PermissionMap[matchedRoute];

  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

function requiresAuth(path: string): boolean {
  if (path.startsWith('/admin')) {
    return true;
  }

  return PROTECTED_ROUTES.some(protectedPath => path.includes(protectedPath));
}

function getAuthData(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const userRoles = request.cookies.get('userRoles')?.value;
    const userPermissions = request.cookies.get('userPermissions')?.value;

    if (!accessToken || !userRoles || !userPermissions) return null;

    return {
      accessToken,
      roles: JSON.parse(userRoles),
      permissions: JSON.parse(userPermissions),
    };
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname);

  if (!requiresAuth(pathWithoutLocale)) {
    return intlMiddleware(request);
  }

  const authData = getAuthData(request);

  if (!authData) {
    const loginUrl = new URL(`/${locale}/`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const hasPermission = hasAccess(authData.permissions, pathWithoutLocale);

  if (!hasPermission) {
    return NextResponse.redirect(new URL(`/${locale}/403`, request.url));
  }
  const response = intlMiddleware(request);
  if (response) {
    response.headers.set('x-user-roles', JSON.stringify(authData.roles));
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
