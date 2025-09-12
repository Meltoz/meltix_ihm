import type { Category } from '~/models/category';

const endpoint = 'category';

export const getAllCategories = async (
  search: string
): Promise<{ categories: Category[]; totalCount: number }> => {
  const params = new URLSearchParams();
  if (search && search !== '') {
    params.set('search', search);
  }

  const response = await useFetchCustomWithCount<Category[]>(
    `${endpoint}/getall?${params.toString()}`,
    HTTP_METHODS.GET
  );

  return {
    categories: response.data,
    totalCount: response.totalCount,
  };
};
