import { getSession, saveSession } from './session.js';
import { isDemoSession } from '../features/auth/demoAccount.js';
export const API_BASE = '/api/v1';

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `HTTP ${status}`);
    this.status = status;
    this.code = body?.code;
    this.details = body?.details;
  }
}

let accessToken = null;
let refreshing = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

async function request(path, { method = 'GET', body, headers = {}, ...rest } = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body !== undefined && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    ...rest,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

export function refreshSession() {
  if (refreshing) return refreshing;
  const previous = getSession();
  if (!previous) return Promise.reject(new ApiError(401, { code: 'UNAUTHORIZED' }));
  if (isDemoSession(previous)) return Promise.resolve(previous.tokens.accessToken);
  refreshing = request('/auth/refresh', { method: 'POST', body: { refreshToken: previous.tokens.refreshToken } })
    .then((tokens) => {
      if (!tokens?.accessToken || !tokens.refreshToken) throw new Error('Phản hồi phiên đăng nhập không hợp lệ.');
      if (getSession() !== previous) throw new Error('Phiên đăng nhập đã thay đổi.');
      accessToken = tokens.accessToken;
      saveSession({ ...previous, tokens });
      return tokens.accessToken;
    })
    .catch((error) => {
      if ((error.status === 401 || error.status === 403) && getSession() === previous) { accessToken = null; saveSession(null); }
      throw error;
    })
    .finally(() => { refreshing = null; });
  return refreshing;
}

export async function api(path, options = {}) {
  if (getSession()?.demo) throw new ApiError(503, { code: 'DEMO_MODE', message: 'Chế độ demo chỉ hỗ trợ xem giao diện, chưa kết nối dữ liệu máy chủ.' });
  const publicRequest = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'].includes(path);
  const token = publicRequest ? null : getSession()?.tokens.accessToken ?? accessToken;
  try { return await request(path, options, token); }
  catch (error) {
    if (publicRequest) throw error;
    if (error.status === 401 && error.code === 'TOKEN_EXPIRED' && getSession()) {
      const nextToken = await refreshSession();
      try { return await request(path, options, nextToken); }
      catch (retryError) {
        if (retryError.status === 401 || retryError.code === 'ACCOUNT_BANNED') { accessToken = null; saveSession(null); }
        throw retryError;
      }
    }
    if (error.status === 401 || error.code === 'ACCOUNT_BANNED') { accessToken = null; saveSession(null); }
    throw error;
  }
}

export async function logoutSession() {
  const current = getSession();
  try { if (current && !current.demo) await request('/auth/logout', { method: 'POST', body: { refreshToken: current.tokens.refreshToken } }, current.tokens.accessToken); }
  finally { accessToken = null; saveSession(null); }
}
