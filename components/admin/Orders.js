import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import CheckSelect from '../../components/CheckSelect';
import TableRowLoading from '../../components/TableRowLoading';
import { SettingsContext } from '../../contexts/SettingsContext';
import { formatter, STATUS } from '../../util';

const statusQueryToOptions = (status) => [
  {
    id: 0,
    checked: status == 0 || (Array.isArray(status) && status?.some((id) => id == 0)),
    text: 'Pendiente',
  },
  {
    id: 1,
    checked: status == 1 || (Array.isArray(status) && status?.some((id) => id == 1)),
    text: 'Completado',
  },
];

const Orders = () => {
  const router = useRouter();
  const options = statusQueryToOptions(router.query?.status);
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
      setOrders(null);
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

  const handleSortChange = (query) => {
    delete query.params;
    router.push({ pathname: '/admin/orders', query }, null, {
      shallow: true,
    });
  };

  const handleSortOrderChange = () =>
    handleSortChange({ ...router.query, order: router.query.order === 'asc' ? 'desc' : 'asc' });

  const handleSortStatusChange = (id, checked) => {
    const status = options
      .filter(({ id: _id, checked: _checked }) => (_id == id ? checked : _checked))
      .map(({ id }) => id);
    const query = { ...router.query, status };
    handleSortChange(query);
  };

  return (
    <>
      <h2 className="text-2xl text-white">Pedidos</h2>
      <div className="text-white flex items-center mt-2 mb-5">
        Filtrar por estado:
        <CheckSelect
          placeholder="Filtrar por estado"
          options={options}
          onChange={handleSortStatusChange}
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
                onClick={handleSortOrderChange}
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
            {!orders && <TableRowLoading cols={8} />}
            <OrdersList orders={orders} />
          </tbody>
        </table>
      </div>
    </>
  );
};

const OrdersList = ({ orders }) => {
  const token = useRef();
  const timeout = useRef();
  const settings = useContext(SettingsContext);
  const [shownUser, setShownUser] = useState();

  const handleMouseEnter = (order) => {
    if (token.current) token.current.cancel();
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      token.current = axios.CancelToken.source();
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${order.userID}`, {
          withCredentials: true,
          cancelToken: token.current.token,
        })
        .then(({ data }) => {
          setShownUser({ ...data, orderID: order.id, id: order.userID });
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
            console.error(err);
          }
        });
    }, 200);
  };

  const handleMouseLeave = () => {
    if (token.current) {
      token.current.cancel();
      token.current = null;
    }
    if (timeout.current) clearInterval(timeout.current);
    setShownUser(null);
  };
  return (
    <>
      {orders?.map((order) => (
        <OrderRow
          settings={settings}
          order={order}
          key={order.id}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          shownUser={shownUser?.orderID === order.id ? shownUser : false}
        />
      ))}
    </>
  );
};

const OrderRow = ({ settings, order, onMouseEnter, onMouseLeave, shownUser }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
        <Link href={`/admin/users/${order.userID}`}>
          <a
            className="relative cursor-pointer hover:text-purple-500"
            onMouseEnter={() => onMouseEnter(order)}
            onMouseLeave={() => onMouseLeave(order)}
          >
            {order.userID}
            {shownUser && (
              <div className="absolute left-0 top-full bg-gray-800 rounded-xl shadow-xl text-white px-2 py-3 z-10 flex items-center w-max">
                <Image
                  className="rounded-full"
                  alt="Foto de perfil"
                  src={`https://cdn.discordapp.com/avatars/${shownUser.id}/${shownUser.avatar}.jpg`}
                  height="42"
                  width="42"
                ></Image>
                <span className="ml-3">{`${shownUser.username}#${shownUser.discriminator}`}</span>
              </div>
            )}
          </a>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
        {new Date(order.createdAt).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.credits}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{formatter.format(order.price)}</td>
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
  );
};
export default Orders;
