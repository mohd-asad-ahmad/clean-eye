import { useMemo, useState } from 'react';
import useTickets from '../hooks/useTickets';
import StatsBar from '../components/StatsBar';
import TicketMap from '../components/TicketMap';
import TicketList from '../components/TicketList';
import { errorMessage } from '../api/client';

export default function DashboardPage({ notify }) {
  const { tickets, loading, error, refresh, resolve } = useTickets();
  const [status, setStatus] = useState('OPEN');
  const [minSeverity, setMinSeverity] = useState(1);
  const [selected, setSelected] = useState(null);

  const visible = useMemo(
    () => tickets.filter((t) => (status === 'ALL' || t.status === status) && t.severity_score >= minSeverity),
    [tickets, status, minSeverity]
  );

  const handleResolve = async (id) => {
    try {
      await resolve(id);
      notify('Marked as cleaned.', 'success');
    } catch (e) {
      notify(errorMessage(e), 'error');
    }
  };

  return (
    <main className="page page--dash">
      <StatsBar tickets={tickets} />

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Status filter">
          {[['OPEN', 'Open'], ['RESOLVED', 'Cleaned'], ['ALL', 'All']].map(([v, l]) => (
            <button key={v} className={status === v ? 'on' : ''} onClick={() => setStatus(v)}>{l}</button>
          ))}
        </div>
        <label className="inline">Severity
          <select value={minSeverity} onChange={(e) => setMinSeverity(Number(e.target.value))}>
            <option value={1}>Any</option>
            <option value={3}>Moderate and above</option>
            <option value={4}>High and above</option>
            <option value={5}>Critical only</option>
          </select>
        </label>
        <button className="btn btn--ghost btn--sm" onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div className="card error">
          <p>{error}</p>
          <button className="btn btn--primary btn--sm" onClick={refresh}>Try again</button>
        </div>
      ) : (
        <div className="split">
          <aside className="split__list">
            {loading && !tickets.length ? <p className="empty">Loading reports…</p> : (
              <TicketList tickets={visible} selectedId={selected?.id} onSelect={setSelected} />
            )}
          </aside>
          <div className="split__map">
            <TicketMap tickets={visible} selected={selected} onSelect={setSelected} onResolve={handleResolve} />
            <div className="legend">
              <span><i className="pin pin--high" /> High</span>
              <span><i className="pin pin--mid" /> Moderate</span>
              <span><i className="pin pin--low" /> Low</span>
              <span><i className="pin pin--done" /> Cleaned</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
