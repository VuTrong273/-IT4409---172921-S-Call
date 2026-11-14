import { useState } from 'react';
import { asset, icons } from '../chatAssets.js';

export function Icon({ name }) { return <img src={asset(icons[name])} alt="" draggable="false" />; }
export function IconButton({ name, label, onClick, className = '', ...props }) {
  return <button type="button" className={`chat-icon-button ${className}`} title={label} aria-label={label} onClick={onClick} {...props}><Icon name={name} /></button>;
}
export function Avatar({ contact = {} }) {
  const [failedSource, setFailedSource] = useState(null);
  const image = contact.avatarUrl || contact.avatar;
  const source = image && (/^(https?:|blob:|data:|\/)/.test(image) ? image : asset(image));
  const name = contact.name || contact.displayName || contact.username || '';
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join('').toLocaleUpperCase();
  return <span className="chat-avatar">
    {source && source !== failedSource
      ? <img className="chat-avatar-image" src={source} alt="" width="40" height="40" onError={() => setFailedSource(source)} />
      : <span className="chat-avatar-initials" aria-hidden="true">{initials || <Icon name="friends" />}</span>}
    {contact.isOnline === true && <img className="chat-online" src={asset('56d73.svg')} alt="Đang hoạt động" />}
  </span>;
}

