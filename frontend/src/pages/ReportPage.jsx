import { useState } from 'react';
import ReportForm from '../components/ReportForm';
import AnalysisResult from '../components/AnalysisResult';

export default function ReportPage({ notify }) {
  const [result, setResult] = useState(null);
  return (
    <main className="page page--report">
      <ReportForm onResult={setResult} notify={notify} />
      {result ? (
        <AnalysisResult result={result} />
      ) : (
        <aside className="card hint">
          <h2>What happens next</h2>
          <p>Your photo is analysed for waste type, severity and volume, then routed to the right department. It shows on the command map as an open spot until a municipal officer marks it cleaned.</p>
        </aside>
      )}
    </main>
  );
}
