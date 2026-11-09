import { useMemo, useState } from 'react';
import TicketMap from '../components/TicketMap';
import TicketList from '../components/TicketList';
import Filters from '../components/Filters';
import ErrorBox from '../components/ErrorBox';
import { btnGhost } from '../lib/ui';

export default function MuniMap({ data, selected, onSelect, onResolve }) {
  const [status, setStatus] = useState('OPEN');
  const [sev, setSev] = useState(1);
  const [showList, setShowList] = useState(true);
  const visible = useMemo(
    () => data.tickets.filter((t) => (status === 'ALL' || t.status === status) && t.severity_score >= sev),
    [data.tickets, status, sev]
  );
  if (data.error) return <ErrorBox message={data.error} onRetry={data.refresh} />;

  return (
    <div className="space-y-4">
      <h1 className="animate-slide-down text-3xl font-bold">Command map</h1>
      <Filters status={status} onStatus={setStatus} sev={sev} onSev={setSev}>
        <button className={`${btnGhost} hidden lg:inline-flex`} onClick={() => setShowList((s) => !s)}>{showList ? 'Map only' : 'Map and list'}</button>
        <button className={btnGhost} onClick={data.refresh}>Refresh</button>
      </Filters>
      <div className={`grid h-[calc(100vh-14rem)] min-h-[460px] gap-4 ${showList ? 'lg:grid-cols-[340px_1fr]' : ''}`}>
        {showList && <TicketList tickets={visible} selectedId={selected?.id} onSelect={onSelect} className="hidden overflow-y-auto lg:block" />}
        <div className="relative overflow-hidden rounded-2xl border border-forest-200 dark:border-forest-800">
          <TicketMap tickets={visible} selected={selected} onSelect={onSelect} onResolve={onResolve} />
          <div className="absolute bottom-3 left-3 z-[500] flex gap-3 rounded-lg bg-white/95 dark:bg-forest-900/95 px-3 py-1.5 text-xs shadow">
            {[['high', 'High'], ['mid', 'Moderate'], ['low', 'Low'], ['done', 'Cleaned']].map(([k, l]) => (
              <span key={k} className="flex items-center gap-1.5"><i className={`pin pin--${k} !h-3 !w-3 !border-2`} />{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
