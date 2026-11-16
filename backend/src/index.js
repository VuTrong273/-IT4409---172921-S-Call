import http from 'node:http';
import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { pool } from './db.js';
import { attachWebSocket } from './ws.js';
import { healthRouter } from './routes/health.js';

const app = express();

// 1. Cấu hình Proxy an toàn
app.disable('x-powered-by');

app.set('trust proxy', 1);

// 2. Gắn Request ID truy vết (khớp schema Error.requestId trong openapi.yaml)
app.use((req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId =
    typeof incomingId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(incomingId)
      ? incomingId
      : crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

// 3. Helmet: Bọc các HTTP Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
    // Cho phép thẻ <img>/video ở frontend tải tài nguyên hợp lệ khi chạy khác port lúc dev
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
);

// Cấm trình duyệt cache dữ liệu API nhạy cảm (tin nhắn, thông tin cá nhân)
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// 4. Kiểm soát CORS
const allowedOrigins = config.corsOrigins
  ? String(config.corsOrigins).split(',').map((s) => s.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request cùng origin (qua Nginx proxy) hoặc không có Origin
      if (!origin) return callback(null, true);
      // Nếu chưa cấu hình danh sách cụ thể ở môi trường dev thì cho phép localhost
      if (allowedOrigins.length === 0) {
        if (config.appEnv === 'development' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        // Nếu đi qua Cloudflare Tunnel cùng domain (Nginx) hoặc cấu hình thêm qua biến môi trường
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS_NOT_ALLOWED'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Conversation-Unlock-Token', 'X-Request-Id'],
    exposedHeaders: ['Retry-After', 'X-Request-Id'],
    maxAge: 600,
  })
);

// 5. Giới hạn tốc độ (Rate Limiting) chống Brute-force & DDoS theo openapi.yaml
const getClientIp = (req) => {
  // Ưu tiên IP thật từ Cloudflare Tunnel nếu có, sau đó tới req.ip
  const cfIp = req.headers['cf-connecting-ip'];
  return (typeof cfIp === 'string' && cfIp.trim()) || req.ip || 'unknown';
};

const createRateLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getClientIp(req),
    handler: (req, res, _next, options) => {
      const retryAfterSec = Math.ceil(options.windowMs / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        code: 'RATE_LIMITED',
        message: message || 'Bạn thao tác quá nhanh, vui lòng thử lại sau',
        requestId: req.requestId,
      });
    },
  });

// 5.1 Rate limit chung cho toàn bộ API (300 requests / phút / IP)
const globalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau ít phút',
});

// 5.2 Rate limit cho Đăng nhập / Đăng ký / Quên mật khẩu / Đặt lại mật khẩu (10 lần / phút / IP)
const strictAuthLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Quá nhiều lần thử xác thực, vui lòng chờ 1 phút',
});

// 5.3 Rate limit chống dò mã PIN 4 số của cuộc trò chuyện (10 lần / 5 phút / IP)
const pinVerifyLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Bạn đã nhập PIN quá nhiều lần, vui lòng thử lại sau 5 phút',
});

// 6. Giới hạn kích thước JSON body (tránh làm tràn RAM; upload file đã dùng multipart riêng)
app.use(express.json({ limit: '256kb', strict: true }));

// 7. Làm sạch dữ liệu đầu vào: Chống HPP, Null-byte (\0) và Prototype Pollution
function sanitizeValue(val) {
  if (typeof val === 'string') {
    // Xóa ký tự null-byte (\0) gây lỗi 500 trên PostgreSQL UTF-8
    return val.replace(/\0/g, '');
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object') {
    const cleaned = {};
    for (const [k, v] of Object.entries(val)) {
      // Chặn Prototype Pollution
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      cleaned[k.replace(/\0/g, '')] = sanitizeValue(v);
    }
    return cleaned;
  }
  return val;
}

app.use((req, _res, next) => {
  // Chống HTTP Parameter Pollution (HPP)
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      const singleValue = Array.isArray(value) ? value[value.length - 1] : value;
      req.query[key] = sanitizeValue(singleValue);
    }
  }
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    for (const [key, value] of Object.entries(req.params)) {
      if (typeof value === 'string') {
        req.params[key] = value.replace(/\0/g, '');
      }
    }
  }
  next();
});

// ---- Routes: /api/v1 (openapi.yaml) ----
const api = express.Router();

api.use('/health', healthRouter);

// Áp dụng Rate Limit cho toàn bộ /api/v1 (trừ /health để Docker healthcheck không bị chặn)
api.use(globalApiLimiter);

// Áp dụng Rate Limit gắt cho các endpoint nhạy cảm
api.use('/auth/login', strictAuthLimiter);
api.use('/auth/register', strictAuthLimiter);
api.use('/auth/forgot-password', strictAuthLimiter);
api.use('/auth/reset-password', strictAuthLimiter);
api.use('/conversations/:conversationId/pin/verify', pinVerifyLimiter);
api.use('/conversations/:conversationId/pin/disable', pinVerifyLimiter);

// Chặn truy cập /api/v1/dev/* (hộp thư OTP giả lập) nếu không phải môi trường development
// HOẶC nếu request đi từ bên ngoài qua Cloudflare Tunnel (có header cf-connecting-ip)
api.use('/dev', (req, res, next) => {
  const isFromCloudflare = Boolean(req.headers['cf-connecting-ip'] || req.headers['cf-ray']);
  if (config.appEnv !== 'development' || isFromCloudflare) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Không tìm thấy tài nguyên',
      requestId: req.requestId,
    });
  }
  return next();
});

app.use('/api/v1', api);

// ---- 404 + xử lý lỗi theo schema Error của openapi ----
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Không tìm thấy tài nguyên',
    requestId: req.requestId,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // Bắt lỗi JSON sai cú pháp từ express.json() -> trả 400 thay vì lộ lỗi 500
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu JSON không hợp lệ',
      requestId: req.requestId,
    });
  }

  // Bắt lỗi payload vượt quá giới hạn
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      code: 'FILE_TOO_LARGE',
      message: 'Dữ liệu gửi lên vượt quá dung lượng cho phép',
      requestId: req.requestId,
    });
  }

  // Bắt lỗi CORS
  if (err && err.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Origin không được phép truy cập',
      requestId: req.requestId,
    });
  }

  console.error(`[api] lỗi (requestId=${req.requestId}):`, err);
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Lỗi hệ thống',
    requestId: req.requestId,
  });
});

const server = http.createServer(app);

// 8. Chống tấn công Slowloris (treo kết nối HTTP)
server.headersTimeout = 15_000;      // Tối đa 15 giây để gửi xong HTTP headers
server.requestTimeout = 30_000;      // Tối đa 30 giây cho mỗi HTTP request
server.keepAliveTimeout = 5_000;     // Giữ kết nối keep-alive tối đa 5 giây

attachWebSocket(server);

server.listen(config.port, '0.0.0.0', () => {
  console.log(`[server] S-Call backend chạy ở cổng ${config.port} (APP_ENV=${config.appEnv})`);
});

// 9. Chặn sập tiến trình khi có lỗi bất đồng bộ chưa được bắt
process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught Exception:', err);
});

// Tắt êm khi Docker gửi SIGTERM
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`[server] nhận ${signal}, đang dừng...`);
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}