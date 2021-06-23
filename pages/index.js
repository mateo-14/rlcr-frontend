import Layout from '../components/Layout';
import { useState } from 'react';
import styles from '../styles/Home.module.scss';
import { useRouter } from 'next/router';

const Form = ({ mode, constants }) => {
  const router = useRouter();
  const [credits, setCredits] = useState(100);
  const [mp, setMp] = useState(0);
  const max = mode == 0 ? constants.MAX_SELL : constants.MAX_BUY;

  const handleChange = ({ currentTarget }) => {
    console.log(currentTarget.value);
    setCredits(currentTarget.value);
  };

  const handleBlur = ({ currentTarget }) => {
    const value = Math.max(100, Math.min(Math.round(currentTarget.value / 10) * 10, max));
    setCredits(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({ pathname: '/checkout/[mode]/[mp]/[amount]', query: { mode, mp, amount: credits } });
  };

  const handleSelectChange = ({ currentTarget }) => {
    setMp(currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.form_input}>
        <label>{mode == 0 ? 'Cuántos créditos querés?' : 'Cuántos créditos querés vender?'}</label>
        <input
          type="number"
          value={credits}
          min="100"
          max={max}
          step="10"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className={styles.form_input}>
        <label>{mode == 0 ? 'Pagas' : 'Te pago'} (Pesos argentinos)</label>
        <input
          type="number"
          value={credits * (mode == 0 ? constants.PESO_X_CREDIT_SELL : constants.PESO_X_CREDIT_BUY)}
          min="100"
          max={max}
          step="10"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={mode != 0}
        />
      </div>
      <div className={styles.form_input}>
        <label>Método de pago</label>
        <select value={mp} onChange={handleSelectChange}>
          <option value={0}> Transferencia bancaria</option>
          <option value={1}>Enviar dinero por UALÁ</option>
          <option value={2}>Enviar dinero por MercadoPago</option>
        </select>
      </div>
      <button className={styles.button}>Continuar</button>
    </form>
  );
};

export default function Home({ constants }) {
  const [mode, setMode] = useState(0);

  return (
    <Layout>
      <section className={styles.info_section}>
        <h1 className={styles.title}>
          Comprar créditos para Rocket League en <span>pesos argentinos y sin impuestos!</span>
        </h1>
        <p>
          * Solo venta de créditos para PC (Steam y Epic Games)
          <br />* Pagos por transferencia bancaria, enviar dinero por UALÁ y MercadoPago
          <br />* Solo válido para Argentina
        </p>
      </section>
      <section className={styles.form_section}>
        <div className={styles.tab}>
          <button className={mode == 0 ? styles.selected : ''} onClick={() => setMode(0)}>
            Comprar
          </button>
          <button className={mode == 1 ? styles.selected : ''} onClick={() => setMode(1)}>
            Vender
          </button>
        </div>
        <Form mode={mode} constants={constants} />
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  //Esto vendría desde una base de datos del sv
  const MAX_SELL = 3000;
  const MAX_BUY = 1000;
  const PESO_X_CREDIT_SELL = 1;
  const PESO_X_CREDIT_BUY = 0.75;
  return {
    props: {
      constants: { MAX_SELL, MAX_BUY, PESO_X_CREDIT_BUY, PESO_X_CREDIT_SELL },
    },
  };
}
