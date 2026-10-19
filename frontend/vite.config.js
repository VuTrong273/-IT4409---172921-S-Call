import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Khi chạy dev (docker-compose.dev.yml hoặc `npm run dev` trên máy), Vite đóng vai trò như nginx ở bản production:
// mọi thứ đi qua MỘT origin nên không cần cấu hình CORS và presigned URL của MinIO ký đúng host.
const backend = process.env.VITE_PROXY_TARGET ?? 'http://localhost:3000';
const minio = process.env.VITE_MINIO_TARGET ?? 'http://localhost:9000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // lắng nghe 0.0.0.0 để dùng trong Docker và truy cập từ điện thoại cùng mạng LAN
    port: 5173,
    strictPort: true,
    allowedHosts: true, // cho phép truy cập qua tên miền Cloudflare Tunnel
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' }, // bind-mount trên Windows / Docker Desktop
    proxy: {
      '/api': { target: backend },
      '/ws': { target: backend, ws: true },
      // Không đặt changeOrigin để giữ nguyên header Host => chữ ký presigned URL hợp lệ
      '/avatars': { target: minio },
      '/chat-files': { target: minio },
    },
  },
});