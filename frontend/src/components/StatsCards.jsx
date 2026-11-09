import Reveal from './Reveal';
import { card } from '../lib/ui';

export default function StatsCards({ tickets }) {
  const open = tickets.filter((t) => t.status === 'OPEN');
  const high = open.filter((t) => t.severity_score >= 4).length;
  const done = tickets.length - open.length;
  const rate = tickets.length ? Math.round((done / tickets.length) * 100) : 0;
  const items = [[open.length, 'open spots', 'text-red-600 dark:text-red-400'], [high, 'high or critical', ''], [done, 'cleaned up', 'text-forest-600 dark:text-forest-300'], [`${rate}%`, 'resolution rate', '']];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(([n, l, c], i) => (
        <Reveal key={l} delay={i * 100}>
          <div className={`${card} p-5`}>
            <p className={`font-display text-4xl font-bold ${c}`}>{n}</p>
            <p className="text-sm text-forest-600 dark:text-forest-300">{l}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
