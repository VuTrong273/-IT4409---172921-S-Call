import { useRef, useState } from 'react';
import { Avatar } from './ChatPrimitives.jsx';
import { formatFileSize } from '../chatModel.js';
import ActionIcon from './ConversationActionIcon.jsx';

function QuickAction({ icon, children, ...props }) {
  return <button type="button" {...props}>
    <span className="chat-detail-action-icon"><ActionIcon name={icon} /></span>
    <span>{children}</span>
  </button>;
}

export default function ConversationDetails({ active, history, contacts, hasPin, onClose, onUpdate, onToggleArchive, onAvatar, onPin, onImage, onNewGroup, onClearHistory }) {
  const confirmation = useRef(null);
  const nicknameDialog = useRef(null);
  const profileDialog = useRef(null);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState(active.name);
  const [avatarError, setAvatarError] = useState('');
  const links = history.filter((message) => !message.recalled).flatMap((message) => (message.text?.match(/https?:\/\/[^\s<>]+/g) || []).map((url) => ({ url, id: message.id + url })));
  const images = history.filter((message) => message.kind === 'image' && message.url && !message.recalled);
  const files = history.filter((message) => message.kind === 'file' && message.url && !message.recalled);
  const isGroup = active.type === 'group';

  function openProfile(person) {
    const contact = contacts.find((entry) => entry.id === person.id);
    setViewedProfile({ ...person, ...contact });
    profileDialog.current.showModal();
  }

  function openNicknameEditor() {
    setNickname(active.nickname || '');
    nicknameDialog.current.showModal();
  }

  function saveNickname(event) {
    event.preventDefault();
    onUpdate({ nickname: nickname.trim() });
    nicknameDialog.current.close();
  }
  return <aside className="chat-details chat-side-panel" aria-label="Thông tin hội thoại">
    <header className="chat-details-heading chat-panel-heading"><h2>Thông tin hội thoại</h2><button type="button" onClick={onClose} aria-label="Đóng thông tin">×</button></header>
    <div className="chat-panel-scroll">
    <div className="chat-details-profile">
      {isGroup ? <Avatar contact={active} showPresence={false} /> : (
        <button type="button" className="chat-profile-avatar-button" aria-label={`Xem hồ sơ ${active.name}`} aria-haspopup="dialog" onClick={() => openProfile(active)}>
          <Avatar contact={active} showPresence={false} />
        </button>
      )}
      <div className="chat-details-name">
        <h2>{active.nickname || active.name}</h2>
        <button type="button" className="chat-icon-button" title="Chỉnh sửa biệt danh" aria-label="Chỉnh sửa biệt danh" aria-haspopup="dialog" onClick={openNicknameEditor}>
          <ActionIcon name="pencil" />
        </button>
      </div>
      {isGroup && <p>{(active.members?.length || 0) + 1} thành viên</p>}
    </div>
    {isGroup && <div className="chat-group-avatar"><label>Đổi ảnh nhóm<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setAvatarError(onAvatar(file)); event.target.value = ''; }} /></label>{avatarError && <p role="alert" className="chat-compose-error">{avatarError}</p>}</div>}
    <div className="chat-details-actions">
      <QuickAction icon={active.muted ? 'bellOff' : 'bell'} onClick={() => onUpdate({ muted: !active.muted })}>
        {active.muted ? 'Bật thông báo' : 'Tắt thông báo'}
      </QuickAction>
      <QuickAction icon={active.pinned ? 'pinOff' : 'pin'} onClick={() => onUpdate({ pinned: !active.pinned })}>
        {active.pinned ? 'Bỏ ghim hội thoại' : 'Ghim hội thoại'}
      </QuickAction>
      <QuickAction icon="group" aria-haspopup="dialog" onClick={onNewGroup}>Tạo nhóm trò chuyện</QuickAction>
    </div>
    {isGroup && <details className="chat-details-section" open><summary>Quản lý nhóm</summary><form className="chat-group-form" onSubmit={(event) => { event.preventDefault(); if (name.trim()) onUpdate({ name: name.trim() }); }}><label>Tên nhóm<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required /></label><button type="submit" className="chat-action-primary" disabled={!name.trim() || name.trim() === active.name}>Lưu tên</button></form><h3>Thành viên</h3><div className="chat-member-row"><span>Bạn</span><small>Trưởng nhóm</small></div>{active.members?.map((member) => <div className="chat-member-row" key={member.id}>
      <button type="button" className="chat-profile-avatar-button" aria-label={`Xem hồ sơ ${member.name}`} aria-haspopup="dialog" onClick={() => openProfile(member)}>
        <Avatar contact={member} showPresence={false} />
      </button>
      <span className="chat-member-name">{member.name}</span>
      <button type="button" aria-label={`Xóa ${member.name} khỏi nhóm`} onClick={() => onUpdate({ members: active.members.filter((person) => person.id !== member.id) })}>Xóa</button></div>)}<label className="chat-add-member">Thêm thành viên<select value="" onChange={(event) => { const person = contacts.find((contact) => contact.id === event.target.value); if (person) onUpdate({ members: [...(active.members || []), person] }); }}><option value="">Chọn bạn bè</option>{contacts.filter((person) => !active.members?.some((member) => member.id === person.id)).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label></details>}
    <details className="chat-details-section" open><summary className="chat-media-summary">Ảnh đã chia sẻ<ActionIcon name="chevron" /></summary>{images.length ? <div className="chat-shared-images">{images.map((message) => <button type="button" key={message.id} onClick={() => onImage(message)} aria-label={`Xem ${message.name}`}><img src={message.url} alt={message.name} /></button>)}</div> : <p className="chat-details-empty">Chưa có ảnh được chia sẻ.</p>}</details>
    <details className="chat-details-section" open><summary className="chat-media-summary">Tệp đã chia sẻ<ActionIcon name="chevron" /></summary>{files.length ? files.map((message) => <a className="chat-shared-file" key={message.id} href={message.url} download={message.name}><strong>{message.name}</strong><small>{formatFileSize(message.size)} · Tải xuống</small></a>) : <p className="chat-details-empty">Chưa có tệp được chia sẻ.</p>}</details>
    <details className="chat-details-section" open><summary className="chat-media-summary">Liên kết<ActionIcon name="chevron" /></summary>{links.length ? links.map((link) => <a key={link.id} className="chat-shared-file chat-shared-link" href={link.url} target="_blank" rel="noopener noreferrer"><strong>{new URL(link.url).hostname}</strong><small>{link.url}</small></a>) : <p className="chat-details-empty">Chưa có liên kết được chia sẻ trong hội thoại này.</p>}</details>
    <div className="chat-details-section">
      <button type="button" className="chat-details-command" onClick={() => onPin(hasPin ? 'disable' : 'set')}>
        <ActionIcon name="lock" />{hasPin ? 'Tắt khóa PIN' : 'Đặt khóa PIN'}
      </button>
      {hasPin && <button type="button" className="chat-details-command" onClick={() => onPin('lock')}>
        <ActionIcon name="lock" />Khóa ngay
      </button>}
      <button type="button" className="chat-details-command" onClick={onToggleArchive}>
        <ActionIcon name={active.archived ? 'unarchive' : 'archive'} />
        {active.archived ? 'Bỏ lưu trữ cuộc trò chuyện' : 'Lưu trữ cuộc trò chuyện'}
      </button>
      <button type="button" className="chat-details-command chat-details-danger" disabled={!history.length} aria-haspopup="dialog" onClick={() => confirmation.current.showModal()}>
        <ActionIcon name="trash" />Xóa lịch sử trò chuyện
      </button>
    </div>
    </div>
    <dialog ref={profileDialog} className="chat-dialog chat-contact-profile" aria-labelledby="chat-contact-profile-title" onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }}>
      <header>
        <h2 id="chat-contact-profile-title">Hồ sơ người dùng</h2>
        <button type="button" aria-label="Đóng hồ sơ" onClick={() => profileDialog.current.close()}>×</button>
      </header>
      {viewedProfile && <section className="chat-contact-profile-body">
        <Avatar contact={viewedProfile} showPresence={false} />
        <h3>{viewedProfile.displayName || viewedProfile.name}</h3>
        {viewedProfile.username && <p>@{viewedProfile.username}</p>}
        {viewedProfile.bio?.trim() && <p className="chat-contact-bio">{viewedProfile.bio}</p>}
      </section>}
    </dialog>
    <dialog ref={nicknameDialog} className="chat-dialog" aria-labelledby="chat-nickname-title" onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }}>
      <h2 id="chat-nickname-title">Chỉnh sửa biệt danh</h2>
      <form className="chat-group-form" onSubmit={saveNickname}>
        <label>Biệt danh
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={100} placeholder={active.name} aria-describedby="chat-nickname-hint" />
        </label>
        <p id="chat-nickname-hint">Để trống để dùng lại tên gốc.</p>
        <div className="chat-dialog-actions">
          <button type="button" onClick={() => nicknameDialog.current.close()}>Hủy</button>
          <button type="submit" className="chat-action-primary">Lưu</button>
        </div>
      </form>
    </dialog>
    <dialog ref={confirmation} className="chat-dialog" aria-labelledby="chat-clear-title" aria-describedby="chat-clear-description" onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }}>
      <h2 id="chat-clear-title">Xóa lịch sử trò chuyện?</h2>
      <p id="chat-clear-description">Tin nhắn và tệp của cuộc trò chuyện này sẽ bị xóa khỏi phiên hiện tại.</p>
      <form method="dialog" className="chat-dialog-actions">
        <button type="submit" autoFocus>Hủy</button>
        <button type="submit" className="chat-action-danger" onClick={onClearHistory}>Xóa lịch sử</button>
      </form>
    </dialog>
  </aside>;
}
