import LandingPage from '../features/landing/LandingPage.jsx';
import { LoginPage, RegisterPage } from '../features/auth/AuthPage.jsx';
import ConversationWorkspace from '../features/conversations/ConversationWorkspace.jsx';
import { Link, Route, Routes } from 'react-router';

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/app" element={<ConversationWorkspace />} />
    <Route path="*" element={<main className="grid min-h-screen place-items-center bg-surface-container-low p-6 text-center"><div><h1 className="text-3xl font-semibold text-on-surface">Không tìm thấy trang</h1><p className="mt-2 text-secondary">Đường dẫn này không tồn tại.</p><Link className="mt-5 inline-block font-semibold text-primary" to="/">Về trang chủ</Link></div></main>} />
  </Routes>;
}
