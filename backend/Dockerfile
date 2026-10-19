# syntax = docker/dockerfile:1
# Các giai đoạn: `dev` (hot-reload, dùng với docker-compose.dev.yml) và `prod` (mặc định).

FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Chỉ cài dependency chạy thật ----
FROM base AS deps
RUN npm ci --omit=dev && npm cache clean --force

# ---- Phát triển: cài đủ, mã nguồn được mount từ máy chủ ----
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- Chạy thật ----
FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/api/v1/health >/dev/null || exit 1
CMD ["node", "src/index.js"]