import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/UI/Loader';
import { SettingsContext } from '../../contexts/SettingsContext';
import { decodeB64Object, encodeB64Object, formatter, STATUS } from '../../util';
import Link from 'next/dist/client/link';
import axios from 'axios';
import LinkButton from '../../components/UI/LinkButton';

export default function Order() {
  const router = useRouter();
  const [order, setOrder] = useState();
  const settings = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.id) return router.replace('/');

    if (router.query.state) {
      const decodedOrder = decodeB64Object(router.query.state);
      if (decodedOrder) {
        setOrder(decodedOrder);
        setIsLoading(false);
        return;
      }
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${router.query.id}`, { withCredentials: true })
      .then(({ data }) => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            const dataB64 = encodeB64Object({ route: 'orders', id: router.query.id });
            window.location.assign(`${process.env.NEXT_PUBLIC_DS_OAUTH}&state=${dataB64}`);
            return;
          }
        }
        router.push('/');
      });
  }, [router.query.id, router.query.state]);

  return (
    <Layout>
      <Head>
        <title>Pedido {router.query.id}</title>
      </Head>
      <section className="my-auto p-10 bg-gray-700 sm:shadow-xl sm:rounded-xl sm:mx-auto sm:max-w-screen-sm">
        {isLoading || !settings ? (
          <Loader size="w-16 h-16" className="m-auto" />
        ) : (
          <>
            <h2 className="text-purple-500 text-2xl font-medium">Pedido {order?.id}</h2>
            <p className="text-white text-lg mt-6 break-words	">
              <span className="font-medium">Créditos:</span> {order.credits}
              <br />
              <span className="font-medium">Precio:</span> {formatter.format(order.price)}
              <br />
              <span className="font-medium">Tipo:</span> {order.mode === 0 ? 'Compra' : 'Venta'}
              <br />
              <span className="font-medium">Creado el:</span> {new Date(order.createdAt).toLocaleString()}
              <br />
              <span className="font-medium">Método de pago:</span>{' '}
              {settings?.paymentMethods[order.paymentMethodID]?.name}
              <br />
              <span className="font-medium">Cuenta de Steam/EpicGames:</span> {order.account}
              {order.dni && (
                <>
                  <br />
                  <span className="font-medium">DNI:</span> {order.dni}
                </>
              )}
              {order.paymentAccount && (
                <>
                  <br />
                  <span className="font-medium">
                    Cuenta de {settings.paymentMethods[order.paymentMethodID].name}:
                  </span>{' '}
                  {order.paymentAccount}
                </>
              )}
              {order.cvu && (
                <>
                  <br />
                  <span className="font-medium">CVU/CBU:</span> {order.cvu}
                </>
              )}
              <br />
              <span className="font-medium">Estado: </span>
              <span className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300 text-sm`}>
                {STATUS[order.status]}
              </span>
              <br />
            </p>
            <Link href="/orders" passHref>
              <LinkButton>Ver todos los pedidos</LinkButton>
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
}
