import Reveal from './Reveal';

export default function Footer() {
  return (
    <Reveal from="up" className="mt-16">
      <footer className="border-t border-forest-200 dark:border-forest-800 bg-forest-900 text-forest-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-white">Clean Eye</p>
            <p className="mt-2 text-sm text-forest-300">Photo-based waste reporting that helps municipal teams find and clear problem spots faster.</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Built with</p>
            <ul className="mt-2 space-y-1 text-forest-300">
              <li>Google Gemini for image analysis</li>
              <li>Supabase PostgreSQL with PostGIS</li>
              <li>OpenStreetMap and Leaflet</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Status colors</p>
            <ul className="mt-2 space-y-1.5 text-forest-300">
              <li className="flex items-center gap-2"><i className="pin pin--high !h-3 !w-3 !border-2" /> High severity, open</li>
              <li className="flex items-center gap-2"><i className="pin pin--mid !h-3 !w-3 !border-2" /> Moderate</li>
              <li className="flex items-center gap-2"><i className="pin pin--done !h-3 !w-3 !border-2" /> Cleaned up</li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-forest-400">© {new Date().getFullYear()} Clean Eye</p>
      </footer>
    </Reveal>
  );
}
