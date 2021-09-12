import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import HeaderUser from '../../components/HeaderUser';
import Orders from './Orders';
import Users from './Users';
import { UserContext } from '../../contexts/UserContext';

export default function Admin() {
  const user = useContext(UserContext);
  const router = useRouter();
  const route = router.query.params?.[0];

  useEffect(() => {
    if (user.isReady && !user.data?.isAdmin) {
      router.push('/');
    }
  }, [user.isReady]);

  return (
    <div className="flex min-h-screen">
      {user?.data?.isAdmin ? (
        <>
          <div className="w-60 bg-gray-700">
            <h1 className="text-3xl text-white m-4">Admin</h1>
            {/* <Menu /> */}
          </div>
          <main role="main" className="flex-grow flex flex-col bg-gray-800">
            <header className="my-4">
              <div className="max-w-max ml-auto mr-8">
                <HeaderUser />
              </div>
            </header>
            <div className="mx-10 mb-8 flex flex-col flex-1">
              {route === 'users' ? <Users /> : route === 'orders' ? <Orders /> : null}
            </div>
          </main>
        </>
      ) : null}
    </div>
  );
}

const Menu = () => {
  const router = useRouter();
  const route = router.query.params?.[0];

  const handleClick = (id) => {
    if (id !== route) {
      router.push(`${id}`);
    }
  };

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
          id="users"
          selectedID={route}
          onClick={handleClick}
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
          id="orders"
          selectedID={route}
          onClick={handleClick}
        >
          Pedidos
        </MenuItem>
      </ul>
    </div>
  );
};

const MenuItem = ({ children, icon, selectedID, id, onClick }) => {
  const handleClick = () => onClick(id);

  return (
    <li className={`ml-4 hover:text-gray-300 ${selectedID === id ? 'text-white' : 'text-gray-400'}`}>
      <button className="w-full text-left py-2 flex font-medium" onClick={handleClick}>
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </button>
    </li>
  );
};
