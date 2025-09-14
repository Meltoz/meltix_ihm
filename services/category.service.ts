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

export const addCategory = async (category: Category): Promise<Category> => {
  return await useFetchCustom<Category>(`${endpoint}/storecategory`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(category),
  });
};

export const updateCategory = async (category: Category): Promise<Category> => {
  return await useFetchCustom<Category>(`${endpoint}/updateCategory`, {
    method: HTTP_METHODS.PATCH,
    body: JSON.stringify(category),
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const params = new URLSearchParams({
    id,
  });
  return await useFetchCustom<void>(`${endpoint}/deleteCategory?${params.toString()}`, {
    method: HTTP_METHODS.DELETE,
  });
};
