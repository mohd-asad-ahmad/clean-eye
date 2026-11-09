import SeverityBadge from './SeverityBadge';
import { card } from '../lib/ui';

export default function AnalysisResult({ result }) {
  const a = result.ai_analysis;
  const rows = [['Waste type', a.waste_category], ['Estimated volume', a.estimated_volume], ['Sent to', a.assigned_department]];
  return (
    <section className={`${card} animate-slide-up border-l-4 !border-l-forest-500 p-6 sm:p-8`} aria-label="AI analysis">
      <h2 className="text-2xl font-bold">Report #{result.ticket.id} logged</h2>
      <p className="mt-1 text-sm text-forest-600 dark:text-forest-300">Gemini analysed your photo and marked the spot on the command map.</p>
      <dl className="mt-4 divide-y divide-forest-200 dark:divide-forest-800">
        <div className="flex justify-between gap-4 py-3"><dt className="text-forest-600 dark:text-forest-300">Severity</dt><dd><SeverityBadge score={a.severity_score} /></dd></div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-forest-600 dark:text-forest-300">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
        ))}
      </dl>
    </section>
  );
}
