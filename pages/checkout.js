import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Loader from '../components/UI/Loader';
import { SettingsContext } from '../contexts/SettingsContext';
import { UserContext } from '../contexts/UserContext';
import { decodeB64Object, encodeB64Object } from '../util';

export default function Checkout() {
  const settings = useContext(SettingsContext);
  const router = useRouter();
  const user = useContext(UserContext);
  const formData = useMemo(() => (router.query.c ? decodeB64Object(router.query.c) : null), [router.query.c]);
  const max = formData?.mode == 0 ? settings?.maxBuy : settings?.maxSell;
  const credits = Math.max(100, Math.min(Math.round((formData?.credits || 100) / 10) * 10, max));

  const handleSubmit = (data) => {
    data.credits = credits;
    data.route = 'checkout';
    if (user.isReady && user.data) {
      return axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { ...data }, { withCredentials: true })
        .then(({ data }) => {
          router.push(`/orders/${data.id}?state=${encodeB64Object(data)}`);
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              const dataB64 = encodeB64Object(data);
              window.location.assign(`${process.env.NEXT_PUBLIC_DS_OAUTH}&state=${dataB64}`);
            } else if (err.response.status === 400) throw err;
          }
        });
    } else {
      const dataB64 = encodeB64Object(data);
      window.location.assign(`${process.env.NEXT_PUBLIC_DS_OAUTH}&state=${dataB64}`);
    }
  };

  return (
    <Layout>
      <section className="my-auto bg-gray-700 sm:rounded-xl sm:shadow-xl px-6 py-10">
        {settings && formData && (
          <>
            <p className="text-4xl text-white mb-10">{`Vas a ${
              formData.mode === 0 ? 'comprar' : 'vender'
            } ${credits} créditos a ARS$${
              (formData.mode === 0 ? settings.creditBuyValue : settings.creditSellValue) * credits
            } por ${settings.paymentMethods[formData.paymentMethodID]?.name}`}</p>
            <Form formData={formData} onSubmit={handleSubmit} />
          </>
        )}
      </section>
    </Layout>
  );
}

const Form = ({ formData, onSubmit }) => {
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
        label="Link de tu perfil de Steam o usuario de Epic Games"
        id="account"
        required
        onChange={({ currentTarget }) => setAccount(currentTarget.value)}
        value={account}
        errors={errors}
        minLength={3}
        maxLength={80}
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
};
