import { useEffect, useRef, useState } from 'react';
import { discardRegistrationCode, requestRegistrationCode, verifyRegistrationCode } from '../registrationService.js';

export default function useRegistration() {
  const [values, setValues] = useState({ displayName: '', email: '', username: '', password: '' });
  const [stage, setStage] = useState('details');
  const [challenge, setChallenge] = useState(null);
  const challengeId = useRef(null);
  const pending = useRef(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [now, setNow] = useState(Date.now());
  useEffect(() => () => discardRegistrationCode(challengeId.current), []);
  useEffect(() => {
    if (stage !== 'verify') return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [stage]);
  const update = (key) => (event) => { setValues((current) => ({ ...current, [key]: event.target.value })); setError(''); setPasswordError(''); };

  async function send() {
    const result = await requestRegistrationCode({ ...values, email: values.email.trim() });
    discardRegistrationCode(challengeId.current);
    challengeId.current = result.id;
    setChallenge(result);
    setCode('');
    setNow(Date.now());
    setStage('verify');
    setValues((current) => ({ ...current, password: '' }));
  }
  async function run(action) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError('');
    try { await action(); } catch (failure) { setError(failure.message); }
    finally { pending.current = false; setBusy(false); }
  }
  function submit(event) {
    event.preventDefault(); setError(''); setPasswordError('');
    if (!values.displayName.trim()) { setError('Vui lòng nhập họ và tên.'); return; }
    if (!/^[A-Za-z0-9_.]{3,30}$/.test(values.username)) { setError('Tên đăng nhập cần 3–30 ký tự: chữ cái, số, dấu chấm hoặc gạch dưới.'); return; }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,72}$/.test(values.password)) { setPasswordError('Mật khẩu cần 8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.'); return; }
    return run(send);
  }
  const remaining = challenge ? Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000)) : 0;
  const resendIn = challenge ? Math.max(0, Math.ceil((challenge.resendAt - now) / 1000)) : 0;
  function verify(event) {
    event.preventDefault();
    return run(async () => { await verifyRegistrationCode(challenge.id, code); setStage('success'); });
  }
  function resend() {
    if (!challenge || Date.now() < challenge.resendAt) return;
    return run(send);
  }
  function edit() {
    discardRegistrationCode(challengeId.current);
    challengeId.current = null; setChallenge(null); setStage('details'); setCode(''); setError('');
  }
  return { values, update, submit, busy, error, passwordError, stage, code, setCode, challenge, remaining, resendIn, verify, resend, edit };
}
