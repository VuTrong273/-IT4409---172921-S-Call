import { useId, useState } from 'react';

export default function SettingsPasswordField({ label, name, value, onChange, autoComplete, error, hint, newPassword = false }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return <div className="settings-field">
    <label htmlFor={id}>{label}</label>
    <div className="settings-password-control">
      <input id={id} name={name} type={visible && value ? 'text' : 'password'} value={value}
        onChange={(event) => { if (!event.target.value) setVisible(false); onChange(event.target.value); }}
        autoComplete={autoComplete} autoCapitalize="none" spellCheck={false} required
        minLength={newPassword ? 8 : undefined} maxLength={newPassword ? 72 : undefined}
        pattern={newPassword ? '(?=.*[A-Za-z])(?=.*[0-9]).+' : undefined}
        placeholder={label} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-help` : undefined} />
      {value && <button type="button" className="settings-password-toggle" aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible} aria-controls={id} onMouseDown={(event) => event.preventDefault()} onClick={() => setVisible((current) => !current)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {visible ? <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></> : <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.5 5.3A11.5 11.5 0 0 1 12 5c7 0 10 7 10 7a16 16 0 0 1-3.1 4.2M6.3 6.3A17 17 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.7-1.7" />}
        </svg>
      </button>}
    </div>
    {(error || hint) && <small id={`${id}-help`} className={error ? 'settings-error' : ''}>{error || hint}</small>}
  </div>;
}
