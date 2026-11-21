import { useState } from 'react';
import LanguageSelect from '../../../components/LanguageSelect.jsx';

export default function GeneralSettings({ preferences, onPreferenceChange }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('s-call-language') === 'en' ? 'en' : 'vi'; } catch { return 'vi'; }
  });
  function changeLanguage(value) {
    setLanguage(value);
    try { localStorage.setItem('s-call-language', value); } catch { /* Storage may be unavailable. */ }
  }
  return <div className="settings-sections">
    <section className="settings-editor" aria-labelledby="general-language-heading">
      <header><h2 id="general-language-heading">Ngôn ngữ</h2></header>
      <div className="settings-preference-row settings-row-first"><div><h3>Trang chủ, đăng nhập và đăng ký</h3><p>Khu vực trò chuyện hiện sử dụng tiếng Việt.</p></div><LanguageSelect label="Ngôn ngữ" value={language} onChange={changeLanguage} /></div>
    </section>
    <section className="settings-editor" aria-labelledby="general-message-heading">
      <header><h2 id="general-message-heading">Soạn tin nhắn</h2></header>
      <div className="settings-preference-row settings-row-first"><div><h3 id="send-enter-label">Nhấn Enter để gửi</h3><p id="send-enter-help">{preferences.sendWithEnter ? 'Enter để gửi, Shift + Enter để xuống dòng.' : 'Enter để xuống dòng, Ctrl + Enter hoặc ⌘ + Enter để gửi.'}</p></div><button type="button" role="switch" className="settings-toggle" aria-checked={preferences.sendWithEnter} aria-labelledby="send-enter-label" aria-describedby="send-enter-help" onClick={() => onPreferenceChange('sendWithEnter', !preferences.sendWithEnter)}><span /></button></div>
      <p className="settings-help">Tùy chọn được ghi nhớ trên trình duyệt này.</p>
    </section>
  </div>;
}
