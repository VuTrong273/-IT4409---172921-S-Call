import { useEffect, useId, useRef } from 'react';
import { Avatar } from './ChatPrimitives.jsx';

export default function NewConversationDialog({ open, people, onClose, onSelect }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  function dismissBackdrop(event) {
    if (event.target !== dialogRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }

  return <dialog ref={dialogRef} className="chat-dialog" aria-labelledby={titleId} onCancel={onClose} onClose={onClose} onClick={dismissBackdrop}>
    <header><h2 id={titleId}>Bắt đầu trò chuyện</h2><button type="button" onClick={onClose} aria-label="Đóng">×</button></header>
    <p>{people.length ? 'Chọn một người bạn để bắt đầu trò chuyện.' : 'Chưa có bạn bè để bắt đầu trò chuyện.'}</p>
    <div>{people.map((person) => <button type="button" key={person.id} onClick={() => onSelect(person)}><Avatar contact={person} /><strong>{person.name}</strong></button>)}</div>
  </dialog>;
}
