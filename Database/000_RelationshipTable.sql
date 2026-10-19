-- =====================================================================
-- S-Call  |  IT4409 - Nhóm 6  |  PostgreSQL 16
-- 000_RelationshipTable.sql : Toàn bộ bảng, ràng buộc, index, trigger, view
--
-- Quy ước:
--   * Khóa chính dùng UUID, riêng `messages.id` dùng BIGINT IDENTITY để
--     sắp xếp tuần tự, phân trang theo con trỏ và so sánh
--     "đã xem đến tin nhắn nào" bằng phép so sánh số.
--   * Thời gian luôn là TIMESTAMPTZ (UTC).
--   * Tệp tin KHÔNG lưu trong DB, chỉ lưu `bucket` + `object_key` của MinIO.
--   * Mật khẩu / PIN / OTP / refresh token chỉ lưu dạng băm (bcrypt/SHA-256).
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- email / username không phân biệt hoa thường
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- tìm kiếm LIKE/ILIKE '%từ khóa%' bằng GIN

-- ---------------------------------------------------------------------
-- 1. ENUM TYPES
-- ---------------------------------------------------------------------
CREATE TYPE user_role              AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE user_status            AS ENUM ('active', 'deactivated', 'banned', 'deleted');
CREATE TYPE friend_request_status  AS ENUM ('pending', 'accepted', 'rejected', 'canceled');
CREATE TYPE conversation_type      AS ENUM ('direct', 'group');
CREATE TYPE member_role            AS ENUM ('admin', 'member');                -- admin = Trưởng nhóm
CREATE TYPE message_type           AS ENUM ('text', 'image', 'file', 'call');  -- call = tin nhắn hệ thống của cuộc gọi
CREATE TYPE attachment_kind        AS ENUM ('image', 'file');
CREATE TYPE call_type              AS ENUM ('voice', 'video');
CREATE TYPE call_status            AS ENUM ('ringing', 'ongoing', 'ended', 'missed', 'rejected', 'canceled', 'failed');
CREATE TYPE email_status           AS ENUM ('pending', 'sent', 'failed');

-- ---------------------------------------------------------------------
-- 2. HÀM TIỆN ÍCH
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 3. NGƯỜI DÙNG & XÁC THỰC
-- =====================================================================

-- 3.1 users -----------------------------------------------------------
-- Một bảng cho cả 3 loại actor (user / admin / super_admin) phân biệt bằng `role`.
-- Xóa tài khoản = XÓA MỀM + ẨN DANH HÓA: status='deleted', email/username đổi thành
-- 'deleted_<uuid>', display_name='Người dùng đã xóa', bio/avatar=NULL, password_hash ngẫu nhiên.
-- Tin nhắn cũ vẫn giữ nguyên (sender_id vẫn trỏ về dòng đã ẩn danh).
CREATE TABLE users (
    id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    email               citext        NOT NULL,
    username            citext        NOT NULL,
    display_name        varchar(100)  NOT NULL,
    bio                 varchar(255),
    password_hash       text          NOT NULL,                                -- bcrypt
    avatar_object_key   text,                                                  -- object key trong bucket `avatars` (MinIO)
    role                user_role     NOT NULL DEFAULT 'user',
    status              user_status   NOT NULL DEFAULT 'active',
    last_seen_at        timestamptz,                                           -- cập nhật khi socket cuối cùng ngắt kết nối
    password_changed_at timestamptz,
    banned_at           timestamptz,
    banned_by           uuid          REFERENCES users(id) ON DELETE SET NULL,
    ban_reason          varchar(500),
    deactivated_at      timestamptz,
    deleted_at          timestamptz,
    created_by          uuid          REFERENCES users(id) ON DELETE SET NULL, -- Super Admin tạo Admin
    created_at          timestamptz   NOT NULL DEFAULT now(),
    updated_at          timestamptz   NOT NULL DEFAULT now(),

    CONSTRAINT uq_users_email    UNIQUE (email),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT chk_users_email_format    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    CONSTRAINT chk_users_username_format CHECK (status = 'deleted' OR username ~ '^[A-Za-z0-9_.]{3,30}$'),
    CONSTRAINT chk_users_display_name    CHECK (length(btrim(display_name)) >= 1),
    CONSTRAINT chk_users_banned_fields   CHECK (status <> 'banned' OR banned_at IS NOT NULL),
    CONSTRAINT chk_users_deleted_fields  CHECK (status <> 'deleted' OR deleted_at IS NOT NULL)
);
COMMENT ON TABLE users IS 'Tài khoản người dùng, Admin, Super Admin.';
COMMENT ON COLUMN users.last_seen_at IS 'Thời gian truy cập lần cuối (ghi khi đóng tab/ngắt WebSocket).';

-- Tìm kiếm người dùng: Email/Username khớp chính xác hoặc tiền tố; Admin tìm theo chuỗi con.
-- (uq_users_email / uq_users_username đã tạo index B-tree cho tra cứu chính xác)
CREATE INDEX idx_users_username_trgm     ON users USING gin ((username::text)     gin_trgm_ops);
CREATE INDEX idx_users_email_trgm        ON users USING gin ((email::text)        gin_trgm_ops);
CREATE INDEX idx_users_display_name_trgm ON users USING gin (display_name         gin_trgm_ops);
-- Lọc ở trang quản trị / thống kê
CREATE INDEX idx_users_role_status       ON users (role, status);
CREATE INDEX idx_users_created_at        ON users (created_at DESC);

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3.2 user_sessions (refresh token) ----------------------------------
-- Access token JWT sống ngắn (15 phút) mang claim `sid` = user_sessions.id.
-- Refresh token xoay vòng (rotation): mỗi lần refresh sinh dòng mới và thu hồi dòng cũ.
-- Khóa tài khoản / đổi mật khẩu => thu hồi toàn bộ session của user.
CREATE TABLE user_sessions (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash  char(64)    NOT NULL,                   -- SHA-256 hex của refresh token
    user_agent          varchar(500),
    ip_address          inet,
    created_at          timestamptz NOT NULL DEFAULT now(),
    last_used_at        timestamptz,
    expires_at          timestamptz NOT NULL,
    revoked_at          timestamptz,
    replaced_by         uuid        REFERENCES user_sessions(id) ON DELETE SET NULL,

    CONSTRAINT uq_user_sessions_token UNIQUE (refresh_token_hash),
    CONSTRAINT chk_user_sessions_expiry CHECK (expires_at > created_at)
);
CREATE INDEX idx_user_sessions_user_active ON user_sessions (user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_user_sessions_expires_at  ON user_sessions (expires_at);   -- job dọn rác

-- 3.3 password_reset_otps --------------------------------------------
-- OTP 6 chữ số, hiệu lực 10 phút, tối đa 5 lần nhập sai.
CREATE TABLE password_reset_otps (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash      text        NOT NULL,                         -- bcrypt/HMAC của OTP
    attempts      smallint    NOT NULL DEFAULT 0,
    max_attempts  smallint    NOT NULL DEFAULT 5,
    request_ip    inet,
    created_at    timestamptz NOT NULL DEFAULT now(),
    expires_at    timestamptz NOT NULL,
    consumed_at   timestamptz,

    CONSTRAINT chk_otp_attempts CHECK (attempts >= 0 AND attempts <= max_attempts),
    CONSTRAINT chk_otp_expiry   CHECK (expires_at > created_at)
);
CREATE INDEX idx_password_reset_otps_user ON password_reset_otps (user_id, created_at DESC);
CREATE INDEX idx_password_reset_otps_expires ON password_reset_otps (expires_at);

-- 3.4 email_outbox ---------------------------------------------------
-- Hàng đợi email (OTP quên mật khẩu, cảnh báo Super Admin đăng nhập).
-- Môi trường dev: không gửi SMTP thật, nội dung hiển thị lên màn hình qua GET /dev/emails.
CREATE TABLE email_outbox (
    id          bigint       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    to_email    citext       NOT NULL,
    template    varchar(50)  NOT NULL,                          -- password_reset_otp | super_admin_login_alert
    subject     varchar(200) NOT NULL,
    body        text         NOT NULL,
    payload     jsonb        NOT NULL DEFAULT '{}'::jsonb,
    status      email_status NOT NULL DEFAULT 'pending',
    attempts    smallint     NOT NULL DEFAULT 0,
    last_error  text,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    sent_at     timestamptz
);
CREATE INDEX idx_email_outbox_pending ON email_outbox (created_at) WHERE status = 'pending';
CREATE INDEX idx_email_outbox_to      ON email_outbox (to_email, created_at DESC);

-- =====================================================================
-- 4. QUAN HỆ XÃ HỘI: KẾT BẠN, CHẶN
-- =====================================================================

-- 4.1 friend_requests -------------------------------------------------
CREATE TABLE friend_requests (
    id           uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id    uuid                  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id  uuid                  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       friend_request_status NOT NULL DEFAULT 'pending',
    created_at   timestamptz           NOT NULL DEFAULT now(),
    responded_at timestamptz,
    updated_at   timestamptz           NOT NULL DEFAULT now(),

    CONSTRAINT chk_friend_requests_not_self CHECK (sender_id <> receiver_id),
    CONSTRAINT chk_friend_requests_responded CHECK ((status = 'pending') = (responded_at IS NULL))
);
-- Mỗi cặp người dùng chỉ có tối đa 1 lời mời đang chờ (bất kể ai gửi cho ai)
CREATE UNIQUE INDEX uq_friend_requests_pending_pair
    ON friend_requests (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
    WHERE status = 'pending';
CREATE INDEX idx_friend_requests_receiver ON friend_requests (receiver_id, status, created_at DESC);
CREATE INDEX idx_friend_requests_sender   ON friend_requests (sender_id,   status, created_at DESC);

CREATE TRIGGER trg_friend_requests_updated_at BEFORE UPDATE ON friend_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4.2 friendships -----------------------------------------------------
-- Lưu 1 dòng cho mỗi cặp bạn bè, quy ước user_low_id < user_high_id
-- để không thể trùng lặp (A,B) và (B,A). Dùng view v_user_friends để truy vấn 2 chiều.
CREATE TABLE friendships (
    user_low_id   uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_high_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at    timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (user_low_id, user_high_id),
    CONSTRAINT chk_friendships_order CHECK (user_low_id < user_high_id)
);
CREATE INDEX idx_friendships_high ON friendships (user_high_id, user_low_id);

CREATE VIEW v_user_friends AS
    SELECT user_low_id  AS user_id, user_high_id AS friend_id, created_at FROM friendships
    UNION ALL
    SELECT user_high_id AS user_id, user_low_id  AS friend_id, created_at FROM friendships;

-- 4.3 user_blocks -----------------------------------------------------
-- Chặn: ngừng nhận tin nhắn/cuộc gọi từ người bị chặn. Khi chặn, ứng dụng xóa friendship
-- và hủy lời mời đang chờ giữa hai người (trong cùng một transaction).
CREATE TABLE user_blocks (
    blocker_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT chk_user_blocks_not_self CHECK (blocker_id <> blocked_id)
);
CREATE INDEX idx_user_blocks_blocked ON user_blocks (blocked_id, blocker_id);

-- =====================================================================
-- 5. HỘI THOẠI
-- =====================================================================

-- 5.1 conversations ---------------------------------------------------
-- type='direct': chat 1-1, `direct_key` = '<uuid nhỏ>:<uuid lớn>' đảm bảo mỗi cặp chỉ có 1 hội thoại.
-- type='group' : nhóm chat, bắt buộc có `name`.
-- last_message_id được duy trì bởi trigger trên bảng messages (FK thêm ở cuối file).
CREATE TABLE conversations (
    id                 uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
    type               conversation_type NOT NULL,
    name               varchar(100),
    avatar_object_key  text,                                     -- bucket `avatars`
    direct_key         varchar(73),
    created_by         uuid              REFERENCES users(id) ON DELETE SET NULL,
    last_message_id    bigint,
    last_message_at    timestamptz,
    created_at         timestamptz       NOT NULL DEFAULT now(),
    updated_at         timestamptz       NOT NULL DEFAULT now(),

    CONSTRAINT uq_conversations_direct_key UNIQUE (direct_key),
    CONSTRAINT chk_conversations_shape CHECK (
        (type = 'direct' AND direct_key IS NOT NULL AND name IS NULL)
     OR (type = 'group'  AND direct_key IS NULL     AND length(btrim(coalesce(name, ''))) >= 1)
    )
);
CREATE INDEX idx_conversations_last_message_at ON conversations (last_message_at DESC NULLS LAST);
CREATE INDEX idx_conversations_type            ON conversations (type);

CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5.2 conversation_members -------------------------------------------
-- Mỗi người dùng có trạng thái riêng trong hội thoại: vai trò, con trỏ "đã xem", mã PIN khóa.
--  * Rời nhóm / bị xóa khỏi nhóm: đặt `left_at` (giữ dòng để bảo toàn lịch sử). Thêm lại: left_at=NULL, joined_at=now().
--  * Thành viên chỉ xem được tin nhắn có created_at >= joined_at.
--  * PIN 4 chữ số lưu bcrypt, sai 5 lần thì khóa tạm (pin_locked_until) vì không gian PIN rất nhỏ.
--  * "Đã xem" = last_read_message_id của thành viên khác >= messages.id.
CREATE TABLE conversation_members (
    conversation_id      uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id              uuid        NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    role                 member_role NOT NULL DEFAULT 'member',
    added_by             uuid        REFERENCES users(id) ON DELETE SET NULL,
    joined_at            timestamptz NOT NULL DEFAULT now(),
    left_at              timestamptz,
    last_read_message_id bigint,
    last_read_at         timestamptz,
    pin_hash             text,
    pin_set_at           timestamptz,
    pin_failed_attempts  smallint    NOT NULL DEFAULT 0,
    pin_locked_until     timestamptz,

    PRIMARY KEY (conversation_id, user_id),
    CONSTRAINT chk_members_pin_attempts CHECK (pin_failed_attempts >= 0),
    CONSTRAINT chk_members_left CHECK (left_at IS NULL OR left_at >= joined_at)
);
-- Danh sách hội thoại của một người dùng (màn hình chính)
CREATE INDEX idx_members_user_active ON conversation_members (user_id, conversation_id) WHERE left_at IS NULL;
-- Liệt kê / đếm thành viên hiện tại của một hội thoại, kiểm tra Trưởng nhóm
CREATE INDEX idx_members_conv_active ON conversation_members (conversation_id, role) WHERE left_at IS NULL;

-- =====================================================================
-- 6. CUỘC GỌI (WebRTC) – bảng calls cần có trước messages vì messages.call_id tham chiếu
-- =====================================================================

-- Phạm vi dự án: chỉ gọi 1-1, nên mỗi cuộc gọi chỉ có caller và callee.
-- (Ràng buộc "conversation phải là direct" do tầng ứng dụng kiểm tra.)
CREATE TABLE calls (
    id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    caller_id        uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    callee_id        uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    call_type        call_type   NOT NULL,
    status           call_status NOT NULL DEFAULT 'ringing',
    end_reason       varchar(20),                                -- hangup | timeout | rejected | canceled | busy | disconnected | failed | blocked
    screen_shared    boolean     NOT NULL DEFAULT false,         -- có dùng chia sẻ màn hình trong cuộc gọi
    created_at       timestamptz NOT NULL DEFAULT now(),         -- thời điểm bắt đầu đổ chuông
    answered_at      timestamptz,
    ended_at         timestamptz,
    ended_by         uuid        REFERENCES users(id) ON DELETE SET NULL,
    duration_seconds integer GENERATED ALWAYS AS (
        CASE WHEN answered_at IS NOT NULL AND ended_at IS NOT NULL
             THEN EXTRACT(EPOCH FROM (ended_at - answered_at))::integer END
    ) STORED,

    CONSTRAINT chk_calls_not_self     CHECK (caller_id <> callee_id),
    CONSTRAINT chk_calls_end_reason   CHECK (end_reason IS NULL OR end_reason IN
        ('hangup','timeout','rejected','canceled','busy','disconnected','failed','blocked')),
    CONSTRAINT chk_calls_terminal     CHECK (status IN ('ringing','ongoing') OR ended_at IS NOT NULL),
    CONSTRAINT chk_calls_answered     CHECK (status <> 'ongoing' OR answered_at IS NOT NULL),
    CONSTRAINT chk_calls_time_order   CHECK (
        (answered_at IS NULL OR answered_at >= created_at) AND
        (ended_at    IS NULL OR ended_at    >= created_at)
    )
);
-- Lịch sử cuộc gọi trong khung chat / theo người dùng
CREATE INDEX idx_calls_conversation ON calls (conversation_id, created_at DESC);
CREATE INDEX idx_calls_caller       ON calls (caller_id, created_at DESC);
CREATE INDEX idx_calls_callee       ON calls (callee_id, created_at DESC);
-- Kiểm tra "máy bận" nhanh: chỉ index các cuộc gọi đang diễn ra
CREATE INDEX idx_calls_active_caller ON calls (caller_id) WHERE status IN ('ringing','ongoing');
CREATE INDEX idx_calls_active_callee ON calls (callee_id) WHERE status IN ('ringing','ongoing');
-- Mỗi hội thoại chỉ có tối đa 1 cuộc gọi đang diễn ra
CREATE UNIQUE INDEX uq_calls_one_active_per_conversation
    ON calls (conversation_id) WHERE status IN ('ringing','ongoing');

-- =====================================================================
-- 7. TIN NHẮN & TỆP ĐÍNH KÈM
-- =====================================================================

-- 7.1 messages --------------------------------------------------------
--  * type='text'  : content bắt buộc.
--  * type='image' / 'file': content là chú thích (tùy chọn); tệp nằm ở bảng attachments.
--  * type='call'  : tin nhắn hệ thống sinh khi cuộc gọi kết thúc/nhỡ/từ chối (call_id bắt buộc),
--                   nội dung "Cuộc gọi video - 03:15" do client dựng từ calls.
--  * Thu hồi: recalled_at != NULL, content = NULL, attachments bị đánh dấu deleted_at.
--  * client_message_id: UUID do client sinh để chống gửi trùng khi mạng chập chờn (idempotency).
CREATE TABLE messages (
    id                bigint       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id   uuid         NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id         uuid         REFERENCES users(id) ON DELETE SET NULL,
    type              message_type NOT NULL,
    content           text,
    call_id           uuid         REFERENCES calls(id) ON DELETE SET NULL,
    client_message_id uuid,
    recalled_at       timestamptz,
    created_at        timestamptz  NOT NULL DEFAULT now(),

    CONSTRAINT chk_messages_content_len CHECK (content IS NULL OR length(content) <= 5000),
    CONSTRAINT chk_messages_text_content CHECK (
        type <> 'text' OR recalled_at IS NOT NULL OR length(btrim(coalesce(content, ''))) > 0
    ),
    CONSTRAINT chk_messages_call_ref CHECK ((type = 'call') = (call_id IS NOT NULL)),
    CONSTRAINT chk_messages_recalled_empty CHECK (recalled_at IS NULL OR content IS NULL)
);
-- (1) Tải 20 tin gần nhất và cuộn lên tải tiếp: WHERE conversation_id=? AND id < ? ORDER BY id DESC LIMIT 20
CREATE INDEX idx_messages_conv_id ON messages (conversation_id, id DESC);
-- (2) Tìm kiếm từ khóa trong cuộc trò chuyện: content ILIKE '%từ khóa%'
CREATE INDEX idx_messages_content_trgm ON messages USING gin (content gin_trgm_ops)
    WHERE content IS NOT NULL AND recalled_at IS NULL;
-- (3) Chống gửi trùng
CREATE UNIQUE INDEX uq_messages_client_id ON messages (conversation_id, sender_id, client_message_id)
    WHERE client_message_id IS NOT NULL;
-- (4) Tin nhắn của một người dùng (xóa/ẩn danh, thống kê)
CREATE INDEX idx_messages_sender ON messages (sender_id, created_at DESC);
-- (5) Gắn tin nhắn hệ thống với cuộc gọi (mỗi cuộc gọi tối đa 1 tin nhắn hệ thống)
CREATE UNIQUE INDEX uq_messages_call ON messages (call_id) WHERE call_id IS NOT NULL;

-- Duy trì tóm tắt tin nhắn cuối của hội thoại để vẽ danh sách chat nhanh
CREATE OR REPLACE FUNCTION trg_messages_after_insert() RETURNS trigger AS $$
BEGIN
    UPDATE conversations
       SET last_message_id = NEW.id,
           last_message_at = NEW.created_at
     WHERE id = NEW.conversation_id
       AND (last_message_id IS NULL OR last_message_id < NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_messages_after_insert AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION trg_messages_after_insert();

ALTER TABLE conversations
    ADD CONSTRAINT fk_conversations_last_message
    FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;

ALTER TABLE conversation_members
    ADD CONSTRAINT fk_members_last_read_message
    FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- 7.2 attachments -----------------------------------------------------
-- Luồng: upload (message_id = NULL, "mồ côi") -> gửi tin nhắn kèm attachmentIds -> gán message_id.
-- Tệp mồ côi quá 24h bị job dọn dẹp xóa khỏi MinIO. Giới hạn 20 MB/tệp.
CREATE TABLE attachments (
    id               uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  uuid            NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    uploader_id      uuid            REFERENCES users(id) ON DELETE SET NULL,
    message_id       bigint          REFERENCES messages(id) ON DELETE CASCADE,
    kind             attachment_kind NOT NULL,
    bucket           varchar(63)     NOT NULL DEFAULT 'chat-files',
    object_key       text            NOT NULL,
    original_name    varchar(255)    NOT NULL,
    mime_type        varchar(150)    NOT NULL,
    size_bytes       bigint          NOT NULL,
    width            integer,
    height           integer,
    created_at       timestamptz     NOT NULL DEFAULT now(),
    deleted_at       timestamptz,                                  -- thu hồi tin nhắn / dọn dẹp

    CONSTRAINT uq_attachments_object UNIQUE (bucket, object_key),
    CONSTRAINT chk_attachments_size  CHECK (size_bytes > 0 AND size_bytes <= 20 * 1024 * 1024),
    CONSTRAINT chk_attachments_dim   CHECK ((width IS NULL OR width > 0) AND (height IS NULL OR height > 0))
);
CREATE INDEX idx_attachments_message      ON attachments (message_id) WHERE message_id IS NOT NULL;
CREATE INDEX idx_attachments_conv_kind    ON attachments (conversation_id, kind, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_uploader     ON attachments (uploader_id, created_at DESC);
CREATE INDEX idx_attachments_orphans      ON attachments (created_at) WHERE message_id IS NULL AND deleted_at IS NULL;

-- =====================================================================
-- 8. QUẢN TRỊ
-- =====================================================================

-- Nhật ký thao tác nhạy cảm của Admin / Super Admin.
-- action: user.ban | user.unban | user.delete | admin.create | admin.delete |
--         admin.password_reset | auth.super_admin_login
CREATE TABLE admin_audit_logs (
    id              bigint       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id        uuid         REFERENCES users(id) ON DELETE SET NULL,
    action          varchar(50)  NOT NULL,
    target_user_id  uuid         REFERENCES users(id) ON DELETE SET NULL,
    metadata        jsonb        NOT NULL DEFAULT '{}'::jsonb,
    ip_address      inet,
    created_at      timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created_at ON admin_audit_logs (created_at DESC);
CREATE INDEX idx_audit_actor      ON admin_audit_logs (actor_id, created_at DESC);
CREATE INDEX idx_audit_target     ON admin_audit_logs (target_user_id, created_at DESC);
CREATE INDEX idx_audit_action     ON admin_audit_logs (action, created_at DESC);

-- Thống kê tổng quan cho Dashboard. "Số người đang Online" lấy từ bộ nhớ của WebSocket hub
-- nên không nằm trong view này. Dung lượng MinIO chỉ tính tệp chat (không tính ảnh đại diện).
CREATE VIEW v_admin_system_stats AS
SELECT
    (SELECT count(*) FROM users          WHERE status <> 'deleted' AND role = 'user')          AS total_users,
    (SELECT count(*) FROM conversations  WHERE type = 'group')                                 AS total_groups,
    (SELECT count(*) FROM messages       WHERE type <> 'call' AND recalled_at IS NULL)         AS total_messages,
    (SELECT count(*) FROM attachments    WHERE deleted_at IS NULL AND message_id IS NOT NULL)  AS total_files,
    (SELECT coalesce(sum(size_bytes), 0) FROM attachments WHERE deleted_at IS NULL)            AS storage_bytes;

-- =====================================================================
-- 9. SEED (tham khảo)
-- Super Admin đầu tiên nên được ứng dụng tạo khi khởi động từ biến môi trường
-- (SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD) để băm bcrypt đúng cách. Ví dụ:
--
--   INSERT INTO users (email, username, display_name, password_hash, role)
--   VALUES ('superadmin@scall.local', 'superadmin', 'Super Admin', '<BCRYPT_HASH>', 'super_admin');
-- =====================================================================

COMMIT;
