import Icon from './Icon';
import Reveal from './Reveal';
import { card } from '../lib/ui';

const STEPS = [
  { icon: 'camera', title: 'Photograph the spot', text: 'Upload a photo and confirm the location. Your phone can fill in the coordinates for you.' },
  { icon: 'spark', title: 'AI reads the scene', text: 'Gemini identifies the waste type, rates severity from 1 to 5 and estimates the volume.' },
  { icon: 'truck', title: 'The right team responds', text: 'The report lands on the command map for the matching department until it is cleaned.' },
];

export default function HowItWorks() {
  return (
    <section className="mt-16">
      <Reveal from="down"><h2 className="text-3xl font-bold">How a report becomes a clean street</h2></Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 150}>
            <div className={`${card} h-full p-6 transition hover:-translate-y-1 hover:shadow-lg`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-200"><Icon name={s.icon} /></span>
                <span className="font-display text-sm text-forest-500">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-forest-700 dark:text-forest-200">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
