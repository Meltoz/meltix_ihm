import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { computed, unref, type Ref } from 'vue';
import {
  getAllVideos,
  getDetail,
  getLatest,
  getRecommendations,
  getUncategorisedVideos,
  requestScanVideo,
  updateVideo,
} from '~/services/video.service';
import type { Video, VideoCard } from '~/models/video';

// Keys
export const VIDEO_QUERY_KEYS = {
  videos: ['videos'] as const,
  allVideos: (pageIndex?: number, sort?: string, search?: string) =>
    [...VIDEO_QUERY_KEYS.videos, 'all', pageIndex, sort, search] as const,
  uncategorised: (pageIndex?: number, pageSize?: number, sort?: string, search?: string) =>
    [...VIDEO_QUERY_KEYS.videos, 'uncategorised', pageIndex, pageSize, sort, search] as const,
  detail: (slug: string) => [...VIDEO_QUERY_KEYS.videos, 'detail', slug] as const,
  recommendations: (slug: string) => [...VIDEO_QUERY_KEYS.videos, 'recommendations', slug] as const,
} as const;

// Configuration par défaut
const DEFAULT_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
} as const;

export const useAllVideos = (
  pageIndex: MaybeRef<number>,
  pageSize: number,
  sort: MaybeRef<string>,
  search: MaybeRef<string>
) => {
  const pageIndexRef = toRef(pageIndex);
  const sortRef = toRef(sort);
  const searchRef = toRef(search);
  const query = useQuery({
    queryKey: computed(() =>
      VIDEO_QUERY_KEYS.allVideos(pageIndexRef.value, sortRef.value, searchRef.value)
    ),
    queryFn: () => getAllVideos(pageIndexRef.value, pageSize, sortRef.value, searchRef.value),
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
  const query = useInfiniteQuery<
    RecommendationsResponse,
    Error,
    InfiniteData<RecommendationsResponse>,
    readonly unknown[],
    number
  >({
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
    mutationFn: (video: VideoEdit) => updateVideo(video),
    onSuccess: async (updatedVideo, video) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: VIDEO_QUERY_KEYS.videos,
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
  pageIndex: MaybeRef<number>,
  pageSize: number,
  sort: MaybeRef<string>,
  search: MaybeRef<string>
) => {
  const pageIndexRef = toRef(pageIndex);
  const sortRef = toRef(sort);
  const searchRef = toRef(search);

  const query = useQuery({
    queryKey: computed(() =>
      VIDEO_QUERY_KEYS.uncategorised(pageIndexRef.value, pageSize, sortRef.value, searchRef.value)
    ),
    queryFn: () =>
      getUncategorisedVideos(pageIndexRef.value, pageSize, sortRef.value, searchRef.value),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG,
  });

  return {
    uncategorisedVideos: query.data,
    isUncategorisedVideoLoading: query.isPending,
    isUncategorisedVideosSuccess: query.isSuccess,
    isUncategorisedVideoError: query.isError,
    uncategorisedVideoError: query.error,
    uncategorisedVideoRefetch: query.refetch,
  };
};

export const useRequestScan = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: () => requestScanVideo(),
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: VIDEO_QUERY_KEYS.videos })]);
    },
    onError: async (error) => {
      console.log(error);
    },
  });

  return {
    requestScanAsync: query.mutateAsync,
    requestScanError: query.error,
    isRequestScanLoading: query.isPending,
    isRequestScanError: query.isError,
    isRequestScanSuccess: query.isSuccess,
  };
};
