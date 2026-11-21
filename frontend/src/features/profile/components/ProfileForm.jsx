import { useState } from 'react';
import ProfileAvatarEditor from './ProfileAvatarEditor.jsx';

export default function ProfileForm({ profile, onSave }) {
  const [draft, setDraft] = useState(profile);
  const [readingImage, setReadingImage] = useState(false);
  const [error, setError] = useState('');
  const dirty = ['displayName', 'bio', 'avatarUrl'].some((key) => draft[key] !== profile[key]);
  function update(key, value) { setDraft((current) => ({ ...current, [key]: value })); setError(''); }
  function submit(event) {
    event.preventDefault();
    if (readingImage) return;
    const displayName = draft.displayName.trim();
    if (!displayName) { setError('Vui lòng nhập tên hiển thị.'); return; }
    const next = { ...draft, displayName, bio: draft.bio.trim() };
    onSave(next);
    setDraft(next);
    setError('');
  }
  return <form className="settings-form" onSubmit={submit}>
    <ProfileAvatarEditor profile={draft} onChange={(value) => update('avatarUrl', value)} onBusyChange={setReadingImage} />
    <div className="settings-fields">
      <label className="settings-field" htmlFor="profile-name"><span>Tên hiển thị</span>
        <input id="profile-name" name="displayName" value={draft.displayName} onChange={(event) => update('displayName', event.target.value)} placeholder="Nhập tên của bạn" maxLength={100} autoComplete="name" required aria-invalid={!!error} aria-describedby={error ? 'profile-name-error' : undefined} />
        {error && <small className="settings-error" id="profile-name-error" role="alert">{error}</small>}
      </label>
      <label className="settings-field" htmlFor="profile-bio"><span>Giới thiệu <small>Không bắt buộc</small></span>
        <textarea id="profile-bio" name="bio" value={draft.bio} onChange={(event) => update('bio', event.target.value)} placeholder="Viết đôi điều về bạn" maxLength={255} rows={3} aria-describedby="profile-bio-count" />
        <small id="profile-bio-count" className="settings-character-count">{draft.bio.length}/255</small>
      </label>
    </div>
    <section className="settings-account-info" aria-labelledby="settings-account-heading">
      <h3 id="settings-account-heading">Thông tin tài khoản</h3>
      <div className="settings-account-grid">
        <label className="settings-field" htmlFor="profile-username"><span>Tên đăng nhập</span><input id="profile-username" value={profile.username} placeholder="Chưa có thông tin" readOnly /></label>
        <label className="settings-field" htmlFor="profile-email"><span>Email</span><input id="profile-email" type="email" value={profile.email} placeholder="Chưa có thông tin" readOnly /></label>
      </div>
    </section>
    <footer className="settings-form-footer">
      <p>Thay đổi được lưu tạm trong phiên mở trang.</p>
      <div><button type="button" className="settings-button settings-button-secondary" disabled={!dirty || readingImage} onClick={() => { setDraft(profile); setError(''); }}>Hủy thay đổi</button><button type="submit" className="settings-button settings-button-primary" disabled={!dirty || readingImage}>Lưu thay đổi</button></div>
    </footer>
  </form>;
}
