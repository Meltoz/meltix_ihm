import type { UserAdmin } from '~/models/userAdmin';
import type { UserEdit } from '~/models/userEdit';

const endpoint: string = 'user';

export const getAllUsers = async (
  pageIndex: number,
  pageSize: number,
  sort: string,
  onlyAdmin: boolean,
  pseudo?: string
): Promise<{ users: UserAdmin[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
    sort: sort,
    onlyAdmin: onlyAdmin.toString(),
  });

  if (pseudo) {
    params.append('pseudo', pseudo);
  }

  const response = await useFetchCustomWithCount<UserAdmin[]>(
    `${endpoint}/search?${params.toString()}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

  return {
    users: response.data,
    totalCount: response.totalCount,
  };
};

export const createUser = async (user: UserEdit): Promise<UserAdmin> => {
  return await useFetchCustom(`${endpoint}/create`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  const params = new URLSearchParams({
    id: id,
  });

  return await useFetchCustom(`${endpoint}/delete?${params.toString()}`, {
    method: HTTP_METHODS.DELETE,
  });
};
