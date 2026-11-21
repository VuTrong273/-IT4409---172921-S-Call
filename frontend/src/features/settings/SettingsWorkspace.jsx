import { NavLink, useSearchParams } from 'react-router';
import { WORKSPACE_PATHS } from '../../app/workspaceRoutes.js';
import AppearanceSettings from './components/AppearanceSettings.jsx';
import NotificationSettings from './components/NotificationSettings.jsx';
import PrivacySettings from './components/PrivacySettings.jsx';
import SettingsIcon from './components/SettingsIcon.jsx';
import ChangePasswordForm from './components/ChangePasswordForm.jsx';
import DeactivateAccount from './components/DeactivateAccount.jsx';
import GeneralSettings from './components/GeneralSettings.jsx';
import CallSettings from './components/CallSettings.jsx';
import AccountActions from './components/AccountActions.jsx';
import './components/SettingsControls.css';
import './SettingsWorkspace.css';

const sections = [
  { id: 'general', label: 'Cài đặt chung', icon: 'general' },
  { id: 'security', label: 'Tài khoản và bảo mật', icon: 'security' },
  { id: 'privacy', label: 'Quyền riêng tư', icon: 'privacy' },
  { id: 'appearance', label: 'Giao diện', icon: 'appearance' },
  { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
  { id: 'calls', label: 'Cài đặt cuộc gọi', icon: 'calls' },
];

export default function SettingsWorkspace({ profile, theme, onThemeChange, preferences, onPreferenceChange }) {
  const [params] = useSearchParams();
  const current = sections.find((item) => item.id === params.get('section')) || sections[0];
  return <section className="settings-workspace" aria-label="Cài đặt ứng dụng">
    <aside className="settings-navigation">
      <header><h1>Cài đặt</h1></header>
      <nav aria-label="Các mục cài đặt">{sections.map((item) => <NavLink key={item.id}
        to={WORKSPACE_PATHS.settings + '?section=' + item.id} aria-current={current.id === item.id ? 'page' : false}
        className={'settings-nav-item ' + (current.id === item.id ? 'is-selected' : '')}>
        <SettingsIcon name={item.icon} /><span>{item.label}</span>
      </NavLink>)}</nav>
    </aside>
    <main className="settings-main" aria-labelledby="settings-title">
      <header className="settings-header"><h2 id="settings-title">{current.label}</h2></header>
      <div className="settings-scroll"><div className="settings-content" key={current.id}>
        {current.id === 'general' && <GeneralSettings preferences={preferences} onPreferenceChange={onPreferenceChange} />}
        {current.id === 'appearance' && <AppearanceSettings theme={theme} onThemeChange={onThemeChange} preferences={preferences} onPreferenceChange={onPreferenceChange} />}
        {current.id === 'calls' && <CallSettings />}
        {current.id === 'notifications' && <NotificationSettings />}
        {current.id === 'privacy' && <PrivacySettings />}
        {current.id === 'security' && <div className="settings-sections">
          <ChangePasswordForm />
          <AccountActions />
          <DeactivateAccount role={profile.role} />
        </div>}
      </div></div>
    </main>
  </section>;
}
