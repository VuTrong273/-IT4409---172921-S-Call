import { Avatar, Icon } from './ChatPrimitives.jsx';
import { useState } from 'react';
import ConversationActionIcon from './ConversationActionIcon.jsx';
import { filterConversations } from '../chatModel.js';

function ConversationItem({ person, selected, friendsOnly, onSelect }) {
  return <button type="button" className={`chat-person ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(person)} aria-current={selected ? 'true' : undefined}>
    <Avatar contact={person} />
    <span className="chat-person-copy">
      <span className="chat-person-top"><strong>{person.nickname || person.name}</strong><time>{person.time}</time></span>
      <span className="chat-person-bottom">
        <span>{friendsOnly ? 'Đang hoạt động' : person.preview}</span>
        {person.unread > 0 && !friendsOnly && <span className="chat-unread" aria-label={`${person.unread} tin chưa đọc`}>{person.unread}</span>}
      </span>
    </span>
  </button>;
}

export default function ConversationList({ people, activeId, tab, filter, archived, onSelect, onNewGroup, onFilterChange, onToggleArchive }) {
  const [unreadOnly, setUnreadOnly] = useState(false);
  function selectFilter(next) {
    const showArchived = next === 'archived';
    setUnreadOnly(next === 'unread');
    if (showArchived !== archived) {
      onFilterChange('');
      onToggleArchive();
    }
  }

  const friendsOnly = tab === 'friends';
  const search = filter.trim().toLocaleLowerCase();
  const visiblePeople = filterConversations(people, { search, archived, unreadOnly: !archived && unreadOnly });
  const unreadCount = people.filter((person) => !person.archived && person.unread > 0).length;
  const pinned = tab === 'chat' && !archived ? visiblePeople.filter((person) => person.pinned) : [];
  const remaining = visiblePeople.filter((person) => friendsOnly || archived || !person.pinned);

  function renderPerson(person) {
    return <ConversationItem key={person.id} person={person} selected={person.id === activeId && tab === 'chat'} friendsOnly={friendsOnly} onSelect={onSelect} />;
  }

  return <aside className="chat-list-panel" aria-label="Danh sách hội thoại">
    <header className="chat-list-heading">
      <h1>{friendsOnly ? 'Bạn bè' : tab === 'calls' ? 'Cuộc gọi' : 'Tin nhắn'}</h1>
      {tab === 'chat' && <button type="button" className="chat-create-trigger" aria-label="Tạo nhóm trò chuyện" title="Tạo nhóm trò chuyện" aria-haspopup="dialog" onClick={onNewGroup}>
        <ConversationActionIcon name="group" />
      </button>}
    </header>
    <label className="chat-search">
      <Icon name="searchBlue" />
      <input aria-label="Tìm hội thoại hoặc bạn bè" placeholder={friendsOnly ? 'Tìm bạn bè' : 'Tìm cuộc trò chuyện'} value={filter} onChange={(event) => onFilterChange(event.target.value)} />
    </label>
    {tab === 'chat' && <div className="chat-list-filters" role="group" aria-label="Lọc hội thoại">
      <button type="button" aria-pressed={!archived && !unreadOnly} onClick={() => selectFilter('all')}>Tất cả</button>
      <button type="button" aria-pressed={!archived && unreadOnly} onClick={() => selectFilter('unread')}>
        Chưa đọc {unreadCount > 0 && <span>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      <button type="button" aria-pressed={archived} onClick={() => selectFilter('archived')}>Đã lưu trữ</button>
    </div>}
    <div className="chat-contact-scroll">
      {tab === 'calls' ? <div className="chat-empty-list"><Icon name="phone" /><h2>Chưa có cuộc gọi</h2><p>Lịch sử cuộc gọi sẽ xuất hiện ở đây.</p></div> : <>
        {pinned.length > 0 && <section>
          <h2 className="chat-list-label">Đã ghim</h2>
          <div className="chat-person-group">{pinned.map(renderPerson)}</div>
        </section>}
        <section>
          <h2 className="chat-list-label">{friendsOnly ? 'Bạn bè của bạn' : archived ? 'Hội thoại đã lưu trữ' : 'Tất cả tin nhắn'}</h2>
          <div className="chat-person-group">{remaining.map(renderPerson)}</div>
        </section>
        {visiblePeople.length === 0 && <p className="chat-empty-list">{filter ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hội thoại trong mục này.'}</p>}
      </>}
    </div>
  </aside>;
}
