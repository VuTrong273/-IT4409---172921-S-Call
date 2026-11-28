import { useEffect, useRef, useState } from 'react';
import { messageMatches } from '../chatModel.js';
import { Avatar } from './ChatPrimitives.jsx';
import ActionIcon from './ConversationActionIcon.jsx';

const presets = [
  { key: 'week', label: '7 ngày qua', days: 7 },
  { key: 'month', label: '30 ngày qua', days: 30 },
  { key: 'quarter', label: '3 tháng qua' },
];
const emptyRange = { from: '', to: '' };

function dateKey(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, '0')).join('-');
}

function presetRange(preset) {
  const from = new Date();
  const to = dateKey(from);
  if (preset.days) {
    from.setDate(from.getDate() - preset.days + 1);
  } else {
    const day = from.getDate();
    from.setDate(1);
    from.setMonth(from.getMonth() - 3);
    const lastDay = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
    from.setDate(Math.min(day, lastDay));
  }
  return { from: dateKey(from), to };
}

const mine = { key: 'mine', name: 'Bạn' };

export default function ConversationSearch({ active, history, query, onQuery, onClose, onSelect }) {
  const [sender, setSender] = useState('');
  const [senderQuery, setSenderQuery] = useState('');
  const [range, setRange] = useState(emptyRange);
  const [presetKey, setPresetKey] = useState('');
  const [popup, setPopup] = useState('');
  const filterRow = useRef(null);
  const senderTrigger = useRef(null);
  const dateTrigger = useRef(null);

  useEffect(() => {
    if (!popup) return;
    function dismissOutside(event) {
      if (!filterRow.current?.contains(event.target)) setPopup('');
    }
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [popup]);

  const isGroup = active.type === 'group';
  const other = { ...active, name: active.nickname || active.name, key: 'other' };
  const senders = [mine, ...(isGroup ? (active.members ?? []).map((member) => ({ ...member, key: 'member:' + member.id })) : [other])];
  function getSender(message) {
    if (message.mine) return mine;
    if (!isGroup) return other;
    const member = senders.slice(1).find((person) => message.senderId ? person.id === message.senderId : person.name === message.sender);
    return member ?? { key: 'history:' + (message.senderId ?? message.sender ?? ''), name: message.sender || 'Thành viên' };
  }
  const senderOptions = new Map(senders.map((person) => [person.key, person]));
  for (const message of history) {
    if (message.recalled) continue;
    const person = getSender(message);
    if (!senderOptions.has(person.key)) senderOptions.set(person.key, person);
  }
  const senderMatches = [...senderOptions.values()].filter((person) => person.name.toLocaleLowerCase().includes(senderQuery.trim().toLocaleLowerCase()));
  const hasDate = Boolean(range.from || range.to);
  const invalidRange = Boolean(range.from && range.to && range.from > range.to);
  const hasFilter = Boolean(query.trim() || sender || hasDate);
  const matches = hasFilter && !invalidRange ? history.filter((message) => {
    if (message.recalled || (query.trim() && !messageMatches(message, query))) return false;
    if (sender && getSender(message).key !== sender) return false;
    if (!hasDate) return true;
    const sentAt = new Date(message.createdAt);
    if (!message.createdAt || Number.isNaN(sentAt.getTime())) return false;
    const day = dateKey(sentAt);
    return (!range.from || day >= range.from) && (!range.to || day <= range.to);
  }).reverse() : [];

  function closeFilter(trigger) {
    setPopup('');
    trigger.current?.focus();
  }

  function updateDate(bound, value) {
    setPresetKey('');
    setRange((current) => ({ ...current, [bound]: value }));
  }

  return <aside className="chat-side-panel chat-search-panel" aria-label="Tìm kiếm trong trò chuyện">
    <header className="chat-panel-heading">
      <h2>Tìm kiếm trong trò chuyện</h2>
      <button type="button" onClick={onClose} aria-label="Đóng tìm kiếm">×</button>
    </header>
    <div className="chat-panel-scroll">
      <div className="chat-search-controls">
        <div className="chat-panel-search-field">
          <ActionIcon name="search" />
          <input aria-label="Từ khóa tìm kiếm tin nhắn" placeholder="Nhập từ khóa để tìm kiếm" value={query} onChange={(event) => onQuery(event.target.value)} autoFocus />
          {query && <button type="button" aria-label="Xóa từ khóa" onClick={() => onQuery('')}>×</button>}
        </div>
        <div ref={filterRow} className="chat-search-filter-row" onKeyDown={(event) => {
          if (event.key === 'Escape' && popup) {
            event.stopPropagation();
            closeFilter(popup === 'sender' ? senderTrigger : dateTrigger);
          }
        }}>
          <span>Lọc theo:</span>
          <button ref={senderTrigger} type="button" className="chat-search-filter-trigger" aria-expanded={popup === 'sender'} aria-pressed={!!sender} onClick={() => {
            setSenderQuery('');
            setPopup(popup === 'sender' ? '' : 'sender');
          }}>
            <ActionIcon name="person" /><span>{senderOptions.get(sender)?.name || 'Người gửi'}</span><ActionIcon name="chevron" />
          </button>
          <button ref={dateTrigger} type="button" className="chat-search-filter-trigger" aria-expanded={popup === 'date'} aria-pressed={hasDate} onClick={() => setPopup(popup === 'date' ? '' : 'date')}>
            <ActionIcon name="calendar" /><span>{presets.find((preset) => preset.key === presetKey)?.label || (hasDate ? 'Khoảng ngày' : 'Ngày gửi')}</span><ActionIcon name="chevron" />
          </button>
          {popup === 'sender' && <div className="chat-search-filter-popup chat-sender-popup" aria-label="Chọn người gửi" role="group">
            <div className="chat-panel-search-field">
              <ActionIcon name="search" />
              <input aria-label="Tìm người gửi" placeholder="Tìm người gửi" value={senderQuery} onChange={(event) => setSenderQuery(event.target.value)} autoFocus />
            </div>
            <div className="chat-sender-choices">
              {sender && <button type="button" onClick={() => { setSender(''); closeFilter(senderTrigger); }}>Tất cả người gửi</button>}
              {senderMatches.map((person) => <button type="button" key={person.key} aria-pressed={sender === person.key} onClick={() => {
                setSender(person.key);
                closeFilter(senderTrigger);
              }}><Avatar contact={person} showPresence={false} /><span>{person.name}</span></button>)}
              {!senderMatches.length && <p>Không tìm thấy người gửi.</p>}
            </div>
          </div>}
          {popup === 'date' && <div className="chat-search-filter-popup chat-date-popup" aria-label="Chọn ngày gửi" role="group">
            <p>Gợi ý thời gian</p>
            <div className="chat-date-presets">{presets.map((preset) => <button type="button" key={preset.key} aria-pressed={presetKey === preset.key} onClick={() => {
              setRange(presetRange(preset));
              setPresetKey(preset.key);
              closeFilter(dateTrigger);
            }}>{preset.label}</button>)}</div>
            <fieldset className="chat-date-range">
              <legend>Chọn khoảng thời gian</legend>
              <label>Từ ngày<input type="date" value={range.from} onChange={(event) => updateDate('from', event.target.value)} /></label>
              <label>Đến ngày<input type="date" value={range.to} onChange={(event) => updateDate('to', event.target.value)} /></label>
              {invalidRange && <p role="alert">Ngày kết thúc phải từ ngày bắt đầu trở đi.</p>}
            </fieldset>
            <button type="button" className="chat-search-clear" onClick={() => { setRange(emptyRange); setPresetKey(''); closeFilter(dateTrigger); }}>Xóa ngày đã chọn</button>
          </div>}
        </div>
        {(sender || hasDate) && <button type="button" className="chat-search-clear" onClick={() => { setSender(''); setRange(emptyRange); setPresetKey(''); setPopup(''); }}>Xóa bộ lọc</button>}
      </div>
      {!hasFilter ? <div className="chat-search-empty">
        <div className="chat-search-empty-icon"><ActionIcon name="search" /></div>
        <p>Nhập từ khóa hoặc chọn bộ lọc để tìm tin nhắn và tệp.</p>
      </div> : invalidRange ? <div className="chat-search-empty"><p>Kiểm tra lại khoảng ngày đã chọn.</p></div> : <>
        <p className="chat-search-count" role="status">{matches.length} kết quả</p>
        {matches.length ? <div className="chat-search-result-list">{matches.map((message) => {
          const person = getSender(message);
          return <button type="button" className="chat-search-result" key={message.id} onClick={() => onSelect(message.id)}>
            <Avatar contact={person} showPresence={false} />
            <span><strong>{person.name}</strong><span>{message.text || message.name}</span>
              <small>{[message.createdAt && new Date(message.createdAt).toLocaleDateString('vi-VN'), message.time].filter(Boolean).join(' · ')}</small>
            </span>
          </button>;
        })}</div> : <div className="chat-search-empty"><p>Không tìm thấy kết quả phù hợp.</p></div>}
      </>}
    </div>
  </aside>;
}
