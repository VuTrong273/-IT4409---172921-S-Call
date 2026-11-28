import { useEffect, useId, useRef, useState } from 'react';
import { Avatar } from './ChatPrimitives.jsx';

export default function NewConversationDialog({ open, people, onClose, onCreateGroup }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const members = people.filter((person) => selected.includes(person.id));
  const canCreate = name.trim() && members.length >= 2;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      setName('');
      setSelected([]);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function create(event) {
    event.preventDefault();
    if (canCreate) onCreateGroup(name, members);
  }

  return <dialog ref={dialogRef} className="chat-dialog" aria-labelledby={titleId} onClose={onClose}
    onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }}>
    <header>
      <h2 id={titleId}>Tạo nhóm trò chuyện</h2>
      <button type="button" onClick={onClose} aria-label="Đóng">×</button>
    </header>
    <p>Đặt tên và chọn ít nhất hai người bạn để tạo nhóm.</p>
    <form className="chat-group-form" onSubmit={create}>
      <label>Tên nhóm<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} /></label>
      <fieldset>
        <legend>Thành viên ({members.length} đã chọn)</legend>
        {people.length === 0 && <p>Chưa có bạn bè để thêm vào nhóm.</p>}
        {people.map((person) => <label key={person.id} className="chat-member-choice">
          <input type="checkbox" checked={selected.includes(person.id)} onChange={(event) => {
            const checked = event.target.checked;
            setSelected((current) => checked ? [...current, person.id] : current.filter((id) => id !== person.id));
          }} />
          <Avatar contact={person} />{person.name}
        </label>)}
      </fieldset>
      <button type="submit" className="chat-action-primary" disabled={!canCreate}>Tạo nhóm</button>
    </form>
  </dialog>;
}
