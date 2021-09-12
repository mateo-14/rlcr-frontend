import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Logout() {
  const { logout, isReady, data } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !isReady) return;

    const asyncLogout = async () => {
      try {
        await logout();
      } catch {}
      router.push('/');
    };

    if (data) {
      asyncLogout();
    } else {
      router.push('/');
    }
  }, [router.isReady, isReady]);

  return <div></div>;
}
