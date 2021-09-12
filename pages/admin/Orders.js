import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import CheckSelect from '../../components/CheckSelect';
import { SettingsContext } from '../../contexts/SettingsContext';
import { formatter, STATUS } from '../../util';

const Orders = () => {
  const router = useRouter();
  const settings = useContext(SettingsContext);
  const firstRender = useRef();
  const [options, setOptions] = useState([
    { id: 0, checked: true, text: 'Pendiente' },
    { id: 1, checked: true, text: 'Completado' },
  ]);
  const [orders, setOrders] = useState();

  useEffect(() => {
    if (router.isReady) {
      const query = { ...router.query };
      delete query.params;
      const searchParams = new URLSearchParams(query);
      if (query.status) {
        searchParams.delete('status');
        if (Array.isArray(query.status))
          for (const status of query.status) {
            searchParams.append('status[]', status);
          }
        else searchParams.append('status[]', query.status);
      }
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/all?${searchParams.toString()}`, {
          withCredentials: true,
        })
        .then(({ data }) => setOrders(data))
        .catch((err) => {
          alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
          console.error(err);
        });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!firstRender.current) return (firstRender.current = true);
    handleSortChange();
  }, [options]);

  const handleSortChange = () => {
    const query = { order: router.query.order === 'asc' ? 'desc' : 'asc' };
    if (options.some((option) => option.checked))
      query.status = options.filter((option) => option.checked).map((option) => option.id);

    router.push({ pathname: 'orders', query }, '', {
      shallow: true,
    });
  };

  const handleChange = (id, checked) =>
    setOptions(options.map((option) => (option.id === id ? { ...option, checked } : option)));

  return (
    <>
      <h2 className="text-2xl text-white">Pedidos</h2>
      <div className="text-white flex items-center mt-2 mb-5">
        Filtrar por estado:
        <CheckSelect
          placeholder="Filtrar por estado"
          options={options}
          onChange={handleChange}
          className="w-60"
          containerClass="ml-4"
        />
      </div>
      <div className="overflow-auto rounded-xl bg-gray-700 " style={{ flex: '1 1 1px', minHeight: '700px' }}>
        <table className="table-auto divide-y divide-gray-600 w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">User ID</th>
              <th
                className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase flex items-center cursor-pointer"
                onClick={handleSortChange}
              >
                Fecha
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  {router.query.order === 'asc' ? (
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Créditos</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Método de pago</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.userID}</td>
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
                  {settings?.paymentMethods[order.paymentMethodID]?.name || '...'}
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
    </>
  );
};

export default Orders;