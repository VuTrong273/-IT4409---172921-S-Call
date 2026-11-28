export function formatFileSize(size = 0) {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.ceil(size / 1024))} KB`;
}
export function filterConversations(people, { search = '', archived = false, unreadOnly = false } = {}) {
  const query = search.trim().toLocaleLowerCase();
  return people.filter((person) => !!person.archived === archived
    && (!unreadOnly || person.unread > 0)
    && (person.name.toLocaleLowerCase().includes(query) || person.nickname?.toLocaleLowerCase().includes(query)));
}
export function messageMatches(message, query) {
  return !message.recalled && `${message.text || ''} ${message.name || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
export function createDemoChat() {
  const date = new Date().toISOString();
  return {
    people: [
      { id: 'demo-linh', name: 'Minh Linh', username: 'minhlinh', bio: 'Thích đọc sách và thiết kế giao diện.', isOnline: true, pinned: true, unread: 0, preview: 'Mình cùng trao đổi lúc 8 giờ nhé!', time: '10:42' },
      { id: 'demo-huy', name: 'Quang Huy', username: 'quanghuy', isOnline: false, unread: 2, preview: 'Cuối tuần mình đi cà phê nhé?', time: '09:15' },
      { id: 'demo-an', name: 'Hoài An', username: 'hoaian', isOnline: true, unread: 0, preview: 'Cảm ơn bạn nha!', time: 'Hôm qua' },
      { id: 'demo-group', name: 'Nhóm học tập', type: 'group', unread: 3, members: [{ id: 'demo-linh', name: 'Minh Linh' }, { id: 'demo-huy', name: 'Quang Huy' }], preview: 'Minh Linh: Hẹn cả nhóm tối nay', time: '08:30' },
    ],
    messages: {
      'demo-linh': [
        { id: 'demo-1', text: 'Chào bạn! Mình đã xem phần giao diện chat rồi.', mine: false, time: '10:38', createdAt: date },
        { id: 'demo-2', text: 'Bạn xem thử giúp mình phần gửi ảnh và tài liệu nhé.', mine: true, status: 'read', time: '10:40', createdAt: date },
        { id: 'demo-3', text: 'Mình cùng trao đổi lúc 8 giờ nhé!', mine: false, time: '10:42', createdAt: date },
      ],
      'demo-huy': [{ id: 'demo-4', text: 'Cuối tuần mình đi cà phê nhé?', mine: false, time: '09:15', createdAt: date }],
      'demo-group': [{ id: 'demo-5', text: 'Hẹn cả nhóm tối nay', sender: 'Minh Linh', mine: false, time: '08:30', createdAt: date }],
    },
  };
}
