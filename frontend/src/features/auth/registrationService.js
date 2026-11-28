// Demo adapter only. Replace these methods with the agreed registration APIs.
// No account is created, no email is sent, and no password is persisted.
export const OTP_TTL_SECONDS = 300;
export const RESEND_SECONDS = 30;
const challenges = new Map();

export function requestRegistrationCode({ email, ttlSeconds = OTP_TTL_SECONDS }) {
  const id = crypto.randomUUID();
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  const code = String(random % 1_000_000).padStart(6, '0');
  const expiresAt = Date.now() + ttlSeconds * 1000;
  challenges.set(id, { code, expiresAt, attempts: 0 });
  return Promise.resolve({ id, email, demoCode: code, expiresAt, resendAt: Date.now() + RESEND_SECONDS * 1000 });
}

export function verifyRegistrationCode(id, code) {
  const challenge = challenges.get(id);
  if (!challenge || Date.now() >= challenge.expiresAt) return Promise.reject(new Error('Mã đã hết hạn. Vui lòng gửi lại mã mới.'));
  if (challenge.attempts >= 5) return Promise.reject(new Error('Bạn đã nhập sai 5 lần. Vui lòng gửi lại mã mới.'));
  if (challenge.code !== code) {
    challenge.attempts += 1;
    return Promise.reject(new Error(challenge.attempts >= 5 ? 'Bạn đã nhập sai 5 lần. Vui lòng gửi lại mã mới.' : 'Mã xác minh chưa chính xác. Vui lòng thử lại.'));
  }
  challenges.delete(id);
  return Promise.resolve();
}

export function discardRegistrationCode(id) { challenges.delete(id); }
