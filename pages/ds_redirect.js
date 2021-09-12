import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import { UserContext } from '../contexts/UserContext';
import Loader from '../components/UI/Loader';
import Button from '../components/UI/Button';
import { decodeB64Object } from '../util';

const DsRedirect = () => {
  const router = useRouter();
  const user = useContext(UserContext);

  useEffect(() => {
    if (router.isReady && user.isReady) {
      if (router.query.code && !user.data) {
        return user
          .login(router.query.code)
          .then(() => {
            if (router.query.state) {
              const decodedState = decodeB64Object(router.query.state);
              if (decodedState.route === 'checkout') {
                router.replace(`/checkout?c=${router.query.state}`);
              } else if (decodedState.route === 'orders') {
                router.replace(`/orders/${decodedState.id}`);
              }
            } else {
              router.replace('/');
            }
          })
          .catch(() => router.replace('/'));
      } else {
        router.replace('/');
      }
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
              className="w-full"
            >
              Reintentar
            </Button>
          </>
        )}
      </section>
    </Layout>
  );
};

export default DsRedirect;
