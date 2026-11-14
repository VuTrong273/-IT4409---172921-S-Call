import { Link } from 'react-router';
import useAuthForm from './hooks/useAuthForm.js';
import { useLoginLanguage } from './loginLanguage.js';
import BrandPanel from './components/BrandPanel.jsx';
import AuthFooter from './components/AuthFooter.jsx';
import PasswordField from './components/PasswordField.jsx';
import './AuthPage.css';
import './LoginPage.css';

export default function LoginPage() {
  const { language, setLanguage, t } = useLoginLanguage(true);
  const { values, update, submit, busy, error, setError, passwordError } = useAuthForm('login');

  return <div className="auth-page auth-login">
    <main className="login-layout">
      <BrandPanel t={t} />
      <section className="login-form-panel">
        <div className="login-topbar">
          <Link to="/" className="login-mobile-logo"><img src="/favicon.svg" alt="" />S-Call</Link>
          <Link to="/" className="login-home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" /></svg>{t('Trang chủ')}
          </Link>
        </div>
        <div className="login-form-content">
          <h2 className="login-title">{t('Đăng nhập vào S-Call')}</h2>
          <div className="login-form-body">
            <form className="login-form" onSubmit={submit}>
              <div className="auth-field">
                <label htmlFor="login-identifier" className="auth-visually-hidden">{t('Email hoặc tên đăng nhập')}</label>
                <input id="login-identifier" name="identifier" className="auth-input" value={values.identifier} onChange={update('identifier')} autoComplete="username" autoCapitalize="none" spellCheck={false} required placeholder={t('Email hoặc tên đăng nhập')} />
              </div>
              <PasswordField t={t} label={t('Mật khẩu')} value={values.password} onChange={update('password')} autoComplete="current-password" error={passwordError} />
              {error && <div role="alert" className="auth-error">{t(error)}</div>}
              <button disabled={busy} className="auth-button auth-button-primary login-submit">{busy ? t('Đang xử lý...') : t('Đăng nhập')}</button>
            </form>
            <div className="login-forgot-password"><button type="button" onClick={() => setError('Chức năng khôi phục mật khẩu chưa khả dụng. Vui lòng thử lại sau.')}>{t('Quên mật khẩu?')}</button></div>
            <Link to="/register" className="auth-button auth-button-outline login-register-link">{t('Tạo tài khoản mới')}</Link>
          </div>
        </div>
      </section>
    </main>
    <AuthFooter language={language} setLanguage={setLanguage} t={t} />
  </div>;
}
