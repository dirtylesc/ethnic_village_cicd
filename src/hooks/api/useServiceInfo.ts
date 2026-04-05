import { getAllServiceInfo } from '@/data/apis/service-info.api';
import { useQuery } from '@tanstack/react-query';

import { ServiceInfoBasic } from '@/types/service-info.type';

export const useServiceInfoList = () => {
  return useQuery<ServiceInfoBasic[]>({
    queryKey: ['service-info-list'],
    queryFn: async () => {
      const res = await getAllServiceInfo();
      return res.data ?? [];
    },
  });
};
