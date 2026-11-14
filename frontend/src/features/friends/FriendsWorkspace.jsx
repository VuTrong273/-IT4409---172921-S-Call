import FriendsSearchBar from './components/FriendsSearchBar.jsx';
import { useEffect, useRef, useState } from 'react';
import FriendCard from './components/FriendCard.jsx';
import FriendIcon from './components/FriendIcon.jsx';
import './FriendsWorkspace.css';

const views = [
  { id: 'search', label: 'Tìm bạn', icon: 'search' },
  { id: 'all', label: 'Tất cả bạn bè', icon: 'users' },
  { id: 'incoming', label: 'Lời mời kết bạn', icon: 'incoming' },
  { id: 'outgoing', label: 'Lời mời đã gửi', icon: 'outgoing' },
];
const headings = {
  all: 'Danh sách bạn bè',
  incoming: 'Lời mời kết bạn',
  outgoing: 'Lời mời đã gửi',
  search: 'Tìm bạn',
};
const emptyStates = {
  all: ['Chưa có bạn bè', 'Tìm một người bạn và bắt đầu kết nối.'],
  incoming: ['Chưa có lời mời mới', 'Lời mời kết bạn bạn nhận được sẽ xuất hiện ở đây.'],
  outgoing: ['Chưa có lời mời đang chờ', 'Những lời mời bạn gửi sẽ xuất hiện ở đây.'],
};

export default function FriendsWorkspace({ model, onMessage, onNotice }) {
  const [view, setView] = useState('all');
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const searchRef = useRef(null);
  const isSearch = view === 'search';
  const title = headings[view];
  const collections = { all: model.friends, incoming: model.incoming, outgoing: model.outgoing };
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = isSearch ? model.searchUsers(searchQuery) : collections[view].filter((user) => (
    `${user.displayName} ${user.username}`.toLocaleLowerCase().includes(normalizedQuery)
  )).slice().sort((a, b) => a.displayName.localeCompare(b.displayName, 'vi'));
  const counts = { all: model.friends.length, incoming: model.incoming.length, outgoing: model.outgoing.length };
  const idleSearch = isSearch && !searchQuery;

  useEffect(() => {
    if (view === 'search') searchRef.current?.focus();
  }, [view]);

  function changeView(next) {
    setView(next);
    setQuery('');
    setSearchQuery('');
    setSearchError('');
  }
  function search(event) {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 3 || value.length > 100) {
      setSearchError('Nhập từ 3 đến 100 ký tự để tìm người dùng.');
      return;
    }
    setSearchError('');
    setSearchQuery(value);
  }
  function send(user) {
    model.sendRequest(user.id);
    onNotice(`Đã gửi lời mời kết bạn đến ${user.displayName}.`);
  }
  function accept(user) {
    model.acceptRequest(user.id);
    onNotice(`Bạn và ${user.displayName} đã là bạn bè.`);
  }
  function reject(user) {
    model.rejectRequest(user.id);
    onNotice(`Đã từ chối lời mời từ ${user.displayName}.`);
  }
  function cancel(user) {
    model.cancelRequest(user.id);
    onNotice(`Đã hủy lời mời gửi đến ${user.displayName}.`);
  }

  let emptyTitle;
  let emptyDescription;
  if (isSearch) {
    emptyTitle = idleSearch ? 'Bạn muốn kết nối với ai?' : 'Không tìm thấy người dùng';
    emptyDescription = idleSearch ? 'Tìm bạn bè hiện tại hoặc người chưa kết bạn.' : 'Kiểm tra lại tên đăng nhập hoặc nhập đầy đủ địa chỉ email.';
  } else if (query) {
    emptyTitle = 'Không tìm thấy kết quả phù hợp';
    emptyDescription = 'Thử một tên khác hoặc xóa nội dung tìm kiếm.';
  } else {
    [emptyTitle, emptyDescription] = emptyStates[view];
  }

  return <section className="friends-workspace" aria-label="Quản lý bạn bè">
    <aside className="friends-navigation">
      <header className="friends-navigation-heading"><h1>Bạn bè</h1><FriendIcon name="users" /></header>
      <div className="friends-navigation-body">
        <nav className="friends-tabs" aria-label="Các mục bạn bè">
          {views.map((item) => <button type="button" key={item.id} aria-current={view === item.id ? 'page' : undefined} className={`friends-tab ${view === item.id ? 'is-selected' : ''}`} onClick={() => changeView(item.id)}>
            <FriendIcon name={item.icon} /><span>{item.label}</span>
            {counts[item.id] !== undefined && <span className="friends-tab-count">{counts[item.id]}</span>}
          </button>)}
        </nav>
      </div>
    </aside>
    <main className="friends-main" aria-labelledby="friends-title">
      <header className="friends-main-header"><h2 id="friends-title">{title}</h2></header>
      <div className="friends-main-scroll">
        <div className="friends-content">
          <FriendsSearchBar
            value={query} inputRef={searchRef} discover={isSearch} error={isSearch ? searchError : ''}
            onChange={(value) => { setQuery(value); setSearchError(''); }}
            onClear={() => { setQuery(''); setSearchQuery(''); setSearchError(''); searchRef.current?.focus(); }}
            onSubmit={isSearch ? search : (event) => event.preventDefault()}
          />
          {!idleSearch && <p className="friends-results-count" role="status">{isSearch ? matches.length : counts[view]} {isSearch ? 'kết quả' : view === 'all' ? 'bạn bè' : 'lời mời'}{isSearch ? ` cho “${searchQuery}”` : ''}</p>}
          {matches.length > 0 && !idleSearch ? <div className="friends-user-list">
            {matches.map((user) => <FriendCard key={user.id} user={user} onMessage={onMessage} onSend={send} onAccept={accept} onReject={reject} onCancel={cancel} />)}
          </div> : <div className="friends-empty-state">
            <span className="friends-empty-icon"><FriendIcon name={isSearch ? 'search' : view === 'all' ? 'users' : view} /></span>
            <h3>{emptyTitle}</h3><p>{emptyDescription}</p>
            {view === 'all' && !query && <button type="button" className="friends-button friends-button-primary" onClick={() => changeView('search')}>Tìm bạn</button>}
          </div>}
        </div>
      </div>
    </main>
  </section>;
}
