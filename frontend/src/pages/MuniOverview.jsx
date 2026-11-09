import StatsCards from '../components/StatsCards';
import SeverityBadge from '../components/SeverityBadge';
import Reveal from '../components/Reveal';
import ErrorBox from '../components/ErrorBox';
import Icon from '../components/Icon';
import { card, btnGhost, barColor } from '../lib/ui';
import { severityLevel, formatDate } from '../lib/severity';

export default function MuniOverview({ data, onFocus }) {
  const { tickets, error, refresh, loading } = data;
  if (error) return <ErrorBox message={error} onRetry={refresh} />;
  const open = tickets.filter((t) => t.status === 'OPEN');
  const counts = [5, 4, 3, 2, 1].map((s) => ({ s, n: open.filter((t) => t.severity_score === s).length }));
  const max = Math.max(1, ...counts.map((c) => c.n));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Municipal command centre</h1>
          <p className="mt-1 text-forest-600 dark:text-forest-300">Live picture of reported waste. Updates every 30 seconds.</p>
        </div>
        <button className={btnGhost} onClick={refresh} disabled={loading}><Icon name="refresh" className="h-4 w-4" />{loading ? 'Refreshing…' : 'Refresh'}</button>
      </div>

      <StatsCards tickets={tickets} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <section className={`${card} p-6`}>
            <h2 className="text-xl font-bold">Open spots by severity</h2>
            <div className="mt-4 space-y-3">
              {counts.map(({ s, n }) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <span className="w-6 font-semibold">{s}/5</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-forest-100 dark:bg-forest-800">
                    <div className={`h-full rounded-full transition-all duration-1000 ${barColor[severityLevel(s)]}`} style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right">{n}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={150}>
          <section className={`${card} p-6`}>
            <h2 className="text-xl font-bold">Latest reports</h2>
            {!tickets.length ? <p className="mt-3 text-forest-600 dark:text-forest-300">No reports yet. Reports from the citizen portal appear here.</p> : (
              <ul className="mt-3 divide-y divide-forest-100 dark:divide-forest-800">
                {tickets.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <button onClick={() => onFocus(t)} className="flex w-full items-center gap-3 py-3 text-left hover:opacity-80">
                      <img src={t.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1"><b className="block truncate">{t.waste_category}</b><span className="text-xs text-forest-600 dark:text-forest-300">{formatDate(t.created_at)}</span></span>
                      <SeverityBadge score={t.severity_score} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      </div>
    </div>
  );
}
