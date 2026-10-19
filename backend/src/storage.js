import { Client } from 'minio';
import { config } from './config.js';

const { minio: cfg } = config;

// Client nội bộ: backend -> MinIO trong mạng Docker (http://minio:9000). Dùng để upload / xóa object.
export const minio = new Client({
  endPoint: cfg.endPoint,
  port: cfg.port,
  useSSL: cfg.useSSL,
  accessKey: cfg.accessKey,
  secretKey: cfg.secretKey,
});

// Client công khai: CHỈ dùng để ký presigned URL cho trình duyệt. Có chỉ định `region` nên không gọi mạng.
// URL công khai cùng origin với frontend (nginx / Vite proxy các đường dẫn /<bucket>/... sang MinIO),
// nhờ đó chạy được sau Cloudflare Tunnel mà chỉ cần mở một hostname.
const pub = new URL(cfg.publicUrl);
const publicMinio = new Client({
  endPoint: pub.hostname,
  port: pub.port ? Number(pub.port) : pub.protocol === 'https:' ? 443 : 80,
  useSSL: pub.protocol === 'https:',
  accessKey: cfg.accessKey,
  secretKey: cfg.secretKey,
  region: 'us-east-1',
});

/** Presigned URL tải xuống một object riêng tư (bucket chat-files). */
export function presignGet(bucket, objectKey, { ttl = cfg.presignTtlSeconds, filename, inline = true } = {}) {
  const respHeaders = {};
  if (filename) {
    const disposition = inline ? 'inline' : 'attachment';
    respHeaders['response-content-disposition'] = `${disposition}; filename*=UTF-8''${encodeURIComponent(filename)}`;
  }
  return publicMinio.presignedGetObject(bucket, objectKey, ttl, respHeaders);
}

/** URL ổn định của ảnh đại diện (bucket avatars cho phép đọc công khai). */
export function avatarUrl(objectKey) {
  if (!objectKey) return null;
  return `${cfg.publicUrl.replace(/\/$/, '')}/${cfg.bucketAvatars}/${objectKey}`;
}

export async function checkStorage() {
  const [avatars, chat] = await Promise.all([
    minio.bucketExists(cfg.bucketAvatars),
    minio.bucketExists(cfg.bucketChat),
  ]);
  if (!avatars || !chat) throw new Error('Thiếu bucket MinIO');
}