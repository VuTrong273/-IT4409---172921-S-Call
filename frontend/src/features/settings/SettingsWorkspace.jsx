import { Avatar } from '../conversations/components/ChatPrimitives.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import './SettingsWorkspace.css';

export default function SettingsWorkspace({ profile, onSave }) {
  return <main className="settings-workspace" aria-labelledby="settings-title">
    <header className="settings-header"><h1 id="settings-title">Cài đặt tài khoản</h1></header>
    <div className="settings-scroll">
      <div className="settings-content">
        <aside className="settings-profile-card" aria-label="Hồ sơ hiện tại">
          <Avatar contact={profile} />
          <h2>{profile.displayName || 'Hồ sơ của bạn'}</h2>
          {profile.username && <p className="settings-username">@{profile.username}</p>}
          {profile.bio && <p className="settings-profile-bio">{profile.bio}</p>}
        </aside>
        <section className="settings-editor" aria-labelledby="settings-personal-heading">
          <header><h2 id="settings-personal-heading">Thông tin cá nhân</h2><p>Quản lý cách bạn xuất hiện trên S-Call.</p></header>
          <ProfileForm profile={profile} onSave={onSave} />
        </section>
      </div>
    </div>
  </main>;
}
