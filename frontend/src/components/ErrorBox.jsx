import { card, btnPrimary } from '../lib/ui';

export default function ErrorBox({ message, onRetry }) {
  return (
    <div className={`${card} flex flex-wrap items-center justify-between gap-4 border-l-4 !border-l-red-500 p-5`}>
      <p>{message}</p>
      <button className={btnPrimary} onClick={onRetry}>Try again</button>
    </div>
  );
}
