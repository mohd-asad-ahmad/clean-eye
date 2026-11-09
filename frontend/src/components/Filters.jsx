import { btnGhost } from '../lib/ui';

export default function Filters({ status, onStatus, sev, onSev, children }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="group" aria-label="Status" className="inline-flex overflow-hidden rounded-xl border border-forest-300 dark:border-forest-700 text-sm">
        {[['OPEN', 'Open'], ['RESOLVED', 'Cleaned'], ['ALL', 'All']].map(([v, l]) => (
          <button key={v} onClick={() => onStatus(v)} className={`px-4 py-2 transition ${status === v ? 'bg-forest-600 text-white font-semibold' : 'bg-white dark:bg-forest-900 hover:bg-forest-100 dark:hover:bg-forest-800'}`}>{l}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">Severity
        <select value={sev} onChange={(e) => onSev(Number(e.target.value))} className="rounded-xl border border-forest-300 dark:border-forest-700 bg-white dark:bg-forest-900 px-3 py-2">
          <option value={1}>Any</option><option value={3}>Moderate and above</option><option value={4}>High and above</option><option value={5}>Critical only</option>
        </select>
      </label>
      {children}
    </div>
  );
}
export { btnGhost };
