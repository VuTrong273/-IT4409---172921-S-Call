import { useId, useRef, useState } from 'react';
import { Avatar } from '../../conversations/components/ChatPrimitives.jsx';

export default function ProfileAvatarEditor({ profile, onChange, onBusyChange }) {
  const inputRef = useRef(null);
  const errorId = useId();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function chooseImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError('Chọn ảnh JPG, PNG hoặc WebP có dung lượng tối đa 2 MB.');
      return;
    }
    setError('');
    setBusy(true);
    onBusyChange(true);
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        if (image.naturalWidth && image.naturalHeight) onChange(reader.result);
        else setError('Không đọc được ảnh. Vui lòng chọn ảnh khác.');
        finish();
      };
      image.onerror = () => { setError('Không đọc được ảnh. Vui lòng chọn ảnh khác.'); finish(); };
      image.src = reader.result;
    };
    reader.onerror = () => { setError('Không đọc được ảnh. Vui lòng chọn ảnh khác.'); finish(); };
    reader.readAsDataURL(file);
  }

  function finish() { setBusy(false); onBusyChange(false); }

  return <div className="settings-avatar-editor">
    <Avatar contact={profile} />
    <div className="settings-avatar-copy">
      <h3>Ảnh đại diện</h3>
      <p>JPG, PNG hoặc WebP · Tối đa 2 MB</p>
      <div className="settings-avatar-actions">
        <button type="button" className="settings-button settings-button-secondary" disabled={busy} onClick={() => inputRef.current?.click()}>{busy ? 'Đang đọc ảnh…' : 'Chọn ảnh'}</button>
        {profile.avatarUrl && <button type="button" className="settings-text-button" disabled={busy} onClick={() => { onChange(''); setError(''); }}>Xóa ảnh</button>}
      </div>
    </div>
    <input ref={inputRef} className="settings-file-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh đại diện" aria-describedby={error ? errorId : undefined} onChange={chooseImage} />
    {error && <p id={errorId} className="settings-error" role="alert">{error}</p>}
  </div>;
}
