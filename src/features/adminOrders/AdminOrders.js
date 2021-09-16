import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableRowLoading from '../../components/TableRowLoading';
import CheckSelect from '../../components/UI/CheckSelect';
import useSettings from '../../hooks/useSettings';
import { formatter, STATUS } from '../../util';
import { fetchUsers } from '../adminUsers/adminUsersSlice';
import { clear, fetchOrders, updateOrder } from './adminOrdersSlice';

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

function queryToSearchParams(query) {
  query = { ...query };
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
  return searchParams;
}

export default function AdminOrders() {
  const dispatch = useDispatch();
  const router = useRouter();
  const options = statusQueryToOptions(router.query?.status);
  const isFetching = useSelector(({ adminOrders }) => adminOrders.isFetching);
  const user = useSelector(({ adminUsers }) => adminUsers.users?.find((user) => user.id === router.query.userID));

  useEffect(() => {
    let token;
    if (router.isReady) {
      const searchParams = queryToSearchParams(router.query);
      token = axios.CancelToken.source();
      dispatch(fetchOrders({ query: searchParams, cancelToken: token.token }))
        .unwrap()
        .catch((err) => {
          if (!err.isAxiosCancel && !err.name === 'ConditionError') {
            alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
            console.error(err);
          }
        });
    }
    return () => {
      token?.cancel();
      dispatch(clear());
    };
  }, [router.isReady, router.query, dispatch]);

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
      <h2 className="text-2xl text-white">
        Pedidos
        {`${
          router.query.userID
            ? ' de ' +
              (user ? user.username + '#' + user.discriminator + ' (' + router.query.userID + ')' : router.query.userID)
            : ''
        }`}
      </h2>
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">User</th>
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Método</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">EpicGames</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {isFetching ? <TableRowLoading cols={9} /> : <OrdersList />}
          </tbody>
        </table>
      </div>
    </>
  );
}

const OrdersList = () => {
  const dispatch = useDispatch();
  const timeout = useRef();
  const settings = useSettings();
  const { orders, users } = useSelector(({ adminOrders, adminUsers }) => ({
    orders: adminOrders.orders,
    users: adminUsers.users,
  }));
  const token = useRef();
  const [shownUser, setShownUser] = useState();

  const findUser = (order) => {
    let user = users?.find((user) => user.id === order.userID);
    if (user) {
      setShownUser({ ...user, orderID: order.id });
      return true;
    }
  };
  const handleMouseEnter = (order) => {
    if (findUser(order)) return;

    timeout.current = setTimeout(() => {
      token.current = axios.CancelToken.source();
      dispatch(fetchUsers(token.current.token))
        .unwrap()
        .then(() => {
          findUser(order);
        })
        .catch((err) => {
          if (!err.isAxiosCancel && !err.name === 'ConditionError') {
            alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
            console.error(err);
          }
        });
    }, 200);
  };

  const cancel = () => {
    token.current?.cancel();
    token.current = null;
    clearInterval(timeout.current);
    timeout.current = null;
  };

  const handleMouseLeave = () => {
    cancel();
    setShownUser(null);
  };

  useEffect(() => () => cancel(), []);

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

function OrderRow({ settings, order, onMouseEnter, onMouseLeave, shownUser }) {
  const user = useSelector(({ adminUsers }) => adminUsers.users?.find((user) => user.id === order.userID));

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
        <span
          className="relative cursor-pointer hover:text-purple-500"
          onMouseEnter={() => onMouseEnter(order)}
          onMouseLeave={() => onMouseLeave(order)}
        >
          {user ? `${user.username}#${user.discriminator}` : order.userID}
          {shownUser && (
            <div className="absolute left-0 top-full bg-gray-800 rounded-xl shadow-xl text-white px-2 py-3 z-10 w-max">
              <div className="flex items-center">
                <Image
                  className="rounded-full"
                  alt="Foto de perfil"
                  src={`https://cdn.discordapp.com/avatars/${shownUser.id}/${shownUser.avatar}.jpg`}
                  height="42"
                  width="42"
                ></Image>
                <span className="ml-3">{`${shownUser.username}#${shownUser.discriminator}`}</span>
              </div>
              <span className="text-xs text-center w-full block mt-2">{shownUser.id}</span>
            </div>
          )}
        </span>
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{order.account}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-purple-500 text-gray-300">
          {STATUS[order.status]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
        {order.status === 0 && <OrderOptions order={order} />}
      </td>
    </tr>
  );
}
function OrderOptions({ order }) {
  const dispatch = useDispatch();
  const [isShowing, setIsShowing] = useState(false);

  const handleClick = () => setIsShowing(!isShowing);

  const handleClickCopy = () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(`Hola! Soy moderador de https://rlgo.store
Recibimos un pedido (**${order.id}**) de **${order.credits}** de **${order.credits}** créditos por **ARS$ ${order.price}** para la cuenta de EpicGames **${order.account}**.
Te mandamos una solicitud con nuestra cuenta de EpicGames  **rlgostore** a **${order.account}**. 
**Por favor, responde a este mensaje para continuar con la transacción.**
**_Verificá que el usuario que envió este mensaje es moderador en nuestro server de Discord RLGO STORE | Compra y venta de créditos para Rocket League_**`);
      }
    });
    setIsShowing(false);
  };

  const handleClickComplete = () => {
    setIsShowing(false);
    dispatch(updateOrder({ id: order.id, data: { status: 1, userID: order.userID } }))
      .unwrap()
      .catch((err) => {
        alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
        console.error(err);
      });
  };

  return (
    <div className="relative">
      <button onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </button>
      {isShowing && (
        <div className="absolute right-0 bg-gray-600 rounded-xl shadow-xl text-white flex flex-col py-3 text-c">
          <button className="hover:bg-gray-500 px-2 py-1 text-sm text-left" onClick={handleClickCopy}>
            Copiar mensaje
          </button>
          <button className="hover:bg-gray-500 px-2 py-1 text-sm text-left" onClick={handleClickComplete}>
            Completar transacción
          </button>
        </div>
      )}
    </div>
  );
}
