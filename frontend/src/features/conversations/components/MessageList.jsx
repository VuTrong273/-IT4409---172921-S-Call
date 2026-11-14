import { useEffect, useRef } from 'react';
import { asset } from '../chatAssets.js';
import { Avatar } from './ChatPrimitives.jsx';

function MessageContent({ message, messageSearch }) {
  if (message.kind === 'file') return <a className="chat-file" href={message.url} download={message.name}>
    <img src={asset('8e9a9.svg')} alt="" />
    <span>{message.name}</span>
    <span className="chat-download"><img src={asset('86474.svg')} alt="Tải xuống" /></span>
  </a>;
  if (message.kind === 'image') return <a className="chat-uploaded-image" href={message.url} download={message.name}><img src={message.url} alt={message.name} /></a>;
  const matchesSearch = messageSearch && message.text.toLocaleLowerCase().includes(messageSearch.toLocaleLowerCase());
  return <p className={`chat-bubble ${matchesSearch ? 'is-match' : ''}`}>{message.text}</p>;
}

export default function MessageList({ active, history, messageSearch }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [active.id, history.length]);

  return <div className="chat-log" ref={logRef} role="log" aria-label="Tin nhắn" aria-live="polite" aria-relevant="additions">
    {history.length === 0 && <div className="chat-conversation-start"><Avatar contact={active} /><h2>{active.name}</h2><p>Bắt đầu bằng một lời chào.</p></div>}
    {history.map((message) => <div key={message.id} className="chat-message-block">
      <div className={`chat-message ${message.mine ? 'is-mine' : ''}`}>
        <div className="chat-message-content"><MessageContent message={message} messageSearch={messageSearch} /></div>
        {message.time && <time className="chat-message-time">{message.time}</time>}
      </div>
    </div>)}
  </div>;
}
