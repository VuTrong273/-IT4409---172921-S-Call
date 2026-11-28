import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useLoginLanguage } from './loginLanguage.js';
import AuthFooter from './components/AuthFooter.jsx';
import PasswordField from './components/PasswordField.jsx';
import { requestRegistrationCode, verifyRegistrationCode, discardRegistrationCode } from './registrationService.js';
import './AuthPage.css';
import './RegisterPage.css';

export default function ForgotPasswordPage() {
  const { language, setLanguage, t } = useLoginLanguage(true);
  const text = (vi, en) => language === 'en' ? en : vi;
  const [stage, setStage] = useState('request');
  const [identifier, setIdentifier] = useState('');
  const [challenge, setChallenge] = useState(null);
  const challengeRef = useRef(null);
  const pending = useRef(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => () => discardRegistrationCode(challengeRef.current), []);
  useEffect(() => {
    if (stage !== 'verify') return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [stage]);
  useEffect(() => {
    const before = document.title;
    document.title = text('Khôi phục mật khẩu | S-Call', 'Password recovery | S-Call');
    return () => { document.title = before; };
  }, [language]);
  const remaining = challenge ? Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000)) : 0;
  const resendIn = challenge ? Math.max(0, Math.ceil((challenge.resendAt - now) / 1000)) : 0;
  async function run(action) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError('');
    try { await action(); } catch (failure) { setError(t(failure.message)); }
    finally { pending.current = false; setBusy(false); }
  }
  async function requestCode() {
    const next = await requestRegistrationCode({ email: identifier.trim(), ttlSeconds: 600 });
    discardRegistrationCode(challengeRef.current);
    challengeRef.current = next.id; setChallenge(next); setCode(''); setNow(Date.now()); setStage('verify');
  }
  function request(event) {
    event.preventDefault();
    if (!identifier.trim()) { setError(text('Vui lòng nhập email hoặc tên đăng nhập.', 'Please enter an email or username.')); return; }
    return run(requestCode);
  }
  function verify(event) {
    event.preventDefault();
    return run(async () => { await verifyRegistrationCode(challenge.id, code); setCode(''); setStage('reset'); });
  }
  function reset(event) {
    event.preventDefault(); setError('');
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,72}$/.test(password)) { setError(t('Mật khẩu cần 8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.')); return; }
    if (password !== confirm) { setError(text('Mật khẩu nhập lại chưa khớp.', 'The passwords do not match.')); return; }
    setPassword(''); setConfirm(''); setStage('success');
  }
  function restart() {
    discardRegistrationCode(challengeRef.current); challengeRef.current = null;
    setStage('request'); setChallenge(null); setCode(''); setError('');
  }
  const titles = {
    request: text('Quên mật khẩu?', 'Forgot your password?'),
    verify: text('Nhập mã xác minh', 'Enter verification code'),
    reset: text('Đặt mật khẩu mới', 'Set a new password'),
    success: text('Hoàn tất bản demo', 'Demo complete'),
  };
  return <div className="auth-page"><main className="register-main"><section className="register-content" aria-labelledby="recovery-title">
    <Link to="/login" className="register-back-link" aria-label={t('Quay lại đăng nhập')}>←</Link>
    <Link to="/" className="register-logo"><img src="/favicon.svg" alt="" />S-Call</Link>
    <h1 id="recovery-title" className="register-title">{titles[stage]}</h1>
    <p className="register-description">{stage === 'request' ? text('Nhập email hoặc tên đăng nhập để nhận mã khôi phục.', 'Enter your email or username to request a recovery code.') : stage === 'verify' ? text('Nếu tài khoản tồn tại, mã sẽ được gửi đến email đã đăng ký.', 'If the account exists, a code will be sent to its registered email.') : stage === 'reset' ? text('Chọn mật khẩu mới và nhập lại để xác nhận.', 'Choose a new password and confirm it.') : text('Bạn đã hoàn tất luồng thử nghiệm. Mật khẩu thật chưa được thay đổi.', 'You have completed the demo flow. Your actual password has not changed.')}</p>
    <div className="registration-demo" role="note">{text('Chế độ demo: không gửi email hoặc thay đổi mật khẩu thật.', 'Demo mode: no email is sent and no actual password is changed.')}</div>
    <div className="register-form-body">
      {stage === 'request' && <form className="register-form" onSubmit={request}><div><label className="auth-label" htmlFor="recovery-identifier">{t('Email hoặc tên đăng nhập')}</label><input id="recovery-identifier" className="auth-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} /></div>{error && <div className="auth-error" role="alert">{error}</div>}<button disabled={busy} className="auth-button auth-button-primary">{busy ? t('Đang xử lý...') : text('Gửi mã xác minh', 'Send verification code')}</button></form>}
      {stage === 'verify' && <><form className="register-form" onSubmit={verify}><div className="registration-demo-code">{text('Mã OTP demo:', 'Demo OTP:')}<strong>{challenge.demoCode}</strong><span>{identifier}</span></div><div><label htmlFor="recovery-code" className="auth-label">{text('Mã xác minh', 'Verification code')}</label><input key={challenge.id} id="recovery-code" className="auth-input registration-otp" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoFocus aria-describedby="recovery-expiry" /><p id="recovery-expiry" className="auth-field-hint">{remaining ? text('Mã hết hạn sau ', 'Code expires in ') + `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : text('Mã đã hết hạn. Hãy gửi lại mã.', 'Code expired. Request a new code.')}</p></div>{error && <div className="auth-error" role="alert">{error}</div>}<button disabled={busy || !remaining || code.length !== 6} className="auth-button auth-button-primary">{text('Xác minh', 'Verify')}</button></form><div className="registration-otp-actions"><button type="button" disabled={busy || resendIn > 0} onClick={() => { if (Date.now() >= challenge.resendAt) run(requestCode); }}>{resendIn ? text('Gửi lại sau ', 'Resend in ') + `${resendIn}s` : text('Gửi lại mã', 'Resend code')}</button><button type="button" onClick={restart} disabled={busy}>{text('Đổi email / tên đăng nhập', 'Change email / username')}</button></div></>}
      {stage === 'reset' && <form className="register-form" onSubmit={reset}><PasswordField showLabel t={t} label={text('Mật khẩu mới', 'New password')} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /><p className="auth-field-hint">{t('8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.')}</p><PasswordField showLabel t={t} label={text('Nhập lại mật khẩu', 'Confirm password')} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />{error && <div className="auth-error" role="alert">{error}</div>}<button className="auth-button auth-button-primary">{text('Lưu mật khẩu mới', 'Save new password')}</button></form>}
      {stage === 'success' && <Link to="/login" className="auth-button auth-button-primary">{text('Về trang đăng nhập', 'Back to login')}</Link>}
    </div>
  </section></main><AuthFooter language={language} setLanguage={setLanguage} t={t} /></div>;
}
