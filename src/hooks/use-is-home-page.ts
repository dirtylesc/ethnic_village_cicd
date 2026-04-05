import { usePathname } from 'next/navigation';

export const useIsHomePage = (): boolean => {
  const pathname = usePathname();
  return /^\/(([a-z]{2,3}))?$/.test(pathname);
};
