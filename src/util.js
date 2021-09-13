export const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export const STATUS = ['Pago pendiente', 'Completado'];

export function encodeB64Object(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function decodeB64Object(obj) {
  try {
    return JSON.parse(Buffer.from(obj, 'base64').toString());
  } catch {}
}

export function dsAuthWithState(state) {
  const dataB64 = encodeB64Object(state);
  window.location.assign(`${process.env.NEXT_PUBLIC_DS_OAUTH}&state=${dataB64}`);
}
