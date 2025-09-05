import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { getAllVideos, getDetail, getRecommendations } from '~/services/video.service';
import type { VideoCard } from '~/models/video';

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

export const useGetRecommandation = (slug: Ref<string>, pageSize: number) => {
  const query = useInfiniteQuery({
    queryKey: ['recommendations', slug],
    queryFn: ({pageParam = 0}) =>
      getRecommendations(unref(slug), pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.totalCount;
      const loadedItems = allPages.reduce((sum, page) => sum + page.recommendations.length, 0);

      return loadedItems < total ? allPages.length : undefined;
    },
    enabled: computed(() => !!unref(slug))
  });

  const recommendations = computed(() =>
    query.data.value?.pages.flatMap(page => page.recommendations) ?? []
  )

  return {
    recommendations : recommendations,
    isRecommendationsLoading: query.isPending,
    isRecommendationsError: query.isError,
    recommendationsError: query.error,
    recommendationsNextPage: query.fetchNextPage,
    isRecommendationNextPage: query.hasNextPage
  }
}