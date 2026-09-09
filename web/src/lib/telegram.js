const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

export const isInsideTelegram = Boolean(tg?.initData);

export function getInitData() {
  return tg?.initData || '';
}

// Fuera de Telegram (navegador normal, solo para desarrollo local) no hay
// datos firmados; se usa un usuario de prueba controlado por ALLOW_DEV_AUTH.
export function getDevUser() {
  return tg?.initDataUnsafe?.user || { id: 1, first_name: 'Dev (navegador)' };
}
