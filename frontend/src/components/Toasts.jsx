export default function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[2000] grid gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`animate-slide-up max-w-sm rounded-xl border-l-4 bg-forest-900 px-4 py-3 text-sm text-white shadow-lg ${t.type === 'error' ? 'border-red-400' : 'border-forest-300'}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
