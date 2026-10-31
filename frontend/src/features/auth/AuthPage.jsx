import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, setAccessToken } from '../../lib/api.js';

const inputClass = 'mt-2 w-full rounded-xl border border-outline-variant/60 bg-white px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-4 focus:ring-primary-fixed';

function BrandPanel() {
  return (
    <aside className="relative hidden min-h-full flex-col justify-between overflow-hidden bg-inverse-surface p-10 text-white lg:flex xl:p-14">
      <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-tertiary-container/20 blur-3xl" />
      <Link to="/" className="relative flex items-center gap-3 text-xl font-bold"><img src="/favicon.svg" alt="" className="h-10 w-10" />S-Call</Link>
      <div className="relative max-w-md py-16">
        <span className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-primary-fixed">Gần nhau hơn, dù ở bất cứ đâu</span>
        <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight">Mọi cuộc trò chuyện đều bắt đầu từ đây.</h1>
        <p className="mt-6 text-base leading-7 text-primary-fixed/70">Nhắn tin, chia sẻ khoảnh khắc và gọi cho những người quan trọng với bạn.</p>
        <div className="mt-10 flex items-center gap-3 text-sm text-primary-fixed/70"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">✦</span>Riêng tư · Tức thì · Luôn kết nối</div>
      </div>
      <p className="relative text-xs text-primary-fixed/45">© 2026 S-Call</p>
    </aside>
  );
}

function PasswordField({ label = 'Mật khẩu', value, onChange, autoComplete, error }) {
  const [visible, setVisible] = useState(false);
  return <div>
    <label className="block text-sm font-medium text-on-surface-variant">{label}</label>
    <div className="relative">
      <input className={`${inputClass} pr-16`} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required />
      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-outline hover:text-primary" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{visible ? 'Ẩn' : 'Hiện'}</button>
    </div>
    {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
  </div>;
}

function AuthShell({ children, title, subtitle, footer }) {
  return <main className="grid min-h-screen bg-white lg:grid-cols-[0.95fr_1.05fr]">
    <BrandPanel />
    <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-24">
      <div className="flex items-center justify-between lg:justify-end"><Link to="/" className="flex items-center gap-2 text-sm font-bold text-on-surface lg:hidden"><img src="/favicon.svg" alt="" className="h-8 w-8" />S-Call</Link><Link to="/" className="text-sm text-secondary transition hover:text-primary">← Về trang chủ</Link></div>
      <div className="m-auto w-full max-w-md py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-container">Chào mừng đến với S-Call</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-secondary">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-7 text-center text-sm text-secondary">{footer}</div>
      </div>
      <div className="text-center text-xs text-outline">Kết nối dễ dàng trên mọi thiết bị</div>
    </section>
  </main>;
}

function apiErrorMessage(error) {
  if (error.code === 'INVALID_CREDENTIALS') return 'Email/username hoặc mật khẩu chưa chính xác.';
  if (error.code === 'ACCOUNT_BANNED') return 'Tài khoản hiện đã bị khóa. Vui lòng liên hệ quản trị viên.';
  if (error.code === 'EMAIL_TAKEN') return 'Email này đã được sử dụng.';
  if (error.code === 'USERNAME_TAKEN') return 'Tên đăng nhập này đã được sử dụng.';
  if (error.status === 400) return error.message || 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.';
  if (error instanceof TypeError) return 'Không thể kết nối máy chủ. Hãy kiểm tra backend rồi thử lại.';
  return error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

function AuthForm({ mode }) {
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
      navigate('/app');
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return <AuthShell
    title={isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
    subtitle={isRegister ? 'Tạo tài khoản miễn phí để bắt đầu kết nối.' : 'Rất vui được gặp lại bạn. Đăng nhập để tiếp tục.'}
    footer={isRegister ? <>Đã có tài khoản? <Link className="font-semibold text-primary hover:text-on-primary-fixed-variant" to="/login">Đăng nhập</Link></> : <>Chưa có tài khoản? <Link className="font-semibold text-primary hover:text-on-primary-fixed-variant" to="/register">Tạo tài khoản</Link></>}
  >
    <form className="space-y-5" onSubmit={submit}>
      {isRegister ? <>
        <div><label className="block text-sm font-medium text-on-surface-variant">Họ tên hiển thị</label><input className={inputClass} value={values.displayName} onChange={update('displayName')} autoComplete="name" maxLength={100} required placeholder="Nguyễn Minh Anh" /></div>
        <div><label className="block text-sm font-medium text-on-surface-variant">Email</label><input className={inputClass} type="email" value={values.email} onChange={update('email')} autoComplete="email" maxLength={254} required placeholder="ban@email.com" /></div>
        <div><label className="block text-sm font-medium text-on-surface-variant">Tên đăng nhập</label><input className={inputClass} value={values.username} onChange={update('username')} autoComplete="username" minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]{3,30}" required placeholder="minhanh_01" /><p className="mt-1.5 text-xs text-outline">3–30 ký tự, gồm chữ cái, số, dấu chấm hoặc gạch dưới.</p></div>
      </> : <div><label className="block text-sm font-medium text-on-surface-variant">Email hoặc tên đăng nhập</label><input className={inputClass} value={values.identifier} onChange={update('identifier')} autoComplete="username" required placeholder="ban@email.com hoặc username" /></div>}
      <PasswordField value={values.password} onChange={update('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} error={passwordError} />
      {!isRegister && <div className="-mt-2 text-right"><button type="button" onClick={() => setError('Luồng quên mật khẩu sẽ được kết nối khi form OTP được xây dựng.')} className="text-xs font-medium text-primary hover:text-on-primary-fixed">Quên mật khẩu?</button></div>}
      {error && <div role="alert" className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm leading-5 text-on-error-container">{error}</div>}
      <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-fixed transition hover:bg-primary disabled:cursor-wait disabled:opacity-60">{busy ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'} {!busy && <span aria-hidden="true">→</span>}</button>
    </form>
    {isRegister && <p className="mt-5 text-center text-xs leading-5 text-outline">Bằng việc tạo tài khoản, bạn đồng ý sử dụng S-Call một cách văn minh và an toàn.</p>}
  </AuthShell>;
}

export function LoginPage() { return <AuthForm mode="login" />; }
export function RegisterPage() { return <AuthForm mode="register" />; }
