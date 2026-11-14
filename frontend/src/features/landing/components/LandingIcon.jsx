import './LandingIcon.css';
const paths = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  chat: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 2V11.5a8.5 8.5 0 0 1 17 0Z" /><path d="M7 10h9M7 14h6" /></>,
  video: <><rect x="3" y="5" width="12" height="14" rx="3" /><path d="m15 9 6-3v12l-6-3" /></>,
  phone: <path d="m7 3 3 5-3 3a14 14 0 0 0 6 6l3-3 5 3-2 4C10 21 3 14 3 5Z" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  media: <><path d="M8 3h10a2 2 0 0 1 2 2v10M4 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle cx="6.5" cy="11.5" r="1" /><path d="m3 18 4-4 3 3 2-2 4 4" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  send: <><path d="m21 3-7 18-4-7-7-4Z" /><path d="m10 14 5-5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3" /></>,
};

export default function LandingIcon({ name, className = 'landing-icon' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
