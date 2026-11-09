import { useMemo, useState } from 'react';
import Filters from '../components/Filters';
import Reveal from '../components/Reveal';
import ErrorBox from '../components/ErrorBox';
import SeverityBadge from '../components/SeverityBadge';
import Icon from '../components/Icon';
import { card, btnPrimary, btnGhost } from '../lib/ui';
import { formatDate } from '../lib/severity';

export default function MuniReports({ data, onFocus, onResolve }) {
  const [status, setStatus] = useState('OPEN');
  const [sev, setSev] = useState(1);
  const visible = useMemo(
    () => data.tickets.filter((t) => (status === 'ALL' || t.status === status) && t.severity_score >= sev),
    [data.tickets, status, sev]
  );
  if (data.error) return <ErrorBox message={data.error} onRetry={data.refresh} />;

  return (
    <div className="space-y-6">
      <h1 className="animate-slide-down text-3xl font-bold">All reports</h1>
      <Filters status={status} onStatus={setStatus} sev={sev} onSev={setSev} />
      {!visible.length ? <p className="text-forest-600 dark:text-forest-300">No reports match these filters.</p> : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 100}>
              <article className={`${card} overflow-hidden`}>
                <img src={t.image_url} alt="Reported waste" loading="lazy" className="h-44 w-full object-cover" />
                <div className="space-y-2 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold">{t.waste_category}</h3>
                    <SeverityBadge score={t.severity_score} />
                  </div>
                  <p className="text-sm">{t.estimated_volume}, {t.assigned_department}</p>
                  {t.user_message && <p className="text-sm italic text-forest-600 dark:text-forest-300">“{t.user_message}”</p>}
                  <p className="text-xs text-forest-600 dark:text-forest-300">{t.status === 'RESOLVED' ? 'Cleaned up' : 'Open'}, reported {formatDate(t.created_at)}</p>
                  <div className="flex gap-2 pt-2">
                    <button className={`${btnGhost} flex-1`} onClick={() => onFocus(t)}><Icon name="map" className="h-4 w-4" />View on map</button>
                    {t.status === 'OPEN' && <button className={`${btnPrimary} flex-1 !py-2 text-sm`} onClick={() => onResolve(t.id)}>Mark as cleaned</button>}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
