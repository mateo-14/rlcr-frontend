import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import TableRowLoading from '../../components/TableRowLoading';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import useSettings from '../../hooks/useSettings';
import { encodeB64Object, formatter, STATUS } from '../../util';
import { getAll as getAllOrders } from '../../services/OrdersService';

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
        <div className="overflow-auto rounded-xl bg-gray-800 my-6" style={{ flex: '1 1 1px', minHeight: '400px' }}>
          <table className="table-auto divide-y divide-gray-700 w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Créditos</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Método de pago</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading && orders.length === 0 && <TableRowLoading cols={7} />}
              {settings &&
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/orders/${order.id}?state=${encodeB64Object(order)}`}>
                        <a className="text-purple-500 hover:text-purple-400">{order.id}</a>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {formatter.format(order.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {order.mode === 0 ? 'Compra' : 'Venta'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {settings.paymentMethods[order.paymentMethodID]?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-purple-500 text-gray-300">
                        {STATUS[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="max-w-xl z-100 text-sm leading-7 mt-auto mx-2 md:mx-0 text-white">
            <span className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300 border-none`}>
              Pago pendiente
            </span>{' '}
            El pedido está confirmado a la espera de la transacción.
            <br />
            <span className={`px-2 font-semibold rounded-full bg-purple-500 text-gray-300`}>Completado</span> El pedido
            se completó.
          </p>
          <Button className="disabled:opacity-50 w-full lg:w-auto mt-3 lg:mt-0" onClick={handleClick} disabled={isLast}>
            Cargar más
          </Button>
        </div>
      </div>
    </Layout>
  );
}
