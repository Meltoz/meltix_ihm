import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { deleteTag, editTag, getAllTag } from '~/services/tag.service';
import type { Tag } from '~/models/tag';

//Keys
export const TAGS_QUERY_KEYS = {
  tags: ['tags'] as const,
  allTags: (pageIndex?: number, search?: string) =>
    [...TAGS_QUERY_KEYS.tags, 'all', pageIndex, search] as const,
} as const;

const DEFAULT_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 1,
} as const;

export const useAllTags = (
  pageIndex: MaybeRef<number>,
  pageSize: number,
  search: MaybeRef<string>
) => {
  const pageIndexRef = toRef(pageIndex);
  const searchRef = toRef(search);

  const query = useQuery({
    queryKey: computed(() => TAGS_QUERY_KEYS.allTags(pageIndexRef.value, searchRef.value)),
    queryFn: () => getAllTag(pageIndexRef.value, pageSize, searchRef.value),
    placeholderData: (prev) => prev,
    ...DEFAULT_CONFIG,
  });

  return {
    allTags: query.data,
    isAllTagsLoading: query.isPending,
    isAllTagsSuccess: query.isSuccess,
    isAllTagsError: query.error,
    allTagsError: query.error,
    allTagsRefetch: query.refetch,
  };
};

export const useEditTag = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (tag: Tag) => editTag(tag),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: TAGS_QUERY_KEYS.tags,
        }),
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    editTag: query.mutateAsync,
    isEditTagLoading: query.isPending,
    isEditTagSuccess: query.isSuccess,
    isEditTagError: query.error,
    editTagError: query.error,
  };
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: TAGS_QUERY_KEYS.tags,
        }),
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    deleteTagAsync: query.mutateAsync,
    isDeleteTagLoading: query.isPending,
    isDeleteTagSuccess: query.isSuccess,
    isDeleteTagsError: query.isError,
    deleteTagsError: query.error,
  };
};
