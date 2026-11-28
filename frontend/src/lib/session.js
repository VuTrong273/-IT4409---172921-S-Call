const KEY = 's-call-session';
const listeners = new Set();
let session = null;
try { session = JSON.parse(sessionStorage.getItem(KEY)); } catch { /* Storage unavailable. */ }
if (!session?.tokens?.refreshToken || !session?.user) session = null;
if (session?.demo && !import.meta.env.DEV) session = null;
export const getSession = () => session;
export const subscribeSession = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
export function saveSession(next) {
  session = next;
  try { if (next) sessionStorage.setItem(KEY, JSON.stringify(next)); else sessionStorage.removeItem(KEY); } catch { /* Keep in memory. */ }
  listeners.forEach((listener) => listener());
}
