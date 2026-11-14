import { WORKSPACE_PATHS } from '../../../app/workspaceRoutes.js';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api, setAccessToken } from '../../../lib/api.js';

function apiErrorMessage(error) {
  if (error.code === 'INVALID_CREDENTIALS') return 'Email/username hoặc mật khẩu chưa chính xác.';
  if (error.code === 'ACCOUNT_BANNED') return 'Tài khoản hiện đã bị khóa. Vui lòng liên hệ quản trị viên.';
  if (error.code === 'EMAIL_TAKEN') return 'Email này đã được sử dụng.';
  if (error.code === 'USERNAME_TAKEN') return 'Tên đăng nhập này đã được sử dụng.';
  if (error.status === 400) return error.message || 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.';
  if (error instanceof TypeError) return 'Không thể kết nối máy chủ. Hãy kiểm tra backend rồi thử lại.';
  return error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

export default function useAuthForm(mode) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', username: '', displayName: '', identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    setPasswordError('');
    if (isRegister && !/^(?=.*[A-Za-z])(?=.*\d).{8,72}$/.test(values.password)) {
      setPasswordError('Mật khẩu cần 8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.');
      return;
    }
    if (isRegister && !/^[A-Za-z0-9_.]{3,30}$/.test(values.username)) {
      setError('Tên đăng nhập cần 3–30 ký tự: chữ cái, số, dấu chấm hoặc gạch dưới.');
      return;
    }
    setBusy(true);
    try {
      const body = isRegister
        ? { email: values.email.trim(), username: values.username.trim(), displayName: values.displayName.trim(), password: values.password }
        : { identifier: values.identifier.trim(), password: values.password };
      const result = await api(isRegister ? '/auth/register' : '/auth/login', { method: 'POST', body });
      setAccessToken(result.tokens.accessToken);
      navigate(WORKSPACE_PATHS.chat);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return { values, update, submit, busy, error, setError, passwordError };
}
