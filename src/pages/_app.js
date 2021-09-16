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
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <UserProvider>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </UserProvider>
    </>
  );
}
