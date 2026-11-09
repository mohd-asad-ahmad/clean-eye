import { SEVERITY_LABEL, severityLevel } from '../lib/severity';

const style = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  mid: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
};

export default function SeverityBadge({ score }) {
  return (
    <span className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${style[severityLevel(score)]}`}>
      {score}/5 {SEVERITY_LABEL[score] || 'Unrated'}
    </span>
  );
}
