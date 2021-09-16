import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/user/userSlice';

export default function Logout() {
  const { isLoading, isLogged } = useSelector(({ user }) => ({ isLoading: user.isLoaing, isLogged: user.isLogged }));
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || isLoading) return;

    if (isLogged) {
      const asyncLogout = async () => {
        try {
          await dispatch(logout());
        } catch {}
        router.push('/');
      };
      asyncLogout();
    } else {
      router.push('/');
    }
  }, [router.isReady, isLoading, dispatch]);

  return <div></div>;
}
