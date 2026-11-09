import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Toasts from './components/Toasts';
import CitizenHome from './pages/CitizenHome';
import CitizenReport from './pages/CitizenReport';
import MuniOverview from './pages/MuniOverview';
import MuniMap from './pages/MuniMap';
import MuniReports from './pages/MuniReports';
import useTickets from './hooks/useTickets';
import useTheme from './hooks/useTheme';
import useScrollHide from './hooks/useScrollHide';
import { errorMessage } from './api/client';

const NAV = {
  citizen: [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'report', label: 'Report waste', icon: 'camera' }],
  municipal: [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'map', label: 'Command map', icon: 'map' },
    { id: 'reports', label: 'All reports', icon: 'list' },
  ],
};

export default function App() {
  const [role, setRole] = useState('citizen');
  const [view, setView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [dark, toggleDark] = useTheme();
  const navHidden = useScrollHide();
  const data = useTickets();

  const notify = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const go = (v, r = role) => {
    setRole(r); setView(v); setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const switchRole = (r) => go(NAV[r][0].id, r);
  const focusOnMap = (t) => { setSelected(t); go('map', 'municipal'); };

  const resolve = async (id) => {
    try { await data.resolve(id); notify('Marked as cleaned.'); }
    catch (e) { notify(errorMessage(e), 'error'); }
  };

  const page = {
    'citizen/home': <CitizenHome tickets={data.tickets} go={go} />,
    'citizen/report': <CitizenReport notify={notify} onSubmitted={data.refresh} />,
    'municipal/overview': <MuniOverview data={data} onFocus={focusOnMap} />,
    'municipal/map': <MuniMap data={data} selected={selected} onSelect={setSelected} onResolve={resolve} />,
    'municipal/reports': <MuniReports data={data} onFocus={focusOnMap} onResolve={resolve} />,
  }[`${role}/${view}`];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={NAV[role]} view={view} onView={go} role={role} open={menuOpen}
        onClose={() => setMenuOpen(false)} collapsed={collapsed} onCollapse={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar hidden={navHidden} role={role} onRole={switchRole} dark={dark} onToggleDark={toggleDark} onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          <div key={`${role}/${view}`} className="animate-slide-up">{page}</div>
        </main>
        <Footer />
      </div>
      <Toasts toasts={toasts} />
    </div>
  );
}
