import { useQuery } from '@tanstack/vue-query';
import { getAllCategories } from '~/services/category.service';

export const useAllCategories = (search: Ref<string>) => {
  const {data, isPending, isError, error} = useQuery({
    queryKey: ['categories', search],
    queryFn: () => getAllCategories(unref(search))
  });

  return {
    allCategories: data,
    isAllCategoriesLoading: isPending,
    isAllCategoriesError: isError,
    allCategoriesError: error
  }
}