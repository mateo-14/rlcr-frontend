import Layout from '../../../../components/Layout';

export default function Checkout({ query }) {
  return <Layout>{JSON.stringify(query)}</Layout>;
}

export async function getServerSideProps({ query }) {
  const { mode, mp, amount } = query;

  return {
    props: { query }, // will be passed to the page component as props
  };
}
