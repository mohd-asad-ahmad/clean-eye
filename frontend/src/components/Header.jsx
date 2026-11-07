const TABS = [
  { id: 'report', label: 'Report waste' },
  { id: 'dashboard', label: 'Command map' },
];

export default function Header({ tab, onChange }) {
  return (
    <header className="header">
      <div className="header__brand">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle cx="14" cy="14" r="13" fill="#2f8f5f" />
          <circle cx="14" cy="14" r="6" fill="none" stroke="#fff" strokeWidth="2.5" />
          <circle cx="14" cy="14" r="2" fill="#fff" />
        </svg>
        <span>Clean Eye</span>
      </div>
      <nav className="tabs" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
