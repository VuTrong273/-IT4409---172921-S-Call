import './LanguageSelect.css';
import { useEffect, useId, useRef, useState } from 'react';

const languages = [{ value: 'vi', label: 'Tiếng Việt' }, { value: 'en', label: 'English' }];

export default function LanguageSelect({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const menuId = useId();
  const selectedIndex = Math.max(0, languages.findIndex((item) => item.value === value));

  useEffect(() => {
    if (!open) return;
    optionRefs.current[selectedIndex]?.focus();
    function dismiss(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open, selectedIndex]);

  function handleKeys(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const current = optionRefs.current.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? languages.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + languages.length) % languages.length;
      optionRefs.current[next]?.focus();
    }
  }

  return <div ref={rootRef} className="language-select" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={triggerRef} type="button" aria-label={`${label}: ${languages[selectedIndex].label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className="language-select-trigger">
      <span lang={value}>{languages[selectedIndex].label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`language-select-chevron ${open ? 'is-open' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && <div id={menuId} role="menu" aria-label={label} onKeyDown={handleKeys} className="language-select-menu">
      {languages.map((language, index) => <button key={language.value} ref={(node) => { optionRefs.current[index] = node; }} type="button" role="menuitemradio" aria-checked={value === language.value} tabIndex={-1} lang={language.value}
        onClick={() => {
          onChange(language.value);
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="language-select-option">
        {language.label}
        {value === language.value && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}
      </button>)}
    </div>}
  </div>;
}
