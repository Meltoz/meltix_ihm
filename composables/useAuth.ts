import type { UserAdmin } from '~/models/userAdmin';
import { loginUser, logoutUser, me, refreshAuth } from '~/services/auth.service';

export const useAuth = () => {
  const router = useRouter();
  const config = useRuntimeConfig();

  const user = useState<UserAdmin>('user', () => null);
  const isRefreshingToken = useState<boolean>('isRefreshing', () => false);
  const hasRefreshed = ref(false);

  const login = async (pseudo: string, password: string) => {
    try {
      hasRefreshed.value = false;
      loginUser(pseudo, password);
      await fetchUser();

      console.log(user.value);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await logoutUser();
    user.value = null;
    hasRefreshed.value = false;
  };

  const fetchUser = async () => {
    try {
      user.value = await me()
    } catch (err: any) {
      if (err?.status === 401 && !hasRefreshed.value) {
        hasRefreshed.value = true
        try {
          await refresh()
          return await fetchUser()
        } catch {
          user.value = null
        }
      } else {
        user.value = null
      }
    }
  };

  const refresh = async () => {
    try{
      await refreshAuth()
    }
    catch {
      user.value = null;
    }
  }

  return {
    user: readonly(user),
    login: login,
    isLoginIn: computed(() => !!user.value),
    isAdmin: computed(() => !!user.value && user.value.role === 'Admin'),
    logout: logout,
    fetchUser: fetchUser,
  };
};
