import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import Loader from '../components/UI/Loader';
import { UserContext } from '../contexts/UserContext';
import Logo from '../public/logo.png';
import HeaderUser from './HeaderUser';

export default function Layout({ children, className = '' }) {
  const { isReady } = useContext(UserContext);

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      <header className="mx-4 sm:mx-8 flex items-center h-24 justify-between">
        <nav className="h-full flex items-center">
          <Link href="/">
            <a className="flex">
              <Image src={Logo} alt="rlgo.store logo" height={51} width={121}></Image>
            </a>
          </Link>
          {/*        <Link href="/orders">
            <a className="text-purple-500 font-semibold text-md">Pedidos</a>
          </Link> */}
        </nav>

        {/* <SellInfo /> */}
        {isReady ? <HeaderUser /> : <Loader size={8} />}
      </header>
      <main role="main" className={`container flex-grow flex flex-col mx-auto my-12 xl:my-8 ${className}`}>
        {children}
      </main>
      <footer className="py-2">
        <p className="text-white text-center">
          Copyright © 2021 -{' '}
          <a className="text-purple-400" href="https://rlgo.store">
            rlgo.store
          </a>
          <br />
          Desarrollado por {''}
          <a className="text-purple-400" href="https://github.com/Nico-14" target="_blank" rel="noreferrer">
            Nico-14
          </a>
          {' - '}
          <a className="text-purple-400" href="https://paranadev.com" target="_blank" rel="noreferrer">
            paranadev.com
          </a>
        </p>
      </footer>
    </div>
  );
}