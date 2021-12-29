import Link from 'next/dist/client/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import LinkButton from '../../components/UI/LinkButton';
import Loader from '../../components/UI/Loader';
import useSettings from '../../hooks/useSettings';
import { getOrder } from '../../services/OrdersService';
import { decodeB64Object, dsAuthWithState, formatter, STATUS } from '../../util';

export default function Order() {
  const router = useRouter();
  const [order, setOrder] = useState();
  const settings = useSettings();
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
    getOrder(router.query.id)
      .then((data) => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401)
          dsAuthWithState({ route: 'orders', id: router.query.id });
        else router.push('/');
      });
  }, [router.query.id, router.query.state]);

  return (
    <Layout>
      <Head>
        <title>Pedido {router.query.id}</title>
      </Head>
      <section className="my-auto p-10 bg-gray-700 sm:shadow-xl sm:rounded-xl sm:mx-auto sm:max-w-screen-sm sm:min-w-min">
        {isLoading || !settings ? (
          <Loader size="w-16 h-16" className="m-auto" />
        ) : (
          <>
            <h2 className="text-purple-500 text-2xl font-medium">Pedido {order?.id}</h2>
            <ul className="text-white text-lg mt-4 mb-2">
              <li>
                <span className="font-medium">Créditos:</span> {order.credits}
              </li>
              <li>
                <span className="font-medium">Precio:</span> {order.credits}
              </li>
              <li>
                <span className="font-medium">Tipo:</span> {order.mode === 0 ? 'Compra' : 'Venta'}
              </li>
              <li>
                <span className="font-medium">Pedido el:</span>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </li>
              <li>
                <span className="font-medium">Método de pago:</span>{' '}
                {settings?.paymentMethods[order.paymentMethodID]?.name}
              </li>
              <li>
                <span className="font-medium">Usuario de Demo Games:</span> {order.account}
              </li>
              <li>
                <span className="font-medium">
                  Cuenta de {settings.paymentMethods[order.paymentMethodID].name}:
                </span>
                {order.paymentAccount}
              </li>
            </ul>
            <span className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300 text-sm`}>
              {STATUS[order.status]}
            </span>
            <Link href="/orders" passHref>
              <LinkButton>Ver todos los pedidos</LinkButton>
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
}
