import { Link, NavLink } from 'react-router';
import { WORKSPACE_PATHS } from '../../../app/workspaceRoutes.js';
import { asset } from '../chatAssets.js';
import { Avatar, Icon } from './ChatPrimitives.jsx';

const navigation = [['chat', 'Tin nhắn'], ['friends', 'Bạn bè'], ['calls', 'Cuộc gọi']];

export default function ChatSidebar({ tab, dark, onTabChange, onToggleTheme, profile }) {
  return <nav className="chat-rail" aria-label="Điều hướng ứng dụng">
    <Link className="chat-brand" to="/" aria-label="S-Call — Trang chủ"><img src="/favicon.svg" alt="S-Call" width="44" height="44" /></Link>
    <div className="chat-rail-links">
      {navigation.map(([name, label]) => <NavLink
        key={name} to={WORKSPACE_PATHS[name]} title={label} aria-label={label}
        className={`chat-icon-button ${tab === name ? 'is-active' : ''}`}
        onClick={(event) => { if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) onTabChange(); }}
      ><Icon name={name} /></NavLink>)}
      <img src={asset('31ae3.svg')} alt="" className="chat-rail-divider" />
      <NavLink to={WORKSPACE_PATHS.settings} className={`chat-icon-button ${tab === 'settings' ? 'is-active' : ''}`} aria-label="Cài đặt tài khoản" title="Cài đặt tài khoản" onClick={onTabChange}><Icon name="settings" /></NavLink>
    </div>
    <div className="chat-rail-bottom">
      <button type="button" className={`chat-theme-switch ${dark ? 'is-dark' : ''}`} role="switch" aria-checked={dark} aria-label="Giao diện tối" onClick={onToggleTheme}><img src={asset('9ded2.svg')} alt="" /></button>
      <NavLink to={WORKSPACE_PATHS.settings} className="chat-profile" aria-label="Hồ sơ cá nhân" title="Hồ sơ cá nhân" onClick={onTabChange}><Avatar contact={profile} /></NavLink>
    </div>
  </nav>;
}
