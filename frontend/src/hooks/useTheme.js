import { useEffect, useState } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ce-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ce-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}
