import { useState } from 'react';
import { Avatar, IconButton } from './ChatPrimitives.jsx';

export default function ChatHeader({ active, searchOpen, onBack, onToggleDetails, onShowDetails, onToggleSearch, onArchiveChange, onUpdate, onNotice }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function update(change) {
    onUpdate(change);
    setMenuOpen(false);
  }
  function toggleArchive() {
    update({ archived: !active.archived });
    onArchiveChange(!active.archived);
  }
  function showDetails() {
    onShowDetails();
    setMenuOpen(false);
  }

  return <header className="chat-header" onKeyDown={(event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  }}>
    <button type="button" className="chat-back chat-icon-button" aria-label="Quay lại danh sách" onClick={onBack}>←</button>
    <button type="button" className="chat-recipient" onClick={onToggleDetails} aria-label={`Thông tin ${active.name}`}>
      <Avatar contact={active} />
      <span><strong>{active.name}</strong><small>Đang hoạt động</small></span>
    </button>
    <div className="chat-header-actions">
      <IconButton name="video" label="Gọi video" onClick={() => onNotice('Gọi video chưa khả dụng.')} />
      <IconButton name="phone" label="Gọi thoại" onClick={() => onNotice('Gọi thoại chưa khả dụng.')} />
      <IconButton name="search" label="Tìm trong cuộc trò chuyện" aria-expanded={searchOpen} onClick={onToggleSearch} />
      <div className="chat-menu-anchor">
        <IconButton name="more" label="Tùy chọn hội thoại" aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)} />
        {menuOpen && <div className="chat-popover chat-options">
          <button type="button" onClick={() => update({ pinned: !active.pinned })}>{active.pinned ? 'Bỏ ghim hội thoại' : 'Ghim hội thoại'}</button>
          <button type="button" onClick={toggleArchive}>{active.archived ? 'Bỏ lưu trữ' : 'Lưu trữ hội thoại'}</button>
          <button type="button" onClick={showDetails}>Thông tin hội thoại</button>
        </div>}
      </div>
    </div>
  </header>;
}
