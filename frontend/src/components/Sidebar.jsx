import Icon from './Icon';

export default function Sidebar({ items, view, onView, open, onClose, collapsed, onCollapse, role }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 animate-fade lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-20 h-screen w-64 shrink-0 flex flex-col bg-forest-900 text-forest-100 transition-all duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
          <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
            <circle cx="14" cy="14" r="13" fill="#5f9e66" />
            <circle cx="14" cy="14" r="6" fill="none" stroke="#fff" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="2" fill="#fff" />
          </svg>
          <span className={`font-display text-xl font-bold ${collapsed ? 'lg:hidden' : ''}`}>Clean Eye</span>
          <button onClick={onClose} aria-label="Close menu" className="ml-auto rounded-lg p-1.5 hover:bg-white/10 lg:hidden"><Icon name="x" /></button>
        </div>

        <p className={`px-5 pt-5 pb-2 text-sm text-forest-300 ${collapsed ? 'lg:hidden' : ''}`}>
          {role === 'citizen' ? 'Citizen portal' : 'Municipal portal'}
        </p>
        <nav className="flex-1 space-y-1 px-3 pt-2" aria-label="Sections">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => onView(it.id)}
              title={it.label}
              aria-current={view === it.id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === it.id ? 'bg-forest-600 text-white' : 'hover:bg-white/10 text-forest-100'} ${collapsed ? 'lg:justify-center' : ''}`}
            >
              <Icon name={it.icon} className="h-5 w-5 shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>{it.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mx-3 mb-4 hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-forest-300 hover:bg-white/10"
        >
          <Icon name="chevron" className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          <span className={collapsed ? 'hidden' : ''}>Collapse</span>
        </button>
      </aside>
    </>
  );
}
