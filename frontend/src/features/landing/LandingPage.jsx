const chats = [
  { initials: 'ML', name: 'Minh Linh', preview: 'Tối nay mình gọi nhé?', time: '10:42', color: 'bg-rose-200 text-rose-700', active: true },
  { initials: 'QA', name: 'Quân Anh', preview: 'Đã gửi một hình ảnh', time: '09:18', color: 'bg-amber-200 text-amber-800' },
  { initials: 'Nh', name: 'Nhóm cuối tuần', preview: 'Hẹn mọi người 7 giờ nha', time: 'Hôm qua', color: 'bg-violet-200 text-violet-700' },
];

const features = [
  { icon: '✦', title: 'Trò chuyện tức thì', text: 'Tin nhắn, hình ảnh và tệp được gửi đến bạn bè ngay khi bạn nhấn gửi.' },
  { icon: '◉', title: 'Gọi nhau thật gần', text: 'Bắt đầu cuộc gọi thoại hoặc video trực tiếp ngay trong khung chat.' },
  { icon: '⌑', title: 'Riêng tư theo cách của bạn', text: 'Khóa những cuộc trò chuyện riêng tư bằng mã PIN cá nhân.' },
];

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-200/60 via-fuchsia-100/40 to-orange-100/70 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white shadow-[0_30px_90px_-35px_rgba(59,36,102,0.35)]">
        <div className="flex min-h-[390px]">
          <aside className="hidden w-[185px] shrink-0 border-r border-slate-100 bg-slate-50/80 p-4 sm:block">
            <div className="mb-7 flex items-center gap-2 font-bold tracking-tight text-slate-800"><img src="/favicon.svg" alt="" className="h-7 w-7" />S-Call</div>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Tin nhắn</div>
            <div className="space-y-1">
              {chats.map((chat) => <div key={chat.name} className={`flex items-center gap-2 rounded-xl p-2 ${chat.active ? 'bg-white shadow-sm' : ''}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${chat.color}`}>{chat.initials}</span>
                <span className="min-w-0"><span className="block truncate text-[11px] font-semibold text-slate-700">{chat.name}</span><span className="block truncate text-[9px] text-slate-400">{chat.preview}</span></span>
              </div>)}
            </div>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-200 text-xs font-bold text-rose-700">ML</span><div><p className="text-xs font-semibold text-slate-800">Minh Linh</p><p className="flex items-center gap-1 text-[10px] text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Đang hoạt động</p></div></div>
              <div className="flex gap-2 text-slate-400"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-50">⌕</span><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-50">♧</span></div>
            </div>
            <div className="flex flex-1 flex-col justify-end gap-3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-50/70 via-white to-white p-4 sm:p-5">
              <p className="self-center rounded-full bg-white/80 px-3 py-1 text-[9px] text-slate-400">Hôm nay, 10:38</p>
              <div className="max-w-[78%] self-start rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-600">Cuối tuần này mình đi khám phá quán cà phê mới nhé ☕</div>
              <div className="max-w-[78%] self-end rounded-2xl rounded-br-md bg-violet-600 px-3.5 py-2.5 text-[11px] leading-relaxed text-white shadow-md shadow-violet-200">Nghe hay đó! Gửi mình địa chỉ với nha ✨</div>
              <div className="max-w-[78%] self-start rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-600">Tối nay mình gọi nhé?</div>
              <p className="self-end text-[9px] text-slate-400">Đã xem · 10:42</p>
            </div>
            <div className="m-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm"><span className="text-lg leading-none text-violet-500">＋</span><span className="flex-1 text-[10px] text-slate-300">Nhắn tin cho Minh Linh...</span><span className="text-violet-500">➤</span></div>
          </div>
        </div>
      </div>
      <div className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-2xl border border-white bg-white px-3 py-2 shadow-lg sm:flex"><span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">✓</span><span className="text-[10px] font-semibold text-slate-700">Tin nhắn đã gửi</span></div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfbff] text-slate-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#home" className="flex items-center gap-2.5 text-lg font-bold tracking-tight"><img src="/favicon.svg" alt="" className="h-9 w-9" />S-Call</a>
        <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex"><a className="transition hover:text-violet-700" href="#features">Tính năng</a><a className="transition hover:text-violet-700" href="#about">Về S-Call</a></div>
        <a href="#start" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700">Đăng nhập</a>
      </nav>

      <section id="home" className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 md:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-12 lg:pb-28 lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3.5 py-2 text-xs font-medium text-violet-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-400" />Gần nhau hơn, dù ở bất cứ đâu</div>
          <h1 className="text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-slate-900">Một lời nhắn,<br />kết nối <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">cả khoảng cách.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">Trò chuyện, chia sẻ và gọi cho những người bạn thương quý — tất cả trong một không gian thân thuộc.</p>
          <div id="start" className="mt-8 flex flex-wrap items-center gap-3"><a href="#signup" className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700">Bắt đầu trò chuyện <span className="ml-2">→</span></a><a href="#features" className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white">Khám phá S-Call</a></div>
          <div className="mt-10 flex items-center gap-3 text-xs text-slate-400"><div className="flex -space-x-2"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#fcfbff] bg-amber-200 text-[9px] font-bold text-amber-800">A</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#fcfbff] bg-sky-200 text-[9px] font-bold text-sky-800">B</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#fcfbff] bg-rose-200 text-[9px] font-bold text-rose-800">C</span></div><span>Kết nối dễ dàng trên mọi thiết bị</span></div>
        </div>
        <ChatPreview />
      </section>

      <section id="features" className="border-y border-slate-100 bg-white/70 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl"><div className="mx-auto mb-10 max-w-lg text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Kết nối theo cách của bạn</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Những điều nhỏ làm nên gần gũi</h2></div>
          <div className="grid gap-4 md:grid-cols-3">{features.map((feature) => <article key={feature.title} className="rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/60"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-xl text-violet-600">{feature.icon}</span><h3 className="mt-5 font-semibold text-slate-800">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p></article>)}</div>
        </div>
      </section>

      <footer id="about" className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><a href="#home" className="flex items-center gap-2 font-semibold text-slate-600"><img src="/favicon.svg" alt="" className="h-6 w-6" />S-Call</a><span>Một không gian nhỏ để giữ mọi người gần nhau hơn.</span><span>© 2026 S-Call</span></footer>
    </main>
  );
}
