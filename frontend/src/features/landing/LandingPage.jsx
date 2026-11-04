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

const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary';

function Logo() {
  const { t } = useLandingLanguage();
  return <a href="#home" aria-label={t("S-Call — Trang chủ")} className="inline-flex shrink-0 items-center gap-2.5 text-xl font-semibold tracking-tight"><img src="/favicon.svg" alt="" className="h-9 w-9" />S-Call</a>;
}

function Header() {
  const { t } = useLandingLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface/95 backdrop-blur-xl" onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }}>
    <div className="landing-container flex h-20 items-center justify-between gap-3">
      <Logo />
      <nav aria-label={t("Điều hướng chính")} className="hidden items-center gap-7 text-sm font-medium text-on-surface-variant lg:flex">
        {navigation.map((item) => <a className="transition hover:text-primary" key={item.href} href={item.href}>{t(item.label)}</a>)}
      </nav>
      <div className="flex items-center gap-1 sm:gap-3">
        <Link to="/login" className="inline-flex min-h-11 items-center rounded-xl px-2 text-sm font-semibold transition hover:text-primary sm:px-4">{t("Đăng nhập")}</Link>
        <span className="hidden sm:block"><Link to="/register" className={primaryButton}>{t("Tạo tài khoản")}</Link></span>
        <button type="button" aria-label={menuOpen ? t('Đóng menu') : t('Mở menu')} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" onClick={() => setMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container lg:hidden"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {menuOpen && <nav id="landing-mobile-menu" aria-label={t("Điều hướng di động")} className="absolute inset-x-0 top-full border-b border-outline-variant/40 bg-surface p-5 shadow-lg lg:hidden">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-1">{navigation.map((item) => <a className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-surface-container" key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{t(item.label)}</a>)}<Link to="/register" onClick={() => setMenuOpen(false)} className={`${primaryButton} mt-3 sm:hidden`}>{t("Tạo tài khoản")}</Link></div>
    </nav>}
  </header>;
}

function SectionHeading({ id, eyebrow, title, children }) {
  return <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
    <h2 id={id} className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
    {children && <p className="mt-4 text-base leading-7 text-secondary">{children}</p>}
  </div>;
}

function LandingContent() {
  const { language, setLanguage, t } = useLandingLanguage();
  return <div id="home" className="landing-page min-h-screen bg-surface text-on-surface">
    <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3" href="#landing-main">{t("Đi đến nội dung chính")}</a>
    <Header />
    <main id="landing-main">
      <section aria-labelledby="hero-title" className="landing-hero py-12 sm:py-20">
        <div className="landing-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-12 xl:gap-16">
          <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-primary"><span className="h-2 w-2 rounded-xl bg-primary-container" />{t("Không gian kết nối của bạn")}</p>
          <h1 id="hero-title" className="mt-6 max-w-[12em] text-4xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-5xl lg:text-[48px] xl:text-[56px]">{t("Nơi dành cho những cuộc trò chuyện có ý nghĩa")}</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-secondary xl:text-lg xl:leading-8">{t("Từ những lời hỏi thăm hằng ngày đến những câu chuyện dài, luôn có một nơi để bạn kết nối.")}</p>
          </div>
          <ChatPreview />
        </div>
      </section>

      <section id="features" aria-labelledby="features-title" className="landing-anchor border-y border-outline-variant/25 bg-white py-16 sm:py-20">
        <div className="landing-container">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{t("Mọi kết nối, thật tự nhiên")}</p>
            <h2 id="features-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("Nhắn tin, gọi nhau, chia sẻ mỗi ngày.")}</h2>
            <p className="mt-4 text-base leading-7 text-secondary">{t("Những điều quen thuộc giúp bạn gần hơn với người mình quan tâm.")}</p>
          </div>
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
            {features.map((feature) => <article key={feature.title} className="flex h-full flex-col items-center rounded-2xl bg-surface-container-low p-6 text-center transition-colors xl:p-8 hover:bg-surface-container">
              <span className="mb-5 grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-fixed text-primary"><Icon name={feature.icon} className="h-6 w-6" /></span>
              <h3 className="w-full text-base font-semibold leading-6 sm:min-h-12">{t(feature.title)}</h3>
              <p className="mt-2.5 text-sm leading-6 text-on-surface-variant">{t(feature.text)}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="privacy" aria-labelledby="privacy-title" className="landing-anchor py-16 sm:py-20">
        <div className="landing-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{t("Riêng tư theo cách của bạn")}</p>
            <h2 id="privacy-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("Có những câu chuyện chỉ dành cho bạn.")}</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-secondary">{t("Giữ riêng những cuộc trò chuyện bạn chọn bằng mã PIN cá nhân.")}</p>
          </div>
          <div className="flex items-center justify-center rounded-3xl bg-surface-container-low p-6 sm:p-10">
            <div className="w-full max-w-xs rounded-2xl border border-outline-variant/30 bg-white p-6 text-center sm:p-8">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary-fixed text-primary"><Icon name="lock" className="h-6 w-6" /></span>
              <p className="mt-5 text-base font-semibold">{t("Cuộc trò chuyện riêng tư")}</p>
              <p className="mt-2 text-sm leading-6 text-secondary">{t("Nhập PIN để mở cuộc trò chuyện")}</p>
              <div aria-label={t("Minh họa mã PIN gồm bốn chữ số được ẩn")} className="mt-6 flex justify-center gap-3">
                {[0, 1, 2, 3].map((digit) => <span aria-hidden="true" key={digit} className="grid h-12 w-10 place-items-center rounded-xl border border-outline-variant/50 bg-surface-container-low"><span className="h-2 w-2 rounded-full bg-primary" /></span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="steps-title" className="landing-anchor border-y border-outline-variant/25 bg-white py-16 sm:py-20">
        <div className="landing-container"><SectionHeading id="steps-title" eyebrow={t("Bắt đầu thật đơn giản")} title={t("Ba bước để đến gần nhau hơn")} /><ol className="grid gap-8 md:grid-cols-3">{steps.map((step, index) => <li key={step.title} className="border-t-2 border-primary-fixed pt-5"><span className="text-4xl font-semibold tracking-tight text-primary/35" aria-hidden="true">0{index + 1}</span><h3 className="mt-4 text-lg font-semibold">{t(step.title)}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">{t(step.text)}</p></li>)}</ol></div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="landing-anchor py-16 sm:py-20">
        <div className="landing-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{t("Trước khi bắt đầu")}</p><h2 id="faq-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("Một vài điều")}<br className="hidden lg:block" /> {t("bạn muốn biết")}</h2><p className="mt-4 max-w-sm text-base leading-7 text-secondary">{t("Những câu hỏi thường gặp khi dùng S-Call.")}</p></div><div className="space-y-3">{questions.map((item) => <details key={item.question} className="group rounded-2xl border border-outline-variant/40 bg-white"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 text-sm font-semibold sm:text-base"><span>{t(item.question)}</span><span className="shrink-0 text-primary transition-transform group-open:rotate-180"><Icon name="chevron" /></span></summary><p className="px-5 pb-5 text-sm leading-7 text-on-surface-variant">{t(item.answer)}</p></details>)}</div></div>
      </section>


    </main>
    <footer className="border-t border-outline-variant/40 bg-surface-container-low pb-6 pt-10 sm:pt-12">
      <div className="landing-container">
        <div className="grid gap-5 pb-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0 sm:pb-10">
          <div className="sm:col-start-1 sm:row-start-1"><Logo /></div>
            <nav aria-label={t("Điều hướng cuối trang")} className="flex min-h-9 flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary sm:col-start-2 sm:row-start-1 sm:justify-self-end">
              <a href="#features" className="py-2 transition hover:text-primary">{t("Tính năng")}</a>
              <a href="#faq" className="py-2 transition hover:text-primary">{t("Hỏi đáp")}</a>
              <Link to="/login" className="py-2 transition hover:text-primary">{t("Đăng nhập")}</Link>
            </nav>
          <p className="row-start-2 max-w-[20rem] text-sm leading-6 text-secondary sm:col-start-1 sm:mt-3">{t("Nơi dành cho những cuộc trò chuyện có ý nghĩa")}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-outline-variant/50 pt-5">
          <span className="shrink-0 text-xs text-secondary">© 2026 S-Call</span>
            <label className="text-sm text-secondary">
              <span className="sr-only">{t("Ngôn ngữ")}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="min-h-11 max-w-full cursor-pointer rounded-lg border border-outline-variant/60 bg-transparent px-3 py-2 text-sm text-on-surface transition hover:border-primary">
                <option value="vi" lang="vi">Tiếng Việt</option>
                <option value="en" lang="en">English</option>
              </select>
            </label>
        </div>
      </div>
    </footer>
  </div>;
}

export default function LandingPage() {
  return <LandingLanguageProvider><LandingContent /></LandingLanguageProvider>;
}
