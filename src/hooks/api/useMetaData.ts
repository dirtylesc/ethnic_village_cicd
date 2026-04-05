import { ethnicApi } from '@/data/apis/ethnic.api';
import { locationApi } from '@/data/apis/location.api';
import { useMetaStore } from '@/stores/useMetaStore';
import { useQuery } from '@tanstack/react-query';

export const useFetchEthnics = () => {
  const setEthnics = useMetaStore(state => state.setEthnics);

  return useQuery({
    queryKey: ['ethnics'],
    queryFn: async () => {
      const res = await ethnicApi.getEthnicAll();
      const data = res.data || [];
      setEthnics(data);
      return data;
    },
    staleTime: Infinity,
  });
};

export const useFetchLocations = () => {
  const setLocations = useMetaStore(state => state.setLocations);

  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await locationApi.getLocationAll();
      const data = res.data || [];
      setLocations(data);
      return data;
    },
    staleTime: Infinity,
  });
};
