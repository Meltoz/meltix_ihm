import type { Tag } from '~/models/tag';

const endpoint = 'tag';

export const searchTags = async (search: string): Promise<string[]> => {
  const params = new URLSearchParams({
    searchTerm: search,
  });

  return await useFetchCustom<string[]>(`${endpoint}/search?${params}`, {
    method: HTTP_METHODS.GET,
  });
};

export const getAllTag = async (
  pageIndex: number,
  pageSize: number,
  search: string
): Promise<{ tags: Tag[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageIndex: pageIndex.toString(),
    searchTerm: search,
  });
  const response = await useFetchCustomWithCount<Tag[]>(`${endpoint}/search?${params.toString()}`, {
    method: HTTP_METHODS.GET,
  });

  return {
    tags: response.data,
    totalCount: response.totalCount,
  };
};

export const editTag = async (
  tag: Tag,
): Promise<Tag> => {

  return await useFetchCustom<Tag>(`${endpoint}/edit`, {
    method: HTTP_METHODS.PATCH,
    body: JSON.stringify(tag)
  });
}

export const deleteTag = async (
  id:string
) : Promise<void> => {
  const params= new URLSearchParams({
    id: id
  })

  return await useFetchCustom(`${endpoint}/delete?${params}`, {
    method: HTTP_METHODS.DELETE,
  });
}
