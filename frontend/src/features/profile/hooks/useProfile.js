import { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';

// Session-only state; replace with the current-user API when available.
export default function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(() => ({ displayName: '', bio: '', avatarUrl: '', username: '', email: '', ...session?.user }));
  return { profile, saveProfile: setProfile };
}
