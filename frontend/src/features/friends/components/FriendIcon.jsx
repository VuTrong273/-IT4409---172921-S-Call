const paths = {
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2" /></>,
  incoming: <><circle cx="8" cy="7" r="3" /><path d="M2 21v-3a6 6 0 0 1 12 0v3M22 12h-8m4-4-4 4 4 4" /></>,
  outgoing: <><circle cx="8" cy="7" r="3" /><path d="M2 21v-3a6 6 0 0 1 12 0v3M14 12h8m-4-4 4 4-4 4" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 2V11.5a8.5 8.5 0 0 1 18 0Z" /><path d="M7 10h9M7 14h6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

export default function FriendIcon({ name }) {
  return <svg className="friends-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
