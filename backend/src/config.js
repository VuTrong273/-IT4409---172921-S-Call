// Đọc cấu hình từ biến môi trường.

const env = process.env;

const int = (name, def) => {
  const v = Number.parseInt(env[name] ?? '', 10);
  return Number.isNaN(v) ? def : v;
};

const bool = (name, def = false) => {
  if (env[name] === undefined || env[name] === '') return def;
  return ['1', 'true', 'yes', 'on'].includes(env[name].toLowerCase());
};

const list = (name, def = []) =>
  env[name] ? env[name].split(',').map((s) => s.trim()).filter(Boolean) : def;

export const config = {
  appEnv: env.APP_ENV ?? 'development',
  isDev: (env.APP_ENV ?? 'development') === 'development',
  port: int('PORT', 3000),
  publicUrl: env.PUBLIC_URL ?? 'http://localhost:8080',

  databaseUrl: env.DATABASE_URL ?? 'postgres://scall:scall_dev_password@localhost:5433/scall',

  minio: {
    endPoint: env.MINIO_ENDPOINT ?? 'localhost',
    port: int('MINIO_PORT', 9000),
    useSSL: bool('MINIO_USE_SSL', false),
    accessKey: env.MINIO_ROOT_USER ?? 'scall_minio',
    secretKey: env.MINIO_ROOT_PASSWORD ?? 'scall_minio_password',
    // URL mà TRÌNH DUYỆT truy cập được (dùng để ký presigned URL). Cùng origin với frontend.
    publicUrl: env.MINIO_PUBLIC_URL ?? env.PUBLIC_URL ?? 'http://localhost:8080',
    bucketAvatars: env.MINIO_BUCKET_AVATARS ?? 'avatars',
    bucketChat: env.MINIO_BUCKET_CHAT ?? 'chat-files',
    presignTtlSeconds: int('MINIO_PRESIGN_TTL_SECONDS', 3600),
  },

  auth: {
    accessSecret: env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
    wsTicketSecret: env.WS_TICKET_SECRET ?? 'dev-ws-ticket-secret-change-me',
    unlockTokenSecret: env.UNLOCK_TOKEN_SECRET ?? 'dev-unlock-secret-change-me',
    accessTtlSeconds: int('JWT_ACCESS_TTL_SECONDS', 900),
    refreshTtlDays: int('REFRESH_TOKEN_TTL_DAYS', 7),
    wsTicketTtlSeconds: int('WS_TICKET_TTL_SECONDS', 60),
    unlockTokenTtlSeconds: int('UNLOCK_TOKEN_TTL_SECONDS', 900),
    bcryptCost: int('BCRYPT_COST', 10),
    otpTtlMinutes: int('OTP_TTL_MINUTES', 10),
    otpMaxAttempts: int('OTP_MAX_ATTEMPTS', 5),
    pinMaxAttempts: int('PIN_MAX_ATTEMPTS', 5),
    pinLockMinutes: int('PIN_LOCK_MINUTES', 5),
  },

  mail: {
    mode: env.MAIL_MODE ?? 'dev', // dev: chỉ ghi email_outbox, xem qua GET /dev/emails | smtp: gửi thật
    from: env.MAIL_FROM ?? 'S-Call <no-reply@scall.local>',
    smtpHost: env.SMTP_HOST ?? '',
    smtpPort: int('SMTP_PORT', 587),
    smtpUser: env.SMTP_USER ?? '',
    smtpPass: env.SMTP_PASS ?? '',
  },

  upload: {
    maxFileMb: int('MAX_UPLOAD_MB', 20),
    maxAvatarMb: int('AVATAR_MAX_MB', 5),
  },

  call: {
    ringTimeoutSeconds: int('CALL_RING_TIMEOUT_SECONDS', 30),
    reconnectGraceSeconds: int('CALL_RECONNECT_GRACE_SECONDS', 10),
  },

  turn: {
    mode: env.TURN_MODE ?? 'coturn', // coturn | metered | none
    stunUrls: list('STUN_URLS', ['stun:stun.l.google.com:19302']),
    urls: list('TURN_URLS', ['turn:localhost:3478?transport=udp', 'turn:localhost:3478?transport=tcp']),
    secret: env.TURN_SECRET ?? 'dev-turn-secret-change-me',
    ttlSeconds: int('TURN_CREDENTIAL_TTL_SECONDS', 3600),
    meteredApp: env.METERED_APP_NAME ?? '',
    meteredApiKey: env.METERED_API_KEY ?? '',
  },
};