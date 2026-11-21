import SettingsIcon from './SettingsIcon.jsx';

export default function PrivacySettings() {
  return <div className="settings-sections">
    <section className="settings-editor" aria-labelledby="privacy-heading">
      <header><h2 id="privacy-heading">Người đã chặn</h2><p>Người bị chặn không thể tìm thấy bạn, gửi tin nhắn hoặc gọi cho bạn. Hội thoại cũ vẫn được giữ lại.</p></header>
      <div className="settings-unavailable-state"><SettingsIcon name="privacy" /><h3>Chưa tải được danh sách</h3><p>Danh sách người đã chặn sẽ hiển thị khi kết nối tài khoản với máy chủ.</p></div>
    </section>
    <section className="settings-editor" aria-labelledby="presence-heading">
      <header><h2 id="presence-heading">Trạng thái hoạt động</h2><p>Trạng thái được cập nhật theo kết nối của bạn. Hiện chưa hỗ trợ tùy chọn ẩn trạng thái hoạt động.</p></header>
    </section>
  </div>;
}
