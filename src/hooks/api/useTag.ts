import { tagApi } from '@/data/apis/tag.api';
import { useQuery } from '@tanstack/react-query';

export const useTagList = () => {
  return useQuery({
    queryKey: ['tag-list'],
    queryFn: () => tagApi.getTagAll(),
  });
};
