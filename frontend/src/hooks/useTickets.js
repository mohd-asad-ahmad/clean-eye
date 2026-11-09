import { useCallback, useEffect, useState } from 'react';
import { getTickets, resolveTicket, errorMessage } from '../api/client';

// Fetches once, then quietly re-fetches every 30s so the map stays current.
export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (silent) => {
    if (!silent) { setLoading(true); setError(''); }
    try {
      setTickets(await getTickets());
    } catch (e) {
      if (!silent) setError(errorMessage(e));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const id = setInterval(() => load(true), 30000);
    return () => clearInterval(id);
  }, [load]);

  const resolve = useCallback(async (id) => {
    await resolveTicket(id);
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t)));
  }, []);

  return { tickets, loading, error, refresh: () => load(false), resolve };
}
