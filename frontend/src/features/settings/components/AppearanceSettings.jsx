
const themes = [{ id: 'light', label: 'Sáng' }, { id: 'dark', label: 'Tối' }, { id: 'system', label: 'Theo thiết bị' }];

export default function AppearanceSettings({ theme, onThemeChange, preferences, onPreferenceChange }) {
  return <section className="settings-editor" aria-labelledby="appearance-heading">
    <header><h2 id="appearance-heading">Tùy chỉnh hiển thị</h2><p>Chọn cách S-Call hiển thị trên thiết bị của bạn.</p></header>
    <fieldset className="settings-theme-fieldset">
      <legend>Chế độ hiển thị</legend>
      <div className="settings-theme-options">{themes.map((item) => <label key={item.id} className={`settings-theme-option ${theme === item.id ? 'is-selected' : ''}`}>
        <input type="radio" name="theme" value={item.id} checked={theme === item.id} onChange={() => onThemeChange(item.id)} />
        <span className={`settings-theme-preview theme-preview-${item.id}`} aria-hidden="true"><i /><span><b /><b /><b /></span></span>
        <span className="settings-theme-label">{item.label}<span aria-hidden="true">{theme === item.id ? '✓' : ''}</span></span>
      </label>)}</div>
      <p className="settings-help">Áp dụng ngay và được ghi nhớ trên trình duyệt này.</p>
    </fieldset>
    <div className="settings-preference-row"><div><h3 id="chat-font-label">Cỡ chữ tin nhắn</h3><p>Áp dụng cho nội dung tin nhắn và ô soạn tin.</p></div><select className="settings-select" aria-labelledby="chat-font-label" value={preferences.fontSize} onChange={(event) => onPreferenceChange('fontSize', event.target.value)}><option value="small">Nhỏ</option><option value="medium">Vừa</option><option value="large">Lớn</option></select></div>
    <div className={`settings-font-preview font-preview-${preferences.fontSize}`} aria-label="Xem trước cỡ chữ">Xin chào! Hôm nay bạn thế nào?</div>
  </section>;
}
