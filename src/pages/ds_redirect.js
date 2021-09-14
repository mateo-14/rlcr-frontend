import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';
import useUser from '../hooks/useUser';
import { decodeB64Object } from '../util';

export default function DsRedirect() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!router.isReady || !user.isReady) return;
    if (!router.query.code && !router.query.error) return router.replace('/');

    if (!user.data && router.query.code) {
      const login = async () => {
        try {
          await user.login(router.query.code);
          if (router.query.state) {
            const decodedState = decodeB64Object(router.query.state);
            console.log(decodedState);
            if (decodedState.route === 'checkout') {
              router.replace(`/checkout?c=${router.query.state}`);
            } else if (decodedState.route === 'orders') {
              router.replace(`/orders/${decodedState.id}`);
            }
            return;
          }
        } catch {}
        router.replace('/');
      };
      login();
    }
  }, [router.isReady, user.isReady]);

  return (
    <Layout>
      <section className="bg-gray-700 rounded-xl shadow-xl flex items-center flex-col m-auto px-4 py-6 max-w-sm">
        {!router.query.error ? (
          <>
            <h2 className="text-white text-3xl">Iniciando sesión...</h2>
            <Loader size="w-12 h-12" className="mt-4" />
          </>
        ) : (
          <>
            <h2 className="text-white text-3xl">No se ha podido autorizar nuestra aplicación de Discord :(</h2>
            <Button
              onClick={() =>
                window.location.assign(
                  `${process.env.NEXT_PUBLIC_DS_OAUTH}${router.query.state ? `&state=${router.query.state}` : ''}`
                )
              }
              className="w-full mt-4"
            >
              Reintentar
            </Button>
          </>
        )}
      </section>
    </Layout>
  );
}
