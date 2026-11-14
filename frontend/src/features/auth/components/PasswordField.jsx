import { useId, useState } from 'react';

export default function PasswordField({ value, onChange, label, autoComplete, error, showLabel = false, t }) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  function handleChange(event) {
    if (!event.target.value) setVisible(false);
    onChange(event);
  }

  return <div className="auth-field">
    <label htmlFor={inputId} className={showLabel ? 'auth-label' : 'auth-visually-hidden'}>{label}</label>
    <div className="auth-password-control">
      <input
        id={inputId} name="password" autoCapitalize="none" spellCheck={false}
        className="auth-input auth-password-input"
        type={visible && value ? 'text' : 'password'} value={value} onChange={handleChange}
        autoComplete={autoComplete} placeholder={label} aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined} required
      />
      {value.length > 0 && <button
        type="button" className="auth-password-toggle"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
        aria-pressed={visible} aria-controls={inputId}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {!visible ? <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.5 5.3A11.5 11.5 0 0 1 12 5c7 0 10 7 10 7a16 16 0 0 1-3.1 4.2M6.3 6.3A17 17 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.7-1.7" /></> : <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
        </svg>
      </button>}
    </div>
    {error && <p id={errorId} className="auth-field-error">{error}</p>}
  </div>;
}
