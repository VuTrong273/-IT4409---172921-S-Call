import { useEffect, useRef, useState } from 'react';
import { Icon, IconButton } from './ChatPrimitives.jsx';
import { formatFileSize } from '../chatModel.js';
const emojis = ['😊', '❤️', '👍', '😂', '👋', '🎉', '🔥', '✨'];

export default function MessageComposer({ draft, onDraftChange, onSend, sendWithEnter = true }) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const composerRef = useRef(null);
  const fileRef = useRef(null);
  const urls = useRef(new Set());
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
  function clearAttachments() {
    urls.current.forEach(URL.revokeObjectURL); urls.current.clear(); setAttachments([]);
  }
  function send(event) {
    event.preventDefault();
    if (!draft.trim() && !attachments.length) return;
    onSend(attachments.map((item) => item.file));
    clearAttachments(); setEmojiOpen(false); setError(''); composerRef.current?.focus();
  }
  function attach(event) {
    const files = Array.from(event.target.files ?? []);
    const valid = files.filter((file) => file.size <= 20 * 1024 * 1024);
    setError(valid.length !== files.length ? 'Một số tệp vượt quá 20 MB và chưa được thêm.' : '');
    setAttachments((current) => [...current, ...valid.map((file) => {
      const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      if (url) urls.current.add(url);
      return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, url };
    })]);
    event.target.value = '';
  }
  function remove(item) {
    if (item.url) { URL.revokeObjectURL(item.url); urls.current.delete(item.url); }
    setAttachments((current) => current.filter((entry) => entry.id !== item.id));
  }
  function keyDown(event) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (!event.shiftKey && (event.ctrlKey || event.metaKey || (sendWithEnter && !event.altKey))) send(event);
  }
  return <div className="chat-composer-wrap" onKeyDown={(event) => { if (event.key === 'Escape') setEmojiOpen(false); }}>
    {attachments.length > 0 && <div className="chat-attachment-tray" aria-label="Tệp chờ gửi">{attachments.map((item) => <div key={item.id} className="chat-pending-file">{item.url ? <img src={item.url} alt={item.file.name} /> : <span className="chat-file-symbol">↥</span>}<div><strong>{item.file.name}</strong><small>{formatFileSize(item.file.size)}</small></div><button type="button" onClick={() => remove(item)} aria-label={`Bỏ ${item.file.name}`}>×</button></div>)}</div>}
    {error && <p className="chat-compose-error" role="alert">{error}</p>}
    <form className="chat-composer" onSubmit={send}>
      <div className="chat-compose-field">
        <IconButton name="attach" label="Đính kèm ảnh hoặc tệp" onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" multiple hidden onChange={attach} />
        <textarea ref={composerRef} aria-label="Nội dung tin nhắn" placeholder="Viết tin nhắn…" rows={Math.min(4, draft.split('\n').length)} value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={keyDown} />
        <div className="chat-emoji-anchor"><IconButton name="emoji" label="Chọn biểu tượng cảm xúc" aria-expanded={emojiOpen} onClick={() => setEmojiOpen((current) => !current)} />{emojiOpen && <div className="chat-popover chat-emojis">{emojis.map((emoji) => <button type="button" key={emoji} aria-label={`Chèn ${emoji}`} onClick={() => { onDraftChange((current) => current + emoji); composerRef.current?.focus(); }}>{emoji}</button>)}</div>}</div>
      </div>
      <button className="chat-send" type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim() && !attachments.length}><Icon name="send" /></button>
    </form>
  </div>;
}
