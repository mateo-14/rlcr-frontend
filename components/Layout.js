import styles from '../styles/Layout.module.css';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Créditos Rocket League PC Steam Epic Games</title>
        <meta name="description" content="Comprar créditos para Rocket League PC con pesos argentinos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
