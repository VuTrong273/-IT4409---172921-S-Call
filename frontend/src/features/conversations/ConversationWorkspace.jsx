import { useNavigate } from 'react-router';
import { WORKSPACE_PATHS } from '../../app/workspaceRoutes.js';
import FriendsWorkspace from '../friends/FriendsWorkspace.jsx';
import useFriends from '../friends/hooks/useFriends.js';
import SettingsWorkspace from '../settings/SettingsWorkspace.jsx';
import useProfile from '../profile/hooks/useProfile.js';
import ProfilePanel from '../profile/ProfilePanel.jsx';
import useAppearance from '../settings/hooks/useAppearance.js';
import usePreferences from '../settings/hooks/usePreferences.js';
import { useEffect, useState } from 'react';
import useConversations from './hooks/useConversations.js';
import ChatSidebar from './components/ChatSidebar.jsx';
import ConversationList from './components/ConversationList.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import MessageList from './components/MessageList.jsx';
import MessageComposer from './components/MessageComposer.jsx';
import ConversationDetails from './components/ConversationDetails.jsx';
import ConversationSearch from './components/ConversationSearch.jsx';
import NewConversationDialog from './components/NewConversationDialog.jsx';
import ImageViewer from './components/ImageViewer.jsx';
import ConversationPin from './components/ConversationPin.jsx';
import './ConversationWorkspace.css';
import './ChatEnhancements.css';

export default function ConversationWorkspace({ tab }) {
  const navigate = useNavigate();
  const chat = useConversations();
  const friends = useFriends();
  const { profile, saveProfile } = useProfile();
  const [filter, setFilter] = useState('');
  const [archived, setArchived] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const { theme, setTheme, dark } = useAppearance();
  const { preferences, updatePreference } = usePreferences();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [jumpTarget, setJumpTarget] = useState(null);
  const [notice, setNotice] = useState('');
  const [newGroup, setNewGroup] = useState(false);
  const [image, setImage] = useState(null);
  const [pins, setPins] = useState({});
  const [unlocked, setUnlocked] = useState({});
  const [pinAction, setPinAction] = useState(null);
  const contacts = friends.friends.length ? friends.friends.map((user) => ({ ...user, name: user.displayName })) : chat.people.filter((person) => person.type !== 'group');
  const isLocked = !!pins[chat.active?.id] && !unlocked[chat.active?.id];

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    setFilter('');
    setSearchOpen(false);
    setMessageSearch('');
    setJumpTarget(null);
    setDetailsOpen(false);
    setNewGroup(false);
    setImage(null);
    setPinAction(null);
  }, [tab]);

  function selectConversation(person) {
    chat.selectConversation(person);
    setMobileChat(true);
    if (tab !== 'chat') navigate(WORKSPACE_PATHS.chat);
    setArchived(!!person.archived);
    setSearchOpen(false);
    setMessageSearch('');
    setJumpTarget(null);
    setDetailsOpen(false);
    setNewGroup(false);
    setPinAction(null);
  }
  function changeTab() {
    setFilter('');
    setMobileChat(false);
  }
  function sendMessage(files) {
    chat.sendMessage(files);
    setArchived(false);
  }
  function requestPin(action) {
    if (action === 'lock') { setUnlocked((current) => ({ ...current, [chat.active.id]: false })); setDetailsOpen(false); }
    else setPinAction(action);
  }
  function submitPin(pin) {
    const id = chat.active.id;
    const entry = pins[id];
    if (pinAction !== 'set' && entry?.blockedUntil > Date.now()) return 'Đã nhập sai 5 lần. Vui lòng thử lại sau 5 phút.';
    if (pinAction !== 'set' && pin !== entry?.code) {
      const attempts = (entry?.blockedUntil && entry.blockedUntil <= Date.now() ? 0 : entry?.attempts || 0) + 1;
      setPins((current) => ({ ...current, [id]: { ...entry, attempts, blockedUntil: attempts >= 5 ? Date.now() + 300000 : 0 } }));
      return attempts >= 5 ? 'Đã nhập sai 5 lần. Vui lòng thử lại sau 5 phút.' : 'Mã PIN chưa chính xác.';
    }
    if (pinAction === 'set') {
      setPins((current) => ({ ...current, [id]: { code: pin, attempts: 0 } }));
      setUnlocked((current) => ({ ...current, [id]: false }));
    } else if (pinAction === 'disable') setPins((current) => { const next = { ...current }; delete next[id]; return next; });
    else {
      setUnlocked((current) => ({ ...current, [id]: true }));
      setPins((current) => ({ ...current, [id]: { ...entry, attempts: 0, blockedUntil: 0 } }));
    }
    setPinAction(null); setDetailsOpen(false); return '';
  }
  function closeSearch() {
    setSearchOpen(false);
    setMessageSearch('');
    setJumpTarget(null);
  }

  function toggleArchive() {
    const archived = !chat.active.archived;
    chat.updateConversation({ archived });
    setArchived(archived);
  }

  function clearHistory() {
    chat.clearHistory();
    closeSearch();
    setImage(null);
    setNotice('Đã xóa lịch sử trò chuyện.');
  }

  return <div className={`chat-workspace chat-font-${preferences.fontSize} ${dark ? 'chat-dark' : ''} ${tab === 'chat' && mobileChat ? 'chat-mobile-open' : ''} ${tab === 'friends' ? 'friends-active' : ''} ${tab === 'settings' ? 'settings-active' : ''} ${tab === 'profile' ? 'profile-active' : ''}`} onKeyDown={(event) => {
    if (event.key === 'Escape') { setDetailsOpen(false); closeSearch(); setNewGroup(false); }
  }}>
    <ChatSidebar tab={tab} dark={dark} profile={profile} onTabChange={changeTab} onToggleTheme={() => setTheme(dark ? 'light' : 'dark')} />
    {tab === 'settings' ? <SettingsWorkspace profile={profile} theme={theme} onThemeChange={setTheme} preferences={preferences} onPreferenceChange={updatePreference} /> : tab === 'friends' ? <FriendsWorkspace model={friends} onNotice={setNotice} onMessage={(user) => selectConversation({ id: user.id, name: user.displayName, avatar: user.avatar, avatarUrl: user.avatarUrl, username: user.username, bio: user.bio, isOnline: !!user.isOnline })} /> : <>
    {tab === 'profile' ? <ProfilePanel profile={profile} onSave={(next) => { saveProfile(next); setNotice('Đã lưu hồ sơ trong phiên này.'); }} /> : <ConversationList people={chat.people.map((person) => pins[person.id] ? { ...person, preview: 'Cuộc trò chuyện đã khóa' } : person)} activeId={chat.active?.id} tab={tab} filter={filter} archived={archived} onSelect={selectConversation} onNewGroup={() => setNewGroup(true)} onFilterChange={setFilter} onToggleArchive={() => setArchived((current) => !current)} />}
    <main className={`chat-main ${!isLocked && (detailsOpen || searchOpen) ? 'chat-main-with-panel' : ''}`} aria-label={chat.active ? `Cuộc trò chuyện với ${chat.active.name}` : 'Tin nhắn'}>
      {chat.active ? <>
      <ChatHeader key={`header-${chat.active.id}`} active={chat.active} detailsOpen={detailsOpen} searchOpen={searchOpen} onBack={() => setMobileChat(false)} onToggleDetails={() => { closeSearch(); setDetailsOpen((current) => !current); }} onToggleSearch={() => { setDetailsOpen(false); if (searchOpen) closeSearch(); else setSearchOpen(true); }} onNotice={setNotice} />
      <div className="chat-body">
        {isLocked ? <div className="chat-locked"><span aria-hidden="true">▣</span><h2>Cuộc trò chuyện đã khóa</h2><p>Nhập mã PIN để xem tin nhắn.</p><button type="button" className="chat-action-primary" onClick={() => setPinAction('unlock')}>Mở khóa</button></div> : <MessageList active={chat.active} history={chat.history} messageSearch={messageSearch} jumpTarget={jumpTarget} onRecall={chat.recallMessage} onImage={setImage} />}

      </div>
      {!isLocked && <MessageComposer key={`composer-${chat.active.id}`} draft={chat.draft} onDraftChange={chat.setDraft} onSend={sendMessage} sendWithEnter={preferences.sendWithEnter} />}
        {detailsOpen && !isLocked && <ConversationDetails key={chat.active.id} active={chat.active} history={chat.history} contacts={contacts} hasPin={!!pins[chat.active.id]} onClose={() => setDetailsOpen(false)} onUpdate={chat.updateConversation} onToggleArchive={toggleArchive} onNewGroup={() => setNewGroup(true)} onClearHistory={clearHistory} onAvatar={chat.updateGroupAvatar} onPin={requestPin} onImage={setImage} />}
      {searchOpen && !isLocked && <ConversationSearch key={chat.active.id} active={chat.active} history={chat.history} query={messageSearch} onQuery={setMessageSearch} onClose={closeSearch} onSelect={(id) => { setJumpTarget({ id, nonce: Date.now() }); if (window.matchMedia('(max-width: 767px)').matches) setSearchOpen(false); }} />}
      </> : <div className="chat-conversation-start"><h2>Chọn một cuộc trò chuyện</h2><p>Chọn một người bạn để bắt đầu nhắn tin.</p></div>}
    </main>
    </>}
    {notice && <div className="chat-toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo">×</button></div>}
    <NewConversationDialog open={newGroup} people={contacts} onClose={() => setNewGroup(false)} onCreateGroup={(name, members) => { const group = chat.createGroup(name, members); if (group) { setNewGroup(false); setMobileChat(true); navigate(WORKSPACE_PATHS.chat); setArchived(false); setDetailsOpen(false); setMessageSearch(''); } }} />
    <ImageViewer image={image} onClose={() => setImage(null)} />
    <ConversationPin action={pinAction} onClose={() => setPinAction(null)} onSubmit={submitPin} />
  </div>;
}
