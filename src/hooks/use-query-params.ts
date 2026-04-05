import { useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  return Object.fromEntries(searchParams.entries());
};
