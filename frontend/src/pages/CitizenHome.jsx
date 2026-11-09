import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';

export default function CitizenHome({ tickets, go }) {
  return (
    <>
      <Hero tickets={tickets} onReport={() => go('report')} onMap={() => go('map', 'municipal')} />
      <HowItWorks />
    </>
  );
}
