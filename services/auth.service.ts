import type { UserAdmin } from '~/models/userAdmin';

export const loginUser = async (pseudo: string, password: string): Promise<void> => {
  const loginOption = { pseudo, password };

  await useFetchCustom(`login`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(loginOption),
    credentials: 'include',
  });
};

export const me = async (): Promise<UserAdmin> => {
  return await useFetchCustom<UserAdmin>('me', {
    method: HTTP_METHODS.GET,
  });
};
export const refreshAuth = async (): Promise<void> => {
  await useFetchCustom<string>(`refresh`, {
    method: HTTP_METHODS.POST,
    credentials: 'include',
  });
};

export const logoutUser = async (): Promise<void> => {
  return await useFetchCustom('logout', {
    method: HTTP_METHODS.DELETE,
  });
};
