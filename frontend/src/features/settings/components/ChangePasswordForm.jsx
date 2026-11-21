import { useState } from 'react';
import SettingsPasswordField from './SettingsPasswordField.jsx';

const emptyValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors({});
    setNotice('');
  }
  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.currentPassword) nextErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    if (values.newPassword.length < 8 || values.newPassword.length > 72 || !/^(?=.*[A-Za-z])(?=.*\d).+$/.test(values.newPassword)) nextErrors.newPassword = 'Mật khẩu cần 8–72 ký tự, có ít nhất một chữ cái và một chữ số.';
    if (values.confirmPassword !== values.newPassword) nextErrors.confirmPassword = 'Mật khẩu nhập lại chưa khớp.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setValues(emptyValues);
    setNotice('Chưa kết nối máy chủ. Mật khẩu chưa được thay đổi.');
  }
  return <section className="settings-editor" aria-labelledby="settings-password-heading">
    <header><h2 id="settings-password-heading">Đổi mật khẩu</h2><p>Sau khi đổi mật khẩu thành công, các phiên đăng nhập khác sẽ kết thúc. Phiên hiện tại được giữ lại.</p></header>
    <form onSubmit={submit}>
      <div className="settings-fields">
        <SettingsPasswordField label="Mật khẩu hiện tại" name="currentPassword" value={values.currentPassword} onChange={(value) => update('currentPassword', value)} autoComplete="current-password" error={errors.currentPassword} />
        <SettingsPasswordField label="Mật khẩu mới" name="newPassword" value={values.newPassword} onChange={(value) => update('newPassword', value)} autoComplete="new-password" newPassword error={errors.newPassword} hint="8–72 ký tự, gồm ít nhất một chữ cái và một chữ số." />
        <SettingsPasswordField label="Nhập lại mật khẩu mới" name="confirmPassword" value={values.confirmPassword} onChange={(value) => update('confirmPassword', value)} autoComplete="new-password" error={errors.confirmPassword} />
      </div>
      {notice && <p className="settings-inline-notice" role="status">{notice}</p>}
      <div className="settings-security-actions"><button type="submit" className="settings-button settings-button-primary">Đổi mật khẩu</button></div>
    </form>
  </section>;
}
