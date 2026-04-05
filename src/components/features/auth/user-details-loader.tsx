'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

import { useApiUserDetailsGet } from '@/hooks/api/useUser';

export function UserDetailsLoader() {
  const { isAuthenticated } = useAuthStore();
  const { refetch } = useApiUserDetailsGet();

  useEffect(() => {

    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  return null;
}
