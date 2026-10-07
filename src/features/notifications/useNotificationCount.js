// =========================================================
// MYNVORA — useNotificationCount
// Polls unread notification count every 30 sec.
// Returns the number (0 if none / error).
// =========================================================
import { useEffect, useState } from 'react';
import api, { tokens } from '../../lib/api.js';

export function useNotificationCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!tokens?.access) return;
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count');
        if (!cancelled) setCount(data.count || 0);
      } catch {
        /* ignore */
      }
    };

    fetchCount();
    const t = setInterval(fetchCount, 30000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return count;
}

export default useNotificationCount;