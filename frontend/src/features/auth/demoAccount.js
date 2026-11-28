// Vite replaces DEV with false in production builds.
export const demoAccount = import.meta.env.DEV ? {
  username: 'demo',
  email: 'demo@scall.local',
  password: 'ScallDemo123',
} : null;

export const isDemoSession = (session) => import.meta.env.DEV && session?.demo === true;

export function demoLogin(identifier, password) {
  if (!demoAccount || ![demoAccount.username, demoAccount.email].includes(identifier.toLowerCase())) return null;
  if (password !== demoAccount.password) throw new Error('Mật khẩu tài khoản demo chưa chính xác.');
  return {
    demo: true,
    tokens: { accessToken: 'frontend-demo', refreshToken: 'frontend-demo', tokenType: 'Bearer' },
    user: { id: 'frontend-demo', username: demoAccount.username, email: demoAccount.email, displayName: 'Người dùng Demo', bio: 'Tài khoản xem thử giao diện', avatarUrl: '', role: 'user' },
  };
}
