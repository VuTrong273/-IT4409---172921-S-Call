import { useNavigate } from 'react-router';
import { WORKSPACE_PATHS } from '../../app/workspaceRoutes.js';
import FriendsWorkspace from '../friends/FriendsWorkspace.jsx';
import useFriends from '../friends/hooks/useFriends.js';
import SettingsWorkspace from '../settings/SettingsWorkspace.jsx';
import useProfile from '../settings/hooks/useProfile.js';
import { useEffect, useState } from 'react';
import useConversations from './hooks/useConversations.js';
import ChatSidebar from './components/ChatSidebar.jsx';
import ConversationList from './components/ConversationList.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import MessageList from './components/MessageList.jsx';
import MessageComposer from './components/MessageComposer.jsx';
import ConversationDetails from './components/ConversationDetails.jsx';
import NewConversationDialog from './components/NewConversationDialog.jsx';
import './ConversationWorkspace.css';

export default function ConversationWorkspace({ tab }) {
  const navigate = useNavigate();
  const chat = useConversations();
  const friends = useFriends();
  const { profile, saveProfile } = useProfile();
  const [filter, setFilter] = useState('');
  const [archived, setArchived] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [dark, setDark] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [newChat, setNewChat] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    setFilter('');
    setSearchOpen(false);
    setMessageSearch('');
    setDetailsOpen(false);
    setNewChat(false);
  }, [tab]);

  function selectConversation(person) {
    chat.selectConversation(person);
    setMobileChat(true);
    if (tab !== 'chat') navigate(WORKSPACE_PATHS.chat);
    setArchived(!!person.archived);
    setSearchOpen(false);
    setMessageSearch('');
    setDetailsOpen(false);
    setNewChat(false);
  }
  function changeTab() {
    setFilter('');
    setMobileChat(false);
  }
  function sendMessage() {
    chat.sendMessage();
    setArchived(false);
  }
  function attachFiles(files) {
    const error = chat.attachFiles(files);
    if (error) setNotice(error);
    setArchived(false);
  }
  function closeSearch() {
    setSearchOpen(false);
    setMessageSearch('');
  }

  return <div className={`chat-workspace ${dark ? 'chat-dark' : ''} ${tab === 'chat' && mobileChat ? 'chat-mobile-open' : ''} ${tab === 'friends' ? 'friends-active' : ''} ${tab === 'settings' ? 'settings-active' : ''}`} onKeyDown={(event) => {
    if (event.key === 'Escape') { setDetailsOpen(false); setNewChat(false); }
  }}>
    <ChatSidebar tab={tab} dark={dark} profile={profile} onTabChange={changeTab} onToggleTheme={() => setDark((current) => !current)} />
    {tab === 'settings' ? <SettingsWorkspace profile={profile} onSave={(next) => { saveProfile(next); setNotice('Đã lưu thông tin trong phiên này.'); }} /> : tab === 'friends' ? <FriendsWorkspace model={friends} onNotice={setNotice} onMessage={(user) => selectConversation({ id: user.id, name: user.displayName, avatar: user.avatar, isOnline: !!user.isOnline })} /> : <>
    <ConversationList people={chat.people} activeId={chat.active?.id} tab={tab} filter={filter} archived={archived} onSelect={selectConversation} onNewConversation={() => setNewChat(true)} onFilterChange={setFilter} onToggleArchive={() => setArchived((current) => !current)} />
    <main className="chat-main" aria-label={chat.active ? `Cuộc trò chuyện với ${chat.active.name}` : 'Tin nhắn'}>
      {chat.active ? <>
      <ChatHeader key={`header-${chat.active.id}`} active={chat.active} searchOpen={searchOpen} onBack={() => setMobileChat(false)} onToggleDetails={() => setDetailsOpen((current) => !current)} onShowDetails={() => setDetailsOpen(true)} onToggleSearch={() => setSearchOpen((current) => !current)} onArchiveChange={setArchived} onUpdate={chat.updateConversation} onNotice={setNotice} />
      {searchOpen && <div className="chat-message-search"><input aria-label="Nội dung cần tìm" placeholder="Tìm tin nhắn…" value={messageSearch} onChange={(event) => setMessageSearch(event.target.value)} autoFocus /><button type="button" onClick={closeSearch}>Đóng</button></div>}
      <div className="chat-body">
        <MessageList active={chat.active} history={chat.history} messageSearch={messageSearch} />
        {detailsOpen && <ConversationDetails active={chat.active} history={chat.history} onClose={() => setDetailsOpen(false)} onTogglePin={() => chat.updateConversation({ pinned: !chat.active.pinned })} />}
      </div>
      <MessageComposer key={`composer-${chat.active.id}`} draft={chat.draft} onDraftChange={chat.setDraft} onSend={sendMessage} onAttach={attachFiles} />
      </> : <div className="chat-conversation-start"><h2>Chọn một cuộc trò chuyện</h2><p>Chọn một người bạn để bắt đầu nhắn tin.</p></div>}
    </main>
    </>}
    {notice && <div className="chat-toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo">×</button></div>}
    <NewConversationDialog open={newChat} people={friends.friends.map((user) => ({ ...user, name: user.displayName }))} onClose={() => setNewChat(false)} onSelect={selectConversation} />
  </div>;
}
