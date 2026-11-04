"""Adapt the supplied Stitch HTML into an S-Call design preview."""
from pathlib import Path
import re

source = Path(r'C:\Users\ADMIN\.codex\attachments\9dfd0471-1e45-4328-bc3e-f1c94de9f7f4\Pasted text.txt').read_text(encoding='utf-8-sig')
head = source.split('<body', 1)[0]
head = re.sub(r'<title>.*?</title>', '<title>S-Call — Nhắn tin dễ dàng. Gọi nhau gần hơn.</title>', head)
head = head.replace('::-webkit-scrollbar{display:none;}', '')
head = head.replace('</head>', '''<meta name="description" content="Khám phá thiết kế S-Call: nhắn tin cá nhân và nhóm, gọi thoại/video, chia sẻ tệp và khóa trò chuyện bằng PIN."/>
<style>
html{scroll-padding-top:110px}body{overflow-x:hidden}a,button,summary,input{touch-action:manipulation}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid #2563eb;outline-offset:5px}summary{cursor:pointer}summary::marker{color:#2563eb}.material-symbols-outlined{vertical-align:middle}#demo input{min-width:0}#demo button{cursor:default}#demo img{background:#dbe1ff}dialog{border:0;border-radius:24px;padding:32px;max-width:460px;width:calc(100% - 40px);color:#131b2e}dialog::backdrop{background:rgba(19,27,46,.45);backdrop-filter:blur(4px)}
@media(max-width:639px){#demo .min-h-\\[560px\\]{min-height:0}#demo .w-64{width:100%}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}}
</style></head>''')

def icon(name):
    return f'<span class="material-symbols-outlined" aria-hidden="true">{name}</span>'

def link(text, target, primary=False):
    style = 'bg-primary-container text-white shadow-lg shadow-blue-200/50 hover:bg-primary' if primary else 'bg-white text-on-surface hover:bg-surface-container-low'
    return f'<a href="{target}" class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition {style}">{text}{icon("arrow_forward") if primary else ""}</a>'

logo = f'<a href="#home" class="flex items-center gap-3 font-bold text-xl tracking-tight"><span class="grid h-10 w-10 place-items-center rounded-xl bg-primary-container text-white">{icon("forum")}</span>S-Call</a>'
header = f'''<body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed">
<a class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white p-3 rounded-xl" href="#home">Đến nội dung chính</a>
<header class="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-primary/5">
<div class="max-w-[1200px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-4">{logo}
<nav aria-label="Điều hướng chính" class="hidden lg:flex gap-6 text-sm font-semibold text-on-surface-variant"><a href="#features">Tính năng</a><a href="#how-it-works">Cách sử dụng</a><a href="#privacy">Quyền riêng tư</a><a href="#faq">Câu hỏi thường gặp</a></nav>
<div class="flex items-center gap-2"><button type="button" data-auth="login" class="hidden sm:block px-4 py-3 text-sm font-semibold rounded-full hover:bg-primary-fixed">Đăng nhập</button><button type="button" data-auth="register" class="px-5 py-3 rounded-full bg-primary-container text-white text-sm font-semibold hover:bg-primary">Đăng ký</button></div></div>
<details class="lg:hidden px-6 pb-3"><summary class="text-sm font-semibold py-2">Khám phá S-Call</summary><nav aria-label="Điều hướng trên điện thoại" class="flex flex-wrap gap-4 py-3 text-sm"><a href="#features">Tính năng</a><a href="#how-it-works">Cách sử dụng</a><a href="#privacy">Quyền riêng tư</a><a href="#faq">FAQ</a><button type="button" data-auth="login">Đăng nhập</button></nav></details></header>
<main><section id="home" class="relative pt-12 lg:pt-20 pb-20 bg-gradient-to-b from-surface via-surface-container-low/60 to-background"><div class="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed/60 text-primary text-xs font-semibold mb-6">{icon('chat_bubble')} Một không gian cho những cuộc trò chuyện mỗi ngày</span>
<h1 class="text-4xl sm:text-5xl lg:text-[64px] leading-[1.15] font-extrabold tracking-tight max-w-4xl mx-auto">Nhắn tin dễ dàng.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary-container">Gọi nhau gần hơn.</span></h1>
<p class="max-w-2xl mx-auto mt-6 text-lg leading-8 text-on-surface-variant">Từ một lời chào đến những câu chuyện dài. S-Call mang tin nhắn, cuộc gọi và những điều bạn muốn chia sẻ về cùng một nơi.</p>
<div class="flex flex-wrap justify-center gap-3 mt-8">{link('Khám phá S-Call','#features',True)}{link('Xem giao diện','#demo')}</div>
<div class="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-7 text-sm text-on-surface-variant"><span>{icon('chat')} Chat cá nhân &amp; nhóm</span><span>{icon('videocam')} Gọi thoại &amp; video</span><span>{icon('language')} Thiết kế cho trình duyệt</span></div>
<p class="text-xs text-on-surface-variant mt-6 mb-10">Bản xem trước thiết kế • Các tính năng đang được phát triển theo đặc tả S-Call.</p>
'''

# Retain the supplied visual language and chat composition, with truthful sample content.
demo = source.split('<!-- Hero App Interface Showcase Mockup (Aligned with Inspiration) -->', 1)[1].split('<!-- SOCIAL PROOF / TRUSTED BY BRANDS -->', 1)[0]
demo = demo[:demo.rfind('</div>\n</section>')] if '</div>\n</section>' in demo else demo
replacements = {
    'Talk Desktop v3.1': 'S-Call · Giao diện minh họa',
    'Đã đồng bộ hóa đám mây': 'Bản xem trước',
    'Pink Panda': 'Minh Anh',
    '>Chats<': '>Tin nhắn<',
    'Đã ghim': 'Cuộc trò chuyện',
    'HD 1080p • 12:45': 'Gọi video · Minh họa',
    'Chào buổi sáng! Bạn đã hoàn thành thiết kế logo phiên bản 3.0 chưa? 👋': 'Chiều nay nhóm mình cùng ôn bài nhé? 👋',
    'Chào Minh Anh! Mình đã vẽ xong cả phối cảnh 3D rồi nhé!': 'Được chứ! Mình gửi tài liệu cho bạn trước nhé.',
    'Abstract_Artwork.png': 'Tai_lieu_on_tap.pdf',
    '14.8 MB • PNG chất lượng cao': '2.4 MB · Tài liệu PDF',
    '🔥</span> 1 Reaction': 'Ảnh chia sẻ</span>',
}
for a,b in replacements.items():
    demo = demo.replace(a,b)
demo = demo.replace('w-full max-w-5xl relative', 'w-full max-w-5xl mx-auto relative')
demo = demo.replace('col-span-12 sm:col-span-5 md:col-span-4', 'hidden sm:flex sm:col-span-5 md:col-span-4')
demo = demo.replace('hidden sm:flex flex-col', 'hidden sm:flex flex-col')
demo = re.sub(r'class="absolute top-16 right-5 w-72', 'class="hidden lg:block absolute top-16 right-5 w-60', demo)
# This is an illustration, not a working messaging client.
demo = re.sub(r'<input\b([^>]*?)/>', r'<input\1 readonly tabindex="-1" aria-label="Nội dung minh họa"/>', demo)
demo = re.sub(r'<button\b', '<button type="button" disabled aria-label="Điều khiển trong hình minh họa"', demo)
demo = re.sub(r'data-alt="([^"]*)"', r'alt="\1" loading="lazy"', demo)
demo = '<figure aria-label="Minh họa giao diện S-Call">' + demo + '<figcaption class="mt-5 text-xs text-on-surface-variant">Hình minh họa chat và cuộc gọi; dữ liệu mẫu, chưa kết nối tài khoản thật.</figcaption></figure></div></section>'

features = [
    ('chat','Nhắn tin cá nhân','Gửi tin nhắn cho bạn bè, xem lịch sử trò chuyện và theo dõi trạng thái đã xem.','Một lời chào, mở đầu câu chuyện.'),
    ('videocam','Gọi thoại & video','Bắt đầu cuộc gọi thoại hoặc video với người bạn muốn trò chuyện ngay từ hội thoại.','Nghe giọng quen, thấy nhau gần.'),
    ('groups','Trò chuyện nhóm','Tạo nhóm, thêm bạn bè và cùng trao đổi trong một không gian chung.','Bạn bè, lớp học, nhóm học tập.'),
    ('attach_file','Chia sẻ ảnh & tài liệu','Gửi hình ảnh và tệp đính kèm để câu chuyện có thêm những điều cần chia sẻ.','Từ tấm ảnh đến tài liệu ôn bài.'),
    ('person_add','Tìm kiếm & kết bạn','Tìm người dùng bằng email hoặc tên tài khoản, gửi và quản lý lời mời kết bạn.','Tìm đúng người, kết nối dễ dàng.'),
    ('lock','Khóa trò chuyện bằng PIN','Thêm bước mở khóa bằng mã PIN cho cuộc trò chuyện bạn muốn giữ riêng tư.','Chủ động với không gian của mình.'),
]
cards = ''.join(f'''<article class="rounded-3xl p-7 bg-white border border-primary/5 shadow-sm hover:shadow-lg transition-shadow"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-primary-fixed/60 text-primary mb-6">{icon(i)}</span><h3 class="font-bold text-xl mb-3">{t}</h3><p class="text-on-surface-variant leading-7 text-sm">{d}</p><p class="mt-6 pt-4 border-t border-primary/5 text-xs text-primary font-semibold">{s}</p></article>''' for i,t,d,s in features)
body = f'''<section id="features" class="py-20 lg:py-24"><div class="max-w-[1200px] mx-auto px-6 lg:px-12"><div class="text-center max-w-2xl mx-auto mb-12"><span class="text-xs font-bold tracking-widest text-primary">KẾT NỐI THEO CÁCH CỦA BẠN</span><h2 class="text-3xl sm:text-4xl font-bold tracking-tight mt-4">Những điều cần cho một cuộc trò chuyện trọn vẹn</h2><p class="mt-5 text-on-surface-variant leading-7">Các tính năng trong kế hoạch sản phẩm S-Call, dành cho liên lạc cá nhân và trao đổi trong nhóm.</p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{cards}</div></div></section>
<section id="how-it-works" class="py-20 bg-white"><div class="max-w-[1200px] mx-auto px-6 lg:px-12"><div class="text-center"><span class="text-xs tracking-widest font-bold text-primary">CÁCH SỬ DỤNG</span><h2 class="text-3xl sm:text-4xl font-bold mt-4">Từ lời chào đầu tiên, chỉ ba bước</h2><p class="mt-4 text-on-surface-variant">Luồng sử dụng dự kiến khi các chức năng được hoàn thiện.</p></div><ol class="grid md:grid-cols-3 gap-8 mt-12">'''
steps = [('Tạo tài khoản','Đăng ký tài khoản S-Call và bổ sung tên hiển thị, ảnh đại diện của bạn.'),('Tìm và kết bạn','Tìm bạn bè qua email hoặc tên tài khoản, sau đó gửi lời mời kết bạn.'),('Bắt đầu trò chuyện','Nhắn tin, chia sẻ tài liệu hoặc bắt đầu cuộc gọi với bạn bè.')]
for n,(t,d) in enumerate(steps,1):
    body += f'<li class="p-6 rounded-3xl bg-surface-container-low/60"><span class="grid h-11 w-11 place-items-center rounded-full bg-primary-container text-white font-bold">0{n}</span><h3 class="text-xl font-bold mt-5">{t}</h3><p class="text-sm text-on-surface-variant leading-7 mt-3">{d}</p></li>'
body += f'''</ol></div></section>
<section id="privacy" class="py-20 lg:py-24"><div class="max-w-[1200px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center"><div><span class="text-xs text-primary font-bold tracking-widest">KHÔNG GIAN RIÊNG CỦA BẠN</span><h2 class="text-3xl sm:text-4xl font-bold mt-4 leading-tight">Gần gũi khi trò chuyện.<br/>Chủ động với riêng tư.</h2><p class="mt-5 text-on-surface-variant leading-7">S-Call được thiết kế với các lựa chọn giúp bạn quản lý cuộc trò chuyện và người có thể liên lạc với mình.</p><ul class="space-y-5 mt-7"><li class="flex gap-3">{icon('pin')}<div><h3 class="font-semibold">Khóa hội thoại bằng PIN</h3><p class="mt-1 text-sm text-on-surface-variant">Thêm bước xác nhận trước khi mở hội thoại đã khóa.</p></div></li><li class="flex gap-3">{icon('block')}<div><h3 class="font-semibold">Chặn và bỏ chặn người dùng</h3><p class="mt-1 text-sm text-on-surface-variant">Quản lý các liên hệ bạn không muốn tương tác.</p></div></li><li class="flex gap-3">{icon('manage_accounts')}<div><h3 class="font-semibold">Quản lý tài khoản cá nhân</h3><p class="mt-1 text-sm text-on-surface-variant">Cập nhật hồ sơ, đổi mật khẩu và đăng xuất khỏi các thiết bị.</p></div></li></ul></div>
<div class="bg-gradient-to-br from-primary-fixed to-surface-container-low rounded-3xl p-7 sm:p-12"><div class="bg-white rounded-3xl p-8 shadow-xl text-center max-w-sm mx-auto"><span class="mx-auto grid h-16 w-16 place-items-center bg-primary-fixed/60 text-primary rounded-2xl">{icon('lock')}</span><h3 class="font-bold text-xl mt-5">Cuộc trò chuyện đã khóa</h3><p class="text-sm text-on-surface-variant mt-3">Nhập mã PIN để mở cuộc trò chuyện.</p><div aria-label="Mã PIN được ẩn trong hình minh họa" class="flex justify-center gap-2 mt-7">{''.join('<span class="w-9 h-12 grid place-items-center bg-surface-container-low rounded-xl text-xl">•</span>' for _ in range(6))}</div><p class="text-xs text-on-surface-variant mt-6">Minh họa chức năng khóa hội thoại</p></div></div></div></section>
<section id="faq" class="bg-white py-20"><div class="max-w-3xl mx-auto px-6"><div class="text-center mb-10"><span class="text-xs text-primary font-bold tracking-widest">BẠN MUỐN BIẾT THÊM?</span><h2 class="mt-4 text-3xl sm:text-4xl font-bold">Câu hỏi thường gặp</h2></div>'''
faqs = [
    ('S-Call hiện đã sử dụng được chưa?','Đây là bản xem trước thiết kế landing page. Các chức năng tài khoản, nhắn tin và gọi điện đang được phát triển; khung chat trên trang sử dụng dữ liệu minh họa.'),
    ('Có cần tải ứng dụng để sử dụng S-Call không?','S-Call được định hướng là ứng dụng web, truy cập qua trình duyệt. Trang này không cung cấp bản cài đặt Windows, macOS, Android hoặc iOS.'),
    ('S-Call có những kiểu trò chuyện nào?','Theo đặc tả sản phẩm, S-Call hỗ trợ hội thoại cá nhân và nhóm; cuộc gọi thoại/video được giới thiệu cho liên lạc cá nhân.'),
    ('Khóa bằng PIN có phải mã hóa đầu cuối không?','Khóa PIN bổ sung bước xác nhận khi mở hội thoại. Đây không phải cam kết mã hóa đầu cuối; bản thiết kế này không đưa ra tuyên bố đó.'),
    ('Tôi có thể tìm bạn bằng cách nào?','Luồng dự kiến cho phép tìm người dùng qua email hoặc tên tài khoản, gửi lời mời kết bạn và bắt đầu trò chuyện sau khi được chấp nhận.'),
]
for q,a in faqs:
    body += f'<details class="border-b border-primary/10 py-5"><summary class="font-semibold leading-7 pr-4">{q}</summary><p class="text-sm leading-7 text-on-surface-variant mt-3">{a}</p></details>'
body += f'''</div></section>
<section id="start" class="py-20"><div class="max-w-[1104px] mx-6 lg:mx-auto p-8 sm:p-14 rounded-3xl text-center bg-gradient-to-tr from-primary via-primary-container to-tertiary-container text-white"><span class="text-xs font-semibold tracking-widest text-white/80">MỖI KẾT NỐI BẮT ĐẦU TỪ MỘT LỜI CHÀO</span><h2 class="text-3xl sm:text-4xl font-bold mt-5">Một lời nhắn. Thêm một chút gần nhau.</h2><p class="max-w-xl mx-auto mt-5 leading-7 text-white/85">Khám phá không gian trò chuyện S-Call, từ tin nhắn hằng ngày đến những cuộc gọi với người bạn quý mến.</p><div class="mt-8 flex flex-wrap justify-center gap-3"><button type="button" data-auth="register" class="bg-white text-primary rounded-full px-7 py-3.5 font-semibold">Tạo tài khoản {icon('arrow_forward')}</button><a href="#demo" class="px-7 py-3.5 rounded-full border border-white/40 font-semibold hover:bg-white/10">Xem giao diện</a></div><p class="mt-5 text-xs text-white/80">Đăng ký và đăng nhập sẽ khả dụng khi hệ thống tài khoản được hoàn thiện.</p></div></section></main>
<footer class="bg-white border-t border-primary/5"><div class="max-w-[1200px] mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row justify-between gap-7"><div>{logo}<p class="mt-4 text-sm text-on-surface-variant">Một không gian nhỏ để giữ mọi người gần nhau hơn.</p></div><nav aria-label="Điều hướng cuối trang" class="flex flex-wrap gap-5 text-sm text-on-surface-variant self-start"><a href="#features">Tính năng</a><a href="#privacy">Quyền riêng tư</a><a href="#faq">Câu hỏi thường gặp</a></nav></div><div class="max-w-[1200px] mx-auto px-6 lg:px-12 py-6 border-t border-primary/5 flex flex-wrap justify-between gap-3 text-xs text-on-surface-variant"><span>© 2026 S-Call</span><span>Bản xem trước thiết kế · Tiếng Việt</span></div></footer>
<dialog id="auth-preview" aria-labelledby="auth-title" aria-describedby="auth-description"><form method="dialog"><div class="flex justify-between items-center gap-4"><h2 id="auth-title" class="font-bold text-xl">Tài khoản S-Call</h2><button autofocus aria-label="Đóng thông báo" class="rounded-full bg-surface-container-low h-9 w-9">✕</button></div><p id="auth-description" class="mt-5 text-sm leading-7 text-on-surface-variant">Đây là bản xem trước thiết kế. Chức năng tài khoản đang được phát triển, chưa tiếp nhận thông tin đăng ký hoặc đăng nhập.</p><button class="mt-6 px-5 py-3 rounded-full bg-primary-container text-white text-sm font-semibold">Đã hiểu</button></form></dialog>
<script>
const authDialog = document.getElementById('auth-preview');
document.querySelectorAll('[data-auth]').forEach(button => button.addEventListener('click', () => {{
  document.getElementById('auth-title').textContent = button.dataset.auth === 'login' ? 'Đăng nhập S-Call' : 'Đăng ký S-Call';
  authDialog.showModal();
}}));
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {{
  const menu = link.closest('details');
  if (menu) menu.open = false;
}}));
authDialog.addEventListener('click', event => {{ if (event.target === authDialog) {{ const rect = authDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) authDialog.close(); }} }});
</script></body></html>'''

output = Path('designs/s-call-landing.html')
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(head + header + demo + body, encoding='utf-8')
print(f'Created {output} ({output.stat().st_size:,} bytes)')
