import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import TableRowLoading from '../../components/TableRowLoading';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import useSettings from '../../hooks/useSettings';
import { encodeB64Object, formatter, STATUS } from '../../util';
import { getAllOrders } from '../../services/OrdersService';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const settings = useSettings();

  const fetchOrders = async (startAfter) => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getAllOrders(startAfter);
      if (fetchedOrders && fetchedOrders.length > 0) setOrders([...orders, ...fetchedOrders]);
      if (fetchedOrders.length < 10) setIsLast(true);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClick = () => {
    if (!isLoading && !isLast) {
      const lastOrderId = orders[orders.length - 1]?.id;
      fetchOrders(lastOrderId);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Pedidos</title>
      </Head>
      <div className="bg-gray-700 sm:rounded-xl sm:shadow-xl flex-grow flex flex-col p-4">
        <div className="flex align-center items-center">
          <h2 className="text-3xl text-purple-500 font-medium text-center md:text-left">Pedidos</h2>
          {isLoading && <Loader size="w-8 h-8" className="ml-auto" />}
        </div>
        <div className="overflow-auto rounded-xl bg-gray-800 my-6 flex-[1_1_1px]">
          {settings &&
            orders.map((order) => (
              <Link href={`/orders/${order.id}?state=${encodeB64Object(order)}`} key={order.id}>
                <div className="cursor-pointer hover:bg-gray-100/5 px-5 py-3 flex text-white">
                  <div className="flex flex-wrap gap-x-8">
                    <ul>
                      <li className="text-purple-500 text-xl">
                        {order.mode === 0 ? 'Compra' : 'Venta'} de {order.credits} créditos x{' '}
                        {formatter.format(order.price)}
                      </li>
                      <li>
                        ID
                        <span className="text-purple-500 font-medium"> {order.id}</span>
                      </li>
                      <li>Pedido el {new Date(order.createdAt).toLocaleString()}</li>
                    </ul>
                    <ul>
                      <li>
                        Método de pago:
                        <span className="font-medium">
                          {settings.paymentMethods[order.paymentMethodID]?.name}
                        </span>
                      </li>
                      <li>
                        Cuenta de Demo Games: <span className="font-medium">{order.account}</span>
                      </li>
                    </ul>
                  </div>
                  <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-purple-500 text-gray-300 self-center ml-auto flex-shrink-0">
                    {STATUS[order.status]}
                  </span>
                </div>
              </Link>
            ))}
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="max-w-xl z-100 text-sm leading-7 mt-auto mx-2 md:mx-0 text-white">
            <span
              className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300 border-none`}
            >
              Pago pendiente
            </span>{' '}
            El pedido está confirmado a la espera de la transacción.
            <br />
            <span className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300`}>
              Completado
            </span>{' '}
            El pedido se completó.
          </p>
          <Button
            className="disabled:opacity-50 w-full lg:w-auto mt-3 lg:mt-0"
            onClick={handleClick}
            disabled={isLast}
          >
            Cargar más
          </Button>
        </div>
      </div>
    </Layout>
  );
}
