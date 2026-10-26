# [S-Call] Hệ thống nhắn tin và gọi thoại / video

Bài tập lớn IT4409 - Nhóm 6 - Mã lớp 172921
Ứng dụng web nhắn tin thời gian thực và gọi thoại / video.

## Mục lục

1.  [Kiến trúc](#1-kiến-trúc)
2.  [Yêu cầu](#2-yêu-cầu)
3.  [Chạy nhanh bằng Docker Compose](#3-chạy-nhanh-bằng-docker-compose)
4.  [Tài khoản demo](#4-tài-khoản-demo-seed-data)
5.  [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6.  [Chế độ phát triển (hot-reload)](#6-chế-độ-phát-triển-hot-reload)
7.  [Cloudflare Tunnel (HTTPS công khai)](#7-chạy-trên-cloudflare-tunnel)
8.  [Cuộc gọi qua mạng khác: TURN](#8-cuộc-gọi-qua-mạng-khác-turn-server)
9.  [Lệnh thường dùng](#9-lệnh-thường-dùng)
10. [Xử lý sự cố](#10-xử-lý-sự-cố)
11. [Ghi chú cho Frontend/Backend Dev](#11-ghi-chú-cho-frontendbackend-Dev)

---

## 1. Kiến trúc

```
                      ┌──────────────────────────────────────────────┐
 Trình duyệt ───────► │   frontend (nginx) → cổng 8080               │
 (HTTP/HTTPS)         │   /            → file tĩnh React (SPA)       │
                      │   /api/        → backend:3000  (REST)        │
                      │   /ws          → backend:3000  (WebSocket)   │
                      │   /avatars/, /chat-files/ → minio:9000       │
                      └───────┬───────────────────────┬──────────────┘
                              │                       │
                       ┌──────▼──────┐         ┌──────▼──────┐
                       │  backend    │────────►│   minio     │  (ảnh đại diện, file chat)
                       │ Express+ws  │         └─────────────┘
                       └──────┬──────┘
                              │
                       ┌──────▼──────┐        ┌─────────────┐
                       │  postgres   │        │   coturn    │  (STUN/TURN – UDP 3478 + 49160-49200)
                       └─────────────┘        └─────────────┘

   Tuỳ chọn: cloudflared ──► http://frontend:80   (đưa ra Internet bằng HTTPS)
```

| Service             | Image / Build              | Cổng host (mặc định)          | Vai trò                                                  |
|---------------------|----------------------------|-------------------------------|----------------------------------------------------------|
| `frontend`          | `./frontend` (nginx)       | **8080**                      | SPA + reverse proxy cho API, WebSocket, MinIO            |
| `backend`           | `./backend` (Node 22)      | 3000                          | REST API `/api/v1`, WebSocket `/ws`                      |
| `postgres`          | `postgres:16-alpine`       | 5433                          | CSDL, tự nạp schema + seed khi volume trống              |
| `minio`             | `alpine/minio` (cộng đồng) | 9000 (S3), 9001 (console)     | Lưu file                                                 |
| `minio-init`        | `amazon/aws-cli`           | –                             | Job chạy 1 lần: tạo bucket, nạp ảnh/file mẫu             |
| `coturn`            | `coturn/coturn:4.18.0`     | 3478 UDP/TCP, 49160–49200 UDP | STUN/TURN cho WebRTC                                     |
| `cloudflared`       | `cloudflare/cloudflared`   | –                             | (profile `tunnel`) Cloudflare Tunnel có tên miền riêng   |
| `cloudflared-quick` | `cloudflare/cloudflared`   | –                             | (profile `quick-tunnel`) Tunnel tạm, không cần tài khoản |

Đặc tả giao tiếp (hợp đồng giữa Frontend và Backend) nằm trong `doc/`:
`[S-Call] openapi.yaml` (REST) và `[S-Call] asyncapi.yaml` (WebSocket/Signaling).

## 2. Yêu cầu

- Docker Desktop (hoặc Docker Engine) có **Docker Compose v2.24+** (dùng `docker compose`, không phải `docker-compose`).
- Còn trống các cổng: 8080, 3000, 5433, 9000, 9001, 3478, 49160–49200 (đổi trong `.env` nếu bị trùng).
- Không cần cài Node.js/PostgreSQL trên máy nếu chỉ chạy bằng Docker.

## 3. Chạy nhanh bằng Docker Compose

```powershell
# 1) Tạo file cấu hình từ mẫu
copy .env.example .env # Linux/macOS: cp .env.example .env

# 2) Build và chạy toàn bộ
docker compose up -d --build

# 3) Kiểm tra (đợi khoảng 30–60 giây cho lần đầu)
docker compose ps
```

Lần chạy đầu Postgres tự thực thi `Database/000_RelationshipTable.sql` (schema) rồi `Database/001_SeedData.sql` (dữ liệu mẫu),
`minio-init` tạo bucket và nạp ảnh/file mẫu.

| Địa chỉ                             | Mô tả                                                                               |
|-------------------------------------|-------------------------------------------------------------------------------------|
| http://localhost:8080               | Ứng dụng (frontend)                                                                 |
| http://localhost:8080/api/v1/health | Kiểm tra backend/DB/MinIO → `{"status":"ok","database":"up","storage":"up"}`        |
| http://localhost:3000/api/v1/health | Gọi thẳng backend (bỏ qua nginx)                                                    |
| http://localhost:9001               | MinIO Console (đăng nhập bằng `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD` trong `.env`) |
| `localhost:5433`                    | PostgreSQL (`psql -h localhost -p 5433 -U scall scall`)                             |

> **Lưu ý:** `.env` bị `.gitignore` loại nên không có trong repo. Sau khi clone, bắt buộc phải tạo `.env`
> từ `.env.example` và **đổi các secret** (`JWT_*`, `TURN_SECRET`, mật khẩu DB/MinIO) nếu đưa lên Internet.

### Nạp lại dữ liệu mẫu từ đầu

Script seed chỉ chạy khi volume Postgres còn trống. Muốn reset toàn bộ (xoá cả DB và file MinIO):

```powershell
docker compose down -v
docker compose up -d --build
```

### Dừng

```powershell
docker compose down    # dừng, giữ dữ liệu
docker compose down -v # dừng và xoá dữ liệu
```

## 4. Tài khoản demo (Seed Data)

Mật khẩu chung cho **mọi** tài khoản: `Scall@2026`. Email dạng `<username>@scall.local`.
Mã PIN của hội thoại bị khoá giữa `minhanh` và `hoangnam`: `1234`.

| Username     | Họ tên hiển thị  | Vai trò / trạng thái         | Dùng để demo                                                    |
|--------------|------------------|------------------------------|-----------------------------------------------------------------|
| `superadmin` | Quản trị cấp cao | Super Admin                  | Quản lý admin, toàn quyền, cảnh báo đăng nhập qua email         |
| `admin`      | Admin Hệ Thống   | Admin                        | Quản lý người dùng: khoá / mở khoá, xoá mềm, xem audit log      |
| `minhanh`    | Nguyễn Minh Anh  | User chính                   | Tài khoản trung tâm: có đủ bạn bè, nhóm, cuộc gọi, tin chưa đọc |
| `quocbao`    | Trần Quốc Bảo    | User, bạn của `minhanh`      | Chat 1-1, gọi video, Trưởng nhóm "Nhóm Web"                     |   
| `hoangnam`   | Lê Hoàng Nam     | User, bạn của `minhanh`      | Hội thoại khoá PIN (`1234`), cuộc gọi thoại                     |
| `tuankiet`   | Phạm Tuấn Kiệt   | User, bạn của `minhanh`      | Cuộc gọi bị từ chối, có 2 tin nhắn chưa đọc                     |
| `thutrang`   | Hoàng Thu Trang  | User, bạn của `minhanh`      | Thành viên nhóm, chưa có hội thoại 1 - 1 với `minhanh`          |
| `giahuy`     | Đặng Gia Huy     | Người lạ                     | Tìm kiếm và gửi lời mời kết bạn tới `minhanh`                   |
| `phuongthao` | Đỗ Phương Thảo   | Đã gửi lời mời tới `minhanh` | Chấp nhận / từ chối lời mời kết bạn đến                         |
| `thanhha`    | Ngô Thanh Hà     | Nhận lời mời từ `minhanh`    | Lời mời đang chờ (chiều gửi đi)                                 |
| `vantoan99`  | Bùi Văn Toàn     | Bị `minhanh` chặn            | Tính năng chặn / bỏ chặn người dùng                             |
| `quockhanh`  | Lý Quốc Khánh    | Bị admin khoá (`banned`)     | Đăng nhập thất bại do tài khoản bị khoá; Admin demo Mở khoá     |
| `dinhkhoa`   | Vũ Đình Khoa     | Đã vô hiệu (`deactivated`)   | Tài khoản tự vô hiệu hoá; đăng nhập lại để kích hoạt            |

Dữ liệu hội thoại: 3 chat 1-1 (`minhanh`–`quocbao` có ảnh, tin thu hồi, cuộc gọi video 03:15 có chia sẻ màn hình, cuộc gọi nhỡ;
`minhanh`–`hoangnam` khoá PIN; `minhanh`–`tuankiet` có cuộc gọi bị từ chối), nhóm **"BTL Web 36"** (40 tin nhắn thảo luận tự nhiên để thử phân trang, file `.pdf`/`.zip`, tin của "Người dùng đã xóa") và nhóm **"Nhóm Web"**. OTP mẫu trong `email_outbox`: `482913`.

> Kịch bản demo chi tiết từng bước: xem phụ lục trong `Docs/TestCases.md`.

## 5. Cấu trúc thư mục

```
.
├── docker-compose.yml              # Stack chạy thật (prod): postgres, minio, coturn, backend, frontend, cloudflared
├── docker-compose.dev.yml          # Override cho phát triển (hot-reload)
├── .env.example                    # Mẫu biến môi trường (commit)
├── .env                            # Biến môi trường thật (KHÔNG commit)
├── database/
│   ├── 000_RelationshipTable.sql   # Schema (bảng, index, trigger)
│   └── 001_SeedData.sql            # Dữ liệu mẫu cho demo
├── doc/                            # PRD, OpenAPI, AsyncAPI, ERD, Sequence Diagram, Test Cases
├── docker/minio/seed/              # Ảnh đại diện, file đính kèm mẫu (khớp với seed SQL)
├── backend/                        # Express + ws + pg + minio (khung)
│   └── src/{index,config,db,storage,turn,ws}.js, routes/health.js
└── frontend/                       # React 19 + Vite + Tailwind 4 (khung)
    ├── nginx.conf                  # Reverse proxy cho bản prod
    └── src/{main.jsx,App.jsx,index.css}, lib/{api,socket}.js
```

## 6. Chế độ phát triển (hot-reload)

Dùng file override `docker-compose.dev.yml`: backend chạy `node --watch`, frontend chạy Vite dev server, mã nguồn được mount từ máy.
Postgres, MinIO, Coturn vẫn chạy như bình thường.

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

- Ứng dụng: http://localhost:5173 (Vite proxy sẵn `/api`, `/ws`, `/avatars`, `/chat-files`).
- API trực tiếp: http://localhost:3000/api/v1/health.
- Sau khi thêm / xoá package trong `package.json`, `node_modules` nằm trong volume riêng nên cần cài lại:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npm install
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm install
```

- Quay lại chế độ chạy thật: `docker compose up -d --build`.

Nếu muốn chạy backend/frontend trực tiếp trên máy (không Docker) vẫn được: chỉ chạy `postgres`, `minio`, `minio-init`, `coturn`
bằng Compose, rồi `npm install && npm run dev` trong `backend/` và `frontend/`.
Khi đó `.env` cần trỏ `localhost` (ví dụ `DATABASE_URL=postgres://scall:...@localhost:5433/scall`, `MINIO_ENDPOINT=localhost`).

## 7. Chạy trên Cloudflare Tunnel

Camera / Micro của trình duyệt **chỉ hoạt động trên HTTPS** (hoặc `localhost`). Để demo gọi video giữa hai thiết bị (ví dụ điện thoại),
cần một địa chỉ HTTPS công khai. Cloudflare Tunnel cung cấp việc này mà không cần mở cổng router.
Nginx của `frontend` là điểm vào duy nhất, nên **chỉ cần một Public Hostname trỏ tới `http://frontend:80`**
(đã bao gồm REST, WebSocket và file MinIO).

### Cách A – Tunnel có tên miền cố định (khuyến nghị)

Yêu cầu: tài khoản Cloudflare và một tên miền đã thêm vào Cloudflare.

1. Vào [Cloudflare Zero Trust](https://one.dash.cloudflare.com) → **Networks → Tunnels → Create a tunnel** → chọn **Cloudflared**, đặt tên (ví dụ `scall`).
2. Ở bước cài đặt, chọn Docker và sao chép **token** (chuỗi dài sau `--token`).
3. Tab **Public Hostname → Add**:
   - Subdomain/Domain: ví dụ `scall.example.com`
   - Service: **Type `HTTP`**, **URL `frontend:80`**
4. Sửa `.env`:

   ```env
   CLOUDFLARE_TUNNEL_TOKEN=<token vừa sao chép>
   PUBLIC_URL=https://scall.example.com
   # MINIO_PUBLIC_URL mặc định = ${PUBLIC_URL}, giữ nguyên
   ```

5. Khởi động cùng profile `tunnel`:

   ```powershell
   docker compose --profile tunnel up -d --build
   ```

6. Mở https://scall.example.com. Kiểm tra: `docker compose logs cloudflared` phải có dòng `Registered tunnel connection`.

### Cách B – Quick Tunnel (thử nhanh, không cần tài khoản/tên miền)

```powershell
docker compose --profile quick-tunnel up -d --build
docker compose logs cloudflared-quick # tìm dòng https://<ngẫu-nhiên>.trycloudflare.com
```

Mở URL `https://....trycloudflare.com` hiển thị trong log. URL **đổi mỗi lần khởi động lại container**, nên cần đặt lại
`PUBLIC_URL` (và `MINIO_PUBLIC_URL`) trong `.env` rồi chạy lại `docker compose up -d backend` để các link tải file/ảnh có chữ ký
được tạo đúng domain.

### Điểm cần nhớ khi dùng Tunnel

- `PUBLIC_URL` **phải khớp** với địa chỉ người dùng truy cập (dùng để ký URL tải file MinIO - chữ ký bao gồm Host). Sau khi đổi, chạy `docker compose up -d backend`.
- WebSocket đi qua cùng tên miền (`wss://<tên-miền>/ws`), Cloudflare hỗ trợ sẵn, không cần cấu hình thêm.
- Giới hạn upload của Cloudflare gói miễn phí là 100 MB/request; ứng dụng giới hạn file 20 MB nên không ảnh hưởng.
- **Tunnel không chuyển được UDP** → gọi giữa hai mạng khác nhau cần cấu hình TURN ở mục dưới.

## 8. Cuộc gọi qua mạng khác: TURN server

WebRTC truyền âm thanh/hình ảnh trực tiếp (UDP) giữa hai trình duyệt, **không đi qua Cloudflare Tunnel**.
- Hai thiết bị **cùng mạng LAN/Wi-Fi**: hoạt động ngay với cấu hình mặc định (dùng STUN).
- Hai thiết bị **khác mạng** (ví dụ 4G và Wi-Fi): thường cần TURN relay. Chọn một trong hai cách:

### Cách 1 – Dùng Coturn trong Compose (cần IP công khai)

1. Mở/chuyển tiếp (port-forward) trên router về máy chạy Docker: **UDP + TCP 3478** và **UDP 49160–49200**.
   Cho phép trong Windows Firewall.
2. Trong `.env` (thay `203.0.113.10` bằng IP công khai của mạng, xem tại https://ifconfig.me):

   ```env
   TURN_MODE=coturn
   TURN_EXTERNAL_IP=203.0.113.10
   TURN_URLS=turn:203.0.113.10:3478?transport=udp,turn:203.0.113.10:3478?transport=tcp
   ```

3. `docker compose up -d coturn backend`.
4. Backend cấp **credential tạm thời** cho từng người dùng (TURN REST API, HMAC-SHA1 với `TURN_SECRET`, hết hạn sau
   `TURN_CREDENTIAL_TTL_SECONDS`). Frontend lấy `iceServers` từ API (xem OpenAPI) – không nhúng mật khẩu TURN vào mã nguồn.
5. Kiểm tra bằng https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/ (nhập URL TURN và username/credential lấy từ API; cần thấy ứng viên loại `relay`).

### Cách 2 – Dịch vụ TURN bên ngoài (Metered.ca, không cần mở cổng)

Đăng ký gói miễn phí tại https://www.metered.ca/stun-turn, rồi đặt:

```env
TURN_MODE=metered
METERED_APP_NAME=<tên app>
METERED_API_KEY=<api key>
```

Khi đó có thể dừng container `coturn`: `docker compose stop coturn`.

> Nếu không cấu hình TURN, cuộc gọi cùng mạng vẫn bình thường; cuộc gọi khác mạng có thể không kết nối được
> (hiển thị trạng thái "Kết nối thất bại" theo thiết kế).

## 9. Lệnh thường dùng

```powershell
docker compose logs -f backend                      # xem log một service
docker compose restart backend                      # khởi động lại
docker compose up -d --build backend                # build lại sau khi sửa code (chế độ prod)
docker compose exec postgres psql -U scall -d scall # mở psql
docker compose config --quiet                       # kiểm tra cú pháp compose/.env
docker compose ps                                   # trạng thái
```

## 10. Xử lý sự cố

| Triệu chứng                                                 | Nguyên nhân / cách xử lý                                                                 |
|-------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `port is already allocated`                                 | Cổng bị trùng, đổi `FRONTEND_PORT`, `BACKEND_PORT`, `POSTGRES_PORT`,... trong `.env`.    |
| Đổi seed/schema nhưng dữ liệu không đổi                     | Script init chỉ chạy khi volume trống: `docker compose down -v` rồi `up -d --build`.     |
| Tiếng Việt hiển thị sai khi dùng `psql` trên Windows        | Đặt `$env:PGCLIENTENCODING="UTF8"` trước khi chạy `psql`.                                |
| Ảnh/file tải về lỗi `403 SignatureDoesNotMatch`             | `PUBLIC_URL`/`MINIO_PUBLIC_URL` không khớp địa chỉ, chạy `docker compose up -d backend`. |
| Không bật được camera/micro                                 | Trang không ở HTTPS. Dùng `http://localhost:8080` trên cùng máy, hoặc Cloudflare Tunnel. |
| Gọi khác mạng mãi "đang kết nối"                            | Chưa có TURN khả dụng.                                                                   |
| `minio-init` báo lỗi                                        | MinIO chưa sẵn sàng hoặc sai `MINIO_ROOT_*`. Chạy: `docker compose up -d minio-init`.    |
| Sau khi sửa file `.sh`/`.sql`/`.conf` trên Windows lỗi `\r` | Dự án có `.gitattributes` ép LF; nếu vẫn lỗi, chuyển file sang LF trong editor.          |
| `.env` bị đổi mà container không nhận                       | `docker compose up -d` (tạo lại container); biến chỉ đọc lúc tạo container.              |

## 11. Ghi chú cho Frontend/Backend Dev

**Cảnh báo bảo mật:** với `APP_ENV=development` backend bật `GET /dev/emails` và trường `debugOtp` (để hiển thị OTP/mail cảnh báo
trên màn hình theo yêu cầu demo). Khi công khai ra Internet hãy đổi secret trong `.env`; chỉ giữ chế độ này trong lúc demo.

**Backend** (`backend/`) – đã có: Express, `/api/v1/health`, kết nối Postgres / MinIO, hàm ký URL tải file (`storage.js`),
sinh credential TURN (`turn.js`), khung WebSocket tại `/ws` (xác thực bằng ticket, mã đóng 4001/4003/4004/4009, ping/pong).
Cần làm: các route theo `doc/[S-Call] openapi.yaml`, các sự kiện chat / call theo `doc/[S-Call] asyncapi.yaml`. 
Mật khẩu trong seed là bcrypt `$2a$` (tương thích `bcryptjs`).

**Frontend** (`frontend/`) – đã có: Vite + React 19 + Tailwind 4, layout responsive (2 cột desktop / 1 cột mobile), `lib/api.js`
(gọi `/api/v1`), `lib/socket.js` (luồng lấy ws-ticket rồi mở WebSocket). Dùng đường dẫn tương đối (`/api/v1`, `/ws`) để chạy được
cả ở localhost lẫn sau Cloudflare Tunnel.

**Tài liệu liên quan:** `doc/[S-Call] Product Requirements Document.pdf`, `doc/[S-Call] Entity Relationship Diagram.pdf`,
`doc/[S-Call] Sequence Diagram.pdf`, `doc/TestCases.md`.