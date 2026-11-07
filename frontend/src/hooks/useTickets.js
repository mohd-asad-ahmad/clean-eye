import { useCallback, useEffect, useState } from 'react';
import { getTickets, resolveTicket, errorMessage } from '../api/client';

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTickets(await getTickets());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const resolve = useCallback(async (id) => {
    await resolveTicket(id);
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t)));
  }, []);

  return { tickets, loading, error, refresh, resolve };
}
