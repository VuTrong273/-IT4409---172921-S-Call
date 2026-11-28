import { useEffect, useRef, useState } from 'react';
import { getSession } from '../../../lib/session.js';
import { isDemoSession } from '../../auth/demoAccount.js';
import { createDemoChat } from '../chatModel.js';

let sequence = 0;
export default function useConversations() {
  const [initial] = useState(() => isDemoSession(getSession()) ? createDemoChat() : { people: [], messages: {} });
  const [people, setPeople] = useState(initial.people);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState(initial.messages);
  const [drafts, setDrafts] = useState({});
  const objectUrls = useRef([]);
  const active = people.find((person) => person.id === activeId);
  const history = messages[activeId] ?? [];
  const draft = drafts[activeId] ?? '';
  useEffect(() => () => { objectUrls.current.forEach(URL.revokeObjectURL); }, []);
  function selectConversation(person) {
    setActiveId(person.id);
    setPeople((current) => current.some((item) => item.id === person.id)
      ? current.map((item) => item.id === person.id ? { ...item, unread: 0 } : item)
      : [...current, { ...person, preview: '', time: '', unread: 0 }]);
  }
  function setDraft(value) {
    if (active) setDrafts((current) => ({ ...current, [activeId]: typeof value === 'function' ? value(current[activeId] ?? '') : value }));
  }
  function updateConversation(change) { setPeople((current) => current.map((person) => person.id === activeId ? { ...person, ...change } : person)); }
  function sendMessage(files = []) {
    if (!active || (!draft.trim() && !files.length)) return;
    const createdAt = new Date().toISOString();
    const time = new Date(createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const contents = files.filter((file) => file.size <= 20 * 1024 * 1024).map((file) => {
      const url = URL.createObjectURL(file); objectUrls.current.push(url);
      return { kind: file.type.startsWith('image/') ? 'image' : 'file', name: file.name, size: file.size, url };
    });
    if (draft.trim()) contents.push({ text: draft.trim() });
    const additions = contents.map((item) => ({ ...item, id: `local-${Date.now()}-${++sequence}`, mine: true, status: 'local', time, createdAt }));
    setMessages((current) => ({ ...current, [activeId]: [...(current[activeId] ?? []), ...additions] }));
    const last = additions.at(-1);
    if (last) updateConversation({ preview: `Bạn: ${last.text || last.name}`, time, archived: false });
    setDraft('');
  }
  function recallMessage(id) {
    setMessages((current) => ({ ...current, [activeId]: (current[activeId] ?? []).map((message) => message.id === id && message.mine ? { ...message, recalled: true, text: '', url: undefined, name: undefined } : message) }));
    if (history.at(-1)?.id === id) updateConversation({ preview: 'Bạn đã thu hồi một tin nhắn' });
  }
  function createGroup(name, members) {
    if (!name.trim() || members.length < 2) return;
    const group = { id: `local-group-${Date.now()}-${++sequence}`, name: name.trim(), type: 'group', members, unread: 0, preview: 'Nhóm mới được tạo', time: 'Vừa xong' };
    setPeople((current) => [...current, group]); setActiveId(group.id); return group;
  }
  function clearHistory() {
    if (!active) return;
    const urls = new Set(history.map((message) => message.url));
    objectUrls.current = objectUrls.current.filter((url) => {
      if (!urls.has(url)) return true;
      URL.revokeObjectURL(url);
      return false;
    });
    setMessages((current) => ({ ...current, [activeId]: [] }));
    updateConversation({ preview: '', time: '', unread: 0 });
  }
  function updateGroupAvatar(file) {
    if (!file.type.startsWith('image/')) return 'Vui lòng chọn tệp hình ảnh.';
    if (file.size > 5 * 1024 * 1024) return 'Ảnh nhóm có dung lượng tối đa 5 MB.';
    const url = URL.createObjectURL(file); objectUrls.current.push(url);
    updateConversation({ avatarUrl: url }); return '';
  }
  return { people, active, history, draft, selectConversation, setDraft, sendMessage, updateConversation, recallMessage, createGroup, updateGroupAvatar, clearHistory };
}
