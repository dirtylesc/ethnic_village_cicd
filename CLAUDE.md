# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 (App Router) frontend for **Ethnic Village Travel**, a travel booking platform for exploring Vietnamese ethnic villages. The application supports both marketing pages and an admin dashboard with role-based access control.

## Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build           # Build for production
npm start               # Start production server
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint with auto-fix
npm run format          # Format code with Prettier
```

### Testing
```bash
npm test                # Run tests in watch mode (Vitest)
npm run test:run        # Run tests once
```

## Architecture

### Routing Structure

The application uses Next.js App Router with internationalization:
- **Route structure**: `/[locale]/(group)/path`
- **Locales**: `vi` (default), `en`
- **Middleware**: Handles i18n routing, authentication, and permission-based access control (src/middleware.ts:100)

#### Route Groups
- `(marketing)` - Public-facing pages (home, tours, articles, booking)
- `admin` - Admin dashboard with RBAC
- `personal` - User account pages (protected routes)

### State Management

**Zustand stores** (src/stores/):
- `useAuthStore` - Authentication state (access token, user data)
- `useUserStore` - User profile and permissions
- `useBookingStore` - Booking flow state
- `useChatSession` - Chatbot session management
- `useProgressStore` - Navigation progress indicator
- `useTourAssignmentStore` - Tour assignment state

### API Layer

**Axios instance** (src/core/api/api.ts):
- Base URL from environment variable
- Auto-injects Bearer token from `useAuthStore`
- Sets `Accept-Language` header from locale cookie
- Auto-redirects to login on 401 responses via `logout()` function

**API organization**:
- Admin APIs: `src/core/api/admin/*.admin.api.ts`
- Public APIs: Individual files per domain in `src/core/api/`

### Data Fetching

**TanStack Query** (React Query):
- Configured in `src/app/[locale]/providers.tsx:58`
- Default settings: 5-minute stale time, no retry, refetch on mount
- Custom hooks pattern: `src/hooks/use*.ts` (e.g., `useArticle`, `useNotification`)

### Components Organization

```
src/components/
├── ui/              # Design system primitives (shadcn/ui + Radix)
├── shared/          # Reusable cross-feature components
├── features/        # Feature-specific components organized by domain
│   ├── admin/       # Admin dashboard components
│   ├── auth/        # Authentication components
│   ├── booking/     # Booking flow components
│   ├── tour/        # Tour listing/detail components
│   ├── article/     # Article/blog components
│   └── home/        # Homepage sections
└── layout/          # Layout components
```

### Internationalization (i18n)

**next-intl** implementation:
- Messages: `src/messages/{locale}.json`
- Config: `src/libs/i18n.ts`
- Navigation helpers: `src/libs/i18n-navigation.ts` (exports `Link`, `redirect`, `useRouter`, `usePathname`)
- Use `Link` from `@/libs/i18n-navigation` instead of `next/link` for locale-aware routing

### Authentication & Authorization

**Flow**:
1. User logs in → tokens stored in cookies + Zustand store
2. Middleware checks authentication for protected routes (src/middleware.ts:109)
3. Permission checks via `PermissionMap` and `DeniedPermissionMap` (src/core/constants/permission-map.ts)
4. Admin routes require `ADMIN_DASHBOARD_READ` permission at minimum

**Protected routes**: Defined in `src/utils/route-guard.ts` via `PROTECTED_ROUTES` array

### Forms & Validation

**Stack**:
- `react-hook-form` - Form state management
- `zod` - Schema validation
- Schemas: `src/libs/schemas/`
- Form components: `src/components/ui/form.tsx` with Radix UI integration

### Data Tables

**Custom hook**: `use-data-table.ts` (src/hooks/use-data-table.ts)
- Built on TanStack Table
- URL state sync via `nuqs` (pagination, sorting, filtering)
- Features: server-side pagination, sorting, column filtering, row selection
- Config: `src/libs/data-table-config.ts`

## Design System

See `DESIGN_SYSTEM.md` for comprehensive documentation.

**Key points**:
- Base: Radix UI + Tailwind CSS (shadcn/ui pattern)
- Colors: CSS variables in `src/styles/globals.css` with light/dark theme support
- Primary brand colors: Blue (#35aff4), Orange (#fa7436), Purple (#b21589)
- Typography: Roboto (primary), Inter (fallback), JetBrains Mono (code)
- Import path: `@/components/ui/*`

## Environment Variables

Configured via `@t3-oss/env-nextjs` (src/libs/env.ts):
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- Validated at build time with Zod schemas

## Path Aliases

```typescript
"@/*" → "./src/*"
```

## Code Style

**ESLint**:
- Config: Extends `@antfu`, `next/core-web-vitals`, `jsx-a11y/recommended`
- Rules: Semicolons required, 1TBS brace style, prefer type over interface
- Run `npm run lint:fix` before committing

**Prettier**:
- Single quotes, 2-space tabs, 120 char line width
- Import order: React → Next → 3rd party → types → local (via `@ianvs/prettier-plugin-sort-imports`)
- Tailwind class sorting via `prettier-plugin-tailwindcss`

## TypeScript

- Strict mode enabled
- Path aliases via `baseUrl: "."` and `paths`
- Global types: `src/core/types/global.d.ts`
- Domain types: `src/types/*.ts`

## Testing

**Vitest + React Testing Library**:
- Config: `vitest.config.ts`
- Setup: `src/test/setup.ts`
- Test location: Co-located with source files (`*.test.ts`, `*.spec.tsx`)

## Important Patterns

### Navigation
```typescript
import { Link, useRouter, redirect } from '@/libs/i18n-navigation';
// NOT: import { useRouter } from 'next/navigation'
```

### API Calls
```typescript
// Use custom axios instance for auth header injection
import api from '@/core/api/api';
const response = await api.get('/endpoint');
```

### Translations
```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
```

### Data Tables
- Use `use-data-table` hook for server-side tables with URL state
- Config reference: `src/libs/data-table.ts` and `src/libs/data-table-config.ts`

### Route Constants
Import from `src/core/constants/route.ts` rather than hardcoding paths:
```typescript
import { RouteConstant } from '@/core/constants/route';
router.push(RouteConstant.admin_dashboard);
```

## Admin vs Marketing Context

- Admin layout: `src/app/[locale]/admin/layout.tsx` - includes sidebar navigation
- Marketing layout: `src/app/[locale]/(marketing)/layout.tsx` - includes header/footer
- Separate styling: `src/styles/admin.css` for admin-specific styles

## Common Gotchas

1. **Middleware permission checks**: When adding new admin routes, update `PermissionMap` in `src/core/constants/permission-map.ts`
2. **Image domains**: Add to `next.config.mjs` `remotePatterns` for external images
3. **Locale cookie**: Set `NEXT_LOCALE` cookie for API language header
4. **Auth state**: Available in both cookies (SSR) and Zustand store (client)
5. **Component imports**: Always use `@/` alias, never relative imports across feature boundaries
