import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '~/services/category.service';
import type { Category } from '~/models/category';

export const CATEGORY_QUERY_KEYS = {
  category: ['category'] as const,
  all: (pageIndex?: number, search?: string) => [...CATEGORY_QUERY_KEYS.category, 'all', pageIndex, search] as const,
} as const;

export const useAllCategories = (pageIndex: MaybeRef<number>, pageSize: number, search: MaybeRef<string>) => {
  const searchRef = toRef(search);
  const pageIndexRef = toRef(pageIndex);

  const query = useQuery({
    queryKey: computed(() => CATEGORY_QUERY_KEYS.all(pageIndexRef.value, searchRef.value)),
    queryFn: () => getAllCategories(pageIndexRef.value, pageSize, searchRef.value),
    placeholderData: (prev) => prev,
  });

  return {
    allCategories: query.data,
    isAllCategoriesLoading: query.isPending,
    isAllCategoriesError: query.isError,
    allCategoriesError: query.error,
    isAllCategoriesSuccess: query.isSuccess,
  };
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (category: Category) => addCategory(category),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CATEGORY_QUERY_KEYS.all(),
        }),
      ]);
    },
    onError: (error) => {
      console.log('Error when adding category: ', error);
    },
  });

  return {
    addCategoryAsync: query.mutateAsync,
    isAddCategoryError: query.isError,
    addCategoryError: query.error,
    isAddCategoryLoading: query.isPending,
    isAddCategorySuccess: query.isSuccess,
  };
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (category: Category) => updateCategory(category),
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all() })]);
    },
    onError: (error) => {
      console.log('Error when updating category: ', error);
    },
  });

  return {
    updateCategoryAsync: query.mutateAsync,
    isUpdateCategoryError: query.isError,
    isUpdateCategorySuccess: query.isSuccess,
    isUpdateCategoryLoading: query.isPending,
    updateCategoryError: query.error,
  };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CATEGORY_QUERY_KEYS.all(),
        }),
      ]);
    },
    onError: (error) => {
      console.log('Error when deleting category: ', error);
    },
  });

  return {
    deleteCategoryAsync: query.mutateAsync,
    isDeleteCategorySuccess: query.isSuccess,
    isDeleteCategoryLoading: query.isPending,
    isDeleteCategoryError: query.isError,
    deleteCategoryError: query.error,
  };
};
