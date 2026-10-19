import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { pool } from './db.js';
import { attachWebSocket } from './ws.js';
import { healthRouter } from './routes/health.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true); // sau nginx / Cloudflare Tunnel: lấy IP thật từ X-Forwarded-For
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// ---- Routes: /api/v1 (openapi.yaml) ----
const api = express.Router();
api.use('/health', healthRouter);


app.use('/api/v1', api);

// ---- 404 + xử lý lỗi theo schema Error của openapi ----
app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Không tìm thấy tài nguyên' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[api] lỗi:', err);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống' });
});

const server = http.createServer(app);
attachWebSocket(server);

server.listen(config.port, '0.0.0.0', () => {
  console.log(`[server] S-Call backend chạy ở cổng ${config.port} (APP_ENV=${config.appEnv})`);
});

// Tắt êm khi Docker gửi SIGTERM
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`[server] nhận ${signal}, đang dừng...`);
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}