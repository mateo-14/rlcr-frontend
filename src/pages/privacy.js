import Layout from '../components/Layout';
import Head from 'next/head';

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Política de privacidad</title>
      </Head>
      <article className="text-white">
        <h1 className="text-5xl">Política de privacidad de rlgo.store</h1>
        <section className="mt-14">
          <h2 className="text-3xl">Privacidad</h2>
          <p>
            Revise nuestra política de privacidad, cuyas disposiciones se incorporan en estos términos y condiciones
            mediante esta referencia. Al usar este sitio, usted reconoce que ha leído esta política de privacidad y da
            su consentimiento a las prácticas descritas en el mismo con respecto a la recopilación, uso y divulgación de
            cualquier información personal proporcionada por usted a la empresa.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-3xl">Derechos de autor</h2>
          <p>
            Todo en este sitio, como texto, gráficos, logotipos, imágenes y compilaciones de datos, es propiedad de la
            empresa o de sus proveedores de contenido y está protegido por las leyes de derechos de autor nacionales e
            internacionales.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-3xl">Licencia y acceso al sitio</h2>
          <p>
            La empresa le concede una licencia limitada para acceder a este sitio y para comprar los productos y
            utilizar los servicios ofrecidos a través de este sitio únicamente para uso personal. esta licencia no
            permite lo siguiente, todo lo cual está estrictamente prohibido sin el consentimiento previo por escrito de
            la empresa: modificar, reproducir, duplicar, copiar o cualquier uso derivado de este sitio o sus contenidos;
            cualquier recopilación o uso de listados de productos, descripciones o precios; cualquier uso de minería de
            datos, robots o dispositivos similares de recopilación y extracción de datos; usar o enmarcar cualquier
            marca comercial, logotipo u otra información de propiedad.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-3xl">Cuenta</h2>
          <p>
            Si usa este sitio, usted es responsable de mantener la confidencialidad de su cuenta y contraseña y de
            restringir el acceso a su computadora, y acepta aceptar la responsabilidad de todas las actividades que
            ocurran bajo su cuenta o contraseña. la empresa se reserva el derecho de rechazar el servicio, cancelar
            cuentas, eliminar o editar contenido o cancelar pedidos a su entera discreción.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-3xl">Acuerdo completo</h2>
          <p>
            Estas políticas de privacidad constituyen el acuerdo completo entre usted y la empresa con respecto al tema
            del presente.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="text-3xl">Datos</h2>
          <p>
            Hemos cifrado la información del miembro. En lo que respecta a la información de pedido, no se guardará ni
            estará disponible para nadie. no divulgamos esta información a ningún tercero.
          </p>
        </section>
      </article>
    </Layout>
  );
}
