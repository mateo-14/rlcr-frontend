import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';
import { login } from '../features/user/userSlice';
import { decodeB64Object } from '../util';

export default function DsRedirect() {
  const { isLoading, isLogged } = useSelector(({ user }) => ({ isLoading: user.isLoaing, isLogged: user.isLogged }));
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoginError, setIsLoginError] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) return;
    if (!router.query.code && !router.query.error) return router.replace('/');

    if (!isLogged && router.query.code && !isLoginError) {
      dispatch(login(router.query.code))
        .unwrap()
        .then(() => {
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
          router.replace('/');
        })
        .catch(() => setIsLoginError(true));
    }
  }, [router.isReady, isLoading, dispatch]);

  return (
    <Layout>
      <section className="bg-gray-700 rounded-xl shadow-xl flex items-center flex-col m-auto px-4 py-6 max-w-sm">
        {!router.query.error && !isLoginError ? (
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
