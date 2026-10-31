import Icon from './LandingIcon.jsx';

const conversations = [
  { name: 'Minh Anh', initials: 'MA', text: 'Bạn: Tối nay mình gọi nhé!', time: '10:35', active: true },
  { name: 'Nhóm học tập', initials: 'N6', text: 'Huy: Mình gửi tài liệu rồi nha', time: '09:42', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { name: 'Quang Huy', initials: 'QH', text: 'Hẹn bạn cuối tuần!', time: 'Hôm qua', color: 'bg-secondary-container text-on-secondary-fixed' },
];

export default function ChatPreview() {
  return <figure id="demo" className="landing-anchor mx-auto mt-12 w-full max-w-[1000px] text-left sm:mt-16">
    <div className="overflow-hidden rounded-3xl border border-outline-variant/40 bg-white shadow-[0_24px_64px_-24px_rgba(37,99,235,0.2)]">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-xs font-medium text-secondary"><img src="/favicon.svg" alt="" className="h-5 w-5" />S-Call Web</span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-secondary">Giao diện minh họa</span>
      </div>
      <div className="flex min-h-[450px]">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-outline-variant/30 p-5 md:flex">
          <div className="flex items-center justify-between"><h3 className="text-lg font-bold">Tin nhắn</h3><span className="text-primary"><Icon name="plus" /></span></div>
          <div className="my-5 flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2.5 text-xs text-secondary"><Icon name="search" className="h-4 w-4" />Tìm cuộc trò chuyện</div>
          <div className="space-y-1">{conversations.map((chat) => <div key={chat.name} className={`flex gap-3 rounded-2xl p-3 ${chat.active ? 'bg-primary-fixed/60' : ''}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${chat.color || 'bg-primary-container text-white'}`}>{chat.initials}</span>
            <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-1"><span className="truncate text-[13px] font-semibold">{chat.name}</span><span className="shrink-0 text-[10px] text-secondary">{chat.time}</span></div><p className="mt-1 truncate text-xs text-secondary">{chat.text}</p></div>
          </div>)}</div>
          <div className="mt-auto rounded-2xl bg-surface-container-low p-4">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-primary">Chỉ một chạm để gần nhau</span>
            <div className="flex items-center gap-2 text-sm font-semibold"><Icon name="video" />Gọi video 1–1</div>
            <p className="mt-2 text-xs leading-5 text-secondary">Bắt đầu cuộc gọi ngay trong cuộc trò chuyện.</p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 p-4 sm:px-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-fixed">MA</span><div><h3 className="text-sm font-semibold">Minh Anh</h3><p className="mt-0.5 flex items-center gap-1.5 text-xs text-secondary"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Đang hoạt động</p></div></div>
            <div className="flex gap-3 text-primary"><Icon name="phone" /><Icon name="video" /></div>
          </div>
          <div className="flex flex-1 flex-col gap-4 bg-surface-container-low/50 p-4 sm:px-6 sm:py-5">
            <span className="self-center text-[11px] text-secondary">Hôm nay, 10:30</span>
            <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border border-outline-variant/20 bg-white px-4 py-3 text-[13px] leading-6 sm:max-w-[75%] sm:text-sm">Mình gửi tài liệu cho buổi học nhé!<span className="mt-1 block text-[10px] leading-4 text-secondary">10:30</span></div>
            <div className="flex max-w-full items-center gap-3 self-start rounded-2xl rounded-bl-sm border border-outline-variant/20 bg-white p-3"><span className="rounded-xl bg-primary-fixed p-2.5 text-primary"><Icon name="file" /></span><div className="min-w-0"><p className="truncate text-[13px] font-semibold">Tai-lieu-hoc-tap.pdf</p><p className="mt-1 text-[11px] text-secondary">PDF · 2,4 MB</p></div></div>
            <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary-container px-4 py-3 text-[13px] leading-6 text-white sm:max-w-[75%] sm:text-sm">Nhận được rồi, cảm ơn bạn!<br />Tối nay mình gọi trao đổi thêm nhé.<span className="mt-1 block text-right text-[10px] leading-4 text-white/80">10:35 · Đã xem</span></div>
          </div>
          <div className="border-t border-outline-variant/20 bg-white p-3 sm:px-5"><div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-3 py-3 text-secondary"><Icon name="plus" /><span className="flex-1 text-[13px]">Nhập tin nhắn...</span><span className="text-primary"><Icon name="send" /></span></div></div>
        </div>
      </div>
    </div>
    <figcaption className="mt-4 text-center text-xs leading-5 text-secondary">Nhắn tin, chia sẻ tài liệu và bắt đầu cuộc gọi trong cùng một không gian.</figcaption>
  </figure>;
}
