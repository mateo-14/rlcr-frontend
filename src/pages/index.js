import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import useSettings from '../hooks/useSettings';
import { encodeB64Object } from '../util';

export function useMode(settings) {
  const [mode, setMode] = useState(!settings || settings?.buyEnabled ? 0 : 1);

  useEffect(() => {
    if (!settings) return;
    if (mode === 0 && !settings?.buyEnabled && settings?.sellEnabled) {
      setMode(1);
    } else if (mode === 1 && !settings?.sellEnabled) {
      setMode(0);
    }
  }, [settings?.sellEnabled, settings?.buyEnabled]);

  return { mode, changeMode: setMode };
}

export default function Home() {
  return (
    <Layout>
      <section className="grid grid-cols-1 xl:grid-cols-index content-center items-center gap-x-16 gap-y-6 my-auto">
        <div className="mx-2 sm:mx-0">
          <p className="text-4xl xl:text-5xl font-medium text-white">
            Compra créditos para Rocket League en pesos argentinos y sin impuestos!
          </p>
          <p className="text-4xl xl:text-5xl font-medium text-purple-500 mt-2">+100 transacciones realizadas!</p>
        </div>
        <Form />
        <p className="text-white mx-2 sm:mx-0">
          * Solo venta de créditos para PC (Steam y Epic Games)
          <br />* Pagos por transferencia bancaria, enviar dinero por UALÁ y MercadoPago
          <br />* Solo válido para Argentina
        </p>
      </section>
    </Layout>
  );
}

function Form() {
  const settings = useSettings();
  const router = useRouter();
  const { mode, changeMode } = useMode(settings);
  const [credits, setCredits] = useState(100);
  const [pm, setPm] = useState(0);
  const max = mode == 0 ? settings?.maxBuy : settings?.maxSell;

  const handleChange = ({ currentTarget }) => {
    if (currentTarget.value.length > 5) return;
    setCredits(currentTarget.value);
  };

  const handleBlur = ({ currentTarget }) => {
    const value = Math.max(100, Math.min(Math.round(currentTarget.value / 10) * 10, max));
    setCredits(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/checkout',
      query: { c: encodeB64Object({ mode, credits, paymentMethodID: parseInt(pm) }) },
    });
  };

  const handleSelectChange = ({ currentTarget }) => {
    setPm(currentTarget.value);
  };

  useEffect(() => {
    if (max) setCredits(Math.max(100, Math.min(Math.round(credits / 10) * 10, max)));
  }, [max]);

  return (
    <div className="lg:row-span-2 bg-gray-700 sm:rounded-xl sm:shadow-xl px-6 py-10">
      {settings && !settings.sellEnabled && !settings.buyEnabled ? (
        <p className="text-center text-white text-5xl font-medium">Compra y venta deshabilitada 🙁</p>
      ) : (
        <>
          <div className="w-full flex h-10 mb-8">
            <TabButton
              onClick={() => changeMode(0)}
              disabled={!settings?.buyEnabled}
              selected={mode === 0}
              rounded="rounded-l-xl"
            >
              Comprar
            </TabButton>
            <TabButton
              onClick={() => changeMode(1)}
              disabled={!settings?.sellEnabled}
              selected={mode === 1}
              rounded="rounded-r-xl"
            >
              Vender
            </TabButton>
          </div>
          <form onSubmit={handleSubmit}>
            {!settings ? (
              <FormSkeleton />
            ) : (
              <>
                <Input
                  type="number"
                  id="credits"
                  value={credits}
                  min="100"
                  max={max}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  hint="CR"
                  step="10"
                  maxLength={3}
                  label={mode == 0 ? 'Cuántos créditos querés?' : 'Cuántos créditos querés vender?'}
                />
                <div className="mt-4">
                  <label htmlFor="paymentmet" className="block text-lg text-white">
                    Método de pago
                  </label>
                  <select
                    id="paymentmet"
                    className="focus:outline-none mt-1 w-full p-2 text-lg rounded-xl bg-gray-600 text-gray-300 focus:text-white"
                    onChange={handleSelectChange}
                    value={pm}
                  >
                    {settings?.paymentMethods.map((method) => (
                      <option value={method.id} key={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-white text-3xl mt-5">
                  {`${mode == 0 ? 'Pagas' : 'Te pagamos'} ARS$ ${Math.ceil(
                    credits * (mode == 0 ? settings?.creditBuyValue : settings?.creditSellValue)
                  )} (Pesos argentinos)`}
                </p>
              </>
            )}
            <Button className="mt-8 w-full" disabled={!settings}>
              Continuar
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

const TabButton = ({ children, selected, disabled, onClick, rounded }) => (
  <button
    className={`flex-1 font-medium ${rounded} text-black text-sm uppercase disabled:opacity-50 ${
      selected ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-300'
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const FormSkeleton = () => (
  <div className="space-y-5">
    <div className="animate-pulse space-y-2">
      <div className="h-5 bg-gray-500 rounded w-2/5"></div>
      <div className="h-10 bg-gray-500 rounded"></div>
    </div>
    <div className="animate-pulse space-y-2">
      <div className="h-5 bg-gray-500 rounded w-2/5"></div>
      <div className="h-10 bg-gray-500 rounded"></div>
    </div>
    <div className="h-10 bg-gray-500 rounded"></div>
  </div>
);
