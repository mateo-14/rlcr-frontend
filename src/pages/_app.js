import 'tailwindcss/tailwind.css';

import Head from 'next/head';
import { SettingsProvider } from '../contexts/SettingsContext';
import { UserProvider } from '../contexts/UserContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Rocket League Go - Créditos para Rocket League PC Steam Epic Games</title>
        <meta name="description" content="Compra créditos para Rocket League PC con pesos argentinos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </UserProvider>
    </>
  );
}
