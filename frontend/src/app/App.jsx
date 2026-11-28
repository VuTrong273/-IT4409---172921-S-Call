import LandingPage from '../features/landing/LandingPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import ConversationWorkspace from '../features/conversations/ConversationWorkspace.jsx';
import { Link, Navigate, Route, Routes, useParams } from 'react-router';
import { WORKSPACE_PATHS } from './workspaceRoutes.js';
import { useAuth } from './providers/AuthProvider.jsx';
import { saveSession } from '../lib/session.js';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthGate guest><LoginPage /></AuthGate>} />
    <Route path="/register" element={<AuthGate guest><RegisterPage /></AuthGate>} />
    <Route path="/forgot-password" element={<AuthGate guest><ForgotPasswordPage /></AuthGate>} />
    <Route path="/app" element={<AuthGate><Navigate to={WORKSPACE_PATHS.chat} replace /></AuthGate>} />
    <Route path="/app/:section" element={<AuthGate><WorkspaceRoute /></AuthGate>} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}

function AuthGate({ children, guest = false }) {
  const { session, ready, error, restore } = useAuth();
  if (!ready && session) return <main className="auth-page"><div className="register-content register-main"><p role="status">{error || 'Đang khôi phục phiên đăng nhập…'}</p>{error && <><button type="button" className="auth-button auth-button-primary" onClick={restore}>Thử lại</button><button type="button" className="auth-button auth-button-secondary" onClick={() => saveSession(null)}>Về đăng nhập</button></>}</div></main>;
  if (guest && session) return <Navigate to={WORKSPACE_PATHS.chat} replace />;
  if (!guest && !session) return <Navigate to="/login" replace />;
  return children;
}

function WorkspaceRoute() {
  const { section } = useParams();
  const tab = Object.keys(WORKSPACE_PATHS).find((key) => WORKSPACE_PATHS[key] === `/app/${section}`);
  return tab ? <ConversationWorkspace tab={tab} /> : <NotFound />;
}

function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-surface-container-low p-6 text-center"><div><h1 className="text-3xl font-semibold text-on-surface">Không tìm thấy trang</h1><p className="mt-2 text-secondary">Đường dẫn này không tồn tại.</p><Link className="mt-5 inline-block font-semibold text-primary" to="/">Về trang chủ</Link></div></main>;
}
