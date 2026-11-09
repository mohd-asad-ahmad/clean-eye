import Icon from './Icon';

export default function Navbar({ hidden, role, onRole, dark, onToggleDark, onMenu }) {
  return (
    <header className={`sticky top-0 z-30 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="flex h-16 items-center gap-3 border-b border-forest-200 dark:border-forest-800 bg-white/80 dark:bg-forest-950/80 px-4 sm:px-6 backdrop-blur">
        <button onClick={onMenu} aria-label="Open menu" className="rounded-lg p-2 hover:bg-forest-100 dark:hover:bg-forest-800 lg:hidden">
          <Icon name="menu" />
        </button>

        <div role="group" aria-label="Portal" className="inline-flex rounded-full bg-forest-100 dark:bg-forest-900 p-1 text-sm font-medium">
          {[['citizen', 'Citizen'], ['municipal', 'Municipal']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => onRole(id)}
              className={`rounded-full px-4 py-1.5 transition ${role === id ? 'bg-forest-600 text-white shadow' : 'text-forest-700 dark:text-forest-200 hover:text-forest-900 dark:hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="ml-auto rounded-full p-2.5 hover:bg-forest-100 dark:hover:bg-forest-800 transition"
        >
          <Icon name={dark ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
}
