import { SEVERITY_LABEL, severityLevel } from '../lib/severity';

export default function SeverityBadge({ score }) {
  return (
    <span className={`badge badge--${severityLevel(score)}`}>
      {score}/5 {SEVERITY_LABEL[score] || 'Unrated'}
    </span>
  );
}
