import SeverityBadge from './SeverityBadge';
import { formatDate } from '../lib/severity';

export default function TicketList({ tickets, selectedId, onSelect }) {
  if (!tickets.length) {
    return <p className="empty">No reports match these filters. Widen them, or submit a new report.</p>;
  }
  return (
    <ul className="list">
      {tickets.map((t) => (
        <li key={t.id}>
          <button className={`item ${selectedId === t.id ? 'item--active' : ''}`} onClick={() => onSelect(t)}>
            <img src={t.image_url} alt="" loading="lazy" />
            <span className="item__body">
              <b>{t.waste_category}</b>
              <SeverityBadge score={t.severity_score} />
              <span className="muted">{t.status === 'RESOLVED' ? 'Cleaned up' : 'Open'}, {formatDate(t.created_at)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
