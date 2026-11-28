import { useState } from 'react';
import { logoutSession } from '../../../lib/api.js';

export default function AccountActions() {
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try { await logoutSession(); }
    catch { setNotice('Đã xóa phiên trên trình duyệt. Chưa xác nhận được việc thu hồi phiên trên máy chủ.'); }
    finally { setBusy(false); }
  }
  return <section className="settings-editor" aria-labelledby="account-session-heading">
    <header><h2 id="account-session-heading">Phiên đăng nhập hiện tại</h2><p>Đăng xuất tài khoản khỏi trình duyệt này.</p></header>
    <div className="settings-security-actions settings-session-action"><button type="button" disabled={busy} className="settings-button settings-button-secondary" onClick={logout}>{busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button></div>
    {notice && <p className="settings-inline-notice" role="status">{notice}</p>}
  </section>;
}
