const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

const STATUS = ['Pago pendiente', 'Completado'];

const encodeB64Object = (obj) => {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
};

const decodeB64Object = (obj) => {
  try {
    return JSON.parse(Buffer.from(obj, 'base64').toString());
  } catch {}
};
export { formatter, STATUS, encodeB64Object, decodeB64Object };
