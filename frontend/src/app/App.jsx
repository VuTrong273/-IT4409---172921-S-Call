import LandingPage from '../features/landing/LandingPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import ConversationWorkspace from '../features/conversations/ConversationWorkspace.jsx';
import { Link, Navigate, Route, Routes, useParams } from 'react-router';
import { WORKSPACE_PATHS } from './workspaceRoutes.js';

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/app" element={<Navigate to={WORKSPACE_PATHS.chat} replace />} />
    <Route path="/app/:section" element={<WorkspaceRoute />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}

function WorkspaceRoute() {
  const { section } = useParams();
  const tab = Object.keys(WORKSPACE_PATHS).find((key) => WORKSPACE_PATHS[key] === `/app/${section}`);
  return tab ? <ConversationWorkspace tab={tab} /> : <NotFound />;
}

function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-surface-container-low p-6 text-center"><div><h1 className="text-3xl font-semibold text-on-surface">Không tìm thấy trang</h1><p className="mt-2 text-secondary">Đường dẫn này không tồn tại.</p><Link className="mt-5 inline-block font-semibold text-primary" to="/">Về trang chủ</Link></div></main>;
}
