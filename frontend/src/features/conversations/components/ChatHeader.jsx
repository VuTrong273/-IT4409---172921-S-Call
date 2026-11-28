import { Avatar, IconButton } from './ChatPrimitives.jsx';

export default function ChatHeader({ active, detailsOpen, searchOpen, onBack, onToggleDetails, onToggleSearch, onNotice }) {
  return <header className="chat-header">
    <button type="button" className="chat-back chat-icon-button" aria-label="Quay lại danh sách" onClick={onBack}>←</button>
    <button type="button" className="chat-recipient" onClick={onToggleDetails} aria-label={`Thông tin ${active.nickname || active.name}`}>
      <Avatar contact={active} />
      <span><strong>{active.nickname || active.name}</strong><small>{active.type === 'group' ? `${(active.members?.length || 0) + 1} thành viên` : active.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</small></span>
    </button>
    <div className="chat-header-actions">
      {active.type !== 'group' && <><IconButton name="video" label="Gọi video" onClick={() => onNotice('Gọi video chưa khả dụng.')} />
      <IconButton name="phone" label="Gọi thoại" onClick={() => onNotice('Gọi thoại chưa khả dụng.')} /></>}
      <IconButton name="search" label="Tìm trong cuộc trò chuyện" aria-expanded={searchOpen} onClick={onToggleSearch} />
      <button type="button" className={`chat-icon-button chat-info-toggle ${detailsOpen ? 'is-active' : ''}`} aria-label="Thông tin hội thoại" aria-expanded={detailsOpen} onClick={onToggleDetails}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg></button>
    </div>
  </header>;
}
