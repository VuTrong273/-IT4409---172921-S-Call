import { Fragment, useEffect, useRef, useState } from 'react';
import { asset } from '../chatAssets.js';
import { Avatar } from './ChatPrimitives.jsx';
import { formatFileSize, messageMatches } from '../chatModel.js';

function MessageContent({ message, query, onImage }) {
  if (message.recalled) return <p className="chat-bubble chat-recalled">Tin nhắn đã được thu hồi</p>;
  if (message.kind === 'file') return <a className="chat-file" href={message.url} download={message.name}><img src={asset('8e9a9.svg')} alt="" /><span><strong>{message.name}</strong><small>{formatFileSize(message.size)} · Tải xuống</small></span><span className="chat-download"><img src={asset('86474.svg')} alt="" /></span></a>;
  if (message.kind === 'image') return <button type="button" className="chat-uploaded-image" onClick={() => onImage(message)} aria-label={`Xem ảnh ${message.name}`}><img src={message.url} alt={message.name} /></button>;
  return <p className={`chat-bubble ${query && messageMatches(message, query) ? 'is-match' : ''}`}>{message.text}</p>;
}

export default function MessageList({ active, history, messageSearch, jumpTarget, onRecall, onImage }) {
  const logRef = useRef(null);
  const recallRef = useRef(null);
  const [recalling, setRecalling] = useState(null);
  useEffect(() => { if (logRef.current && !messageSearch.trim()) logRef.current.scrollTop = logRef.current.scrollHeight; }, [active.id, history.length, messageSearch]);
  useEffect(() => { if (jumpTarget) document.getElementById(`message-${jumpTarget.id}`)?.scrollIntoView({ block: 'center' }); }, [jumpTarget]);
  useEffect(() => { if (recalling && !recallRef.current.open) recallRef.current.showModal(); }, [recalling]);
  const day = (message) => message.createdAt ? new Date(message.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay';
  return <div className="chat-message-area">
    <div className="chat-log" ref={logRef} role="log" aria-label="Tin nhắn" aria-live="polite" aria-relevant="additions">
      {history.length === 0 && <div className="chat-conversation-start"><Avatar contact={active} /><h2>{active.nickname || active.name}</h2><p>Bắt đầu bằng một lời chào.</p></div>}
      {history.map((message, index) => <Fragment key={message.id}>
        {(index === 0 || day(history[index - 1]) !== day(message)) && <div className="chat-date-separator"><span>{day(message)}</span></div>}
        <div id={`message-${message.id}`} className={`chat-message-block ${jumpTarget?.id === message.id ? 'chat-jump-target' : ''}`}><div className={`chat-message ${message.mine ? 'is-mine' : ''}`}>
          <div className="chat-message-content">{message.sender && !message.mine && <small className="chat-sender">{message.sender}</small>}<MessageContent message={message} query={messageSearch} onImage={onImage} />
          </div>
          <div className="chat-message-meta"><time>{message.time}</time>{message.mine && !message.recalled && <span>{message.status === 'read' ? 'Đã xem' : message.status === 'sent' ? 'Đã gửi' : 'Chỉ lưu trên máy'}</span>}{message.mine && !message.recalled && <details className="chat-message-menu"><summary aria-label="Thao tác tin nhắn">•••</summary><button type="button" onClick={(event) => { event.currentTarget.closest('details').open = false; setRecalling(message); }}>Thu hồi</button></details>}</div>
        </div></div>
      </Fragment>)}
    </div>
    <dialog ref={recallRef} className="chat-dialog" onClose={() => setRecalling(null)}><h2>Thu hồi tin nhắn?</h2><p>Tin nhắn sẽ được thay bằng thông báo đã thu hồi trong bản xem thử này.</p><div className="chat-dialog-actions"><button type="button" onClick={() => recallRef.current.close()}>Hủy</button><button type="button" className="chat-action-primary" onClick={() => { onRecall(recalling.id); recallRef.current.close(); }}>Thu hồi</button></div></dialog>
  </div>;
}
