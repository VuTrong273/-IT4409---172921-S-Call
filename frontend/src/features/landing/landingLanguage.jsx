import { createContext, useContext, useEffect, useState } from 'react';

const english = {
  "Riêng tư theo cách của bạn": "Privacy on your terms",
  "Có những câu chuyện chỉ dành cho bạn.": "Some conversations are just for you.",
  "Giữ riêng những cuộc trò chuyện bạn chọn bằng mã PIN cá nhân.": "Keep the conversations you choose private with a personal PIN.",
  "Nhập PIN để mở cuộc trò chuyện": "Enter your PIN to unlock the conversation",
  "Mọi kết nối, thật tự nhiên": "Every connection feels natural",
  "Nhắn tin, gọi nhau, chia sẻ mỗi ngày.": "Message, call, and share every day.",
  "Những điều quen thuộc giúp bạn gần hơn với người mình quan tâm.": "Everyday moments bring you closer to the people you care about.",
  "Chuyện nhỏ, chuyện dài": "Little chats, long conversations",
  "Nhắn riêng hay trò chuyện cùng nhóm, luôn có chỗ cho câu chuyện của bạn.": "One-to-one or with a group, there is always room for your story.",
  "Gặp nhau qua màn hình": "See each other on screen",
  "Nghe giọng nói, nhìn nụ cười và cùng chia sẻ một khoảnh khắc.": "Hear their voice, see their smile, and share a moment together.",
  "Chia sẻ điều bạn muốn": "Share what matters to you",
  "Gửi một bức ảnh, một tài liệu hay điều thú vị vừa tìm thấy.": "Send a photo, a document, or something interesting you just found.",
  "Khóa cuộc trò chuyện bằng PIN và chủ động chọn người bạn muốn kết nối.": "Lock conversations with a PIN and choose who you want to connect with.",
  "Từ những lời hỏi thăm hằng ngày đến những câu chuyện dài, luôn có một nơi để bạn kết nối.": "From everyday check-ins to long conversations, there is always a place for you to connect.",
  "Tính năng": "Features",
  "Cách bắt đầu": "Get started",
  "Hỏi đáp": "FAQ",
  "Đăng nhập": "Log in",
  "Tạo tài khoản": "Create account",
  "S-Call — Trang chủ": "S-Call — Home",
  "Điều hướng chính": "Main navigation",
  "Điều hướng di động": "Mobile navigation",
  "Đóng menu": "Close menu",
  "Mở menu": "Open menu",
  "Đi đến nội dung chính": "Skip to main content",
  "Không gian kết nối của bạn": "Your space to connect",
  "Nhắn tin dễ dàng.": "Messaging made easy.",
  "Gọi nhau gần hơn.": "Every call brings you closer.",
  "Trò chuyện cùng bạn bè, chia sẻ tài liệu và bắt đầu cuộc gọi ngay trong khung chat.": "Chat with friends, share files, and start a call right from your conversation.",
  "Xem giao diện": "Explore the interface",
  "Trên máy tính hay điện thoại — chỉ cần mở trình duyệt.": "On desktop or mobile — just open your browser.",
  "Kết nối theo cách của bạn": "Connect your way",
  "Những điều cần cho một cuộc trò chuyện": "Everything for a conversation",
  "Từ lời hỏi thăm đến buổi trao đổi cùng nhóm, mọi thứ ở cùng một nơi.": "From a quick hello to a group discussion, everything is in one place.",
  "Chat cá nhân & nhóm": "Private & group chats",
  "Giữ liên lạc cùng bạn bè, tạo nhóm học tập và tìm lại những tin nhắn quan trọng.": "Keep in touch with friends, create study groups, and find important messages.",
  "Gọi thoại, video 1–1": "Voice & video calls",
  "Chuyển từ lời nhắn sang cuộc gọi. Chia sẻ màn hình khi cần cùng nhau trao đổi.": "Go from messaging to a call. Share your screen when you need to work together.",
  "Chia sẻ ảnh & tài liệu": "Share photos & files",
  "Gửi ảnh, PDF, Word và các tệp đính kèm ngay trong khung chat, tối đa 20 MB mỗi tệp.": "Send photos, PDFs, Word documents, and attachments in chat, up to 20 MB per file.",
  "Chủ động giữ riêng tư": "Control your privacy",
  "Khóa cuộc trò chuyện bằng mã PIN cá nhân và chặn người dùng khi bạn muốn ngừng tương tác.": "Lock conversations with a personal PIN and block people when you want to stop interacting.",
  "Không gian riêng của bạn": "Your personal space",
  "Giữ gần người thân quen.": "Keep your people close.",
  "Giữ riêng điều cần thiết.": "Keep private things private.",
  "Thêm một lớp riêng tư cho những cuộc trò chuyện quan trọng bằng mã PIN bốn chữ số do bạn đặt.": "Add a layer of privacy to important conversations with a four-digit PIN you choose.",
  "Ẩn nội dung cho đến khi mở khóa.": "Hide content until you unlock it.",
  "Mã PIN riêng của bạn cho từng hội thoại.": "Your own PIN for each conversation.",
  "Tìm hiểu về khóa PIN": "Learn about PIN locks",
  "Cuộc trò chuyện riêng tư": "Private conversation",
  "Nhập mã PIN để xem nội dung.": "Enter your PIN to view the conversation.",
  "Minh họa mã PIN gồm bốn chữ số được ẩn": "Illustration of a hidden four-digit PIN",
  "Minh họa khóa trò chuyện": "Conversation lock preview",
  "Bắt đầu thật đơn giản": "Getting started is easy",
  "Ba bước để đến gần nhau hơn": "Three steps to connect",
  "Đăng ký bằng email, chọn tên đăng nhập và tên hiển thị của bạn.": "Sign up with your email and choose your username and display name.",
  "Tìm và kết bạn": "Find your friends",
  "Tìm bạn bè bằng email hoặc tên đăng nhập, sau đó gửi lời mời kết bạn.": "Find friends by email or username, then send a friend request.",
  "Bắt đầu trò chuyện": "Start a conversation",
  "Nhắn tin, tạo nhóm và gọi cho bạn bè ngay trên trình duyệt.": "Message, create groups, and call friends right from your browser.",
  "Trước khi bắt đầu": "Before you start",
  "Một vài điều": "A few things",
  "bạn muốn biết": "you may want to know",
  "Những câu hỏi thường gặp khi dùng S-Call.": "Frequently asked questions about S-Call.",
  "Tôi có thể dùng S-Call trên điện thoại không?": "Can I use S-Call on my phone?",
  "Có. S-Call là ứng dụng web có giao diện thích ứng với máy tính và điện thoại. Bạn mở bằng trình duyệt, không cần cài ứng dụng riêng.": "Yes. S-Call is a web app that adapts to desktop and mobile screens. Open it in your browser without installing a separate app.",
  "S-Call có hỗ trợ gọi nhóm không?": "Does S-Call support group calls?",
  "S-Call hỗ trợ gọi thoại và video giữa hai người bạn. Nhóm chat dùng để nhắn tin, gửi ảnh và chia sẻ tệp; hiện không có cuộc gọi nhóm.": "S-Call supports one-to-one voice and video calls between friends. Group chats support messages, photos, and files; group calls are not currently available.",
  "Tôi có thể gửi tệp dung lượng bao nhiêu?": "What is the file size limit?",
  "Mỗi tệp đính kèm có dung lượng tối đa 20 MB. Bạn có thể chia sẻ hình ảnh, PDF, Word, Excel, ZIP và tải xuống ngay trong cuộc trò chuyện.": "Each attachment can be up to 20 MB. Share images, PDF, Word, Excel, and ZIP files and download them directly from your conversation.",
  "Khóa cuộc trò chuyện bằng PIN hoạt động thế nào?": "How do PIN locks work?",
  "Bạn đặt mã PIN gồm bốn chữ số cho cuộc trò chuyện muốn giữ riêng tư. Nội dung được ẩn cho đến khi bạn nhập đúng mã. PIN là lớp kiểm soát truy cập cuộc trò chuyện, không phải mã hóa đầu cuối.": "Set a four-digit PIN for a conversation you want to keep private. Content stays hidden until you enter the correct PIN. A PIN controls access to the conversation; it is not end-to-end encryption.",
  "Bắt đầu từ một lời chào.": "It starts with a hello.",
  "Một người bạn, một nhóm học tập, một cuộc gọi sau ngày dài.": "A friend, a study group, a call at the end of a long day.",
  "Nơi dành cho những cuộc trò chuyện có ý nghĩa": "A place for meaningful conversations",
  "Giao diện minh họa": "Interface preview",
  "Tin nhắn": "Messages",
  "Tìm cuộc trò chuyện": "Search conversations",
  "Bạn: Tối nay mình gọi nhé!": "You: Let's call tonight!",
  "Nhóm học tập": "Study group",
  "Huy: Mình gửi tài liệu rồi nha": "Huy: I've sent the files",
  "Hẹn bạn cuối tuần!": "See you this weekend!",
  "Hôm qua": "Yesterday",
  "Chỉ một chạm để gần nhau": "One tap to connect",
  "Gọi video 1–1": "One-to-one video calls",
  "Bắt đầu cuộc gọi ngay trong cuộc trò chuyện.": "Start a call right from your conversation.",
  "Đang hoạt động": "Online",
  "Hôm nay, 10:30": "Today, 10:30",
  "Mình gửi tài liệu cho buổi học nhé!": "Here are the files for our study session!",
  "Nhận được rồi, cảm ơn bạn!": "Got them, thank you!",
  "Tối nay mình gọi trao đổi thêm nhé.": "Let's call tonight to discuss.",
  "10:35 · Đã xem": "10:35 · Seen",
  "Nhập tin nhắn...": "Type a message...",
  "Nhắn tin, chia sẻ tài liệu và bắt đầu cuộc gọi trong cùng một không gian.": "Message, share files, and start calls in one place.",
  "Ngôn ngữ": "Language",
  "Điều hướng cuối trang": "Footer navigation"
};
const LanguageContext = createContext(null);

export function LandingLanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('s-call-language') === 'en' ? 'en' : 'vi'; }
    catch { return 'vi'; }
  });
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    const previousTitle = document.title;
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'S-Call - Messaging & Calls' : 'S-Call - Nhắn tin & Gọi điện';
    try { localStorage.setItem('s-call-language', language); } catch { /* Storage may be unavailable. */ }
    return () => {
      document.documentElement.lang = previousLanguage;
      document.title = previousTitle;
    };
  }, [language]);
  const t = (text) => language === 'en' ? (english[text] ?? text) : text;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLandingLanguage() {
  return useContext(LanguageContext);
}
