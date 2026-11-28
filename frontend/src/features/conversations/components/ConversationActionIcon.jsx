const paths = {
  person: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18M8 14h2m4 0h2m-8 3h2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  pencil: <><path d="m14 6 4 4M4 20l4-.8L20 7l-4-4L4.8 15.2 4 20Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  bellOff: <><path d="m3 3 18 18M18 12V8a6 6 0 0 0-9-5M6 8c0 7-3 7-3 9h14M10 21h4" /></>,
  pin: <><path d="M8 3h8l-1 7 3 4v2H6v-2l3-4-1-7ZM12 16v5" /></>,
  pinOff: <><path d="m3 3 18 18M9 3h7l-1 7 3 4M8 10l-2 4v2h10M12 16v5" /></>,
  group: <><circle cx="8" cy="7" r="3" /><path d="M2 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M14 4a3 3 0 0 1 0 6M19 12v8m-4-4h8" /></>,
  archive: <><rect x="3" y="3" width="18" height="5" rx="1" /><path d="M5 8v12h14V8m-7 3v6m-3-3 3 3 3-3" /></>,
  unarchive: <><rect x="3" y="3" width="18" height="5" rx="1" /><path d="M5 8v12h14V8m-7 9v-6m-3 3 3-3 3 3" /></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
};

export default function ConversationActionIcon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
