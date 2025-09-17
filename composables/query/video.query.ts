import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, unref, type Ref } from 'vue';
import {
  getAllVideos,
  getDetail,
  getLatest,
  getRecommendations,
  getUncategorisedVideos,
  updateVideo,
} from '~/services/video.service';
import type { Video, VideoCard } from '~/models/video';

// Keys
export const VIDEO_QUERY_KEYS = {
  all: ['videos'] as const,
  allVideos: (pageIndex?: number, search?: string) => [...VIDEO_QUERY_KEYS.all, 'all', pageIndex, search] as const,
  latestVideos: (pageIndex?: number, pageSize?: number) => [...VIDEO_QUERY_KEYS.all, 'latest', pageIndex, pageSize] as const,
  uncategorised: (pageIndex?: number, pageSize?: number, search?: string) => [...VIDEO_QUERY_KEYS.all, 'uncategorised', pageIndex, pageSize, search] as const,
  detail: (slug: string) => [...VIDEO_QUERY_KEYS.all, 'detail', slug] as const,
  recommendations: (slug: string) => [...VIDEO_QUERY_KEYS.all, 'recommendations', slug] as const,
} as const;

// Configuration par défaut
const DEFAULT_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
} as const;

export const useAllVideos = (pageIndex: Ref<number>, pageSize: number, search: Ref<string>) => {
  const query = useQuery({
    queryKey: computed(() => VIDEO_QUERY_KEYS.allVideos(unref(pageIndex), unref(search))),
    queryFn: () => getAllVideos(unref(pageIndex), pageSize, unref(search)),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG,
  });

  return {
    allVideos: query.data,
    isAllVideosLoading: query.isPending,
    isAllVideosError: query.isError,
    isAllVideosSuccess: query.isSuccess,
    allVideoError: query.error,
    allVideoRefetch: query.refetch, // Correction de la typo "refrech"
  };
};

export const useDetailVideo = (slug: Ref<string>) => {
  const query = useQuery({
    queryKey: computed(() => VIDEO_QUERY_KEYS.detail(unref(slug))),
    queryFn: () => getDetail(unref(slug)),
    enabled: computed(() => !!unref(slug)),
    ...DEFAULT_CONFIG,
  });

  return {
    video: query.data,
    isVideoLoading: query.isPending,
    isVideoError: query.isError,
    videoError: query.error,
    isVideoSuccess: query.isSuccess,
  };
};

interface RecommendationsResponse {
  recommendations: VideoCard[];
  totalCount: number;
  hasMore?: boolean;
}

export const useGetRecommendation = (slug: Ref<string>, pageSize: number) => {
  const query = useInfiniteQuery<RecommendationsResponse, Error, InfiniteData<RecommendationsResponse>, readonly unknown[], number>({
    queryKey: computed(() => VIDEO_QUERY_KEYS.recommendations(unref(slug))),
    queryFn: ({ pageParam = 0 }) => getRecommendations(unref(slug), pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.totalCount;
      const loadedItems = allPages.reduce((sum, page) => sum + page.recommendations.length, 0);
      return loadedItems < total ? allPages.length : undefined;
    },
    enabled: computed(() => !!unref(slug)),
    initialPageParam: 0,
    ...DEFAULT_CONFIG,
  });

  const recommendations = computed(
    () => query.data.value?.pages.flatMap((page) => page.recommendations) ?? []
  );

  return {
    recommendations,
    isRecommendationsLoading: query.isPending,
    isRecommendationsError: query.isError,
    recommendationsError: query.error,
    fetchNextRecommendations: query.fetchNextPage,
    hasNextRecommendations: query.hasNextPage,
    isFetchingNextRecommendations: query.isFetchingNextPage,
  };
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (video: Video) => updateVideo(video),
    onSuccess: async (updatedVideo, video) => {
      // Invalidation
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: VIDEO_QUERY_KEYS.allVideos()
        }),
        queryClient.invalidateQueries({
          queryKey: VIDEO_QUERY_KEYS.latestVideos()
        }),
        queryClient.invalidateQueries({
          queryKey: VIDEO_QUERY_KEYS.uncategorised()
        }),
        queryClient.invalidateQueries({
          queryKey: VIDEO_QUERY_KEYS.detail(video.slug)
        }),
      ]);
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la vidéo:', error);
    },
  });

  return {
    updateVideo: mutation.mutate,
    updateVideoAsync: mutation.mutateAsync,
    isUpdateVideoLoading: mutation.isPending,
    isUpdateVideoError: mutation.isError,
    updateVideoError: mutation.error,
    resetUpdateVideo: mutation.reset,
  };
};

export const useUncategorisedVideos = (
  pageIndex: Ref<number>,
  pageSize: number,
  search: Ref<string>
) => {
  const query = useQuery({
    queryKey: computed(() => VIDEO_QUERY_KEYS.uncategorised(unref(pageIndex), pageSize, unref(search))),
    queryFn: () => getUncategorisedVideos(unref(pageIndex), pageSize, unref(search)),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG,
  });

  return {
    uncategorisedVideos: query.data,
    isUncategorisedVideoLoading: query.isPending,
    isUncategorisedVideoError: query.isError,
    uncategorisedVideoError: query.error, // Correction du nom
  };
};

export const useLatestVideo = (pageIndex: Ref<number>, pageSize: number) => {
  const query = useQuery({
    queryKey: computed(() => VIDEO_QUERY_KEYS.latestVideos(unref(pageIndex), pageSize)),
    queryFn: () => getLatest(unref(pageIndex), pageSize),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG,
  });

  return {
    latestVideos: query.data,
    isLatestVideoLoading: query.isPending,
    isLatestVideoError: query.isError,
    latestVideosError: query.error,
    isLatestVideoSuccess: query.isSuccess,
  };
};
