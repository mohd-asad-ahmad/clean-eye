import { useState } from 'react';
import ReportForm from '../components/ReportForm';
import AnalysisResult from '../components/AnalysisResult';
import Reveal from '../components/Reveal';
import { card } from '../lib/ui';

export default function CitizenReport({ notify, onSubmitted }) {
  const [result, setResult] = useState(null);
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,560px)_1fr]">
      <Reveal from="down"><ReportForm onResult={setResult} onDone={onSubmitted} notify={notify} /></Reveal>
      <Reveal delay={150}>
        {result ? <AnalysisResult result={result} /> : (
          <aside className={`${card} p-6 sm:p-8`}>
            <h2 className="text-2xl font-bold">What happens next</h2>
            <p className="mt-2 text-forest-700 dark:text-forest-200">Your photo is analysed for waste type, severity and volume, then routed to the right department. It shows on the command map as an open spot until a municipal officer marks it cleaned.</p>
          </aside>
        )}
      </Reveal>
    </div>
  );
}
