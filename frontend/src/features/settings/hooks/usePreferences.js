import { useEffect, useState } from 'react';

const defaults = { sendWithEnter: true, fontSize: 'medium' };
function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem('s-call-preferences'));
    return {
      sendWithEnter: typeof saved?.sendWithEnter === 'boolean' ? saved.sendWithEnter : defaults.sendWithEnter,
      fontSize: ['small', 'medium', 'large'].includes(saved?.fontSize) ? saved.fontSize : defaults.fontSize,
    };
  } catch { return defaults; }
}

export default function usePreferences() {
  const [preferences, setPreferences] = useState(readPreferences);
  useEffect(() => {
    try { localStorage.setItem('s-call-preferences', JSON.stringify(preferences)); } catch { /* Storage may be unavailable. */ }
  }, [preferences]);
  function updatePreference(name, value) { setPreferences((current) => ({ ...current, [name]: value })); }
  return { preferences, updatePreference };
}
