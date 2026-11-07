import SeverityBadge from './SeverityBadge';

export default function AnalysisResult({ result }) {
  const a = result.ai_analysis;
  return (
    <section className="card result" aria-label="AI analysis">
      <h2>Report #{result.ticket.id} logged</h2>
      <p className="muted">Gemini analysed your photo and marked the spot on the command map.</p>
      <dl className="facts">
        <div><dt>Waste type</dt><dd>{a.waste_category}</dd></div>
        <div><dt>Severity</dt><dd><SeverityBadge score={a.severity_score} /></dd></div>
        <div><dt>Estimated volume</dt><dd>{a.estimated_volume}</dd></div>
        <div><dt>Sent to</dt><dd>{a.assigned_department}</dd></div>
      </dl>
    </section>
  );
}
