import { useId } from 'react';

function UnavailableToggle({ title, description }) {
  const id = useId();
  return <div className="settings-preference-row"><div><h3 id={id}>{title}</h3><p>{description}</p></div><button type="button" role="switch" aria-checked={false} aria-labelledby={id} disabled className="settings-toggle"><span /></button></div>;
}

export default function NotificationSettings() {
  return <section className="settings-editor" aria-labelledby="notifications-heading">
    <header><h2 id="notifications-heading">Thông báo</h2><p>Quản lý những cập nhật bạn muốn nhận.</p></header>
    <p className="settings-availability" role="status">Các tùy chọn này chưa khả dụng. Bạn sẽ có thể bật khi chức năng thông báo được kết nối.</p>
    <UnavailableToggle title="Thông báo trên máy tính" description="Hiển thị thông báo khi có tin nhắn mới." />
    <UnavailableToggle title="Âm thanh tin nhắn" description="Phát âm thanh khi nhận tin nhắn." />
    <UnavailableToggle title="Thông báo cuộc gọi" description="Nhận thông báo khi có cuộc gọi đến." />
    <UnavailableToggle title="Xem trước nội dung" description="Hiển thị nội dung tin nhắn trong thông báo." />
  </section>;
}
