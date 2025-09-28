import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createUser, deleteUser, editUserAdmin, getAllUsers } from '~/services/user.service';
import type { UserEdit } from '~/models/userEdit';

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

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (user: UserEdit) => createUser(user),
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: USER_QUERY_KEYS.allBase(),
        }),
      ]);
    },
    onError: (error) => {
      console.error('Error when creating user : ', error);
    },
  });

  return {
    addUserAsync: query.mutateAsync,
    isAddUserLoading: query.isPending,
    isAddUserSuccess: query.isSuccess,
    isAddUserError: query.isError,
    addUserError: query.error,
  };
};

export const useEditUserAdmin = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (user: UserEdit) => editUserAdmin(user),
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: USER_QUERY_KEYS.allBase(),
        })
      ])
    },
    onError: (error) => {
      console.error('Error when editing user : ', error);
    }
  });

  return {
    editUserAsync: query.mutateAsync,
    isEditUserLoading: query.isPending,
    isEditUserSuccess: query.isSuccess,
    isEditUserError: query.isError,
    editUserError: query.error,
  }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: USER_QUERY_KEYS.allBase(),
        }),
      ]);
    },
    onError: (error) => {
      console.error('Error when deleting user : ', error);
    },
  });

  return {
    deleteUserAsync: query.mutateAsync,
    isDeleteUserLoading: query.isPending,
    isDeleteUserSuccess: query.isSuccess,
    isDeleteUserError: query.isError,
    deleteUserError: query.error,
  };
};
