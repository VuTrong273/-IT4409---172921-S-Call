import { Avatar } from './ChatPrimitives.jsx';

export default function ConversationDetails({ active, history, onClose, onTogglePin }) {
  const sharedFiles = history.filter((message) => message.url);
  return <aside className="chat-details">
    <button type="button" className="chat-details-close" onClick={onClose} aria-label="Đóng thông tin">×</button>
    <Avatar contact={active} />
    <h2>{active.name}</h2>
    <p>Đang hoạt động</p>
    <button type="button" onClick={onTogglePin}>{active.pinned ? 'Bỏ ghim hội thoại' : 'Ghim hội thoại'}</button>
    <h3>Tệp đã chia sẻ</h3>
    {sharedFiles.map((message) => <a key={message.id} href={message.url} download={message.name}>{message.name}</a>)}
  </aside>;
}
