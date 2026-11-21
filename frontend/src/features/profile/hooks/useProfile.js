import { useState } from 'react';

// Session-only state; replace with the current-user API when available.
export default function useProfile() {
  const [profile, setProfile] = useState({ displayName: '', bio: '', avatarUrl: '', username: '', email: '' });
  return { profile, saveProfile: setProfile };
}
