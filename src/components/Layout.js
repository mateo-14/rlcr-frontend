import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.png';
import HeaderUser from '../features/user/HeaderUser';

const Layout = ({ children, className = '' }) => (
  <div className="bg-gray-800 min-h-screen flex flex-col">
    <header className="mx-4 sm:mx-8 flex items-center h-24 justify-between">
      <nav className="h-full flex items-center">
        <Link href="/">
          <a className="flex">
            <Image src={Logo} alt="rlgo.store logo" height={51} width={121}></Image>
          </a>
        </Link>
      </nav>
      <HeaderUser />
    </header>
    <main
      role="main"
      className={`container flex-grow flex flex-col mx-auto my-12 xl:my-8 md:px-4 ${className}`}
    >
      {children}
    </main>
    <footer className="py-2">
      <p className="text-white text-center">
        Copyright © 2021 -{' '}
        <a href="https://rlgo.store" className="text-purple-400">
          rlgo.store
        </a>
      </p>
    </footer>
  </div>
);
export default Layout;
