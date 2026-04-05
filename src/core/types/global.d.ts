import { routing } from '@/libs/i18n-navigation';

import messages from '../../messages/en.json';

declare module 'next-intl' {
  type AppConfig = {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
