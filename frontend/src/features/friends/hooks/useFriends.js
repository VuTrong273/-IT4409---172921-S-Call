import { useState } from 'react';

// Local relationship state until the friends API is connected.
// No request is sent to the server until the friends endpoints are implemented.
export default function useFriends() {
  const [directory, setDirectory] = useState([]);
  const friends = directory.filter((user) => user.relationship === 'friend');
  const incoming = directory.filter((user) => user.relationship === 'request_received');
  const outgoing = directory.filter((user) => user.relationship === 'request_sent');

  function changeRelationship(userId, expected, relationship) {
    setDirectory((current) => current.map((user) => user.id === userId && user.relationship === expected ? {
      ...user,
      relationship,
      friendRequestId: relationship === 'request_sent' ? `local-request-${userId}` : undefined,
    } : user));
  }
  function searchUsers(query) {
    const search = query.trim().toLocaleLowerCase();
    if (search.length < 3 || search.length > 100) return [];
    return directory.filter((user) => user.relationship !== 'blocked' && (search.includes('@')
      ? user.email.toLocaleLowerCase() === search
      : user.username.toLocaleLowerCase().startsWith(search))).slice(0, 20);
  }

  return {
    friends, incoming, outgoing, searchUsers,
    sendRequest: (id) => changeRelationship(id, 'none', 'request_sent'),
    acceptRequest: (id) => changeRelationship(id, 'request_received', 'friend'),
    rejectRequest: (id) => changeRelationship(id, 'request_received', 'none'),
    cancelRequest: (id) => changeRelationship(id, 'request_sent', 'none'),
  };
}
