import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useUser from '../hooks/useUser';

export default function Logout() {
  const { logout, isReady, data } = useUser();
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
