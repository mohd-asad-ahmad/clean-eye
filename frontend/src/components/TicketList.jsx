import SeverityBadge from './SeverityBadge';
import { formatDate } from '../lib/severity';
import { card } from '../lib/ui';

export default function TicketList({ tickets, selectedId, onSelect, className = '' }) {
  return (
    <aside className={`${card} ${className}`}>
      {!tickets.length ? <p className="p-6 text-forest-600 dark:text-forest-300">No reports match these filters. Widen them, or submit a new report.</p> : (
        <ul>
          {tickets.map((t) => (
            <li key={t.id}>
              <button onClick={() => onSelect(t)} className={`flex w-full gap-3 border-b border-forest-100 dark:border-forest-800 p-3 text-left transition hover:bg-forest-50 dark:hover:bg-forest-800 ${selectedId === t.id ? 'bg-forest-100 dark:bg-forest-800 shadow-[inset_4px_0_0_#3f8049]' : ''}`}>
                <img src={t.image_url} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                <span className="flex min-w-0 flex-col gap-1">
                  <b className="truncate">{t.waste_category}</b>
                  <SeverityBadge score={t.severity_score} />
                  <span className="text-xs text-forest-600 dark:text-forest-300">{t.status === 'RESOLVED' ? 'Cleaned up' : 'Open'}, {formatDate(t.created_at)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
