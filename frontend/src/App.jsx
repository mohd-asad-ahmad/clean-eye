import { useCallback, useState } from 'react';
import Header from './components/Header';
import Toasts from './components/Toasts';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [tab, setTab] = useState('report');
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <>
      <Header tab={tab} onChange={setTab} />
      {tab === 'report' ? <ReportPage notify={notify} /> : <DashboardPage notify={notify} />}
      <Toasts toasts={toasts} />
    </>
  );
}
