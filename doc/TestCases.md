# [S-Call] Tài liệu kiểm thử (Test Cases)

Dự án BTL IT4409 - Nhóm 6. Tài liệu bám theo các tính năng trong *Product Requirements Document* (PRD v1.1),
đặc tả `[S-Call] openapi.yaml` / `[S-Call] asyncapi.yaml` và dữ liệu mẫu `database/001_SeedData.sql`.

## Mục lục

1. [Phạm vi và quy ước](#1-phạm-vi-và-quy-ước)
2. [Môi trường và dữ liệu kiểm thử](#2-môi-trường-và-dữ-liệu-kiểm-thử)
3. [Test case chức năng](#3-test-case-chức-năng)
4. [Test case phi chức năng](#4-test-case-phi-chức-năng)
5. [Ma trận truy vết yêu cầu](#5-ma-trận-truy-vết-yêu-cầu)
6. [Phụ lục A - Kịch bản demo](#6-phụ-lục-a---kịch-bản-demo)
7. [Phụ lục B - Biên bản kết quả kiểm thử (mẫu)](#7-phụ-lục-b---biên-bản-kết-quả-kiểm-thử-mẫu)

---

## 1. Phạm vi và quy ước

**Trong phạm vi:** Các tính năng của PRD (đăng ký / đăng nhập / hồ sơ, kết bạn, trạng thái online, nhắn tin 1 - 1 / nhóm, tìm kiếm
và phân trang, khoá PIN, gọi thoại / video, chia sẻ màn hình và lịch sử cuộc gọi, quản trị hệ thống, quản trị Admin) và các
yêu cầu phi chức năng (độ trễ, responsive, bảo mật).

**Ngoài phạm vi:** gọi nhóm, ứng dụng native, newsfeed, mã hoá đầu cuối, gửi email thật qua SMTP.

**Quy ước cột:**

| Cột       | Ý nghĩa                                                                                                                |
|-----------|------------------------------------------------------------------------------------------------------------------------|
| ID        | Mã test case. Tiền tố: `AUTH` đăng ký/đăng nhập, `FRD` bạn bè, `PRS` online, `MSG` nhắn tin, `SRC` tìm kiếm/phân trang, `PIN` khoá chat, `CALL` gọi, `HIS` lịch sử/chia sẻ màn hình, `ADM` quản trị, `SAD` Super Admin, `NFR` phi chức năng                                   |
| Ưu tiên   | **P1** bắt buộc đạt khi triển khai sản phẩm, **P2** quan trọng, **P3** bổ sung                                         |
| Loại      | **Đ** = kịch bản đúng (positive), **S** = kịch bản sai/biên (negative/boundary)                                        |
| Liên quan | Endpoint REST (`openapi`) hoặc sự kiện WebSocket (`asyncapi`)                                                          |
| Kết quả   | Cột trống để ghi **Pass / Fail** khi chạy kiểm thử (xem Phụ lục B)                                                     |

Mọi tài khoản mẫu có mật khẩu `Scall@2026` (xem README mục 4). Tiền điều kiện chung: hệ thống đã chạy bằng
`docker compose up -d --build` trên DB mới (`docker compose down -v` trước đó) và truy cập `http://localhost:8080`.

## 2. Môi trường và dữ liệu kiểm thử

| Hạng mục    | Giá trị                                                                                                |
|-------------|--------------------------------------------------------------------------------------------------------|
| Trình duyệt | Chrome/Edge bản mới nhất (chính), Firefox, Safari iOS hoặc Chrome Android (di động)                    |
| Thiết bị    | 1 máy tính + 1 điện thoại (hoặc 2 cửa sổ ẩn danh cho test không cần thiết bị thật)                     |
| Mạng        | LAN chung cho test chức năng; Wi-Fi + 4G cho test gọi khác mạng (cần TURN, README mục 8)               |
| HTTPS       | Cloudflare Tunnel (README mục 7) cho test Camera/Mic trên điện thoại                                   |
| Công cụ     | Trình duyệt DevTools (Network, WS), `psql`, Postman/curl, MinIO Console `:9001`, `docker compose logs` |
| Chế độ mail | `MAIL_MODE=dev`, `APP_ENV=development`: OTP trả trong `debugOtp`, mail xem ở `GET /dev/emails`         |

**Dữ liệu mẫu dùng trong test (`001_SeedData.sql`):**

| Tài khoản            | Họ tên                 | Trạng thái            | Dữ liệu liên quan                                                            |
|----------------------|------------------------|-----------------------|------------------------------------------------------------------------------|
| `minhanh`            | Nguyễn Minh Anh        | `active` (user chính) | Bạn của `quocbao`, `hoangnam`, `tuankiet`, `thutrang`; 3 chat 1-1; nhóm **BTL Web 36** (Trưởng nhóm) và nhóm **Nhóm Web** (thành viên) |
| `quocbao`            | Trần Quốc Bảo          | `active`              | Trưởng nhóm **Nhóm Web** (Lớp Công nghệ Web); chưa đọc tin cuối của `minhanh` trong chat `minhanh`–`quocbao`; gửi ảnh `memechongheorach.png` |
| `hoangnam`           | Lê Hoàng Nam           | `active`              | Chat `minhanh`–`hoangnam`,khoá PIN:`1234`(phía `minhanh`), có cuộc gọi `01:02` và 1 tin chưa đọc của `minhanh` |
| `tuankiet`           | Phạm Tuấn Kiệt         | `active`              | Chat `minhanh`–`tuankiet`: cuộc gọi bị từ chối, 2 tin chưa đọc của `minhanh` |
| `thutrang`           | Hoàng Thu Trang        | `active`              | Bạn của `minhanh` nhưng **chưa có** chat 1 - 1; thành viên nhóm **Nhóm Web** |
| `giahuy`             | Đặng Gia Huy           | `active`              | Người lạ để tìm kiếm / gửi lời mời kết bạn                                   |
| `phuongthao`         | Đỗ Phương Thảo         | `active`              | Đã gửi lời mời kết bạn cho `minhanh` (đang chờ Chấp nhận/Từ chối)            |
| `thanhha`            | Ngô Thanh Hà           | `active`              | `minhanh` đã gửi lời mời kết bạn (đang chờ)                                  |
| `vantoan99`          | Bùi Văn Toàn           | `active`              | Bị `minhanh` chặn (Block)                                                    |
| `quockhanh`          | Lý Quốc Khánh          | `banned`              | Không thể đăng nhập; dùng để Admin demo mở khoá                              |
| `dinhkhoa`           | Vũ Đình Khoa           | `deactivated`         | Tự vô hiệu hoá; đăng nhập lại để kích hoạt                                   |
| `admin`/`superadmin` | Admin Hệ Thống/cấp cao | `admin`/`super_admin` | Quản trị hệ thống và quản trị tài khoản Admin                                |

---

## 3. Test case chức năng

### 3.1 Đăng ký, đăng nhập và hồ sơ (Tính năng 1)

| ID      | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---------|---|---|---|---|---|---|---|---|
| AUTH-01 | Đăng ký thành công | Chưa có tài khoản `tester01` | Mở trang Đăng ký, nhập Email `tester01@scall.local`, Username `tester01`, Họ tên `Tester Một`, Mật khẩu `Scall@2026`, bấm Đăng ký | Tạo tài khoản, hiển thị thông báo thành công/chuyển vào ứng dụng; DB có bản ghi `users` với `password_hash` bắt đầu `$2` (bcrypt), không lưu mật khẩu gốc | Đ | P1 | `POST /auth/register` | |
| AUTH-02 | Đăng ký thiếu trường bắt buộc | – | Bỏ trống lần lượt Email, Username, Họ tên, Mật khẩu rồi gửi | Mỗi trường trống đều báo lỗi `400` và thông báo tại ô tương ứng; không tạo tài khoản | S | P1 | `POST /auth/register` | |
| AUTH-03 | Đăng ký trùng email/username | `minhanh` đã tồn tại | Đăng ký với Username `minhanh`; lặp lại với Email `minhanh@scall.local` | Báo lỗi `409` (trùng), không tạo thêm bản ghi | S | P1 | `POST /auth/register` | |
| AUTH-04 | Đăng ký định dạng sai | – | Email `abc`; Username có khoảng trắng/ký tự đặc biệt; mật khẩu quá ngắn | Báo lỗi validate `400` cho từng trường | S | P2 | `POST /auth/register` | |
| AUTH-05 | Đăng nhập bằng Username | – | Đăng nhập `minhanh` / `Scall@2026` | Thành công, nhận access token, vào màn hình chat với dữ liệu mẫu của `minhanh` | Đ | P1 | `POST /auth/login` | |
| AUTH-06 | Đăng nhập bằng Email | – | Đăng nhập `minhanh@scall.local` / `Scall@2026` | Thành công như AUTH-05 | Đ | P1 | `POST /auth/login` | |
| AUTH-07 | Sai mật khẩu | – | Đăng nhập `minhanh` / `saimatkhau` | `401`, thông báo chung chung (không tiết lộ tồn tại tài khoản), không có token | S | P1 | `POST /auth/login` | |
| AUTH-08 | Tài khoản không tồn tại | – | Đăng nhập `khongco` / bất kỳ | `401`, cùng thông báo như AUTH-07 | S | P2 | `POST /auth/login` | |
| AUTH-09 | Tài khoản bị khoá | `quockhanh` đang `banned` | Đăng nhập `quockhanh` / `Scall@2026` | Từ chối (`403`), thông báo tài khoản bị khoá | S | P1 | `POST /auth/login` | |
| AUTH-10 | Duy trì phiên và refresh token | Đã đăng nhập | Tải lại trang (F5); chờ access token hết hạn rồi thao tác | Vẫn đăng nhập (dùng refresh token), không phải nhập lại mật khẩu | Đ | P2 | `POST /auth/refresh` | |
| AUTH-11 | Đăng xuất | Đã đăng nhập | Bấm Đăng xuất; thử mở lại trang chat; thử dùng refresh token cũ | Về màn hình đăng nhập; refresh token cũ bị từ chối; WebSocket đóng | Đ | P1 | `POST /auth/logout` | |
| AUTH-12 | Cập nhật hồ sơ | Đăng nhập `minhanh` | Đổi Họ tên và Giới thiệu ngắn, lưu, tải lại trang | Giá trị mới được lưu và hiển thị; bạn bè thấy tên mới | Đ | P2 | `PATCH /users/me` | |
| AUTH-13 | Tải ảnh đại diện | Đăng nhập | Chọn ảnh PNG/JPG < 20MB làm ảnh đại diện | Ảnh mới hiển thị; object lưu trong bucket `avatars` của MinIO | Đ | P2 | `PUT /users/me/avatar` | |
| AUTH-14 | Ảnh đại diện sai định dạng | Đăng nhập | Tải file `.exe`/`.pdf` làm ảnh đại diện | Từ chối với lỗi `400/415`, ảnh cũ giữ nguyên | S | P3 | `PUT /users/me/avatar` | |
| AUTH-15 | Đổi mật khẩu | Đăng nhập một tài khoản thử (`tester01`) | Nhập mật khẩu cũ đúng, mật khẩu mới + xác nhận, lưu; đăng xuất và đăng nhập lại | Đăng nhập được bằng mật khẩu mới, mật khẩu cũ không còn hiệu lực | Đ | P2 | `PUT /users/me/password` | |
| AUTH-16 | Đổi mật khẩu sai mật khẩu cũ | Đăng nhập | Nhập mật khẩu cũ sai | `400/401`, mật khẩu không đổi | S | P2 | `PUT /users/me/password` | |
| AUTH-17 | Quên mật khẩu – nhận OTP | `quocbao` tồn tại | Chọn Quên mật khẩu, nhập `quocbao` (hoặc `quocbao@scall.local`); xem OTP trên màn hình (`debugOtp`) hoặc `/dev/emails` | Trả OTP 6 chữ số (dev), có bản ghi trong `email_outbox`, thông báo đã gửi mã | Đ | P1 | `POST /auth/forgot-password`, `GET /dev/emails` | |
| AUTH-18 | Quên mật khẩu – đặt lại thành công | Đã có OTP hợp lệ (AUTH-17) | Nhập Email, OTP, Mật khẩu mới, Xác nhận; đăng nhập lại | Đổi thành công; đăng nhập được bằng mật khẩu mới | Đ | P1 | `POST /auth/reset-password` | |
| AUTH-19 | OTP sai/hết hạn/dùng lại | Đã có OTP | (a) nhập sai OTP 5 lần; (b) dùng OTP sau 10 phút; (c) dùng lại OTP đã dùng | Cả ba trường hợp bị từ chối; sai quá số lần cho phép thì OTP bị vô hiệu | S | P1 | `POST /auth/reset-password` | |
| AUTH-20 | Quên mật khẩu – xác nhận không khớp | OTP hợp lệ | Mật khẩu mới ≠ Xác nhận | Báo lỗi, không đổi mật khẩu | S | P3 | `POST /auth/reset-password` | |
| AUTH-21 | Tự vô hiệu hoá tài khoản | Đăng nhập `tester01` | Cài đặt → Vô hiệu hoá (nhập mật khẩu) | Bị đăng xuất mọi phiên; WebSocket đóng; người khác không tìm thấy `tester01` | Đ | P1 | `POST /users/me/deactivate` | |
| AUTH-22 | Đăng nhập lại để kích hoạt | `dinhkhoa` đang `deactivated` (hoặc `tester01` từ AUTH-21) | Đăng nhập lại bằng đúng mật khẩu (`Scall@2026`) | Tài khoản trở lại `active`, đăng nhập thành công, tìm kiếm thấy lại | Đ | P1 | `POST /auth/login` | |
| AUTH-23 | Truy cập API không token | – | Gọi `GET /api/v1/users/me` không có header `Authorization` | `401` | S | P1 | `GET /users/me` | |
| AUTH-24 | Token giả/sai chữ ký | – | Gọi API với JWT bị sửa một ký tự | `401`, không truy cập được dữ liệu | S | P1 | mọi endpoint bảo vệ | |

### 3.2 Tìm kiếm và kết bạn (Tính năng 2)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| FRD-01 | Tìm theo Username | Đăng nhập `minhanh` | Nhập `giahuy` vào ô tìm kiếm | Hiển thị `giahuy` (Đặng Gia Huy) kèm nút Gửi lời mời | Đ | P1 | `GET /users/search` | |
| FRD-02 | Tìm theo Email | Đăng nhập `minhanh` | Nhập `giahuy@scall.local` | Hiển thị `giahuy` | Đ | P1 | `GET /users/search` | |
| FRD-03 | Không tìm thấy tài khoản đã khoá/vô hiệu/xoá | Đăng nhập `minhanh` | Tìm `dinhkhoa` (deactivated), `quockhanh` (banned), tên tài khoản đã xoá | Không có kết quả | S | P1 | `GET /users/search` | |
| FRD-04 | Không tìm thấy người đã chặn mình/mình chặn | `minhanh` đã chặn `vantoan99` | `minhanh` tìm `vantoan99`; `vantoan99` tìm `minhanh` | Cả hai đều không thấy nhau | S | P1 | `GET /users/search` | |
| FRD-05 | Gửi lời mời kết bạn | `minhanh` và `giahuy` chưa là bạn | `minhanh` gửi lời mời cho `giahuy` | Nút chuyển "Đã gửi"; `giahuy` nhận thông báo realtime `friend.request.received` và thấy lời mời | Đ | P1 | `POST /friend-requests`, WS `friend.request.received` | |
| FRD-06 | Gửi lời mời trùng/đã là bạn/chính mình | – | (a) gửi lại cho `thanhha`; (b) gửi cho `quocbao`; (c) gửi cho chính mình | Cả ba bị từ chối (`409/400`), không tạo bản ghi mới | S | P2 | `POST /friend-requests` | |
| FRD-07 | Chấp nhận lời mời | `phuongthao` đã gửi lời mời cho `minhanh` | `minhanh` mở danh sách lời mời, bấm Chấp nhận | Hai bên thành bạn bè; `phuongthao` nhận `friend.request.accepted`; xuất hiện trong danh sách bạn của cả hai | Đ | P1 | `POST /friend-requests/{id}/accept`, WS `friend.request.accepted` | |
| FRD-08 | Từ chối lời mời | Có lời mời đang chờ (dùng `giahuy` → `minhanh` mới tạo) | `minhanh` bấm Từ chối | Lời mời biến mất, không thành bạn bè; `giahuy` có thể gửi lại sau đó | Đ | P2 | `POST /friend-requests/{id}/reject` | |
| FRD-09 | Huỷ lời mời đã gửi | `minhanh` đã gửi cho `thanhha` | `minhanh` huỷ lời mời | Lời mời bị xoá/huỷ, `thanhha` không còn thấy | Đ | P3 | `DELETE /friend-requests/{id}` | |
| FRD-10 | Danh sách bạn bè | Đăng nhập `minhanh` | Mở danh sách bạn bè | Thấy `quocbao`, `hoangnam`, `tuankiet`, `thutrang` (+ `phuongthao` nếu đã chấp nhận); mỗi người có trạng thái hoạt động | Đ | P1 | `GET /friends` | |
| FRD-11 | Huỷ kết bạn | `minhanh` và `thutrang` là bạn | `minhanh` huỷ kết bạn với `thutrang` | Không còn trong danh sách bạn của cả hai; `thutrang` nhận `friend.removed` | Đ | P1 | `DELETE /friends/{userId}`, WS `friend.removed` | |
| FRD-12 | Huỷ kết bạn vẫn giữ hội thoại | `minhanh` và `quocbao` có chat | `minhanh` huỷ kết bạn với `quocbao` (làm sau khi hoàn tất test khác với `quocbao`) | Lịch sử chat `minhanh`–`quocbao` vẫn còn đọc được (đúng PRD) | Đ | P1 | `DELETE /friends/{userId}` | |
| FRD-13 | Chặn người dùng | `minhanh` và `tuankiet` là bạn | `minhanh` chặn `tuankiet` | Đồng thời huỷ kết bạn; `tuankiet` không nhắn/gọi được cho `minhanh`, không tìm thấy `minhanh` | Đ | P1 | `POST /blocks` | |
| FRD-14 | Người bị chặn gửi tin/gọi | Đã chặn (FRD-13) | `tuankiet` thử gửi tin nhắn và gọi cho `minhanh` | Bị từ chối (lỗi/ack lỗi), `minhanh` không nhận được tin hay cuộc gọi | S | P1 | WS `message.send`, `call.invite` | |
| FRD-15 | Danh sách chặn và bỏ chặn | `minhanh` đã chặn `vantoan99` (seed) | Mở Danh sách chặn, thấy `vantoan99`, bấm Bỏ chặn | `vantoan99` biến khỏi danh sách; hai bên tìm thấy nhau trở lại (chưa là bạn) | Đ | P1 | `GET /blocks`, `DELETE /blocks/{userId}` | |

### 3.3 Trạng thái Online / Offline (Tính năng 3)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| PRS-01 | Báo online khi mở web | `minhanh`, `quocbao` là bạn; `minhanh` đang mở danh sách bạn | `quocbao` đăng nhập ở trình duyệt khác | Trong < 1s, `quocbao` hiện chấm xanh "Đang hoạt động" ở máy `minhanh` | Đ | P1 | WS `connection.ready`, `presence.updated` | |
| PRS-02 | Báo offline khi đóng tab | `quocbao` online | `quocbao` đóng tab | `minhanh` thấy `quocbao` offline kèm "Truy cập lần cuối"; DB `users.last_seen_at` cập nhật | Đ | P1 | WS `presence.updated` | |
| PRS-03 | Nhiều tab cùng một tài khoản | `quocbao` mở 2 tab | Đóng một tab | `quocbao` vẫn online (còn kết nối); chỉ offline khi đóng hết | Đ | P2 | WS `presence.updated` | |
| PRS-04 | Mất kết nối đột ngột | `quocbao` online | Tắt mạng máy `quocbao` ~60 giây | Cơ chế ping/pong phát hiện, `quocbao` chuyển offline | Đ | P2 | WS `ping`/`pong` | |
| PRS-05 | Tự kết nối lại | Đang mở chat | Ngắt rồi bật lại mạng | Giao diện tự kết nối lại, tin mới nhận đầy đủ (không phải tải lại trang) | Đ | P2 | WS `/ws` | |
| PRS-06 | Kết nối WebSocket không có ticket | – | Mở `ws://localhost:8080/ws` không kèm ticket | Server đóng với mã `4001` | S | P1 | WS `/ws` | |
| PRS-07 | Ticket dùng lại/hết hạn | Có ticket | Dùng cùng ticket lần hai hoặc sau khi hết hạn | Bị đóng (`4001`/`4003`) | S | P2 | `POST /auth/ws-ticket` | |

### 3.4 Nhắn tin 1 - 1 và nhóm (Tính năng 4)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| MSG-01 | Gửi/nhận văn bản 1-1 realtime | `minhanh` và `quocbao` mở chat với nhau (2 trình duyệt) | `minhanh` gửi "Xin chào" | `quocbao` nhận ngay không cần tải lại (< 1s); tin hiển thị ở cả hai; DB có bản ghi `messages` | Đ | P1 | WS `message.send`, `message.new` | |
| MSG-02 | Tin nhắn có tiếng Việt/emoji/ký tự đặc biệt | Chat đang mở | Gửi `Xin chào 😀 <b>test</b> & "dấu nháy"` | Hiển thị nguyên văn, **không** render HTML (chống XSS) | Đ | P1 | WS `message.send` | |
| MSG-03 | Tin rỗng/quá dài | Chat đang mở | Gửi tin chỉ có khoảng trắng; gửi tin vượt giới hạn độ dài | Tin rỗng bị chặn; tin quá dài bị từ chối kèm thông báo | S | P2 | WS `message.send` | |
| MSG-04 | Trạng thái "Đang soạn tin…" | `minhanh`–`quocbao` mở chat | `minhanh` gõ chữ vào ô nhập (chưa gửi) | `quocbao` thấy "minhanh đang soạn tin…" và tự biến mất sau khi ngừng gõ | Đ | P1 | WS `typing.update`, `typing.updated` | |
| MSG-05 | Trạng thái Đã gửi / Đã xem | `minhanh` gửi tin cho `quocbao` (hoặc xem tin cuối trong chat `minhanh`–`quocbao` từ seed) | (a) `quocbao` offline hoặc chưa mở chat; (b) `quocbao` mở chat | (a) tin ở trạng thái "Đã gửi"; (b) chuyển "Đã xem" ở máy `minhanh` | Đ | P1 | WS `message.read`, `conversation.read` | |
| MSG-06 | Đánh dấu tin chưa đọc xa nhất | Đăng nhập `minhanh` (seed: chat với `hoangnam` có 1 chưa đọc, chat với `tuankiet` có 2, nhóm **BTL Web 36** có 2) | Xem danh sách hội thoại | Mỗi hội thoại hiển thị đúng huy hiệu số tin chưa đọc; mở hội thoại cuộn tới tin chưa đọc đầu tiên và huy hiệu về 0 | Đ | P1 | `POST /conversations/{id}/read`, `GET /conversations` | |
| MSG-07 | Thu hồi tin nhắn của mình | `minhanh` có tin trong chat với `quocbao` (seed có sẵn 1 tin đã thu hồi của `minhanh`) | `minhanh` thu hồi tin vừa gửi | Cả hai thấy "Tin nhắn đã được thu hồi" ngay; nội dung không còn trong phản hồi API | Đ | P1 | `POST /messages/{id}/recall`, WS `message.recalled` | |
| MSG-08 | Thu hồi tin của người khác | `quocbao` có tin trong chat | `minhanh` thử thu hồi tin của `quocbao` (UI không có nút; thử qua API) | `403` | S | P1 | `POST /messages/{id}/recall` | |
| MSG-09 | Tạo nhóm thành công | `minhanh` có ≥ 2 bạn | Tạo nhóm "Test", chọn `quocbao`, `hoangnam`, đặt ảnh nhóm | Nhóm được tạo, `minhanh` là Trưởng nhóm, các thành viên nhận `conversation.created` | Đ | P1 | `POST /conversations`, WS `conversation.created` | |
| MSG-10 | Tạo nhóm thiếu điều kiện | `minhanh` | (a) tên nhóm trống; (b) chỉ chọn 1 người (PRD: tối thiểu 2 người lần đầu); (c) chọn người không phải bạn | Cả ba bị từ chối với lỗi rõ ràng | S | P1 | `POST /conversations` | |
| MSG-11 | Gửi tin trong nhóm | Nhóm **BTL Web 36**; `minhanh`, `quocbao` đang mở | `minhanh` gửi tin | Mọi thành viên đang online nhận realtime, tên người gửi hiển thị | Đ | P1 | WS `message.new` | |
| MSG-12 | Thêm thành viên (Trưởng nhóm) | `minhanh` là Trưởng nhóm **BTL Web 36**; `thutrang` là bạn của `minhanh` | Thêm `thutrang` vào nhóm | `thutrang` thấy nhóm, các thành viên nhận `conversation.member.added` | Đ | P1 | `POST /conversations/{id}/members`, WS `conversation.member.added` | |
| MSG-13 | Xoá thành viên (Trưởng nhóm) | `minhanh` là Trưởng nhóm | Xoá `tuankiet` khỏi nhóm **BTL Web 36** | `tuankiet` mất quyền truy cập nhóm, nhận `conversation.member.removed` | Đ | P1 | `DELETE /conversations/{id}/members/{userId}` | |
| MSG-14 | Thành viên thường không quản lý được nhóm | `quocbao` là thành viên nhóm **BTL Web 36** | `quocbao` thử thêm/xoá thành viên (qua API) | `403` | S | P1 | `POST/DELETE …/members` | |
| MSG-15 | Trưởng nhóm rời nhóm – chuyển quyền | Nhóm do `minhanh` tạo ở MSG-09, thêm lần lượt `quocbao` rồi `hoangnam` (dùng nhóm mới, vì thành viên nhóm seed có cùng thời điểm tham gia) | `minhanh` (Trưởng nhóm) rời nhóm | Người vào nhóm sớm nhất (`quocbao`) trở thành Trưởng nhóm (đúng PRD) | Đ | P1 | `DELETE /conversations/{id}/members/{userId}` | |
| MSG-16 | Đổi tên/ảnh nhóm | `minhanh` là Trưởng nhóm | Đổi tên nhóm và ảnh đại diện | Mọi thành viên thấy thay đổi (`conversation.updated`) | Đ | P2 | `PATCH /conversations/{id}`, `PUT …/avatar` | |
| MSG-17 | Gửi ảnh – hiển thị trực tiếp | Chat 1-1 mở (seed có sẵn ảnh `memechongheorach.png` trong chat `minhanh`–`quocbao`) | Chọn ảnh PNG/JPG (< 20MB) để gửi | Ảnh hiển thị trực tiếp (thumbnail/xem lớn) ở cả hai bên; object ở bucket `chat-files` | Đ | P1 | `POST /conversations/{id}/attachments`, `GET /attachments/{id}/url` | |
| MSG-18 | Gửi tệp đính kèm | Chat mở (seed có sẵn `bao-cao-tuan-5.pdf` và `source-code.zip` trong nhóm **BTL Web 36**) | Gửi `.pdf`, `.docx`, `.xlsx`, `.zip` (< 20MB) | Hiển thị tên file, dung lượng và nút Tải về; tải về đúng file nguyên vẹn | Đ | P1 | `POST …/attachments` | |
| MSG-19 | Tệp vượt 20MB hoặc định dạng bị cấm | Chat mở | Gửi file 21MB; gửi file `.exe` | Bị từ chối (`413`/`415`) kèm thông báo; không lưu object | S | P1 | `POST …/attachments` | |
| MSG-20 | Quyền truy cập tệp | Có file trong nhóm **BTL Web 36** (`bao-cao-tuan-5.pdf`, `source-code.zip`) | Người **không** thuộc nhóm (`thutrang`) gọi `GET /attachments/{id}/url` của file trong nhóm **BTL Web 36** | `403/404`, không nhận được URL tải | S | P1 | `GET /attachments/{id}/url` | |
| MSG-21 | URL tải file hết hạn | Có URL ký sẵn | Mở URL sau khi quá thời hạn (`MINIO_PRESIGN_TTL`) hoặc sửa chữ ký | `403` từ MinIO | S | P3 | `GET /attachments/{id}/url` | |
| MSG-22 | Không phải thành viên thì không đọc được tin | – | `giahuy` gọi `GET /conversations/{id}/messages` của hội thoại `minhanh`–`quocbao` | `403/404` | S | P1 | `GET …/messages` | |
| MSG-23 | Tin của tài khoản đã xoá | Nhóm **BTL Web 36** (seed có tin *"để t tổng hợp lại tài liệu kiểm thử cho nhé"* của người dùng đã xoá) | `minhanh` mở nhóm **BTL Web 36** | Tin cũ hiển thị người gửi "Người dùng đã xóa", không lộ dữ liệu cá nhân | Đ | P2 | `GET …/messages` | |
| MSG-24 | Gửi tin cho hội thoại khi không còn là thành viên | `tuankiet` đã bị xoá khỏi nhóm (MSG-13) | `tuankiet` gửi tin vào nhóm đó | Bị từ chối | S | P1 | WS `message.send` | |

### 3.5 Tìm kiếm và phân trang tin nhắn (Tính năng 5)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| SRC-01 | Tải 20 tin gần nhất | Nhóm **BTL Web 36** có > 40 tin (48 tin trong seed) | `minhanh` mở nhóm **BTL Web 36** | Hiển thị đúng **20** tin mới nhất, theo thứ tự thời gian | Đ | P1 | `GET …/messages` | |
| SRC-02 | Cuộn lên tải tin cũ | Như SRC-01 | Cuộn lên đầu danh sách | Tải thêm trang 20 tin cũ hơn (cursor), không trùng/mất tin, giữ vị trí cuộn | Đ | P1 | `GET …/messages?before=` | |
| SRC-03 | Hết lịch sử | Đã cuộn tới tin đầu tiên (*"ê lập gr làm btl web đi dm"*) | Tiếp tục cuộn lên | Không gọi tải thêm vô hạn; có chỉ báo "Đã hết tin nhắn" | Đ | P2 | `GET …/messages` | |
| SRC-04 | Tìm tin theo từ khoá | Nhóm **BTL Web 36** có tin chứa "báo cáo" | Nhập "báo cáo" vào thanh tìm kiếm | Chỉ liệt kê tin chứa từ khoá (có hiển thị/đánh dấu từ khoá), không phân biệt hoa thường | Đ | P1 | `GET …/messages/search` | |
| SRC-05 | Tìm không có kết quả | – | Nhập `zzzxxxyyy` | Hiển thị trạng thái "Không có kết quả" | S | P2 | `GET …/messages/search` | |
| SRC-06 | Từ khoá rỗng/chứa ký tự đặc biệt | – | Tìm chuỗi rỗng; tìm `%`, `_`, `'` | Rỗng bị chặn; ký tự đặc biệt được xử lý an toàn (không lỗi SQL/không trả tất cả) | S | P1 | `GET …/messages/search` | |
| SRC-07 | Tìm không lộ tin đã thu hồi | Có tin đã thu hồi chứa từ khoá (ví dụ từ `"nhầm tab"` trong chat `minhanh`–`quocbao`) | Tìm từ khoá đó | Tin đã thu hồi không xuất hiện | S | P2 | `GET …/messages/search` | |

### 3.6 Khoá cuộc trò chuyện bằng PIN (Tính năng 6)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| PIN-01 | Đặt PIN | `minhanh` mở chat với `quocbao` | Cài đặt chat → Khoá trò chuyện → nhập PIN `4321` | Chat được đánh dấu khoá; DB lưu `pin_hash` (bcrypt) chứ không lưu PIN thô | Đ | P1 | `PUT /conversations/{id}/pin` | |
| PIN-02 | PIN không hợp lệ | – | Nhập PIN 3 số, 5 số, có chữ | Bị từ chối (`400`), yêu cầu đúng 4 chữ số | S | P1 | `PUT …/pin` | |
| PIN-03 | Che nội dung khi chưa mở khoá | PIN đang bật (seed: chat `minhanh`–`hoangnam`, PIN `1234`) | `minhanh` đăng nhập và bấm vào chat với `hoangnam` | Màn hình **che mờ** nội dung, yêu cầu nhập PIN; chưa gọi/hiển thị tin nhắn | Đ | P1 | `GET …/messages` | |
| PIN-04 | Mở khoá bằng PIN đúng | Như PIN-03 | Nhập `1234` | Mở khoá, hiển thị tin nhắn; API trả unlock token | Đ | P1 | `POST …/pin/verify`, WS `conversation.unlock` | |
| PIN-05 | API không cho đọc tin khi chưa mở khoá | Chat khoá, chưa verify | Gọi `GET …/messages` của chat `minhanh`–`hoangnam` không có unlock token | `403` (mã lỗi "conversation locked") | S | P1 | `GET …/messages` | |
| PIN-06 | Nhập sai PIN | Chat khoá | Nhập `0000` | Báo sai PIN, hiển thị số lần còn lại | S | P1 | `POST …/pin/verify` | |
| PIN-07 | Sai quá 5 lần – khoá 5 phút | Chat khoá | Nhập sai PIN 5 lần liên tiếp rồi thử nhập **đúng** PIN | Từ chối với thời gian chờ còn lại (`429/423`); sau đúng 5 phút nhập đúng PIN mới mở được | S | P1 | `POST …/pin/verify` | |
| PIN-08 | Khoá lại thủ công | Đã mở khoá | Bấm Khoá lại hoặc đóng chat | Lần sau mở lại phải nhập PIN; unlock token cũ không còn dùng được | Đ | P2 | WS `conversation.lock` | |
| PIN-09 | Tắt PIN | Chat đang khoá, đã mở | Cài đặt → Tắt khoá, nhập PIN đúng | Chat không còn khoá; PIN sai thì không tắt được | Đ/S | P2 | `POST …/pin/disable` | |
| PIN-10 | Khoá chỉ áp dụng cho người đặt | `minhanh` đặt PIN với `hoangnam` | Đăng nhập `hoangnam`, mở chat với `minhanh` | `hoangnam` xem bình thường (PIN là riêng từng người dùng) | Đ | P2 | `GET …/messages` | |
| PIN-11 | Tin mới tới chat đang khoá | Chat `minhanh`–`hoangnam` đang khoá ở máy `minhanh` | `hoangnam` gửi tin | Danh sách hiển thị huy hiệu chưa đọc nhưng **không** lộ nội dung xem trước | Đ | P2 | WS `message.new` | |

### 3.7 Gọi thoại và gọi video 1-1 (Tính năng 7)

> Cần 2 thiết bị/2 trình duyệt có Camera/Mic (hoặc dùng cờ giả lập camera của Chrome). Trên điện thoại cần HTTPS (Cloudflare Tunnel).

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| CALL-01 | Gọi thoại thành công | `minhanh`, `quocbao` online, đã cấp quyền Mic | `minhanh` bấm Gọi thoại trong chat với `quocbao`; `quocbao` bấm Nghe máy | Máy `quocbao` đổ chuông hiển thị tên `minhanh` cùng nút Nghe/Từ chối; sau khi nghe, hai bên nghe được nhau | Đ | P1 | WS `call.invite`, `call.incoming`, `call.accept`, `call.offer/answer/ice_candidate` | |
| CALL-02 | Gọi video thành công | Như trên, có Camera | `minhanh` bấm Gọi video; `quocbao` nghe máy | Hai bên thấy hình ảnh và nghe âm thanh của nhau | Đ | P1 | như CALL-01 | |
| CALL-03 | Bật/tắt Mic | Đang trong cuộc gọi | `minhanh` tắt Mic rồi bật lại | Bên kia không nghe khi tắt, nghe lại khi bật; biểu tượng trạng thái cập nhật ở cả hai bên | Đ | P1 | WS `call.media_state` | |
| CALL-04 | Bật/tắt Camera | Đang gọi video | `minhanh` tắt rồi bật Camera | Bên kia thấy khung hình đen/avatar khi tắt, hình trở lại khi bật | Đ | P1 | WS `call.media_state` | |
| CALL-05 | Kết thúc cuộc gọi | Đang trong cuộc gọi | Một bên bấm Kết thúc | Cả hai bên đóng màn hình gọi, giải phóng Camera/Mic (đèn camera tắt) | Đ | P1 | WS `call.end`, `call.ended` | |
| CALL-06 | Từ chối cuộc gọi | `quocbao` đang nhận cuộc gọi đến | `quocbao` bấm Từ chối | `minhanh` thấy "Bị từ chối"; trong chat có tin hệ thống tương ứng | Đ | P1 | WS `call.reject`, `call.ended` | |
| CALL-07 | Người gọi huỷ trước khi bắt máy | `minhanh` đang gọi, `quocbao` đang đổ chuông | `minhanh` bấm huỷ | Hộp thoại đổ chuông của `quocbao` biến mất; ghi nhận cuộc gọi nhỡ | Đ | P2 | WS `call.cancel` | |
| CALL-08 | Không trả lời quá 30 giây – nhỡ | `quocbao` online | `minhanh` gọi và `quocbao` không phản hồi | Sau 30 giây cuộc gọi tự kết thúc "nhỡ"; tin hệ thống "Cuộc gọi nhỡ" trong chat | Đ | P1 | WS `call.ended` (`missed`) | |
| CALL-09 | Người nhận offline | `quocbao` đã đóng tab | `minhanh` gọi `quocbao` | Hệ thống báo không liên lạc được/nhỡ ngay (theo PRD), có tin hệ thống | Đ | P1 | WS `call.invite` | |
| CALL-10 | Đang bận cuộc gọi khác | `quocbao` đang trong cuộc gọi với `hoangnam` | `minhanh` gọi `quocbao` | Nhận phản hồi bận/từ chối tự động, không làm gián đoạn cuộc gọi hiện tại | S | P2 | WS `call.invite` | |
| CALL-11 | Gọi người đã chặn mình/không phải bạn | `tuankiet` bị `minhanh` chặn (FRD-13) | `tuankiet` gọi `minhanh` | Bị từ chối, `minhanh` không nhận được cuộc gọi | S | P1 | WS `call.invite` | |
| CALL-12 | Từ chối quyền Camera/Mic | Trình duyệt chặn quyền | Bấm Gọi video | Thông báo hướng dẫn cấp quyền, cuộc gọi không bắt đầu treo | S | P2 | – | |
| CALL-13 | Nghe máy ở nhiều tab/thiết bị | `quocbao` đăng nhập 2 thiết bị | `minhanh` gọi; `quocbao` nghe máy ở thiết bị 1 | Thiết bị 2 ngừng đổ chuông (`call.handled_elsewhere`) | Đ | P2 | WS `call.handled_elsewhere` | |
| CALL-14 | Gọi khác mạng (Wi-Fi ↔ 4G) | HTTPS qua Cloudflare Tunnel, TURN đã cấu hình | Máy tính (Wi-Fi) gọi video điện thoại (4G) | Kết nối thành công, thời gian thiết lập < 3 giây, hình/tiếng thông suốt; ICE chọn ứng viên `relay` khi cần | Đ | P1 | `GET /calls/ice-servers` | |
| CALL-15 | Lấy cấu hình ICE cần đăng nhập | – | Gọi `GET /calls/ice-servers` không token; có token | Không token: `401`; có token: trả `iceServers` gồm STUN và TURN với credential tạm thời | Đ/S | P1 | `GET /calls/ice-servers` | |
| CALL-16 | Credential TURN hết hạn | Credential đã quá TTL | Dùng lại credential cũ tại coturn | TURN từ chối xác thực; client lấy credential mới và gọi lại được | S | P3 | `GET /calls/ice-servers` | |
| CALL-17 | Mất kết nối giữa cuộc gọi | Đang gọi | Ngắt mạng một bên < 10s rồi nối lại; ngắt > 10s | < 10s: tự khôi phục; > 10s: cuộc gọi kết thúc với lý do mất kết nối | S | P2 | `CALL_RECONNECT_GRACE_SECONDS` | |
| CALL-18 | Không có gọi nhóm | Mở nhóm **BTL Web 36** | Tìm nút gọi trong nhóm | Không có nút gọi (ngoài phạm vi PRD); gọi qua API nhóm bị từ chối | S | P3 | WS `call.invite` | |

### 3.8 Chia sẻ màn hình và lịch sử cuộc gọi (Tính năng 8)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| HIS-01 | Chia sẻ màn hình | Đang trong cuộc gọi video, trình duyệt máy tính | `minhanh` bấm Chia sẻ màn hình, chọn màn hình/cửa sổ | Bên `quocbao` thấy màn hình của `minhanh` rõ nét; cuộc gọi không bị ngắt | Đ | P1 | WS `call.offer` (renegotiation), `call.media_state` | |
| HIS-02 | Dừng chia sẻ | Đang chia sẻ | Bấm Dừng (hoặc nút "Stop sharing" của trình duyệt) | Quay lại hình camera, `quocbao` thấy cập nhật | Đ | P1 | WS `call.media_state` | |
| HIS-03 | Người dùng huỷ hộp thoại chọn màn hình | Đang gọi video | Bấm Chia sẻ rồi Cancel | Không có thay đổi, không báo lỗi nghiêm trọng | S | P3 | – | |
| HIS-04 | Tin hệ thống sau cuộc gọi thành công | Hoàn tất CALL-02 sau 1 phút | Quan sát khung chat | Xuất hiện tin hệ thống "Cuộc gọi video - mm:ss" với thời lượng đúng; đánh dấu nếu có chia sẻ màn hình | Đ | P1 | `GET …/messages`, WS `message.new` | |
| HIS-05 | Tin hệ thống cuộc gọi nhỡ/từ chối | CALL-06, CALL-08 | Quan sát khung chat | Tin "Cuộc gọi nhỡ"/"Đã từ chối" xuất hiện ở cả hai bên | Đ | P1 | `GET …/messages` | |
| HIS-06 | Lịch sử cuộc gọi của hội thoại | Seed: chat `minhanh`–`quocbao` có cuộc gọi video 03:15 (có chia sẻ màn hình) và cuộc gọi thoại nhỡ | Mở lịch sử cuộc gọi trong chat `minhanh`–`quocbao` | Liệt kê cuộc gọi với loại, trạng thái, thời lượng, thời điểm chính xác | Đ | P1 | `GET /conversations/{id}/calls`, `GET /calls/{callId}` | |
| HIS-07 | Quyền xem chi tiết cuộc gọi | – | `giahuy` gọi `GET /calls/{callId}` của cuộc gọi `minhanh`–`quocbao` | `403/404` | S | P1 | `GET /calls/{callId}` | |

### 3.9 Quản trị hệ thống – Admin (Tính năng 9)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| ADM-01 | Dashboard thống kê | Đăng nhập `admin` | Mở Dashboard | Hiển thị đúng: tổng User, số User online, tổng nhóm chat, tổng tin nhắn, số file và dung lượng MinIO; đối chiếu với truy vấn `COUNT` trong DB | Đ | P1 | `GET /admin/stats` | |
| ADM-02 | Số online chính xác | `minhanh` và `quocbao` đang online | Xem Dashboard; `quocbao` đóng tab; xem lại | Số online giảm tương ứng | Đ | P2 | `GET /admin/stats` | |
| ADM-03 | Tìm người dùng | Đăng nhập `admin` | Tìm theo Username `minh` và theo Email | Danh sách lọc đúng, có phân trang, hiển thị trạng thái | Đ | P1 | `GET /admin/users` | |
| ADM-04 | Khoá tài khoản | `quocbao` đang online | `admin` Khoá `quocbao` | `quocbao` bị **ngắt WebSocket ngay lập tức** (`session.terminated`), không đăng nhập lại được (AUTH-09); ghi nhật ký | Đ | P1 | `POST /admin/users/{id}/ban`, WS `session.terminated` | |
| ADM-05 | Mở khoá tài khoản | `quockhanh` đang `banned` (seed) | `admin` Mở khoá `quockhanh`; đăng nhập `quockhanh` | Đăng nhập được | Đ | P1 | `POST /admin/users/{id}/unban` | |
| ADM-06 | Xoá tài khoản (xoá mềm + ẩn danh) | Có tài khoản thử `tester01` | `admin` xoá `tester01` | `status=deleted`, email/username/tên bị ẩn danh trong DB; tin cũ hiển thị "Người dùng đã xóa"; không đăng nhập/tìm thấy được | Đ | P1 | `DELETE /admin/users/{id}` | |
| ADM-07 | Xem nhật ký thao tác | Đã làm ADM-04..06; đăng nhập `superadmin` (OpenAPI giới hạn `GET /admin/audit-logs` cho Super Admin, xem ghi chú đối chiếu ở mục 5) | Mở Nhật ký (audit log) | Có đủ bản ghi hành động, người thực hiện, đối tượng, thời gian, IP; lọc/phân trang được | Đ | P1 | `GET /admin/audit-logs` | |
| ADM-08 | User thường không vào được admin | Đăng nhập `minhanh` | Gọi `GET /admin/stats`, mở `/admin` | `403`, giao diện không hiển thị menu admin | S | P1 | mọi `/admin/*` | |
| ADM-09 | Admin không khoá/xoá được Admin khác hoặc Super Admin | Đăng nhập `admin` | Khoá/xoá `superadmin` hoặc Admin khác (OpenAPI: ban/delete chỉ áp dụng cho role `user`) | Bị từ chối (`403`/`409`), tài khoản đích không đổi | S | P1 | `POST …/ban`, `DELETE …` | |
| ADM-10 | Admin không tạo/xoá Admin | Đăng nhập `admin` | Gọi `POST /admin/admins` | `403` (chỉ Super Admin) | S | P1 | `POST /admin/admins` | |

### 3.10 Quản trị tài khoản Admin – Super Admin (Tính năng 10)

| ID | Tên | Tiền điều kiện | Các bước | Kết quả mong đợi | Loại | Ưu tiên | Liên quan | Kết quả |
|---|---|---|---|---|---|---|---|---|
| SAD-01 | Cảnh báo khi Super Admin đăng nhập | Đăng nhập `superadmin` | Đăng nhập `superadmin` / `Scall@2026`; mở `GET /dev/emails` hoặc màn hình mail dev | Có email cảnh báo đăng nhập (kèm thời gian, IP) gửi tới email của tài khoản; hiện ngay trên màn hình ở môi trường dev | Đ | P1 | `POST /auth/login`, `GET /dev/emails` | |
| SAD-02 | Quyền hạn của Super Admin | Đăng nhập `superadmin` | Thực hiện ADM-01, ADM-03, ADM-04, ADM-07 | Theo PRD: Super Admin kế thừa quyền Admin nên đều làm được. Ghi lại kết quả thực tế để đối chiếu với `x-roles` trong OpenAPI (ghi chú ở mục 5) | Đ | P1 | `/admin/*` | |
| SAD-03 | Tạo tài khoản Admin | Đăng nhập `superadmin` | Nhập Email, Username, Họ tên, Mật khẩu → Tạo; đăng nhập bằng tài khoản mới | Tạo được Admin (`role=admin`); đăng nhập và có quyền quản trị; ghi nhật ký | Đ | P1 | `POST /admin/admins` | |
| SAD-04 | Tạo Admin thiếu/trùng thông tin | Đăng nhập `superadmin` | Bỏ trống trường; dùng Username đã có | Lỗi `400`/`409` | S | P2 | `POST /admin/admins` | |
| SAD-05 | Đổi mật khẩu Admin không cần OTP | Có Admin `adminnew` | `superadmin` đổi mật khẩu cho `adminnew` | Đổi được ngay, không yêu cầu OTP; `adminnew` đăng nhập bằng mật khẩu mới | Đ | P1 | `PUT /admin/admins/{id}/password` | |
| SAD-06 | Xoá tài khoản Admin | Có Admin `adminnew` | `superadmin` xoá `adminnew` | Admin bị xoá; không đăng nhập được; ghi nhật ký | Đ | P1 | `DELETE /admin/admins/{id}` | |
| SAD-07 | Không tự xoá Super Admin | Đăng nhập `superadmin` | Cố xoá chính `superadmin` | Bị từ chối | S | P2 | `DELETE /admin/admins/{id}` | |

---

## 4. Test case phi chức năng

### 4.1 Hiệu năng

| ID | Tiêu chí PRD | Cách đo | Kết quả mong đợi | Ưu tiên | Kết quả |
|---|---|---|---|---|---|
| NFR-01 | Gửi/nhận tin nhắn qua WebSocket < 1s | Gửi 50 tin liên tiếp giữa 2 trình duyệt; đo thời gian từ `message.send` đến `message.new` ở máy nhận (đồng hồ DevTools/log) | ≥ 95% tin < 1s, không mất/đảo thứ tự | P1 | |
| NFR-02 | Trạng thái (typing, presence, read) < 1s | Đo tương tự NFR-01 với `typing.updated`, `presence.updated` | < 1s | P1 | |
| NFR-03 | Thiết lập cuộc gọi khác mạng < 3s | Wi-Fi ↔ 4G: đo từ lúc bấm Nghe máy đến khi có âm thanh/hình ảnh (10 lần) | Trung bình < 3s, mọi lần thành công | P1 | |
| NFR-04 | Âm thanh/hình ảnh thông suốt | Gọi 5 phút; quan sát giật/lag; `chrome://webrtc-internals` | Không đứt quãng kéo dài, packet loss thấp | P2 | |
| NFR-05 | Tải trang đầu tiên | Lighthouse/DevTools trên bản prod (nginx) | Tải < 3s trên mạng thường | P3 | |
| NFR-06 | Nhiều kết nối đồng thời | Mở 30–50 kết nối WebSocket đồng thời (script) | Server ổn định, tin nhắn vẫn nhận < 1s | P3 | |

### 4.2 Giao diện Responsive

| ID | Nội dung | Các bước | Kết quả mong đợi | Ưu tiên | Kết quả |
|---|---|---|---|---|---|
| NFR-07 | Desktop 2 cột | Cửa sổ ≥ 1024px | Cột trái: danh sách hội thoại/bạn bè; cột phải: khung chat và màn hình gọi | P1 | |
| NFR-08 | Mobile 1 cột | Thiết bị 360–430px (DevTools hoặc điện thoại thật) | Chuyển đổi giữa danh sách và màn hình chat, có nút quay lại; không vỡ khung/không cuộn ngang | P1 | |
| NFR-09 | Màn hình gọi trên mobile | Gọi video trên điện thoại | Video, nút Mic/Camera/Kết thúc hiển thị đủ, bấm được | P1 | |
| NFR-10 | Thay đổi kích thước/xoay màn hình | Kéo giãn cửa sổ; xoay ngang/dọc | Bố cục thích ứng liên tục, không mất trạng thái | P2 | |
| NFR-11 | Tương thích trình duyệt | Chạy các kịch bản P1 trên Chrome, Edge, Firefox, Safari/iOS | Hoạt động đúng (ghi chú khác biệt nếu có, ví dụ chia sẻ màn hình không có trên mobile) | P2 | |

### 4.3 Bảo mật

| ID | Nội dung | Các bước | Kết quả mong đợi | Ưu tiên | Kết quả |
|---|---|---|---|---|---|
| NFR-12 | Mật khẩu băm bcrypt | Xem `users.password_hash` trong DB | Dạng `$2a$/$2b$…`, không có mật khẩu thô; hai tài khoản cùng mật khẩu có hash khác nhau (salt) | P1 | |
| NFR-13 | Xác thực JWT | Gọi API với token hết hạn/giả/thiếu | `401` ở tất cả endpoint bảo vệ | P1 | |
| NFR-14 | Phân quyền (IDOR) | Dùng token của `giahuy` truy cập tài nguyên (hội thoại, tin nhắn, file, cuộc gọi) của `minhanh` bằng ID đoán được | `403/404`, không lộ dữ liệu | P1 | |
| NFR-15 | HTTPS | Truy cập qua Cloudflare Tunnel | Chỉ HTTPS, WebSocket là `wss://`, Camera/Mic hoạt động | P1 | |
| NFR-16 | Chống XSS | Gửi `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>` trong tin nhắn, họ tên, tên nhóm | Hiển thị dạng văn bản, không thực thi script | P1 | |
| NFR-17 | Chống SQL Injection | Nhập `' OR '1'='1` vào ô đăng nhập/tìm kiếm/tìm tin | Không lỗi SQL, không bypass xác thực | P1 | |
| NFR-18 | Giới hạn thử sai | Đăng nhập sai nhiều lần; PIN sai; OTP sai | Cơ chế giới hạn hoạt động (PIN 5 lần/khoá 5 phút, OTP tối đa lần thử) | P1 | |
| NFR-19 | Bí mật cấu hình | Rà soát repo/lịch sử git | Không có `.env` hay secret thật; chỉ có `.env.example` | P1 | |
| NFR-20 | Không lộ thông tin lỗi | Gây lỗi 500 (dữ liệu sai) | Phản hồi JSON chung, không chứa stack trace/chuỗi kết nối | P2 | |
| NFR-21 | Bucket MinIO | Truy cập trực tiếp `/chat-files/...` không có chữ ký; `/avatars/...` | `chat-files` trả `403`; `avatars` đọc công khai | P1 | |
| NFR-22 | Môi trường production tắt chế độ dev | Đặt `APP_ENV=production` rồi chạy | `GET /dev/emails` trả `404`, không có `debugOtp` trong phản hồi quên mật khẩu | P2 | |

### 4.4 Độ tin cậy và triển khai

| ID | Nội dung | Các bước | Kết quả mong đợi | Ưu tiên | Kết quả |
|---|---|---|---|---|---|
| NFR-23 | Khởi động từ đầu bằng Docker Compose | `docker compose down -v` → `docker compose up -d --build` | Tất cả service `healthy`/`Exited 0` (minio-init); `GET /api/v1/health` trả `ok`; đăng nhập `minhanh` được | P1 | |
| NFR-24 | Khởi động lại giữ dữ liệu | `docker compose restart` hoặc `down` rồi `up` (không `-v`) | Dữ liệu (tin nhắn, tài khoản, file) còn nguyên | P1 | |
| NFR-25 | Backend hồi phục khi DB/MinIO sập tạm | `docker compose stop postgres`, rồi `start` | `/health` báo `down` rồi trở lại `up`; backend không crash vĩnh viễn | P2 | |
| NFR-26 | Cloudflare Tunnel | Làm theo README mục 7 | Truy cập qua tên miền HTTPS, WebSocket và tải file hoạt động | P1 | |
| NFR-27 | Coturn hoạt động | Trickle ICE test với credential từ API | Có ứng viên `relay` | P1 | |

---

## 5. Ma trận truy vết yêu cầu và ghi chú đối chiếu

| #  | Tính năng (PRD)                                            | Nhóm test case    | Số TC   |
|----|------------------------------------------------------------|-------------------|---------|
| 1  | Đăng ký, Đăng nhập và Hồ sơ                                | AUTH-01 … AUTH-24 | 24      |
| 2  | Tìm kiếm và Kết bạn                                        | FRD-01 … FRD-15   | 15      |
| 3  | Trạng thái Online/Offline                                  | PRS-01 … PRS-07   | 7       |
| 4  | Nhắn tin 1-1 và Nhóm                                       | MSG-01 … MSG-24   | 24      |
| 5  | Tìm kiếm và Phân trang tin nhắn                            | SRC-01 … SRC-07   | 7       |
| 6  | Bảo mật cuộc trò chuyện (PIN)                              | PIN-01 … PIN-11   | 11      |
| 7  | Gọi thoại và Gọi video 1-1                                 | CALL-01 … CALL-18 | 18      |
| 8  | Chia sẻ màn hình và Lịch sử cuộc gọi                       | HIS-01 … HIS-07   | 7       |
| 9  | Quản trị hệ thống                                          | ADM-01 … ADM-10   | 10      |
| 10 | Quản trị tài khoản Admin                                   | SAD-01 … SAD-07   | 7       |
| –  | Phi chức năng (hiệu năng, responsive, bảo mật, triển khai) | NFR-01 … NFR-27   | 27      |
|    | **Tổng**                                                   |                   | **157** |

**Ghi chú đối chiếu PRD và OpenAPI (thống nhất trước khi kiểm thử):**

- PRD ghi giới hạn file **20MB** (`MAX_UPLOAD_MB=20`). Nginx cho phép body tối đa 25MB (dư phần overhead multipart), nên backend phải là nơi chặn file > 20MB (MSG-19).

---

## 6. Phụ lục A - Kịch bản demo

Thời lượng: **15 - 20 phút**. Chuẩn bị trước:

1. `docker compose down -v && docker compose --profile tunnel up -d --build` (hoặc `up -d` nếu chỉ demo localhost); chờ tất cả `healthy`.
2. Mở sẵn **2 trình duyệt / profile khác nhau** (hoặc 1 máy tính + 1 điện thoại qua HTTPS): máy A đăng nhập `minhanh`, máy B đăng nhập `quocbao`.
3. Cấp trước quyền Camera / Mic cho trang. Mở sẵn `GET /dev/emails` ở một tab.
4. Với demo gọi khác mạng: điện thoại dùng 4G, máy tính dùng Wi-Fi, TURN đã kiểm tra bằng NFR-27.
5. Dự phòng: ghi sẵn lệnh reset dữ liệu `docker compose down -v` (đưa dữ liệu về trạng thái ban đầu giữa các lần chạy thử).

| Bước | Nội dung thao tác | Tài khoản | Điểm nhấn / Test case |
|---|---|---|---|
| 1 | Giới thiệu kiến trúc (sơ đồ README), chạy `docker compose ps` cho thấy đủ 5 service chạy trong 1 lệnh | – | NFR-23 |
| 2 | **Đăng ký** tài khoản mới `demo01`, đăng xuất, đăng nhập lại | `demo01` | AUTH-01, AUTH-05 |
| 3 | **Quên mật khẩu**: nhập `quocbao`, OTP hiện ngay trên màn hình (`debugOtp`/mail dev) → đặt lại và đăng nhập (reset về `Scall@2026` để demo tiếp) | `quocbao` | AUTH-17, AUTH-18 |
| 4 | **Tìm & kết bạn**: tìm `giahuy` bằng email; `minhanh` gửi lời mời → `giahuy` nhận realtime và chấp nhận; `phuongthao` có sẵn lời mời tới `minhanh` → chấp nhận; **chặn** `vantoan99` đã có sẵn trong danh sách chặn, thử bỏ chặn | `minhanh`, `giahuy`, `phuongthao` | FRD-01, 05, 07, 15 |
| 5 | **Online/Offline**: `quocbao` đóng tab → `minhanh` thấy chuyển offline + "Truy cập lần cuối"; mở lại → xanh | `minhanh`, `quocbao` | PRS-01, PRS-02 |
| 6 | **Nhắn tin realtime**: gửi văn bản, emoji; hiển thị "Đang soạn tin…", "Đã xem"; **thu hồi** tin; gửi **ảnh** (`memechongheorach.png`) và file **PDF/ZIP** (`bao-cao-tuan-5.pdf`, `source-code.zip`), tải về | `minhanh`, `quocbao` | MSG-01, 04, 05, 07, 17, 18 |
| 7 | **Tin chưa đọc & phân trang**: `minhanh` mở nhóm **BTL Web 36** (huy hiệu 2 chưa đọc), cuộn lên để tải thêm (20 tin/lần), **tìm kiếm** từ "báo cáo" | `minhanh` | MSG-06, SRC-01, 02, 04 |
| 8 | **Nhóm chat**: tạo nhóm mới, thêm/xoá thành viên (Trưởng nhóm `minhanh`), `quocbao` là Trưởng nhóm **Nhóm Web** | `minhanh`, `quocbao` | MSG-09, 12, 13 |
| 9 | **Khoá PIN**: `minhanh` mở chat với `hoangnam` → màn hình che mờ; nhập sai PIN (hiện số lần còn lại), nhập đúng `1234` để mở; (tuỳ chọn) nhập sai 5 lần để thấy khoá 5 phút | `minhanh` | PIN-03, 04, 06, 07 |
| 10 | **Gọi video** từ `minhanh` tới `quocbao` (khác mạng nếu có): đổ chuông, Nghe máy, bật/tắt mic/camera, **chia sẻ màn hình**, kết thúc → tin hệ thống "Cuộc gọi video – mm:ss" | `minhanh`, `quocbao` | CALL-02, 03, 04, HIS-01, HIS-04, CALL-14 |
| 11 | **Gọi nhỡ/từ chối**: `minhanh` gọi `quocbao`, `quocbao` từ chối; gọi lần nữa, không nghe (30s) → "Cuộc gọi nhỡ"; xem **lịch sử cuộc gọi** có sẵn của chat `minhanh`–`quocbao` (03:15) | `minhanh`, `quocbao` | CALL-06, 08, HIS-05, 06 |
| 12 | **Responsive**: thu nhỏ cửa sổ hoặc dùng điện thoại → 1 cột, chuyển danh sách ↔ chat | – | NFR-07, 08 |
| 13 | **Admin**: đăng nhập `admin` → Dashboard thống kê; tìm `quocbao`, **Khoá** (`quocbao` bị ngắt ngay), **Mở khoá**; mở khoá `quockhanh` (đang bị khoá) | `admin`, `quocbao`, `quockhanh` | ADM-01, 03, 04, 05, AUTH-09 |
| 14 | **Super Admin**: đăng nhập `superadmin` → mail cảnh báo hiện ngay; **tạo Admin mới**, đổi mật khẩu không cần OTP, xoá Admin, xem **nhật ký thao tác** (thấy các lần khoá/mở khoá ở bước 13) | `superadmin` | SAD-01, 03, 05, 06, ADM-07 |
| 15 | **Tự vô hiệu hoá**: `dinhkhoa` (đã vô hiệu) đăng nhập → tài khoản hoạt động trở lại | `dinhkhoa` | AUTH-22 |
| 16 | Tổng kết: Docker Compose, Cloudflare Tunnel (HTTPS), Coturn, test case | – | NFR-15, 26, 27 |

**Lưu ý khi demo:**

- Thứ tự bước 6 trước bước 9 để tránh làm mất dữ liệu seed; nếu đã thao tác phá dữ liệu (xoá bạn, chặn,…) hãy `docker compose down -v` trước lần demo chính thức.
- Tài khoản dùng cho demo "người đã xoá" không cần thao tác: tin của "Người dùng đã xóa" (*"để t tổng hợp lại tài liệu kiểm thử cho nhé"*) trong nhóm **BTL Web 36** minh hoạ sẵn kết quả xoá mềm + ẩn danh (MSG-23).
- Nếu mạng khác nhau mà cuộc gọi không kết nối: kiểm tra `TURN_EXTERNAL_IP`/`TURN_URLS` và port-forward (README mục 8), hoặc chuyển sang Metered.ca.

## 7. Phụ lục B – Biên bản kết quả kiểm thử (mẫu)

| Thông tin                                | Giá trị |
|------------------------------------------|---------|
| Phiên bản / commit                       |         |
| Ngày kiểm thử                            |         |
| Người kiểm thử                           |         |
| Môi trường (trình duyệt, thiết bị, mạng) |         |

| Tổng số TC | Pass | Fail | Chưa chạy | Tỷ lệ Pass |
|------------|------|------|-----------|------------|
| 157        |      |      |           |            |

**Danh sách lỗi phát hiện:**

| Mã lỗi  | TC liên quan | Mô tả | Mức độ (Nghiêm trọng / Trung bình / Nhẹ) | Người xử lý | Trạng thái |
|---------|--------------|-------|------------------------------------------|-------------|------------|
| BUG-001 |              |       |                                          |             |            |