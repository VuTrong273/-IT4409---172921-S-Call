import { Avatar, Icon, IconButton } from './ChatPrimitives.jsx';

function ConversationItem({ person, selected, friendsOnly, onSelect }) {
  return <button type="button" className={`chat-person ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(person)} aria-current={selected ? 'true' : undefined}>
    <Avatar contact={person} />
    <span className="chat-person-copy">
      <span className="chat-person-top"><strong>{person.name}</strong><time>{person.time}</time></span>
      <span className="chat-person-bottom">
        <span>{friendsOnly ? 'Đang hoạt động' : person.preview}</span>
        {person.unread > 0 && !friendsOnly && <span className="chat-unread" aria-label={`${person.unread} tin chưa đọc`}>{person.unread}</span>}
      </span>
    </span>
  </button>;
}

export default function ConversationList({ people, activeId, tab, filter, archived, onSelect, onNewConversation, onFilterChange, onToggleArchive }) {
  const friendsOnly = tab === 'friends';
  const search = filter.trim().toLocaleLowerCase();
  const visiblePeople = people.filter((person) => (friendsOnly || !!person.archived === archived) && person.name.toLocaleLowerCase().includes(search));
  const pinned = tab === 'chat' && !archived ? visiblePeople.filter((person) => person.pinned) : [];
  const remaining = visiblePeople.filter((person) => friendsOnly || archived || !person.pinned);

  function renderPerson(person) {
    return <ConversationItem key={person.id} person={person} selected={person.id === activeId && tab === 'chat'} friendsOnly={friendsOnly} onSelect={onSelect} />;
  }

  return <aside className="chat-list-panel" aria-label="Danh sách hội thoại">
    <header className="chat-list-heading">
      <h1>{friendsOnly ? 'Bạn bè' : tab === 'calls' ? 'Cuộc gọi' : 'Tin nhắn'}</h1>
      <IconButton name="new" label="Bắt đầu trò chuyện" onClick={onNewConversation} />
    </header>
    <label className="chat-search">
      <Icon name="searchBlue" />
      <input aria-label="Tìm hội thoại hoặc bạn bè" placeholder={friendsOnly ? 'Tìm bạn bè' : 'Tìm cuộc trò chuyện'} value={filter} onChange={(event) => onFilterChange(event.target.value)} />
    </label>
    {tab === 'chat' && <button type="button" className={`chat-archive-link ${archived ? 'is-open' : ''}`} aria-pressed={archived} onClick={onToggleArchive}>
      <Icon name="archive" /><span>{archived ? 'Quay lại tất cả tin nhắn' : 'Đã lưu trữ'}</span>
    </button>}
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
