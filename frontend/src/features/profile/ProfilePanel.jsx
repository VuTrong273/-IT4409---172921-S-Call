import { Link } from 'react-router';
import { WORKSPACE_PATHS } from '../../app/workspaceRoutes.js';
import ProfileForm from './components/ProfileForm.jsx';
import '../settings/components/SettingsControls.css';
import './ProfilePanel.css';

export default function ProfilePanel({ profile, onSave }) {
  return <aside className="profile-panel" aria-labelledby="profile-title">
    <header className="profile-header">
      <Link to={WORKSPACE_PATHS.chat} className="chat-icon-button" aria-label="Quay lại tin nhắn">←</Link>
      <h1 id="profile-title">Hồ sơ của tôi</h1>
    </header>
    <div className="profile-scroll"><ProfileForm profile={profile} onSave={onSave} /></div>
  </aside>;
}
