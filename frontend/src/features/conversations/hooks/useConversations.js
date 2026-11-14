import { useEffect, useRef, useState } from 'react';

let messageSequence = 0;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Local state until the conversation API is connected.
export default function useConversations() {
  const [people, setPeople] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState({});
  const [drafts, setDrafts] = useState({});
  const objectUrls = useRef([]);
  const active = people.find((person) => person.id === activeId);
  const history = messages[activeId] ?? [];
  const draft = drafts[activeId] ?? '';

  useEffect(() => () => objectUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function selectConversation(person) {
    setActiveId(person.id);
    setPeople((current) => current.some((item) => item.id === person.id)
      ? current.map((item) => item.id === person.id ? { ...item, unread: 0 } : item)
      : [...current, { ...person, preview: '', time: '', unread: 0 }]);
  }
  function setDraft(value) {
    if (!active) return;
    setDrafts((current) => ({ ...current, [activeId]: typeof value === 'function' ? value(current[activeId] ?? '') : value }));
  }
  function addMessage(content) {
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const item = { ...content, id: `local-${Date.now()}-${++messageSequence}`, mine: true, time };
    setMessages((current) => ({ ...current, [activeId]: [...(current[activeId] ?? []), item] }));
    updateConversation({ preview: `Bạn: ${content.text ?? content.name}`, time, archived: false });
  }
  function sendMessage() {
    if (!active || !draft.trim()) return;
    addMessage({ text: draft.trim() });
    setDraft('');
  }
  function attachFiles(files) {
    if (!active) return '';
    let rejected = false;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) { rejected = true; continue; }
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      addMessage({ kind: file.type.startsWith('image/') ? 'image' : 'file', name: file.name, url });
    }
    return rejected ? 'Mỗi tệp có dung lượng tối đa 20 MB.' : '';
  }
  function updateConversation(change) {
    setPeople((current) => current.map((person) => person.id === activeId ? { ...person, ...change } : person));
  }

  return { people, active, history, draft, selectConversation, setDraft, sendMessage, attachFiles, updateConversation };
}
