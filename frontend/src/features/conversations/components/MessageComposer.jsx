import { useRef, useState } from 'react';
import { Icon, IconButton } from './ChatPrimitives.jsx';

const emojis = ['😊', '❤️', '👍', '😂', '👋', '🎉', '🔥', '✨'];

export default function MessageComposer({ draft, onDraftChange, onSend, onAttach }) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const composerRef = useRef(null);
  const fileRef = useRef(null);

  function send(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend();
    setEmojiOpen(false);
    composerRef.current?.focus();
  }
  function attach(event) {
    onAttach(Array.from(event.target.files ?? []));
    event.target.value = '';
  }
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) send(event);
  }
  function insertEmoji(emoji) {
    onDraftChange((current) => current + emoji);
    composerRef.current?.focus();
  }

  return <div className="chat-composer-wrap" onKeyDown={(event) => {
    if (event.key === 'Escape') setEmojiOpen(false);
  }}>
    <form className="chat-composer" onSubmit={send}>
      <div className="chat-compose-field">
        <IconButton name="attach" label="Đính kèm ảnh hoặc tệp" onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" multiple hidden onChange={attach} />
        <textarea
          ref={composerRef}
          aria-label="Nội dung tin nhắn"
          placeholder="Viết tin nhắn…"
          rows={Math.min(4, draft.split('\n').length)}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="chat-emoji-anchor">
          <IconButton name="emoji" label="Chọn biểu tượng cảm xúc" aria-expanded={emojiOpen} onClick={() => setEmojiOpen((current) => !current)} />
          {emojiOpen && <div className="chat-popover chat-emojis">
            {emojis.map((emoji) => <button type="button" key={emoji} aria-label={`Chèn ${emoji}`} onClick={() => insertEmoji(emoji)}>{emoji}</button>)}
          </div>}
        </div>
      </div>
      <button className="chat-send" type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Icon name="send" /></button>
    </form>
  </div>;
}
