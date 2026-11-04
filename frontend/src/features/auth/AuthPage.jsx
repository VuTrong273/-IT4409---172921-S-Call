import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, setAccessToken } from '../../lib/api.js';

const loginInputClass = 'login-input w-full h-[52px] rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface transition-colors placeholder:text-secondary';

const inputClass = 'mt-2 w-full rounded-xl border border-outline-variant/60 bg-white px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-4 focus:ring-primary-fixed';

function BrandPanel({ compact = false }) {
  if (compact) return <aside className="hidden min-h-screen flex-col border-r border-outline-variant/60 bg-white p-8 text-on-surface lg:flex xl:p-10">
    <Link to="/" aria-label="S-Call — Trang chủ" className="inline-flex w-fit items-center gap-3 text-xl font-semibold"><img src="/favicon.svg" alt="" className="h-12 w-12" />S-Call</Link>
    <div className="my-auto grid items-center gap-4 py-10 xl:grid-cols-[0.85fr_1.35fr] xl:gap-0">
      <h1 className="max-w-lg text-4xl font-semibold leading-[1.15] tracking-tight xl:relative xl:z-10 xl:text-[clamp(2.5rem,3.2vw,3.75rem)]">Nơi dành cho những cuộc trò chuyện <span className="text-primary-container">có ý nghĩa.</span></h1>
      <img src="/images/auth-connections.png" alt="" className="mx-auto w-full max-w-[620px] object-contain" width="1254" height="1254" />
    </div>
  </aside>;
  return (
    <aside className="relative hidden min-h-full flex-col justify-between overflow-hidden bg-inverse-surface p-10 text-white lg:flex xl:p-14">
      <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-tertiary-container/20 blur-3xl" />
      <Link to="/" className="relative flex items-center gap-3 text-xl font-bold"><img src="/favicon.svg" alt="" className="h-10 w-10" />S-Call</Link>
      <div className="relative max-w-md py-16">
        <span className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-primary-fixed">Gần nhau hơn, dù ở bất cứ đâu</span>
        <h1 className={compact ? "max-w-sm text-4xl font-semibold leading-[1.2] tracking-tight" : "text-5xl font-semibold leading-[1.1] tracking-tight"}>Mọi cuộc trò chuyện đều bắt đầu từ đây.</h1>
        <p className="mt-6 text-base leading-7 text-primary-fixed/70">Nhắn tin, chia sẻ khoảnh khắc và gọi cho những người quan trọng với bạn.</p>
        <div className="mt-10 flex items-center gap-3 text-sm text-primary-fixed/70"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">✦</span>Riêng tư · Tức thì · Luôn kết nối</div>
      </div>
      <p className="relative text-xs text-primary-fixed/45">© 2026 S-Call</p>
    </aside>
  );
}

function PasswordField({ label = 'Mật khẩu', value, onChange, autoComplete, error, compact = false }) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  function handleChange(event) {
    if (!event.target.value) setVisible(false);
    onChange(event);
  }
  return <div>
    <label htmlFor={inputId} className={compact ? 'sr-only' : 'block text-sm font-medium text-on-surface-variant'}>{label}</label>
    <div className="relative">
      <input id={inputId} className={`${compact ? loginInputClass : inputClass} pr-14`} type={visible && value ? 'text' : 'password'} value={value} onChange={handleChange} autoComplete={autoComplete} placeholder={compact ? label : undefined} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} required />
      {value.length > 0 && <button type="button" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-secondary transition hover:bg-primary-fixed hover:text-primary focus-visible:outline-2 focus-visible:outline-primary-container" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible} aria-controls={inputId}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {visible ? <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.5 5.3A11.5 11.5 0 0 1 12 5c7 0 10 7 10 7a16 16 0 0 1-3.1 4.2M6.3 6.3A17 17 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.7-1.7" /></> : <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
        </svg>
      </button>}
    </div>
    {error && <p id={errorId} className="mt-1.5 text-xs text-error">{error}</p>}
  </div>;
}

function AuthShell({ children, title, subtitle, footer, compact = false }) {
  return <main className={`${compact ? 'auth-login lg:grid-cols-2 xl:grid-cols-[1.6fr_1fr]' : 'lg:grid-cols-[0.95fr_1.05fr]'} grid min-h-screen bg-white`}>
    <BrandPanel compact={compact} />
    <section className={compact ? "flex min-h-screen flex-col px-5 py-6 sm:px-8 xl:px-12" : "flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-24"}>
      <div className="flex items-center justify-between lg:justify-end"><Link to="/" className="flex items-center gap-2 text-sm font-bold text-on-surface lg:hidden"><img src="/favicon.svg" alt="" className="h-8 w-8" />S-Call</Link><Link to="/" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-outline-variant/60 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary-container hover:bg-primary-fixed/50 hover:text-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" /></svg>Trang chủ
      </Link></div>
      <div className={compact ? "m-auto w-full max-w-[620px] py-10" : "m-auto w-full max-w-md py-12"}>
        {!compact && <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-container">Chào mừng đến với S-Call</p>}
        <h2 className={compact ? "text-xl font-semibold tracking-tight text-on-surface" : "mt-3 text-3xl font-semibold tracking-tight text-on-surface"}>{title}</h2>
        {subtitle && <p className="mt-2 text-sm leading-6 text-secondary">{subtitle}</p>}
        <div className={compact ? "mt-6" : "mt-8"}>{children}</div>
        {footer && <div className="mt-7 text-center text-sm text-secondary">{footer}</div>}
      </div>
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
    compact={!isRegister}
    title={isRegister ? 'Tạo tài khoản' : 'Đăng nhập vào S-Call'}
    subtitle={isRegister ? 'Tạo tài khoản miễn phí để bắt đầu kết nối.' : undefined}
    footer={isRegister ? <>Đã có tài khoản? <Link className="font-semibold text-primary hover:text-on-primary-fixed-variant" to="/login">Đăng nhập</Link></> : null}
  >
    <form className={isRegister ? "space-y-5" : "space-y-3"} onSubmit={submit}>
      {isRegister ? <>
        <div><label className="block text-sm font-medium text-on-surface-variant">Họ tên hiển thị</label><input className={inputClass} value={values.displayName} onChange={update('displayName')} autoComplete="name" maxLength={100} required placeholder="Nguyễn Minh Anh" /></div>
        <div><label className="block text-sm font-medium text-on-surface-variant">Email</label><input className={inputClass} type="email" value={values.email} onChange={update('email')} autoComplete="email" maxLength={254} required placeholder="ban@email.com" /></div>
        <div><label className="block text-sm font-medium text-on-surface-variant">Tên đăng nhập</label><input className={inputClass} value={values.username} onChange={update('username')} autoComplete="username" minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]{3,30}" required placeholder="minhanh_01" /><p className="mt-1.5 text-xs text-outline">3–30 ký tự, gồm chữ cái, số, dấu chấm hoặc gạch dưới.</p></div>
      </> : <div><label htmlFor="login-identifier" className="sr-only">Email hoặc tên đăng nhập</label><input id="login-identifier" name="identifier" className={loginInputClass} value={values.identifier} onChange={update('identifier')} autoComplete="username" autoCapitalize="none" spellCheck={false} required placeholder="Email hoặc tên đăng nhập" /></div>}
      <PasswordField compact={!isRegister} value={values.password} onChange={update('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} error={passwordError} />
      {error && <div role="alert" className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm leading-5 text-on-error-container">{error}</div>}
      <button disabled={busy} className={`${isRegister ? "mt-3 min-h-12 py-3 text-base" : "mt-6 min-h-[50px] py-3 text-base"} flex w-full items-center justify-center rounded-full bg-primary-container px-4 font-semibold text-white transition hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container disabled:cursor-wait disabled:opacity-60`}>{busy ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</button>
    </form>
    {!isRegister && <>
      <div className="mt-4 text-center"><button type="button" onClick={() => setError('Chức năng khôi phục mật khẩu chưa khả dụng. Vui lòng thử lại sau.')} className="min-h-11 rounded-lg px-3 text-sm text-on-surface transition hover:text-primary">Quên mật khẩu?</button></div>
      <Link to="/register" className="mt-12 flex min-h-[50px] w-full items-center justify-center rounded-full border border-primary-container px-4 py-3 text-base font-medium text-primary transition hover:bg-primary-fixed">Tạo tài khoản mới</Link>
    </>}
    {isRegister && <p className="mt-5 text-center text-xs leading-5 text-outline">Bằng việc tạo tài khoản, bạn đồng ý sử dụng S-Call một cách văn minh và an toàn.</p>}
  </AuthShell>;
}

export function LoginPage() { return <AuthForm mode="login" />; }
export function RegisterPage() { return <AuthForm mode="register" />; }
