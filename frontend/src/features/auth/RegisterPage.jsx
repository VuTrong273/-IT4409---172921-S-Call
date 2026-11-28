import { Link } from 'react-router';
import useRegistration from './hooks/useRegistration.js';
import { useLoginLanguage } from './loginLanguage.js';
import AuthFooter from './components/AuthFooter.jsx';
import PasswordField from './components/PasswordField.jsx';
import './AuthPage.css';
import './RegisterPage.css';

export default function RegisterPage() {
  const { language, setLanguage, t } = useLoginLanguage(true, true);
  const model = useRegistration();
  const { values, update, submit, busy, error, passwordError, stage } = model;
  const text = (vi, en) => language === 'en' ? en : vi;

  return <div className="auth-page auth-register">
    <main className="register-main">
      <section aria-labelledby="register-title" className="register-content">
        <Link to="/login" aria-label={t('Quay lại đăng nhập')} className="register-back-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </Link>
        <Link to="/" aria-label={t('S-Call — Trang chủ')} className="register-logo"><img src="/favicon.svg" alt="" />S-Call</Link>
        <h1 id="register-title" className="register-title">{stage === 'details' ? t('Tạo tài khoản mới') : stage === 'verify' ? text('Xác minh email', 'Verify your email') : text('Xác minh thành công', 'Verification complete')}</h1>
        <p className="register-description">{stage === 'details' ? t('Tạo tài khoản để trò chuyện và giữ liên lạc với những người bạn quan tâm.') : stage === 'verify' ? <>{text('Nhập mã 6 chữ số cho ', 'Enter the 6-digit code for ')}<strong>{model.challenge.email}</strong></> : text('Bạn đã hoàn tất luồng đăng ký giả lập.', 'You have completed the demo registration flow.')}</p>
        {stage !== 'details' && <div className="registration-demo" role="note">{text('Chế độ demo: chưa gửi email và chưa tạo tài khoản thật.', 'Demo mode: no email is sent and no real account is created.')}</div>}
        <div className="register-form-body">
          {stage === 'details' && <>
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
          </>}
          {stage === 'verify' && <>
            <form className="register-form" onSubmit={model.verify} aria-busy={busy}>
              <div className="registration-demo-code">{text('Mã OTP demo:', 'Demo OTP:')} <strong>{model.challenge.demoCode}</strong><span>{text('Chỉ dùng để thử giao diện.', 'For previewing this interface only.')}</span></div>
              <div className="auth-field"><label htmlFor="registration-otp" className="auth-label">{text('Mã xác minh', 'Verification code')}</label><input key={model.challenge.id} id="registration-otp" className="auth-input registration-otp" value={model.code} onChange={(event) => model.setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus aria-describedby="registration-otp-hint" placeholder="000000" disabled={busy} /><p id="registration-otp-hint" className="auth-field-hint">{model.remaining > 0 ? text('Mã có hiệu lực trong ', 'Code expires in ') + `${Math.floor(model.remaining / 60)}:${String(model.remaining % 60).padStart(2, '0')}` : text('Mã đã hết hạn. Vui lòng gửi lại mã mới.', 'This code has expired. Request a new code.')}</p></div>
              {error && <div role="alert" className="auth-error">{t(error)}</div>}
              <button disabled={busy || model.code.length !== 6 || !model.remaining} className="auth-button auth-button-primary">{busy ? t('Đang xử lý...') : text('Xác minh & hoàn tất', 'Verify & finish')}</button>
            </form>
            <div className="registration-otp-actions"><button type="button" disabled={busy || model.resendIn > 0} onClick={model.resend}>{model.resendIn > 0 ? text('Gửi lại sau ', 'Resend in ') + `${model.resendIn}s` : text('Gửi lại mã', 'Resend code')}</button><button type="button" disabled={busy} onClick={model.edit}>{text('Sửa thông tin đăng ký', 'Edit registration details')}</button></div>
          </>}
          {stage === 'success' && <div className="registration-success" role="status"><span aria-hidden="true">✓</span><p>{text('Email đã được xác minh trong bản demo. Bạn vẫn cần tài khoản thật để đăng nhập.', 'Email verified in this demo. You still need a real account to log in.')}</p><Link className="auth-button auth-button-primary" to="/login">{text('Về trang đăng nhập', 'Go to login')}</Link><button type="button" className="auth-button auth-button-secondary" onClick={model.edit}>{text('Thử lại luồng đăng ký', 'Try registration again')}</button></div>}
        </div>
      </section>
    </main>
    <AuthFooter language={language} setLanguage={setLanguage} t={t} />
  </div>;
}
