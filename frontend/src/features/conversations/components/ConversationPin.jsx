import { useEffect, useRef, useState } from 'react';
export default function ConversationPin({ action, onClose, onSubmit }) {
  const ref = useRef(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setPin(''); setError(''); if (action && !ref.current.open) ref.current.showModal(); else if (!action && ref.current.open) ref.current.close(); }, [action]);
  return <dialog ref={ref} className="chat-dialog" onClose={onClose} onCancel={onClose} aria-labelledby="chat-pin-heading"><header><h2 id="chat-pin-heading">{action === 'set' ? 'Đặt mã PIN' : action === 'disable' ? 'Tắt khóa PIN' : 'Mở khóa hội thoại'}</h2><button type="button" onClick={onClose} aria-label="Đóng">×</button></header><p>Khóa PIN trong bản xem thử chỉ có hiệu lực trong phiên này.</p><form className="chat-group-form" onSubmit={(event) => { event.preventDefault(); const result = onSubmit(pin); if (result) setError(result); }}><label>Mã PIN bốn chữ số<input type="password" inputMode="numeric" autoComplete="off" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} pattern="[0-9]{4}" maxLength={4} required /></label>{error && <p className="chat-compose-error" role="alert">{error}</p>}<button className="chat-action-primary" disabled={pin.length !== 4}>Xác nhận</button></form></dialog>;
}
