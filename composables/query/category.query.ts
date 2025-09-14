import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '~/services/category.service';
import type { Category } from '~/models/category';

export const useAllCategories = (search: Ref<string>) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['categories', search],
    queryFn: () => getAllCategories(unref(search)),
  });

  return {
    allCategories: data,
    isAllCategoriesLoading: isPending,
    isAllCategoriesError: isError,
    allCategoriesError: error,
  };
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const {mutateAsync, isError, error, isPending} = useMutation({
    mutationFn: (category:Category) => addCategory(category),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['categories']})
    }
  });

  return {
    addCategoryAsync: mutateAsync,
    isAddCategoryError: isError,
    addCategoryError: error,
    isAddCategoryLoading: isPending,
  }
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const {mutateAsync, isError, error, isPending} = useMutation({
    mutationFn: (category:Category) => updateCategory(category),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['categories']})
    }
  });

  return {
    updateCategoryAsync: mutateAsync,
    isUpdateCategoryError: isError,
    updateCategoryError: error,
    isUpdateCategoryLoading: isPending,
  }
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const {mutateAsync, isError, error, isPending} = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ['categories']})
    }
  });

  return {
    deleteCategoryAsync: mutateAsync,
    isDeleteCategoryError: isError,
    isDeleteCategoryLoading: isPending,
    deleteCategoryError: error,
  }
}