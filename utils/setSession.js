// utils/setSession.ts (client)
import { getIdToken } from 'firebase/auth';

export async function setSession(user) {
  const token = await getIdToken(user, true);

  await fetch('/api/auth/session-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important!
    body: JSON.stringify({ token }),
  });
}
