import './ChatPreview.css';
import Icon from './LandingIcon.jsx';
import { useLandingLanguage } from '../landingLanguage.jsx';

const conversations = [
  { name: 'Minh Anh', initials: 'MA', text: 'Bạn: Tối nay mình gọi nhé!', time: '10:35', active: true },
  { name: 'Nhóm học tập', initials: 'N6', text: 'Huy: Mình gửi tài liệu rồi nha', time: '09:42', color: 'preview-avatar-group' },
  { name: 'Quang Huy', initials: 'QH', text: 'Hẹn bạn cuối tuần!', time: 'Hôm qua', color: 'preview-avatar-friend' },
];

export default function ChatPreview() {
  const { t } = useLandingLanguage();
  return <figure id="demo" className="landing-anchor preview">
    <div className="preview-window">
      <div className="preview-layout">
        <aside className="preview-sidebar">
          <div className="preview-list-heading"><h3 className="preview-list-title">{t("Tin nhắn")}</h3><span className="preview-accent"><Icon name="plus" /></span></div>
          <div className="preview-search"><Icon name="search" className="preview-icon-small" />{t("Tìm cuộc trò chuyện")}</div>
          <div className="preview-conversations">{conversations.map((chat) => <div key={chat.name} className={`preview-conversation ${chat.active ? 'is-active' : ''}`}>
            <span className={`preview-avatar ${chat.color || ''}`}>{chat.initials}</span>
            <div className="preview-conversation-copy"><div className="preview-conversation-heading"><span className="preview-contact-name">{t(chat.name)}</span><span className="preview-contact-time">{t(chat.time)}</span></div><p className="preview-contact-message">{t(chat.text)}</p></div>
          </div>)}</div>
        </aside>
        <div className="preview-main">
          <div className="preview-header">
            <div className="preview-recipient"><span className="preview-recipient-avatar">MA</span><div><h3 className="preview-recipient-name">Minh Anh</h3><p className="preview-status"><span className="preview-status-dot" />{t("Đang hoạt động")}</p></div></div>
            <div className="preview-call-actions"><Icon name="phone" /><Icon name="video" /></div>
          </div>
          <div className="preview-messages">
            <span className="preview-day">{t("Hôm nay, 10:30")}</span>
            <div className="preview-incoming">{t("Mình gửi tài liệu cho buổi học nhé!")}<span className="preview-message-time">10:30</span></div>
            <div className="preview-file"><span className="preview-file-icon"><Icon name="file" /></span><div className="preview-file-copy"><p className="preview-contact-name">Tai-lieu-hoc-tap.pdf</p><p className="preview-file-meta">PDF · 2,4 MB</p></div></div>
            <div className="preview-outgoing">{t("Nhận được rồi, cảm ơn bạn!")}<br />{t("Tối nay mình gọi trao đổi thêm nhé.")}<span className="preview-outgoing-time">{t("10:35 · Đã xem")}</span></div>
          </div>
          <div className="preview-composer"><div className="preview-compose-field"><Icon name="plus" /><span className="preview-compose-placeholder">{t("Nhập tin nhắn...")}</span><span className="preview-accent"><Icon name="send" /></span></div></div>
        </div>
      </div>
    </div>
    <figcaption className="preview-caption">{t("Nhắn tin, chia sẻ tài liệu và bắt đầu cuộc gọi trong cùng một không gian.")}</figcaption>
  </figure>;
}
