import Icon from './Icon';

const Leaf = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={`absolute animate-sway fill-white/15 ${className}`} style={style} aria-hidden="true">
    <path d="M12 2C6 6 3 12 5 20c8 0 15-5 15-16-3-1-6-2-8-2z" />
  </svg>
);

export default function Hero({ tickets, onReport, onMap }) {
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const done = tickets.length - open;
  const chips = [[open, 'open spots'], [done, 'cleaned up'], [tickets.length, 'reports logged']];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-600 text-white">
      <Leaf className="top-10 right-[12%] h-24 w-24" />
      <Leaf className="top-32 right-[28%] h-12 w-12" style={{ animationDelay: '-3s' }} />
      <Leaf className="top-6 right-[42%] h-16 w-16 hidden sm:block" style={{ animationDelay: '-5s' }} />

      <div className="relative z-10 px-6 pt-14 pb-44 sm:px-12 sm:pt-20">
        <h1 className="max-w-2xl animate-slide-up text-4xl font-bold leading-tight sm:text-6xl">
          Spot waste early. Clear it before it spreads.
        </h1>
        <p className="mt-5 max-w-xl animate-slide-up text-lg text-forest-100 [animation-delay:150ms]">
          Take a photo and Clean Eye reads the waste type and severity, then shows the right municipal team exactly where to go.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 animate-slide-up [animation-delay:300ms]">
          <button onClick={onReport} className="inline-flex items-center gap-2 rounded-xl bg-sun-400 px-6 py-3 font-semibold text-forest-950 transition hover:bg-sun-500">
            <Icon name="camera" /> Report waste
          </button>
          <button onClick={onMap} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
            <Icon name="map" /> Open the command map
          </button>
        </div>
      </div>

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#27522f" d="M0 120 Q240 40 480 100 T960 90 T1440 110 V200 H0z" />
        <path fill="#122b1d" d="M0 160 Q300 100 620 150 T1440 140 V200 H0z" />
      </svg>

      <div className="absolute bottom-5 left-0 right-0 z-10 grid grid-cols-3 gap-3 px-6 sm:px-12">
        {chips.map(([n, l]) => (
          <div key={l} className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur sm:px-5 sm:py-3">
            <p className="font-display text-2xl font-bold sm:text-3xl">{n}</p>
            <p className="text-xs text-forest-100 sm:text-sm">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
