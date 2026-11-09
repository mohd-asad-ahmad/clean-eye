import { useEffect, useRef, useState } from 'react';

// Slides content into view when it scrolls onscreen.
// from="up" rises from below, from="down" drops from above.
export default function Reveal({ children, from = 'up', delay = 0, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const offset = from === 'up' ? 'translate-y-12' : '-translate-y-12';
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : `opacity-0 ${offset}`} ${className}`}
    >
      {children}
    </div>
  );
}
