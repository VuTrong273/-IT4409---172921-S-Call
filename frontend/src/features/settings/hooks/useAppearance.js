import { useEffect, useState } from 'react';

function readTheme() {
  try {
    const value = localStorage.getItem('s-call-theme');
    return ['light', 'dark', 'system'].includes(value) ? value : 'light';
  } catch { return 'light'; }
}

export default function useAppearance() {
  const [theme, setTheme] = useState(readTheme);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    try { localStorage.setItem('s-call-theme', theme); } catch { /* Browser storage can be disabled. */ }
  }, [theme]);
  return { theme, setTheme, dark: theme === 'dark' || (theme === 'system' && systemDark) };
}
