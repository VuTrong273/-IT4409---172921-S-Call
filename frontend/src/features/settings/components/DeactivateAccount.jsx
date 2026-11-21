import { useState } from 'react';
import SettingsPasswordField from './SettingsPasswordField.jsx';

export default function DeactivateAccount({ role }) {
  const [expanded, setExpanded] = useState(false);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  if (role === 'admin' || role === 'super_admin') return null;
  function cancel() { setExpanded(false); setPassword(''); setNotice(''); }
  function submit(event) {
    event.preventDefault();
    if (!password) return;
    setPassword('');
    setNotice('Chưa kết nối máy chủ. Tài khoản chưa bị vô hiệu hóa.');
  }
  return <section className="settings-editor settings-deactivate" aria-labelledby="settings-deactivate-heading">
    <header><h2 id="settings-deactivate-heading">Vô hiệu hóa tài khoản</h2><p>Bạn sẽ được đăng xuất khỏi mọi thiết bị và hiển thị ngoại tuyến. Đăng nhập lại để kích hoạt lại tài khoản.</p></header>
    {!expanded ? <button type="button" className="settings-button settings-button-danger" aria-expanded={false} onClick={() => setExpanded(true)}>Vô hiệu hóa tài khoản</button> : <form onSubmit={submit}>
      <div className="settings-fields"><SettingsPasswordField label="Xác nhận mật khẩu" name="password" value={password} onChange={(value) => { setPassword(value); setNotice(''); }} autoComplete="current-password" hint="Nhập mật khẩu hiện tại để xác nhận yêu cầu vô hiệu hóa." /></div>
      {notice && <p className="settings-inline-notice" role="status">{notice}</p>}
      <div className="settings-security-actions"><button type="button" className="settings-button settings-button-secondary" onClick={cancel}>Hủy</button><button type="submit" className="settings-button settings-button-danger">Xác nhận vô hiệu hóa</button></div>
    </form>}
  </section>;
}
