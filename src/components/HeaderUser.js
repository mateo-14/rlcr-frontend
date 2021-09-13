import { forwardRef, useContext, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import Image from 'next/image';
import { CSSTransition } from 'react-transition-group';
import Link from 'next/link';
import Loader from './UI/Loader';

const MenuItem = ({ children }) => {
  return <div className="flex px-4 py-2 font-medium hover:bg-gray-500">{children}</div>;
};

const _UserMenu = ({ user }, ref) => {
  return (
    <div className="absolute right-0 top-14 bg-gray-700 rounded-xl shadow-xl text-white w-60" ref={ref}>
      <style jsx>{`
        .enter {
          opacity: 0;
          top: 2rem;
        }
        .exit {
          opacity: 1;
          top: 3.5rem;
        }

        .enter-active,
        .exit-active {
          transition: all 0.2s;
        }

        .enter-active {
          opacity: 1;
          top: 3.5rem;
        }

        .exit-active {
          opacity: 0;
          top: 2rem;
        }
      `}</style>
      <div className="px-4 py-2 font-semibold text-md border-b border-gray-600 ">{user.username}</div>
      <div className="mb-4 mt-2">
        {user.isAdmin && (
          <Link href="/admin">
            <a>
              <MenuItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Admin
              </MenuItem>
            </a>
          </Link>
        )}

        <Link href="/orders">
          <a>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
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
              Mis pedidos
            </MenuItem>
          </a>
        </Link>
        <Link href="/logout">
          <a>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </MenuItem>
          </a>
        </Link>
      </div>
    </div>
  );
};

const UserMenu = forwardRef(_UserMenu);

const Avatar = ({ user }) => {
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const nodeRef = useRef(null);
  return (
    <div className="relative">
      <button onClick={() => setIsMenuShowing(!isMenuShowing)} className="relative flex z-10">
        <Image
          className="rounded-full"
          alt="Foto de perfil"
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
          height="45"
          width="45"
        ></Image>
      </button>
      <CSSTransition
        in={isMenuShowing}
        timeout={200}
        unmountOnExit
        onExit={() => setIsMenuShowing(false)}
        nodeRef={nodeRef}
      >
        {<UserMenu user={user} ref={nodeRef} />}
      </CSSTransition>
    </div>
  );
};
const HeaderUser = () => {
  const user = useContext(UserContext);
  const handleClick = () => {
    window.location.assign(process.env.NEXT_PUBLIC_DS_OAUTH);
  };

  return user.data ? (
    <Avatar user={user.data} />
  ) : user.isReady && !user.isLogging ? (
    <button className="bg-indigo-500 font-medium rounded-xl text-white py-2 px-4 flex" onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 127.14 96.36"
        fill="currentColor"
        className="h-6 w-6 mr-2"
        stroke="currentColor"
      >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
      </svg>
      Iniciar sesión
    </button>
  ) : (
    <Loader />
  );
};

export default HeaderUser;
