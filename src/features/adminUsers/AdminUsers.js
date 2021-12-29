import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableRowLoading from '../../components/TableRowLoading';
import { fetchUsers } from './adminUsersSlice';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const adminUsers = useSelector(({ adminUsers }) => adminUsers);

  useEffect(() => {
    const token = axios.CancelToken.source();
    dispatch(fetchUsers(token.token))
      .unwrap()
      .catch((err) => {
        if (!err.isAxiosCancel && !err.name === 'ConditionError') {
          alert(
            'Hubo un error, decile al programadorcito de cuarta que mire la consola y el Log de Heroku'
          );
          console.error(err);
        }
      });
    return () => token?.cancel();
  }, []);

  return (
    <>
      <h2 className="text-2xl text-white">Users</h2>
      <div className="overflow-auto rounded-xl bg-gray-700 mt-6 min-h-[400px] flex-[1_1_1px]">
        <table className="table-auto divide-y divide-gray-600 w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">
                User
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">
                ID
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">
                IP
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-300 uppercase">
                Pedidos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {adminUsers.isFetching ? (
              <TableRowLoading cols={4} />
            ) : (
              adminUsers.users?.map((user) => (
                <tr className="text-gray-300" key={user.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium flex items-center">
                    <Image
                      className="rounded-full"
                      alt="Foto de perfil"
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
                      height="36"
                      width="36"
                    ></Image>
                    <span className="ml-2" title={user.isAdmin ? 'Es admin 😎' : ''}>{`${
                      user.username
                    }#${user.discriminator}${user.isAdmin ? ' 😎' : ''}`}</span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">{user.id}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">{user.ip}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/orders?userID=${user.id}`}>
                      <a className="text-purple-500 hover:text-purple-400">Ver pedidos</a>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
