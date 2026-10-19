# syntax=docker/dockerfile:1
# Nhiều giai đoạn: `dev` (Vite dev server, dùng với docker-compose.dev.yml) và `prod` (nginx, mặc định).

FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Phát triển ----
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---- Build bản tĩnh ----
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---- Chạy thật: nginx phục vụ file tĩnh + reverse proxy ----
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
