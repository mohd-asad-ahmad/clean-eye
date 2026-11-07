export default function StatsBar({ tickets }) {
  const open = tickets.filter((t) => t.status === 'OPEN');
  const critical = open.filter((t) => t.severity_score >= 4).length;
  const resolved = tickets.length - open.length;
  const rate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;

  return (
    <div className="stats">
      <div className="stat stat--alert"><b>{open.length}</b><span>open spots</span></div>
      <div className="stat"><b>{critical}</b><span>high or critical</span></div>
      <div className="stat"><b>{resolved}</b><span>cleaned up</span></div>
      <div className="stat"><b>{rate}%</b><span>resolution rate</span></div>
    </div>
  );
}
