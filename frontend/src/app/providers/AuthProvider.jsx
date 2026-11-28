import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { getSession, saveSession, subscribeSession } from '../../lib/session.js';
import { refreshSession, setAccessToken } from '../../lib/api.js';
import { isDemoSession } from '../../features/auth/demoAccount.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeSession, getSession);
  const [ready, setReady] = useState(!getSession());
  const [error, setError] = useState('');
  async function restore() {
    setError(''); setReady(false);
    if (isDemoSession(getSession())) { setReady(true); return; }
    try { await refreshSession(); setReady(true); }
    catch { if (!getSession()) setReady(true); else setError('Không thể khôi phục phiên. Kiểm tra kết nối rồi thử lại.'); }
  }
  useEffect(() => { if (getSession()) restore(); }, []);
  function signIn(result) {
    if (!result?.tokens?.accessToken || !result.tokens.refreshToken || !result.user) throw new Error('Phản hồi đăng nhập không hợp lệ.');
    setAccessToken(result.tokens.accessToken); saveSession(result); setReady(true); setError('');
  }
  return <AuthContext.Provider value={{ session, ready, error, restore, signIn }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
