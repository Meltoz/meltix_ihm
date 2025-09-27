import { useQuery } from '@tanstack/vue-query';
import { getAllUsers } from '~/services/user.service';

export const USER_QUERY_KEYS = {
  users: ['users'] as const,
  allBase: () => [...USER_QUERY_KEYS.users, 'all'],
  all: (pageIndex: number, onlyAdmin: boolean, sort: string, search: string) =>
    [...USER_QUERY_KEYS.allBase(), pageIndex, onlyAdmin, search] as const,
} as const;

export const useAllUsers = (
  pageIndex: MaybeRef<number>,
  pageSize: number,
  onlyAdmin: MaybeRef<boolean>,
  sort: MaybeRef<string>,
  search: MaybeRef<string>
) => {
  const pageIndexRef = toRef(pageIndex);
  const onlyAdminRef = toRef(onlyAdmin);
  const sortRef = toRef(sort);
  const searchRef = toRef(search);

  const query = useQuery({
    queryKey: computed(() =>
      USER_QUERY_KEYS.all(pageIndexRef.value, onlyAdminRef.value, sortRef.value, searchRef.value)
    ),
    queryFn: () =>
      getAllUsers(pageIndexRef.value, pageSize, sortRef.value, onlyAdminRef.value, searchRef.value),
    placeholderData: (prev) => prev,
  });

  return {
    allUsers: query.data,
    isAllUsersLoading: query.isPending,
    isAllUsersError: query.isError,
    isAllUsersSuccess: query.isSuccess,
    refetchAllUser: query.refetch,
    allUserError: query.error,
  };
};
