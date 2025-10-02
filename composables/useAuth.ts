import type { UserAdmin } from '~/models/userAdmin';
import { loginUser, logoutUser, me } from '~/services/auth.service';

export const useAuth = () => {
  const router = useRouter();
  const config = useRuntimeConfig();

  const user = useState<UserAdmin>('user', () => null);
  const isRefreshingToken = useState<boolean>('isRefreshing', () => false);

  const login = async (pseudo: string, password: string) => {
    try {
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
  };

  const fetchUser = async () => {
    try {
      user.value = await me(); // appelle /me -> si cookie valide => user
    } catch {
      user.value = null;
    }
  };

  return {
    user: readonly(user),
    login: login,
    isLoginIn: computed(() => !!user.value),
    isAdmin: computed(() => !!user.value && user.value.role === 'Admin'),
    logout: logout,
    fetchUser: fetchUser,
  };
};
