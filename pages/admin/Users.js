import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TableRowLoading from '../../components/TableRowLoading';

const Users = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/all`, { withCredentials: true })
      .then(({ data }) => setUsers(data))
      .catch((err) => {
        alert('Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku');
        console.error(err);
      });
  }, []);
  return (
    <>
      <h2 className="text-2xl text-white">Users</h2>
      <div className="overflow-auto rounded-xl bg-gray-700 mt-6" style={{ flex: '1 1 1px', minHeight: '400px' }}>
        <table className="table-auto divide-y divide-gray-600 w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">User</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">ID</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">Pedidos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {!users && <TableRowLoading cols={3} />}

            {users?.map((user) => (
              <tr className="text-gray-300" key={user.id}>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium flex items-center">
                  <Image
                    className="rounded-full"
                    alt="Foto de perfil"
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
                    height="36"
                    width="36"
                  ></Image>
                  <span className="ml-2" title={user.isAdmin ? 'Es admin 😎' : ''}>{`${user.username}#${
                    user.discriminator
                  }${user.isAdmin ? ' 😎' : ''}`}</span>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">{user.id}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/orders?user=${user.id}`}>
                    <a className="text-purple-500 hover:text-purple-400">Ver pedidos</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
