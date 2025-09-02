import { useQuery } from '@tanstack/vue-query';
import { getAllVideos } from '~/services/video.service';

export const useAllVideos = (
  pageIndex: Ref<number>,
  pageSize: number,
  search: Ref<string>
) => {
  const {data, isPending, isError, error} = useQuery({
    queryKey: ['allVideos', pageIndex, search],
    queryFn: () => getAllVideos(unref(pageIndex), pageSize, unref(search)),
    placeholderData:(prev) => prev
  });

  return {
    allVideos: data,
    isAllVideosLoading: isPending,
    isAllVideosError: isError,
    allVideoError: error
  }
}