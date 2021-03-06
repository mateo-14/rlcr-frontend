import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminOrders from '../../features/adminOrders/AdminOrders';
import AdminUsers from '../../features/adminUsers/AdminUsers';
import { fetchUsers } from '../../features/adminUsers/adminUsersSlice';
import HeaderUser from '../../features/user/HeaderUser';

export default function Admin() {
  const user = useSelector(({ user }) => user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.isReady && !user.data?.isAdmin) return router.push('/');
    dispatch(fetchUsers());
  }, [user.isReady, dispatch]);

  return (
    <div className="flex min-h-screen">
      {user?.data?.isAdmin ? (
        <>
          <div className="w-60 bg-gray-700">
            <h1 className="text-3xl text-white m-4">Admin</h1>
            <Menu />
          </div>
          <main role="main" className="flex-grow flex flex-col bg-gray-800">
            <header className="my-4">
              <div className="max-w-max ml-auto mr-8">
                <HeaderUser />
              </div>
            </header>
            <div className="mx-10 mb-8 flex flex-col flex-1">
              {router.query.params?.[0] === 'users' ? (
                <AdminUsers />
              ) : router.query.params?.[0] === 'orders' ? (
                <AdminOrders />
              ) : null}
            </div>
          </main>
        </>
      ) : null}
    </div>
  );
}

function Menu() {
  const router = useRouter();
  const route = router.query.params?.[0];
  return (
    <div className="m-6">
      <h2 className="text-lg text-white font-semibold">Menú</h2>
      <ul className="mt-2">
        <MenuItem
          icon={
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          route="users"
          selectedID={route}
        >
          Usuarios
        </MenuItem>
        <MenuItem
          icon={
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          }
          route="orders"
          selectedID={route}
        >
          Pedidos
        </MenuItem>
        <MenuItem
          icon={
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          route="settings"
          selectedID={route}
        >
          Settings
        </MenuItem>
      </ul>
    </div>
  );
}

const MenuItem = ({ children, icon, selectedID, route }) => (
  <li className={`ml-4 hover:text-gray-300 ${selectedID === route ? 'text-white' : 'text-gray-400'}`}>
    <Link href={route} shallow={true}>
      <a className="w-full text-left py-2 flex font-medium">
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </a>
    </Link>
  </li>
);
