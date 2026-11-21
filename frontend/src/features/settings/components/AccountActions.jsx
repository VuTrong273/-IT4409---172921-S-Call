import { useState } from 'react';

export default function AccountActions() {
  const [notice, setNotice] = useState('');
  return <section className="settings-editor" aria-labelledby="account-session-heading">
    <header><h2 id="account-session-heading">Phiên đăng nhập hiện tại</h2><p>Đăng xuất tài khoản khỏi trình duyệt này.</p></header>
    <div className="settings-security-actions settings-session-action"><button type="button" className="settings-button settings-button-secondary" onClick={() => setNotice('Chưa kết nối máy chủ. Hiện chưa thể thực hiện đăng xuất tài khoản.')}>Đăng xuất</button></div>
    {notice && <p className="settings-inline-notice" role="status">{notice}</p>}
  </section>;
}
