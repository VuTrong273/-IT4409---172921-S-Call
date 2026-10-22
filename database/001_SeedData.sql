-- =====================================================================
-- S-Call  |  IT4409 - Nhóm 6
-- 001_SeedData.sql : Dữ liệu mẫu phục vụ DEMO
--
-- Chạy SAU 000_RelationshipTable.sql (Docker tự chạy theo thứ tự tên file khi
-- khởi tạo volume PostgreSQL lần đầu). Chạy lại thủ công trên DB đã seed sẽ báo
-- trùng khóa; muốn seed lại hãy xóa volume:  docker compose down -v
--
-- MẬT KHẨU CHUNG của mọi tài khoản mẫu : Scall@2026
-- MÃ PIN của minhanh cho cuộc trò chuyện với hoangnam : 1234
-- (băm bằng pgcrypto crypt(..., gen_salt('bf')) => bcrypt $2a$, tương thích bcrypt/bcryptjs)
--
--  Tài khoản          Role         Trạng thái    Mục đích demo
--  -----------------  -----------  ------------  -----------------------------------------------
--  superadmin         super_admin  active        Tạo/xóa Admin, nhật ký thao tác, mail cảnh báo
--  admin              admin        active        Dashboard, khóa/mở khóa/xóa người dùng
--  minhanh (chính)    user         active        Tài khoản demo chính: có đủ dữ liệu mọi tính năng
--  quocbao            user         active        Bạn của minhanh; Trưởng nhóm "Lớp Công nghệ Web"
--  hoangnam           user         active        Bạn của minhanh; hội thoại bị khóa PIN (1234)
--  tuankiet           user         active        Bạn của minhanh; có tin chưa đọc, từ chối cuộc gọi
--  thutrang           user         active        Bạn của minhanh, CHƯA có hội thoại 1-1
--  giahuy             user         active        Người lạ: dùng để demo Tìm kiếm + Gửi lời mời
--  phuongthao         user         active        Đã gửi lời mời kết bạn cho minhanh (chờ Chấp nhận/Từ chối)
--  thanhha            user         active        minhanh đã gửi lời mời cho thanhha (đang chờ)
--  vantoan99          user         active        Bị minhanh chặn (Block)
--  quockhanh          user         banned        Đăng nhập báo "bị khóa"; admin demo Mở khóa
--  dinhkhoa           user         deactivated   Tự vô hiệu hóa, đăng nhập lại để kích hoạt
--  (ẩn danh)          user         deleted       Tài khoản đã xóa; tin nhắn cũ hiển thị "Người dùng đã xóa"
-- ==============================================================================================

BEGIN;

-- Hàm phụ (chỉ tồn tại trong phiên này): chèn tin nhắn và trả về id
CREATE FUNCTION pg_temp.seed_msg(
    p_conv uuid, p_sender uuid, p_type message_type, p_content text,
    p_at timestamptz, p_call uuid DEFAULT NULL, p_recalled boolean DEFAULT false
) RETURNS bigint LANGUAGE plpgsql AS $fn$
DECLARE v_id bigint;
BEGIN
    INSERT INTO messages (conversation_id, sender_id, type, content, call_id, recalled_at, created_at)
    VALUES (p_conv, p_sender, p_type,
            CASE WHEN p_recalled THEN NULL ELSE p_content END,
            p_call,
            CASE WHEN p_recalled THEN p_at + interval '2 minutes' END,
            p_at)
    RETURNING id INTO v_id;
    RETURN v_id;
END
$fn$;

DO $seed$
DECLARE
    ---- mật khẩu / PIN (băm bcrypt) ----
    v_pw   text := crypt('Scall@2026', gen_salt('bf', 10));
    v_pin  text := crypt('1234',       gen_salt('bf', 8));

    ---- người dùng ----
    u_super   constant uuid := 'a0000000-0000-4000-8000-000000000001';
    u_admin   constant uuid := 'a0000000-0000-4000-8000-000000000002';
    u_alice   constant uuid := 'a0000000-0000-4000-8000-000000000003'; -- minhanh
    u_bob     constant uuid := 'a0000000-0000-4000-8000-000000000004'; -- quocbao
    u_charlie constant uuid := 'a0000000-0000-4000-8000-000000000005'; -- hoangnam
    u_david   constant uuid := 'a0000000-0000-4000-8000-000000000006'; -- tuankiet
    u_eva     constant uuid := 'a0000000-0000-4000-8000-000000000007'; -- thutrang
    u_frank   constant uuid := 'a0000000-0000-4000-8000-000000000008'; -- giahuy
    u_grace   constant uuid := 'a0000000-0000-4000-8000-000000000009'; -- phuongthao
    u_hannah  constant uuid := 'a0000000-0000-4000-8000-00000000000a'; -- thanhha
    u_trudy   constant uuid := 'a0000000-0000-4000-8000-00000000000b'; -- vantoan99
    u_mallory constant uuid := 'a0000000-0000-4000-8000-00000000000c'; -- quockhanh
    u_ivan    constant uuid := 'a0000000-0000-4000-8000-00000000000d'; -- dinhkhoa
    u_ghost   constant uuid := 'a0000000-0000-4000-8000-00000000000e'; -- đã xóa

    ---- hội thoại ----
    c_ab  constant uuid := 'c0000000-0000-4000-8000-000000000001';  -- minhanh - quocbao (direct)
    c_ac  constant uuid := 'c0000000-0000-4000-8000-000000000002';  -- minhanh - hoangnam (direct, khóa PIN)
    c_ad  constant uuid := 'c0000000-0000-4000-8000-000000000003';  -- minhanh - tuankiet (direct)
    c_btl constant uuid := 'c0000000-0000-4000-8000-000000000004';  -- nhóm BTL IT4409 (minhanh là Trưởng nhóm)
    c_web constant uuid := 'c0000000-0000-4000-8000-000000000005';  -- nhóm Lớp Công nghệ Web (quocbao là Trưởng nhóm)

    ---- cuộc gọi ----
    k_video constant uuid := 'd0000000-0000-4000-8000-000000000001';  -- minhanh -> quocbao, video, 03:15, có chia sẻ màn hình
    k_missed constant uuid := 'd0000000-0000-4000-8000-000000000002'; -- quocbao -> minhanh, voice, nhỡ
    k_reject constant uuid := 'd0000000-0000-4000-8000-000000000003'; -- minhanh -> tuankiet, voice, bị từ chối
    k_voice constant uuid := 'd0000000-0000-4000-8000-000000000004';  -- hoangnam -> minhanh, voice, 01:02

    ---- tệp đính kèm ----
    f_img constant uuid := 'e0000000-0000-4000-8000-000000000001';
    f_pdf constant uuid := 'e0000000-0000-4000-8000-000000000002';
    f_zip constant uuid := 'e0000000-0000-4000-8000-000000000003';

    t_start timestamptz;
    v_msg   bigint;
    m_last_ab bigint; m_prev_ab bigint;
    m_call_ac bigint; m_last_ac bigint;
    m_call_ad bigint; m_last_ad bigint;
    m_alice_btl bigint; m_last_btl bigint; m_david_btl bigint;
    m_last_web bigint; m_eva_web bigint;
    i int;
    v_senders uuid[] := ARRAY[u_alice, u_bob, u_charlie, u_david];

    -- 40 message của user để demo "Tin nhắn thử phân trang"
    v_btl_msgs text[] := ARRAY[
        'ê lập gr làm btl web đi dm',
        'ok chốt đề tài hệ thống chat + gọi video webrtc nhá',
        'nghe bảo đề này nhiều cái phải cấu hình lắm á',
        'ko sao chia việc ra làm là đc',
        't khởi tạo cái repo trên github r nhá, ae check mail accept invite đi',
        'oke thấy mail r, để t clone về máy',
        'nhớ check lại cái git config user.email trùng vs mail github nhé ko đến lúc thầy vào lại 0 commit',
        'ừa kỳ trc nhóm bạn t bị trừ điểm vụ lệch mail git cay vl',
        'database dùng postgres hay mysql đây mn',
        'dùng postgres 16 đi, chạy trong docker luôn đéo phải cài',
        'còn ảnh đại diện vs file đính kèm thì lưu vào đâu đc?',
        'dùng minio, nó giống hệt s3 mà dựng bằng docker nhẹ vl',
        'ok thế cấu hình sẵn vào docker-compose giúp bọn t nhé',
        'phần fe dùng react + vite + tailwind đc ko ae',
        'tùy m, nhớ làm responsive trên đt, đéo làm mất 5đ',
        'ok để t chia layout 2 cột, thu nhỏ màn hình về đt thì ẩn cột danh sách đi',
        'ê cái vụ gọi video lúc mang lên trường demo có sợ wifi trường chặn ko',
        'ko bt, chắc phải gắn thêm turn server vào mới gọi xuyên tường lửa đc',
        'turn server có phải tự code ko v',
        'đéo cần, lấy cấu hình sẵn hoặc chạy image coturn trong docker là đc',
        'thế thì đc, tưởng phải code từ đầu thì ngu người',
        'à từ tuần 7 bắt đầu tính điểm commit hàng tuần r đấy nhé ae',
        'ok tuần nào cx đẩy code lên đều đặn là đc',
        'ai rảnh vào bảng trello kéo card của mình sang cột in progress đi kìa',
        'đã kéo r nhé :v',
        'ê sao t gõ docker compose up nó cứ báo trùng port 5432 nhỉ?',
        'mở services của win lên tắt cái postgresql cài sẵn trong máy đi là chạy đc',
        'à ừ, đc r',
        'cái file openapi.yaml viết xong r đấy, ae mở postman import vào mà đọc nhé',
        'ok con trai',
        'còn mấy sự kiện websocket vs webrtc thì xem ở bảng tổng hợp nhé',
        'gói tin ws cứ thống nhất bọc trong trường type vs data là dễ xử lý nhất',
        'uk, thêm cái requestId để server bắn ack về nữa là đc',
        'tối nay có ai đi ăn bún đậu ở ngõ tự do ko, t vừa học xong',
        't đang đến, m gọi trước 1 suất nhé',
        'đợi t 15p tải nốt thư viện r đi',
        'kệ m',
        'xong r dm đang ra đây',
        'tối về nhớ viết phần báo cáo nhé, lấy template trước t gửi',
        'm làm đi t ko làm đâu'
    ];
BEGIN
    ------------------------------------------------------------------
    -- 1. NGƯỜI DÙNG
    ------------------------------------------------------------------
    INSERT INTO users (id, email, username, display_name, bio, password_hash, avatar_object_key,
                       role, status, last_seen_at, password_changed_at, created_by, created_at) VALUES
    (u_super,   'superadmin@scall.local', 'superadmin', 'Quản trị cấp cao',     'Tài khoản vận hành hệ thống S-Call', v_pw, NULL,
        'super_admin', 'active', now() - interval '30 minutes', NULL, NULL, now() - interval '30 days'),
    (u_admin,   'admin@scall.local',      'admin',      'Admin Hệ Thống',       'Hỗ trợ & kiểm duyệt người dùng',     v_pw, NULL,
        'admin',       'active', now() - interval '1 hour',     NULL, u_super, now() - interval '29 days'),
    (u_alice,   'minhanh@scall.local',    'minhanh',    'Nguyễn Minh Anh',      'Meow~', v_pw,
        'users/' || u_alice || '.png',   'user', 'active', now() - interval '5 minutes',  NULL, NULL, now() - interval '20 days'),
    (u_bob,     'quocbao@scall.local',    'quocbao',    'Trần Quốc Bảo',        '(๑˃ᴗ˂) ﻭ', v_pw,
        'users/' || u_bob || '.png',     'user', 'active', now() - interval '20 minutes', NULL, NULL, now() - interval '19 days'),
    (u_charlie, 'hoangnam@scall.local',   'hoangnam',   'Lê Hoàng Nam',         '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', v_pw,
        'users/' || u_charlie || '.png', 'user', 'active', now() - interval '2 hours',    NULL, NULL, now() - interval '18 days'),
    (u_david,   'tuankiet@scall.local',   'tuankiet',   'Phạm Tuấn Kiệt',       '¯\_(ツ)_/¯', v_pw,
        'users/' || u_david || '.png',   'user', 'active', now() - interval '1 day',      NULL, NULL, now() - interval '17 days'),
    (u_eva,     'thutrang@scall.local',   'thutrang',   'Hoàng Thu Trang',      '(¬‿¬)', v_pw,
        'users/' || u_eva || '.png',     'user', 'active', now() - interval '3 hours',    NULL, NULL, now() - interval '16 days'),
    (u_frank,   'giahuy@scall.local',     'giahuy',     'Đặng Gia Huy',         '(ง •̀_•́)ง',                           v_pw, NULL,
        'user', 'active', now() - interval '6 hours', NULL, NULL, now() - interval '10 days'),
    (u_grace,   'phuongthao@scall.local', 'phuongthao', 'Đỗ Phương Thảo',       'K68 SOICT',                          v_pw, NULL,
        'user', 'active', now() - interval '4 hours', NULL, NULL, now() - interval '9 days'),
    (u_hannah,  'thanhha@scall.local',    'thanhha',    'Ngô Thanh Hà',         NULL,                                 v_pw, NULL,
        'user', 'active', now() - interval '2 days',  NULL, NULL, now() - interval '8 days'),
    (u_trudy,   'vantoan99@scall.local',  'vantoan99',  'Bùi Văn Toàn',         'Nhận làm thuê đồ án, chạy quảng cáo giá rẻ', v_pw, NULL,
        'user', 'active', now() - interval '7 hours', NULL, NULL, now() - interval '7 days');

    -- Bị khóa
    INSERT INTO users (id, email, username, display_name, password_hash, role, status,
                       banned_at, banned_by, ban_reason, last_seen_at, created_at)
    VALUES (u_mallory, 'quockhanh@scall.local', 'quockhanh', 'Lý Quốc Khánh', v_pw, 'user', 'banned',
            now() - interval '2 days', u_admin, 'Rải link rác và spam tin nhắn quảng cáo liên tục', now() - interval '2 days', now() - interval '6 days');

    -- Tự vô hiệu hóa
    INSERT INTO users (id, email, username, display_name, password_hash, role, status,
                       deactivated_at, last_seen_at, created_at)
    VALUES (u_ivan, 'dinhkhoa@scall.local', 'dinhkhoa', 'Vũ Đình Khoa', v_pw, 'user', 'deactivated',
            now() - interval '3 days', now() - interval '3 days', now() - interval '5 days');

    -- Đã xóa (xóa mềm + ẩn danh hóa): email/username/họ tên bị thay, mật khẩu vô hiệu
    INSERT INTO users (id, email, username, display_name, password_hash, role, status, deleted_at, created_at)
    VALUES (u_ghost, 'deleted_' || replace(u_ghost::text, '-', '') || '@deleted.invalid',
            'deleted_' || replace(u_ghost::text, '-', ''), 'Người dùng đã xóa',
            crypt(gen_random_uuid()::text, gen_salt('bf', 4)), 'user', 'deleted',
            now() - interval '1 day', now() - interval '12 days');

    ------------------------------------------------------------------
    -- 2. KẾT BẠN, CHẶN
    ------------------------------------------------------------------
    -- Quan hệ bạn bè (user_low_id < user_high_id nên dùng LEAST/GREATEST)
    INSERT INTO friendships (user_low_id, user_high_id, created_at)
    SELECT LEAST(a, b), GREATEST(a, b), now() - age_
    FROM (VALUES
        (u_alice,   u_bob,     interval '18 days'),
        (u_alice,   u_charlie, interval '17 days'),
        (u_alice,   u_david,   interval '16 days'),
        (u_alice,   u_eva,     interval '15 days'),
        (u_bob,     u_charlie, interval '14 days'),
        (u_bob,     u_david,   interval '13 days'),
        (u_bob,     u_eva,     interval '12 days'),
        (u_charlie, u_david,   interval '11 days')
    ) AS v(a, b, age_);

    -- Lịch sử lời mời: đã chấp nhận / bị từ chối / đang chờ
    INSERT INTO friend_requests (sender_id, receiver_id, status, created_at, responded_at) VALUES
        (u_alice, u_bob,     'accepted', now() - interval '18 days', now() - interval '18 days' + interval '1 hour'),
        (u_alice, u_charlie, 'accepted', now() - interval '17 days', now() - interval '17 days' + interval '2 hours'),
        (u_david, u_alice,   'accepted', now() - interval '16 days', now() - interval '16 days' + interval '3 hours'),
        (u_eva,   u_alice,   'accepted', now() - interval '15 days', now() - interval '15 days' + interval '1 hour'),
        (u_frank, u_eva,     'rejected', now() - interval '4 days',  now() - interval '4 days' + interval '1 hour'),
        (u_grace, u_alice,   'pending',  now() - interval '1 hour',  NULL),   -- minhanh thấy lời mời đến từ phuongthao
        (u_alice, u_hannah,  'pending',  now() - interval '2 hours', NULL);   -- minhanh thấy lời mời đã gửi cho thanhha

    -- minhanh chặn vantoan99
    INSERT INTO user_blocks (blocker_id, blocked_id, created_at) VALUES
        (u_alice, u_trudy, now() - interval '3 days');

    ------------------------------------------------------------------
    -- 3. HỘI THOẠI + THÀNH VIÊN
    ------------------------------------------------------------------
    INSERT INTO conversations (id, type, name, avatar_object_key, direct_key, created_by, created_at) VALUES
        (c_ab,  'direct', NULL, NULL, LEAST(u_alice, u_bob)::text     || ':' || GREATEST(u_alice, u_bob)::text,     u_alice,   now() - interval '18 days'),
        (c_ac,  'direct', NULL, NULL, LEAST(u_alice, u_charlie)::text || ':' || GREATEST(u_alice, u_charlie)::text, u_alice,   now() - interval '17 days'),
        (c_ad,  'direct', NULL, NULL, LEAST(u_alice, u_david)::text   || ':' || GREATEST(u_alice, u_david)::text,   u_david,   now() - interval '16 days'),
        (c_btl, 'group', 'BTL Web 36', 'conversations/' || c_btl || '.png', NULL, u_alice, now() - interval '4 days'),
        (c_web, 'group', 'Nhóm Web', NULL, NULL, u_bob, now() - interval '10 days');

    INSERT INTO conversation_members (conversation_id, user_id, role, added_by, joined_at, left_at) VALUES
        (c_ab,  u_alice,   'member', NULL,    now() - interval '18 days', NULL),
        (c_ab,  u_bob,     'member', NULL,    now() - interval '18 days', NULL),
        (c_ac,  u_alice,   'member', NULL,    now() - interval '17 days', NULL),
        (c_ac,  u_charlie, 'member', NULL,    now() - interval '17 days', NULL),
        (c_ad,  u_alice,   'member', NULL,    now() - interval '16 days', NULL),
        (c_ad,  u_david,   'member', NULL,    now() - interval '16 days', NULL),
        -- Nhóm BTL: minhanh là Trưởng nhóm; ghost (đã xóa tài khoản) từng là thành viên
        (c_btl, u_alice,   'admin',  NULL,    now() - interval '4 days', NULL),
        (c_btl, u_bob,     'member', u_alice, now() - interval '4 days', NULL),
        (c_btl, u_charlie, 'member', u_alice, now() - interval '4 days', NULL),
        (c_btl, u_david,   'member', u_alice, now() - interval '4 days', NULL),
        (c_btl, u_ghost,   'member', u_alice, now() - interval '4 days', now() - interval '1 day'),
        -- Nhóm Lớp Web: quocbao là Trưởng nhóm
        (c_web, u_bob,     'admin',  NULL,    now() - interval '10 days', NULL),
        (c_web, u_alice,   'member', u_bob,   now() - interval '10 days', NULL),
        (c_web, u_eva,     'member', u_bob,   now() - interval '10 days', NULL);

    -- minhanh khóa cuộc trò chuyện với hoangnam bằng PIN 1234
    UPDATE conversation_members
       SET pin_hash = v_pin, pin_set_at = now() - interval '2 days'
     WHERE conversation_id = c_ac AND user_id = u_alice;

    ------------------------------------------------------------------
    -- 4. CUỘC GỌI
    ------------------------------------------------------------------
    -- 4.1 minhanh -> quocbao, VIDEO, nghe máy sau 5s, kéo dài 03:15, có chia sẻ màn hình
    t_start := now() - interval '1 day 3 hours';
    INSERT INTO calls (id, conversation_id, caller_id, callee_id, call_type, status, end_reason, screen_shared,
                       created_at, answered_at, ended_at, ended_by)
    VALUES (k_video, c_ab, u_alice, u_bob, 'video', 'ended', 'hangup', true,
            t_start, t_start + interval '5 seconds', t_start + interval '200 seconds', u_alice);

    -- 4.2 quocbao -> minhanh, VOICE, nhỡ (hết 30s không nghe)
    t_start := now() - interval '3 hours 10 minutes';
    INSERT INTO calls (id, conversation_id, caller_id, callee_id, call_type, status, end_reason,
                       created_at, ended_at, ended_by)
    VALUES (k_missed, c_ab, u_bob, u_alice, 'voice', 'missed', 'timeout',
            t_start, t_start + interval '30 seconds', NULL);

    -- 4.3 minhanh -> tuankiet, VOICE, tuankiet từ chối
    t_start := now() - interval '1 day 20 hours';
    INSERT INTO calls (id, conversation_id, caller_id, callee_id, call_type, status, end_reason,
                       created_at, ended_at, ended_by)
    VALUES (k_reject, c_ad, u_alice, u_david, 'voice', 'rejected', 'rejected',
            t_start, t_start + interval '8 seconds', u_david);

    -- 4.4 hoangnam -> minhanh, VOICE, 01:02
    t_start := now() - interval '5 hours';
    INSERT INTO calls (id, conversation_id, caller_id, callee_id, call_type, status, end_reason,
                       created_at, answered_at, ended_at, ended_by)
    VALUES (k_voice, c_ac, u_charlie, u_alice, 'voice', 'ended', 'hangup',
            t_start, t_start + interval '6 seconds', t_start + interval '68 seconds', u_charlie);

    ------------------------------------------------------------------
    -- 5. TIN NHẮN (chèn theo thứ tự thời gian tăng dần trong từng hội thoại)
    ------------------------------------------------------------------
    -- 5.1 minhanh - quocbao: văn bản, ảnh, thu hồi, cuộc gọi video, cuộc gọi nhỡ
    PERFORM pg_temp.seed_msg(c_ab, u_alice, 'text', 'ê m be code xong cái auth chưa v', now() - interval '2 days 3 hours');
    PERFORM pg_temp.seed_msg(c_ab, u_bob,   'text', 'r đang lm nốt websocket, khó vkl', now() - interval '2 days 2 hours 55 minutes');
    v_msg := pg_temp.seed_msg(c_ab, u_bob,  'image', 'cho t xin ít tiền ăn trưa lm on', now() - interval '2 days 2 hours 45 minutes');
    INSERT INTO attachments (id, conversation_id, uploader_id, message_id, kind, bucket, object_key, original_name, mime_type, size_bytes, width, height, created_at)
    VALUES (f_img, c_ab, u_bob, v_msg, 'image', 'chat-files',
            c_ab || '/' || f_img || '/memechongheorach.png', 'memechongheorach.png', 'image/png', 16941, 640, 360,
            now() - interval '2 days 2 hours 46 minutes');
    PERFORM pg_temp.seed_msg(c_ab, u_alice, 'text', ':) kệ m', now() - interval '2 days 2 hours 40 minutes');
    PERFORM pg_temp.seed_msg(c_ab, u_alice, 'text', 'nhầm tab sr', now() - interval '2 days 2 hours 30 minutes', NULL, true);          -- ĐÃ THU HỒI
    PERFORM pg_temp.seed_msg(c_ab, u_alice, 'call', NULL, now() - interval '1 day 3 hours' + interval '200 seconds', k_video);         -- "Cuộc gọi video - 03:15"
    PERFORM pg_temp.seed_msg(c_ab, u_bob,   'text', 'oke chốt thế nhé, share màn hình nhìn phát hiểu luôn đỡ phải gõ nhiều 🥀',   now() - interval '1 day 2 hours 50 minutes');
    m_prev_ab := pg_temp.seed_msg(c_ab, u_bob, 'call', NULL, now() - interval '3 hours 10 minutes' + interval '30 seconds', k_missed); -- "Cuộc gọi nhỡ"
    m_last_ab := pg_temp.seed_msg(c_ab, u_alice, 'text', 'nãy t chạy xuống dưới nhà lấy đồ ăn ko cầm đt, có j ko', now() - interval '3 hours');

    UPDATE conversation_members SET last_read_message_id = m_prev_ab, last_read_at = now() - interval '3 hours 5 minutes'
     WHERE conversation_id = c_ab AND user_id = u_alice;      -- minhanh: đã đọc hết, chưa có tin chưa đọc
    UPDATE conversation_members SET last_read_message_id = m_prev_ab, last_read_at = now() - interval '3 hours 9 minutes'
     WHERE conversation_id = c_ab AND user_id = u_bob;        -- quocbao chưa xem tin cuối của minhanh => "Đã gửi" (chưa "Đã xem")

    -- 5.2 minhanh - hoangnam (khóa PIN 1234)
    PERFORM pg_temp.seed_msg(c_ac, u_alice,   'text', 'ê t đặt mã pin 1234 chat này vào r, hay vứt lap ở clb sợ bị đọc trộm', now() - interval '2 days');
    PERFORM pg_temp.seed_msg(c_ac, u_charlie, 'text', ':D à nhớ lưu lại pass wifi phòng lab tầng 4 là lab1235 nhá', now() - interval '1 day 23 hours');
    m_call_ac := pg_temp.seed_msg(c_ac, u_charlie, 'call', NULL, now() - interval '5 hours' + interval '68 seconds', k_voice);   -- cuộc gọi thoại 01:02
    m_last_ac := pg_temp.seed_msg(c_ac, u_charlie, 'text', 'oke nãy trao đổi thế nha, tối về t sửa lại css trên đt cho đỡ bị tràn chữ', now() - interval '4 hours 55 minutes');
    UPDATE conversation_members SET last_read_message_id = m_call_ac, last_read_at = now() - interval '4 hours 58 minutes'
     WHERE conversation_id = c_ac AND user_id = u_alice;      -- minhanh còn 1 tin chưa đọc
    UPDATE conversation_members SET last_read_message_id = m_last_ac, last_read_at = now() - interval '4 hours 50 minutes'
     WHERE conversation_id = c_ac AND user_id = u_charlie;

    -- 5.3 minhanh - tuankiet (tuankiet từ chối cuộc gọi, minhanh còn 2 tin chưa đọc)
    PERFORM pg_temp.seed_msg(c_ad, u_alice, 'text', 'kiệt ơi đang ở thư viện hay về trọ r?', now() - interval '1 day 20 hours 5 minutes');
    m_call_ad := pg_temp.seed_msg(c_ad, u_alice, 'call', NULL, now() - interval '1 day 20 hours' + interval '8 seconds', k_reject);
    PERFORM pg_temp.seed_msg(c_ad, u_david, 'text', 'sr đang ngồi trong lớp thầy điểm danh ko nghe đt đc', now() - interval '1 day 19 hours');
    m_last_ad := pg_temp.seed_msg(c_ad, u_david, 'text', 'có j gấp ko m, phần btl của t tối nay t push lên git nhé', now() - interval '1 day 18 hours 55 minutes');
    UPDATE conversation_members SET last_read_message_id = m_call_ad, last_read_at = now() - interval '1 day 19 hours 30 minutes'
     WHERE conversation_id = c_ad AND user_id = u_alice;
    UPDATE conversation_members SET last_read_message_id = m_last_ad, last_read_at = now() - interval '1 day 18 hours'
     WHERE conversation_id = c_ad AND user_id = u_david;

    -- 5.4 Nhóm BTL IT4409: 40 tin tự nhiên để demo phân trang (20 tin/trang), tệp ZIP/PDF, người dùng đã xóa
    FOR i IN 1..40 LOOP
        PERFORM pg_temp.seed_msg(c_btl, v_senders[1 + ((i - 1) % 4)], 'text',
                                 v_btl_msgs[i],
                                 now() - interval '3 days' + (i * interval '2 minutes'));
    END LOOP;
    m_alice_btl := pg_temp.seed_msg(c_btl, u_alice, 'text', 'ê mn tập trung chốt nốt các đầu việc tuần này để chuẩn bị ghép code đi dm', now() - interval '2 days 5 hours');
    PERFORM pg_temp.seed_msg(c_btl, u_bob,   'text', 'ok phần be t xong khung ws vs signaling r, đang test thử trc đã',                  now() - interval '2 days 4 hours');
    PERFORM pg_temp.seed_msg(c_btl, u_ghost, 'text', 'để t tổng hợp lại tài liệu kiểm thử cho nhé',                                      now() - interval '2 days 3 hours');   -- người gửi đã xóa tài khoản
    v_msg := pg_temp.seed_msg(c_btl, u_charlie, 'file', 't nén tạm cái khung giao diện fe gửi lên đây cho mn xem trc nhé',               now() - interval '1 day 6 hours');
    INSERT INTO attachments (id, conversation_id, uploader_id, message_id, kind, bucket, object_key, original_name, mime_type, size_bytes, created_at)
    VALUES (f_zip, c_btl, u_charlie, v_msg, 'file', 'chat-files',
            c_btl || '/' || f_zip || '/source-code.zip', 'source-code.zip', 'application/zip', 297,
            now() - interval '1 day 6 hours 1 minute');
    v_msg := pg_temp.seed_msg(c_btl, u_alice, 'file', 'còn đây là file báo cáo tiến độ tuần 5 t vừa xuất pdf nha',                     now() - interval '1 day 5 hours');
    INSERT INTO attachments (id, conversation_id, uploader_id, message_id, kind, bucket, object_key, original_name, mime_type, size_bytes, created_at)
    VALUES (f_pdf, c_btl, u_alice, v_msg, 'file', 'chat-files',
            c_btl || '/' || f_pdf || '/bao-cao-tuan-5.pdf', 'bao-cao-tuan-5.pdf', 'application/pdf', 706,
            now() - interval '1 day 5 hours 1 minute');
    m_david_btl := pg_temp.seed_msg(c_btl, u_david, 'text', 'ok đã tải về xem r nhé, viết chi tiết phết đấy',                          now() - interval '1 day 4 hours');
    PERFORM pg_temp.seed_msg(c_btl, u_bob,     'text', 'tối nay 9h lên web mình call video test thử luôn ko ae',                       now() - interval '3 hours');
    m_last_btl := pg_temp.seed_msg(c_btl, u_charlie, 'text', 'oke chốt 9h nhé, t rảnh',                                                now() - interval '2 hours');
    UPDATE conversation_members SET last_read_message_id = m_david_btl,  last_read_at = now() - interval '1 day'
     WHERE conversation_id = c_btl AND user_id IN (u_alice, u_david);       -- minhanh còn 2 tin chưa đọc
    UPDATE conversation_members SET last_read_message_id = m_last_btl, last_read_at = now() - interval '1 hour'
     WHERE conversation_id = c_btl AND user_id IN (u_bob, u_charlie);

    -- 5.5 Nhóm Lớp Công nghệ Web
    PERFORM pg_temp.seed_msg(c_web, u_bob,   'text', 'thầy vừa giao bài trên lớp buổi trc, m ko đi học ak', now() - interval '1 day');
    m_eva_web := pg_temp.seed_msg(c_web, u_eva, 'text', 'khó ;<',                                           now() - interval '23 hours');
    m_last_web := pg_temp.seed_msg(c_web, u_alice, 'text', 'Đùa m oi',                                      now() - interval '22 hours');
    UPDATE conversation_members SET last_read_message_id = m_last_web, last_read_at = now() - interval '21 hours'
     WHERE conversation_id = c_web AND user_id IN (u_alice, u_bob);
    UPDATE conversation_members SET last_read_message_id = m_eva_web,  last_read_at = now() - interval '22 hours 30 minutes'
     WHERE conversation_id = c_web AND user_id = u_eva;

    ------------------------------------------------------------------
    -- 6. QUẢN TRỊ: nhật ký thao tác và hộp thư giả lập (dev mailbox)
    ------------------------------------------------------------------
    INSERT INTO admin_audit_logs (actor_id, action, target_user_id, metadata, ip_address, created_at) VALUES
        (u_super, 'admin.create',           u_admin,   '{"username":"admin"}'::jsonb,                                                 '127.0.0.1', now() - interval '29 days'),
        (u_super, 'auth.super_admin_login', NULL,      '{"userAgent":"Chrome 130 / Windows"}'::jsonb,                                 '127.0.0.1', now() - interval '30 minutes'),
        (u_admin, 'user.ban',               u_mallory, '{"reason":"Rải link rác và spam tin nhắn quảng cáo liên tục"}'::jsonb,        '127.0.0.1', now() - interval '2 days'),
        (u_admin, 'user.delete',            u_ghost,   '{"reason":"Người dùng gửi yêu cầu xóa tài khoản cá nhân"}'::jsonb,            '127.0.0.1', now() - interval '1 day');

    INSERT INTO email_outbox (to_email, template, subject, body, payload, status, attempts, created_at, sent_at) VALUES
        ('superadmin@scall.local', 'super_admin_login_alert', '[S-Call] Cảnh báo: Super Admin vừa đăng nhập',
         E'Tài khoản Super Admin vừa đăng nhập.\nThời gian: gần đây\nIP: 127.0.0.1\nNếu không phải bạn, hãy kiểm tra hệ thống ngay.',
         '{"ip":"127.0.0.1"}'::jsonb, 'sent', 1, now() - interval '30 minutes', now() - interval '30 minutes'),
        ('minhanh@scall.local', 'password_reset_otp', '[S-Call] Mã OTP đặt lại mật khẩu',
         E'Xin chào Nguyễn Minh Anh,\nMã OTP khôi phục mật khẩu của bạn là 482913. Mã có hiệu lực trong 10 phút.',
         '{"otp":"482913"}'::jsonb, 'sent', 1, now() - interval '9 days', now() - interval '9 days');
END
$seed$;

COMMIT;