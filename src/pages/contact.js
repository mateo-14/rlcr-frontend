import Layout from '../components/Layout';
import Head from 'next/head';

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Contacto</title>
      </Head>
      <article className="text-white">
        <h1 className="text-5xl">Contacto</h1>
        <p className="text-xl mt-8">
          Email: <a href="mailto:rlgo.store@hotmail.com">rlgo.store@hotmail.com</a>
          <br />
          Discord: <a href="https:/discord.gg/mWWmBqPQKk">discord.gg/mWWmBqPQKk</a>
        </p>
      </article>
    </Layout>
  );
}
