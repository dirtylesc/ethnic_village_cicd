import { useAuthStore } from '@/stores/useAuthStore';
import { deleteCookie } from '@/utils/cookie';
import { useUserStore } from '@/stores/useUserStore';

export const logout = () => {
  const { setAuth } = useAuthStore.getState();
  const { clearUserData } = useUserStore.getState();
  if (typeof window !== 'undefined') {
    deleteCookie('accessToken');
    deleteCookie('userRoles');
    deleteCookie('userPermissions');
    deleteCookie('userId');
  }

  setAuth({ accessToken: '', refreshToken: '', user: null });
  clearUserData();
};
