import { useEffect, useState } from 'react';
import { api } from './lib/api.js';

// Khung giao diện theo PRD: 2 cột trên máy tính (trái: danh sách hội thoại, phải: khung chat / màn hình gọi),
// thu gọn thành 1 cột trên điện thoại (chuyển qua lại giữa danh sách và màn hình chat).
// Đây chỉ là template để kiểm tra kết nối hệ thống; thay thế bằng các giao diện thật sau.

function useHealth() {
  const [health, setHealth] = useState({ loading: true });
  useEffect(() => {
    api('/health')
      .then((data) => setHealth({ ok: true, data }))
      .catch((err) => setHealth({ ok: false, error: err.message }));
  }, []);
  return health;
}

function StatusBadge({ health }) {
  if (health.loading) return <span className="text-sm text-gray-500">Đang kiểm tra hệ thống ...</span>;
  const ok = health.ok && health.data.status === 'ok';
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${ok ? 'text-green-600' : 'text-red-600'}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      {ok
        ? `API ${health.data.status} · DB ${health.data.database} · MinIO ${health.data.storage}`
        : `Không kết nối được backend (${health.error ?? health.data?.status})`}
    </span>
  );
}

export default function App() {
  const health = useHealth();
  const [chatOpen, setChatOpen] = useState(false); // chỉ dùng trên mobile

  return (
    <div className="flex h-full bg-gray-50 text-gray-900">
      {/* Cột trái: danh sách hội thoại / bạn bè */}
      <aside className={`${chatOpen ? 'hidden' : 'flex'} w-full flex-col border-r bg-white md:flex md:w-80`}>
        <header className="flex items-center gap-2 border-b p-4">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <h1 className="text-lg font-semibold">S-Call</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">
          <p className="mb-3">Danh sách hội thoại sẽ hiển thị ở đây.</p>
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-white md:hidden"
            onClick={() => setChatOpen(true)}
          >
            Mở khung chat (mobile)
          </button>
        </div>
        <footer className="border-t p-3">
          <StatusBadge health={health} />
        </footer>
      </aside>

      {/* Cột phải: khung chat và màn hình gọi */}
      <main className={`${chatOpen ? 'flex' : 'hidden'} flex-1 flex-col md:flex`}>
        <header className="flex items-center gap-3 border-b bg-white p-4">
          <button className="md:hidden" onClick={() => setChatOpen(false)} aria-label="Quay lại">
            ←
          </button>
          <h2 className="font-medium">Khung chat</h2>
        </header>
        <div className="flex flex-1 items-center justify-center p-6 text-gray-400">
          Chọn một cuộc trò chuyện để bắt đầu
        </div>
      </main>
    </div>
  );
}