import { useQuery } from '@tanstack/vue-query';
import { getAllTag } from '~/services/tag.service';

export const TAGS_QUERY_KEYS = {
  tags: ['tags'] as const,
  allTags: (pageIndex: number, search: string) =>
    [...TAGS_QUERY_KEYS.tags, 'all', pageIndex, search] as const,
} as const;

const DEFAULT_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 1
} as const;

export const useAllTags = (pageIndex: MaybeRef<number>, pageSize: number, search: MaybeRef<string>) => {
  const pageIndexRef = toRef(pageIndex);
  const searchRef = toRef(search);

  const query = useQuery({
    queryKey: computed(() => TAGS_QUERY_KEYS.allTags(pageIndexRef.value, searchRef.value)),
    queryFn: () =>  getAllTag(pageIndexRef.value, pageSize, searchRef.value),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG
  });

  return {
    allTags: query.data,
    isAllTagsLoading: query.isPending,
    isAllTagsSuccess: query.isSuccess,
    isAllTagsError: query.error,
    allTagsError: query.error,
    allTagsRefetch: query.refetch,
  }

}