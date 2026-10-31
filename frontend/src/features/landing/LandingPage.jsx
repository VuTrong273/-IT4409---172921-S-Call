import { useState } from 'react';
import { Link } from 'react-router';
import ChatPreview from './components/ChatPreview.jsx';
import Icon from './components/LandingIcon.jsx';

const navigation = [
  { href: '#features', label: 'Tính năng' },
  { href: '#how-it-works', label: 'Cách bắt đầu' },
  { href: '#faq', label: 'Hỏi đáp' },
];

const features = [
  { icon: 'chat', title: 'Chat cá nhân & nhóm', text: 'Giữ liên lạc cùng bạn bè, tạo nhóm học tập và tìm lại những tin nhắn quan trọng.' },
  { icon: 'video', title: 'Gọi thoại, video 1–1', text: 'Chuyển từ lời nhắn sang cuộc gọi. Chia sẻ màn hình khi cần cùng nhau trao đổi.' },
  { icon: 'file', title: 'Chia sẻ ảnh & tài liệu', text: 'Gửi ảnh, PDF, Word và các tệp đính kèm ngay trong khung chat, tối đa 20 MB mỗi tệp.' },
  { icon: 'lock', title: 'Chủ động giữ riêng tư', text: 'Khóa cuộc trò chuyện bằng mã PIN cá nhân và chặn người dùng khi bạn muốn ngừng tương tác.' },
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

const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary';

function Logo() {
  return <a href="#home" aria-label="S-Call — Trang chủ" className="inline-flex shrink-0 items-center gap-2.5 text-xl font-bold tracking-tight"><img src="/favicon.svg" alt="" className="h-9 w-9" />S-Call</a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface/95 backdrop-blur-xl" onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }}>
    <div className="landing-container flex h-20 items-center justify-between gap-3">
      <Logo />
      <nav aria-label="Điều hướng chính" className="hidden items-center gap-7 text-sm font-medium text-on-surface-variant lg:flex">
        {navigation.map((item) => <a className="transition hover:text-primary" key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <div className="flex items-center gap-1 sm:gap-3">
        <Link to="/login" className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-semibold transition hover:text-primary sm:px-4">Đăng nhập</Link>
        <Link to="/register" className={`${primaryButton} hidden sm:inline-flex`}>Đăng ký</Link>
        <button type="button" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" onClick={() => setMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container lg:hidden"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {menuOpen && <nav id="landing-mobile-menu" aria-label="Điều hướng di động" className="absolute inset-x-0 top-full border-b border-outline-variant/40 bg-surface p-5 shadow-lg lg:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-1">{navigation.map((item) => <a className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-surface-container" key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<Link to="/register" onClick={() => setMenuOpen(false)} className={`${primaryButton} mt-3 sm:hidden`}>Tạo tài khoản</Link></div>
    </nav>}
  </header>;
}

function SectionHeading({ eyebrow, title, children }) {
  return <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
    {children && <p className="mt-4 text-base leading-7 text-secondary">{children}</p>}
  </div>;
}

export default function LandingPage() {
  return <div id="home" className="landing-page min-h-screen bg-surface text-on-surface">
    <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3" href="#landing-main">Đi đến nội dung chính</a>
    <Header />
    <main id="landing-main">
      <section aria-labelledby="hero-title" className="bg-gradient-to-b from-surface via-surface-container-low/60 to-surface pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="landing-container text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-fixed bg-white/80 px-3.5 py-2 text-xs font-medium text-primary sm:text-sm"><Icon name="chat" className="h-4 w-4" />Nhắn tin · Gọi thoại · Gọi video trên web</p>
          <h1 id="hero-title" className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.2] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">Nhắn tin dễ dàng.<br /><span className="bg-gradient-to-r from-primary via-primary-container to-tertiary-container bg-clip-text text-transparent">Gọi nhau gần hơn.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">Trò chuyện cùng bạn bè, chia sẻ tài liệu và bắt đầu cuộc gọi ngay trong khung chat.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/register" className={primaryButton}>Tạo tài khoản<Icon name="arrow" className="h-4 w-4" /></Link><a href="#demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-outline-variant/60 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-surface-container-low">Xem giao diện<Icon name="chevron" className="h-4 w-4" /></a></div>
          <p className="mt-5 text-xs text-secondary">Trên máy tính hay điện thoại — chỉ cần mở trình duyệt.</p>
          <ChatPreview />
        </div>
      </section>

      <section id="features" aria-labelledby="features-title" className="landing-anchor border-y border-outline-variant/25 bg-white py-16 sm:py-20">
        <div className="landing-container">
          <div id="features-title"><SectionHeading eyebrow="Kết nối theo cách của bạn" title="Những điều cần cho một cuộc trò chuyện">Từ lời hỏi thăm đến buổi trao đổi cùng nhóm, mọi thứ ở cùng một nơi.</SectionHeading></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <article key={feature.title} className="rounded-2xl border border-outline-variant/30 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-primary-fixed hover:shadow-lg hover:shadow-primary-fixed/30"><span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-surface-container text-primary"><Icon name={feature.icon} className="h-6 w-6" /></span><h3 className="text-base font-bold leading-6">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-on-surface-variant">{feature.text}</p></article>)}</div>
        </div>
      </section>

      <section id="privacy" aria-labelledby="privacy-title" className="landing-anchor py-16 sm:py-20">
        <div className="landing-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Không gian riêng của bạn</p><h2 id="privacy-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Giữ gần người thân quen.<br />Giữ riêng điều cần thiết.</h2><p className="mt-5 text-base leading-7 text-on-surface-variant">Thêm một lớp riêng tư cho những cuộc trò chuyện quan trọng bằng mã PIN bốn chữ số do bạn đặt.</p><ul className="mt-6 space-y-3 text-sm text-on-surface-variant"><li className="flex gap-3"><span className="text-primary"><Icon name="check" /></span>Ẩn nội dung cho đến khi mở khóa.</li><li className="flex gap-3"><span className="text-primary"><Icon name="check" /></span>Mã PIN riêng của bạn cho từng hội thoại.</li></ul><a href="#faq" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">Tìm hiểu về khóa PIN<Icon name="arrow" className="h-4 w-4" /></a></div>
          <div className="rounded-3xl bg-gradient-to-br from-primary-fixed/80 via-surface-container to-tertiary-fixed/70 p-6 sm:p-10">
            <div className="mx-auto max-w-sm rounded-3xl border border-white bg-white/95 p-6 text-center shadow-[0_12px_32px_-12px_rgba(37,99,235,0.15)] sm:p-8"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface-container text-primary"><Icon name="lock" className="h-7 w-7" /></span><p className="mt-5 text-lg font-bold">Cuộc trò chuyện riêng tư</p><p className="mt-2 text-sm leading-6 text-secondary">Nhập mã PIN để xem nội dung.</p><div aria-label="Minh họa mã PIN gồm bốn chữ số được ẩn" className="my-6 flex justify-center gap-3">{[0, 1, 2, 3].map((digit) => <span aria-hidden="true" key={digit} className="grid h-14 w-11 place-items-center rounded-xl border border-primary-fixed bg-surface-container-low"><span className="h-2.5 w-2.5 rounded-full bg-primary" /></span>)}</div><p className="flex items-center justify-center gap-1.5 text-xs text-secondary"><Icon name="lock" className="h-3.5 w-3.5" />Minh họa khóa trò chuyện</p></div>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="steps-title" className="landing-anchor border-y border-outline-variant/25 bg-white py-16 sm:py-20">
        <div className="landing-container"><div id="steps-title"><SectionHeading eyebrow="Bắt đầu thật đơn giản" title="Ba bước để đến gần nhau hơn" /></div><ol className="grid gap-8 md:grid-cols-3">{steps.map((step, index) => <li key={step.title} className="border-t-2 border-primary-fixed pt-5"><span className="text-4xl font-bold tracking-tight text-primary/35" aria-hidden="true">0{index + 1}</span><h3 className="mt-4 text-lg font-bold">{step.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">{step.text}</p></li>)}</ol></div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="landing-anchor py-16 sm:py-20">
        <div className="landing-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Trước khi bắt đầu</p><h2 id="faq-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Một vài điều<br className="hidden lg:block" /> bạn muốn biết</h2><p className="mt-4 max-w-sm text-base leading-7 text-secondary">Những câu hỏi thường gặp khi dùng S-Call.</p></div><div className="space-y-3">{questions.map((item) => <details key={item.question} className="group rounded-2xl border border-outline-variant/40 bg-white"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 text-sm font-semibold sm:text-base"><span>{item.question}</span><span className="shrink-0 text-primary transition-transform group-open:rotate-180"><Icon name="chevron" /></span></summary><p className="px-5 pb-5 text-sm leading-7 text-on-surface-variant">{item.answer}</p></details>)}</div></div>
      </section>

      <section aria-labelledby="start-title" className="pb-16 sm:pb-20">
        <div className="landing-container"><div className="flex flex-col items-start justify-between gap-7 rounded-3xl bg-gradient-to-br from-primary to-tertiary-container p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:p-12"><div className="max-w-xl"><h2 id="start-title" className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Bắt đầu từ một lời chào.</h2><p className="mt-3 text-base leading-7 text-white/85">Một người bạn, một nhóm học tập, một cuộc gọi sau ngày dài.</p></div><Link to="/register" className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary transition hover:bg-primary-fixed sm:w-auto">Tạo tài khoản<Icon name="arrow" className="h-4 w-4" /></Link></div></div>
      </section>
    </main>
    <footer className="border-t border-outline-variant/30 bg-white py-8"><div className="landing-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><Logo /><p className="text-sm text-secondary">Một lời nhắn, thêm gần nhau.</p><span className="text-xs text-secondary">© 2026 S-Call</span></div></footer>
  </div>;
}
