import { useQuery } from '@tanstack/vue-query';
import { getAllVideos, getDetail } from '~/services/video.service';

export const useAllVideos = (pageIndex: Ref<number>, pageSize: number, search: Ref<string>) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['allVideos', pageIndex, search],
    queryFn: () => getAllVideos(unref(pageIndex), pageSize, unref(search)),
    placeholderData: (prev) => prev,
  });

  return {
    allVideos: data,
    isAllVideosLoading: isPending,
    isAllVideosError: isError,
    allVideoError: error,
    allVideoRefrech: refetch,
  };
};

export const useDetailVideo = (slug: Ref<string>) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['video', slug],
    queryFn: () => getDetail(unref(slug)),
  });

  return {
    video: data,
    isVideoLoading: isPending,
    isVideoError: isError,
    videoError: error,
  };
};
