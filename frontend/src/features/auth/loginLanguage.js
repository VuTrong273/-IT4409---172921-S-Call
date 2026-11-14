import { useEffect, useState } from 'react';

const english = {
  "Quay lại đăng nhập": "Back to login",
  "Tôi có tài khoản rồi": "I already have an account",
  "Tạo tài khoản để trò chuyện và giữ liên lạc với những người bạn quan tâm.": "Create an account to chat and stay in touch with the people you care about.",
  "Nhanh chóng và dễ dàng.": "Quick and easy.",
  "Đã có tài khoản?": "Already have an account?",
  "Họ và tên": "Full name",
  "Tên đăng nhập": "Username",
  "Tạo tài khoản": "Create account",
  "3–30 ký tự, gồm chữ cái, số, dấu chấm hoặc gạch dưới.": "3\u201330 characters: letters, numbers, dots, or underscores.",
  "8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.": "8\u201372 characters, including at least one letter and one number.",
  "Mật khẩu cần 8–72 ký tự, gồm ít nhất một chữ cái và một chữ số.": "Use 8\u201372 characters, including at least one letter and one number.",
  "Tên đăng nhập cần 3–30 ký tự: chữ cái, số, dấu chấm hoặc gạch dưới.": "Your username must be 3\u201330 characters: letters, numbers, dots, or underscores.",
  "Email này đã được sử dụng.": "This email is already in use.",
  "Tên đăng nhập này đã được sử dụng.": "This username is already in use.",
  "S-Call — Trang chủ": "S-Call — Home",
  "Trang chủ": "Home",
  "Nơi dành cho những cuộc trò chuyện": "A place for",
  "có ý nghĩa.": "meaningful conversations.",
  "Đăng nhập vào S-Call": "Log in to S-Call",
  "Email hoặc tên đăng nhập": "Email or username",
  "Mật khẩu": "Password",
  "Hiện mật khẩu": "Show password",
  "Ẩn mật khẩu": "Hide password",
  "Đang xử lý...": "Please wait...",
  "Đăng nhập": "Log in",
  "Quên mật khẩu?": "Forgot password?",
  "Tạo tài khoản mới": "Create new account",
  "Ngôn ngữ": "Language",
  "Email/username hoặc mật khẩu chưa chính xác.": "Your email/username or password is incorrect.",
  "Tài khoản hiện đã bị khóa. Vui lòng liên hệ quản trị viên.": "Your account has been suspended. Please contact an administrator.",
  "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.": "Invalid details. Please check and try again.",
  "Không thể kết nối máy chủ. Hãy kiểm tra backend rồi thử lại.": "Unable to connect. Please try again later.",
  "Đã có lỗi xảy ra. Vui lòng thử lại.": "Something went wrong. Please try again.",
  "Chức năng khôi phục mật khẩu chưa khả dụng. Vui lòng thử lại sau.": "Password recovery is currently unavailable. Please try again later."
};

export function useLoginLanguage(enabled, registering = false) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('s-call-language') === 'en' ? 'en' : 'vi'; }
    catch { return 'vi'; }
  });
  useEffect(() => {
    if (!enabled) return;
    const previousLanguage = document.documentElement.lang;
    const previousTitle = document.title;
    document.documentElement.lang = language;
    document.title = registering
      ? (language === 'en' ? 'Create account | S-Call' : 'Đăng ký | S-Call')
      : (language === 'en' ? 'Log in | S-Call' : 'Đăng nhập | S-Call');
    try { localStorage.setItem('s-call-language', language); } catch { /* Storage may be unavailable. */ }
    return () => {
      document.documentElement.lang = previousLanguage;
      document.title = previousTitle;
    };
  }, [enabled, language, registering]);
  const t = (text) => enabled && language === 'en' ? (english[text] ?? text) : text;
  return { language, setLanguage, t };
}
