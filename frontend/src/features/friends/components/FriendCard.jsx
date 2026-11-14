import { Avatar } from '../../conversations/components/ChatPrimitives.jsx';
import FriendIcon from './FriendIcon.jsx';

export default function FriendCard({ user, onMessage, onSend, onAccept, onReject, onCancel }) {
  const received = user.relationship === 'request_received';
  const sent = user.relationship === 'request_sent';
  const friend = user.relationship === 'friend';

  return <article className="friends-card">
    <div className="friends-card-person">
      <Avatar contact={{ ...user, isOnline: !!user.isOnline }} />
      <div className="friends-card-copy">
        <h3>{user.displayName}</h3>
        <p>@{user.username}</p>
        <span className={`friends-card-status ${friend && user.isOnline ? 'is-online' : ''}`}>
          {friend ? (user.isOnline ? 'Đang hoạt động' : 'Chưa hoạt động') : received ? 'Muốn kết bạn với bạn' : sent ? 'Đang chờ phản hồi' : 'Chưa kết bạn'}
        </span>
      </div>
    </div>
    <div className="friends-card-actions">
      {friend && <button type="button" className="friends-button friends-button-soft" onClick={() => onMessage(user)}><FriendIcon name="message" />Nhắn tin<span className="friends-sr-only"> với {user.displayName}</span></button>}
      {received && <>
        <button type="button" className="friends-button friends-button-primary" onClick={() => onAccept(user)}><FriendIcon name="check" />Chấp nhận<span className="friends-sr-only"> lời mời từ {user.displayName}</span></button>
        <button type="button" className="friends-button friends-button-quiet" onClick={() => onReject(user)}>Từ chối<span className="friends-sr-only"> lời mời từ {user.displayName}</span></button>
      </>}
      {sent && <button type="button" className="friends-button friends-button-quiet" onClick={() => onCancel(user)}>Hủy lời mời<span className="friends-sr-only"> tới {user.displayName}</span></button>}
      {user.relationship === 'none' && <button type="button" className="friends-button friends-button-primary" onClick={() => onSend(user)}><FriendIcon name="plus" />Kết bạn<span className="friends-sr-only"> với {user.displayName}</span></button>}
    </div>
  </article>;
}
