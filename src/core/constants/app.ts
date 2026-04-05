import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConstant = {
  name: 'Ethnic Village Travel',
  locales: {
    en: 'English',
    vi: 'Tiếng Việt',
  },
  defaultLocale: 'vi',
  localePrefix,
};
