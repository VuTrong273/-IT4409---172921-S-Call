import './LandingPage.css';
import LanguageSelect from '../../components/LanguageSelect.jsx';
import { useState } from 'react';
import { LandingLanguageProvider, useLandingLanguage } from './landingLanguage.jsx';
import { Link } from 'react-router';
import ChatPreview from './components/ChatPreview.jsx';
import Icon from './components/LandingIcon.jsx';

const navigation = [
  { href: '#features', label: 'Tính năng' },
  { href: '#how-it-works', label: 'Cách bắt đầu' },
  { href: '#faq', label: 'Hỏi đáp' },
];

const features = [
  { icon: 'chat', title: 'Chuyện nhỏ, chuyện dài', text: 'Nhắn riêng hay trò chuyện cùng nhóm, luôn có chỗ cho câu chuyện của bạn.' },
  { icon: 'video', title: 'Gặp nhau qua màn hình', text: 'Nghe giọng nói, nhìn nụ cười và cùng chia sẻ một khoảnh khắc.' },
  { icon: 'media', title: 'Chia sẻ điều bạn muốn', text: 'Gửi một bức ảnh, một tài liệu hay điều thú vị vừa tìm thấy.' },
  { icon: 'lock', title: 'Không gian riêng của bạn', text: 'Khóa cuộc trò chuyện bằng PIN và chủ động chọn người bạn muốn kết nối.' },
];

const steps = [
  { title: 'Tạo tài khoản', text: 'Đăng ký bằng email, chọn tên đăng nhập và tên hiển thị của bạn.' },
  { title: 'Tìm và kết bạn', text: 'Tìm bạn bè bằng email hoặc tên đăng nhập, sau đó gửi lời mời kết bạn.' },
  { title: 'Bắt đầu trò chuyện', text: 'Nhắn tin, tạo nhóm và gọi cho bạn bè ngay trên trình duyệt.' },
];

const questions = [
  { question: 'Tôi có thể dùng S-Call trên điện thoại không?', answer: 'Có. S-Call là ứng dụng web có giao diện thích ứng với máy tính và điện thoại. Bạn mở bằng trình duyệt, không cần cài ứng dụng riêng.' },
  { question: 'S-Call có hỗ trợ gọi nhóm không?', answer: 'S-Call hỗ trợ gọi thoại và video giữa hai người bạn. Nhóm chat dùng để nhắn tin, gửi ảnh và chia sẻ tệp; hiện không có cuộc gọi nhóm.' },
  { question: 'Tôi có thể gửi tệp dung lượng bao nhiêu?', answer: 'Mỗi tệp đính kèm có dung lượng tối đa 20 MB. Bạn có thể chia sẻ hình ảnh, PDF, Word, Excel, ZIP và tải xuống ngay trong cuộc trò chuyện.' },
  { question: 'Khóa cuộc trò chuyện bằng PIN hoạt động thế nào?', answer: 'Bạn đặt mã PIN gồm bốn chữ số cho cuộc trò chuyện muốn giữ riêng tư. Nội dung được ẩn cho đến khi bạn nhập đúng mã. PIN là lớp kiểm soát truy cập cuộc trò chuyện, không phải mã hóa đầu cuối.' },
];


function Logo() {
  const { t } = useLandingLanguage();
  return <a href="#home" aria-label={t("S-Call — Trang chủ")} className="landing-logo"><img src="/favicon.svg" alt="" className="landing-logo-image" />S-Call</a>;
}

function Header() {
  const { t } = useLandingLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="landing-header" onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }}>
    <div className="landing-container landing-header-inner">
      <Logo />
      <nav aria-label={t("Điều hướng chính")} className="landing-desktop-nav">
        {navigation.map((item) => <a className="landing-nav-link" key={item.href} href={item.href}>{t(item.label)}</a>)}
      </nav>
      <div className="landing-header-actions">
        <Link to="/login" className="landing-login-link">{t("Đăng nhập")}</Link>
        <span className="landing-register-link"><Link to="/register" className="landing-primary-button">{t("Tạo tài khoản")}</Link></span>
        <button type="button" aria-label={menuOpen ? t('Đóng menu') : t('Mở menu')} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" onClick={() => setMenuOpen((open) => !open)} className="landing-menu-toggle"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {menuOpen && <nav id="landing-mobile-menu" aria-label={t("Điều hướng di động")} className="landing-mobile-nav">
      <div className="landing-mobile-nav-inner">{navigation.map((item) => <a className="landing-mobile-nav-link" key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{t(item.label)}</a>)}<Link to="/register" onClick={() => setMenuOpen(false)} className="landing-primary-button landing-primary-button-mobile">{t("Tạo tài khoản")}</Link></div>
    </nav>}
  </header>;
}

function SectionHeading({ id, eyebrow, title, children }) {
  return <div className="landing-section-heading">
    <p className="landing-eyebrow">{eyebrow}</p>
    <h2 id={id} className="landing-section-title">{title}</h2>
    {children && <p className="landing-section-description">{children}</p>}
  </div>;
}

function LandingContent() {
  const { language, setLanguage, t } = useLandingLanguage();
  return <div id="home" className="landing-page">
    <a className="landing-skip-link" href="#landing-main">{t("Đi đến nội dung chính")}</a>
    <Header />
    <main id="landing-main">
      <section aria-labelledby="hero-title" className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-copy">
          <p className="landing-hero-eyebrow"><span className="landing-hero-dot" />{t("Không gian kết nối của bạn")}</p>
          <h1 id="hero-title" className="landing-hero-title">{t("Nơi dành cho những cuộc trò chuyện có ý nghĩa")}</h1>
          <p className="landing-hero-description">{t("Từ những lời hỏi thăm hằng ngày đến những câu chuyện dài, luôn có một nơi để bạn kết nối.")}</p>
          </div>
          <ChatPreview />
        </div>
      </section>

      <section id="features" aria-labelledby="features-title" className="landing-anchor landing-section-bordered">
        <div className="landing-container">
          <div className="landing-features-heading">
            <p className="landing-eyebrow">{t("Mọi kết nối, thật tự nhiên")}</p>
            <h2 id="features-title" className="landing-section-title">{t("Nhắn tin, gọi nhau, chia sẻ mỗi ngày.")}</h2>
            <p className="landing-section-description">{t("Những điều quen thuộc giúp bạn gần hơn với người mình quan tâm.")}</p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => <article key={feature.title} className="landing-feature-card">
              <span className="landing-feature-icon"><Icon name={feature.icon} className="landing-icon-large" /></span>
              <h3 className="landing-feature-title">{t(feature.title)}</h3>
              <p className="landing-feature-description">{t(feature.text)}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="privacy" aria-labelledby="privacy-title" className="landing-anchor landing-section">
        <div className="landing-container landing-privacy-grid">
          <div className="landing-privacy-copy">
            <p className="landing-eyebrow">{t("Riêng tư theo cách của bạn")}</p>
            <h2 id="privacy-title" className="landing-section-title">{t("Có những câu chuyện chỉ dành cho bạn.")}</h2>
            <p className="landing-privacy-description">{t("Giữ riêng những cuộc trò chuyện bạn chọn bằng mã PIN cá nhân.")}</p>
          </div>
          <div className="landing-pin-background">
            <div className="landing-pin-card">
              <span className="landing-pin-icon"><Icon name="lock" className="landing-icon-large" /></span>
              <p className="landing-pin-title">{t("Cuộc trò chuyện riêng tư")}</p>
              <p className="landing-pin-description">{t("Nhập PIN để mở cuộc trò chuyện")}</p>
              <div aria-label={t("Minh họa mã PIN gồm bốn chữ số được ẩn")} className="landing-pin-digits">
                {[0, 1, 2, 3].map((digit) => <span aria-hidden="true" key={digit} className="landing-pin-digit"><span className="landing-pin-dot" /></span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="steps-title" className="landing-anchor landing-section-bordered">
        <div className="landing-container"><SectionHeading id="steps-title" eyebrow={t("Bắt đầu thật đơn giản")} title={t("Ba bước để đến gần nhau hơn")} /><ol className="landing-steps-grid">{steps.map((step, index) => <li key={step.title} className="landing-step"><span className="landing-step-number" aria-hidden="true">0{index + 1}</span><h3 className="landing-step-title">{t(step.title)}</h3><p className="landing-step-description">{t(step.text)}</p></li>)}</ol></div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="landing-anchor landing-section">
        <div className="landing-container landing-faq-grid"><div><p className="landing-eyebrow">{t("Trước khi bắt đầu")}</p><h2 id="faq-title" className="landing-section-title">{t("Một vài điều")}<br className="landing-desktop-break" /> {t("bạn muốn biết")}</h2><p className="landing-faq-description">{t("Những câu hỏi thường gặp khi dùng S-Call.")}</p></div><div className="landing-faq-list">{questions.map((item) => <details key={item.question} className="landing-faq-item"><summary className="landing-faq-question"><span>{t(item.question)}</span><span className="landing-faq-chevron"><Icon name="chevron" /></span></summary><p className="landing-faq-answer">{t(item.answer)}</p></details>)}</div></div>
      </section>


    </main>
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand"><Logo /></div>
            <nav aria-label={t("Điều hướng cuối trang")} className="landing-footer-links">
              <a href="#features" className="landing-footer-link">{t("Tính năng")}</a>
              <a href="#faq" className="landing-footer-link">{t("Hỏi đáp")}</a>
              <Link to="/login" className="landing-footer-link">{t("Đăng nhập")}</Link>
            </nav>
          <p className="landing-footer-tagline">{t("Nơi dành cho những cuộc trò chuyện có ý nghĩa")}</p>
        </div>
        <div className="landing-footer-bottom">
          <span className="landing-copyright">© 2026 S-Call</span>
          <LanguageSelect value={language} onChange={setLanguage} label={t("Ngôn ngữ")} />
        </div>
      </div>
    </footer>
  </div>;
}

export default function LandingPage() {
  return <LandingLanguageProvider><LandingContent /></LandingLanguageProvider>;
}
