import { Link } from 'react-router';
import useAuthForm from './hooks/useAuthForm.js';
import { useLoginLanguage } from './loginLanguage.js';
import AuthFooter from './components/AuthFooter.jsx';
import PasswordField from './components/PasswordField.jsx';
import './AuthPage.css';
import './RegisterPage.css';

export default function RegisterPage() {
  const { language, setLanguage, t } = useLoginLanguage(true, true);
  const { values, update, submit, busy, error, passwordError } = useAuthForm('register');

  return <div className="auth-page auth-register">
    <main className="register-main">
      <section aria-labelledby="register-title" className="register-content">
        <Link to="/login" aria-label={t('Quay lại đăng nhập')} className="register-back-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </Link>
        <Link to="/" aria-label={t('S-Call — Trang chủ')} className="register-logo"><img src="/favicon.svg" alt="" />S-Call</Link>
        <h1 id="register-title" className="register-title">{t('Tạo tài khoản mới')}</h1>
        <p className="register-description">{t('Tạo tài khoản để trò chuyện và giữ liên lạc với những người bạn quan tâm.')}</p>
        <div className="register-form-body">
          <form className="register-form" onSubmit={submit}>
            <div className="auth-field">
              <label htmlFor="register-name" className="auth-label">{t('Họ và tên')}</label>
              <input id="register-name" name="displayName" className="auth-input" value={values.displayName} onChange={update('displayName')} autoComplete="name" maxLength={100} required placeholder={t('Họ và tên')} />
            </div>
            <div className="auth-field">
              <label htmlFor="register-email" className="auth-label">Email</label>
              <input id="register-email" name="email" className="auth-input" type="email" value={values.email} onChange={update('email')} autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required placeholder="Email" />
            </div>
            <div className="auth-field">
              <label htmlFor="register-username" className="auth-label">{t('Tên đăng nhập')}</label>
              <input id="register-username" name="username" className="auth-input" value={values.username} onChange={update('username')} autoComplete="username" autoCapitalize="none" spellCheck={false} minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]{3,30}" aria-describedby="register-username-hint" required placeholder={t('Tên đăng nhập')} />
              <p id="register-username-hint" className="auth-field-hint">{t('3–30 ký tự, gồm chữ cái, số, dấu chấm hoặc gạch dưới.')}</p>
            </div>
            <PasswordField showLabel t={t} label={t('Mật khẩu')} value={values.password} onChange={update('password')} autoComplete="new-password" error={passwordError} />
            <p className="auth-password-hint">{t('8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.')}</p>
            {error && <div role="alert" className="auth-error">{t(error)}</div>}
            <button disabled={busy} className="auth-button auth-button-primary register-submit">{busy ? t('Đang xử lý...') : t('Tạo tài khoản')}</button>
          </form>
          <div className="register-login-link"><Link className="auth-button auth-button-secondary" to="/login">{t('Tôi có tài khoản rồi')}</Link></div>
        </div>
      </section>
    </main>
    <AuthFooter language={language} setLanguage={setLanguage} t={t} />
  </div>;
}
