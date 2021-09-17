import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LinkButton from '../components/UI/LinkButton';
import Loader from '../components/UI/Loader';
import useSettings from '../hooks/useSettings';
import { createOrder } from '../services/OrdersService';
import { decodeB64Object, dsAuthWithState, encodeB64Object } from '../util';

export default function Checkout() {
  const settings = useSettings();
  const router = useRouter();
  const user = useSelector(({ user }) => user);
  const [order, setOrder] = useState();

  const formData = useMemo(() => (router.query.c ? decodeB64Object(router.query.c) : null), [router.query.c]);
  const max = formData?.mode == 0 ? settings?.maxBuy : settings?.maxSell;
  const credits = Math.max(100, Math.min(Math.round((formData?.credits || 100) / 10) * 10, max));

  const handleSubmit = (data) => {
    data.credits = credits;
    data.route = 'checkout';
    if (user.isLogged) return createOrder(data).then((order) => setOrder(order));
    else dsAuthWithState(data);
  };

  return (
    <Layout>
      <section className="my-auto bg-gray-700 sm:rounded-xl sm:shadow-xl px-6 py-10">
        {settings &&
          formData &&
          !user.isLoading &&
          (order ? (
            <>
              <h1 className="text-4xl text-white mb-4">Pedido realizado!</h1>
              <p className="text-3xl text-white">
                Te enviamos un DM a tu Discord <span className="text-purple-500">({user.data.username})</span> con
                información del pedido.
                <br />
                En breve nos contactaremos por DM para realizar la transacción.
              </p>
              <Link href={`/orders/${order.id}?state=${encodeB64Object(order)}`} passHref>
                <LinkButton>Ver pedido</LinkButton>
              </Link>
            </>
          ) : (
            <>
              <p className="text-4xl text-white mb-10">{`Vas a ${
                formData.mode === 0 ? 'comprar' : 'vender'
              } ${credits} créditos a ARS$${Math.ceil(
                (formData.mode === 0 ? settings.creditBuyValue : settings.creditSellValue) * credits
              )} por ${settings.paymentMethods[formData.paymentMethodID]?.name}`}</p>
              <Form formData={formData} onSubmit={handleSubmit} />
            </>
          ))}
      </section>
    </Layout>
  );
}

function Form({ formData, onSubmit }) {
  const [dni, setDNI] = useState(formData.dni || '');
  const [paymentAccount, setPaymentAccount] = useState(formData.paymentAccount || '');
  const [account, setAccount] = useState(formData.account || '');
  const [cvuAlias, setCVUAlias] = useState(formData.cvuAlias || '');
  const [errors, setErrors] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFetching) return;

    const data = {
      paymentMethodID: formData.paymentMethodID,
      mode: formData.mode,
      account,
    };
    if (dni?.length > 0) data.dni = dni;
    if (paymentAccount?.length > 0) data.paymentAccount = paymentAccount;
    if (cvuAlias?.length > 0) data.cvuAlias = cvuAlias;

    setIsFetching(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
    setIsFetching(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formData.paymentMethodID === 2 ? (
        <>
          <Input
            className="mb-4"
            label="Tu CVU/CBU/Alias"
            id="cvuAlias"
            required
            onChange={({ currentTarget }) => setCVUAlias(currentTarget.value)}
            value={cvuAlias}
            errors={errors}
            minLength={4}
            maxLength={40}
          />
          <Input
            className="mb-4"
            label="Tu DNI"
            id="dni"
            required
            onChange={({ currentTarget }) => setDNI(currentTarget.value)}
            value={dni}
            errors={errors}
            minLength={7}
            maxLength={9}
          />
        </>
      ) : formData.paymentMethodID === 0 || formData.paymentMethodID === 1 ? (
        <Input
          className="mb-4"
          label={formData.paymentMethodID === 1 ? 'Usuario de UALÁ' : 'Usuario de MercadoPago'}
          id="paymentAccount"
          required
          onChange={({ currentTarget }) => setPaymentAccount(currentTarget.value)}
          value={paymentAccount}
          errors={errors}
          minLength={4}
          maxLength={40}
        />
      ) : null}

      <Input
        label="Tu usuario de Epic Games"
        id="account"
        required
        onChange={({ currentTarget }) => setAccount(currentTarget.value)}
        value={account}
        errors={errors}
        minLength={3}
        maxLength={16}
      />
      <p className="text-white mt-6 mb-4">
        * Al confirmar es necesario que autorices nuestra aplicación de Discord para seguir con el proceso de pago. (Es
        necesario tener una cuenta de Discord)
      </p>

      <Button className="flex justify-center items-center h-12 w-full " disabled={isFetching}>
        {isFetching ? <Loader color="text-white" size="w-8 h-8" /> : 'Confirmar'}
      </Button>
    </form>
  );
}
