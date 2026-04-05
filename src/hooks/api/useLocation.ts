import { locationApi } from '@/data/apis/location.api';
import { useQuery } from '@tanstack/react-query';

export const useLocationList = () => {
  return useQuery({
    queryKey: ['location-list'],
    queryFn: () => locationApi.getLocationAll(),
  });
};
