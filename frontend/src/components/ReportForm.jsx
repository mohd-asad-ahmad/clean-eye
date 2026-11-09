import { useEffect, useRef, useState } from 'react';
import { submitReport, errorMessage } from '../api/client';
import { card, inp, btnPrimary } from '../lib/ui';
import Icon from './Icon';
import LocationPicker from './LocationPicker';

export default function ReportForm({ onResult, onDone, notify }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [pos, setPos] = useState(null); // { lat, lng } chosen in LocationPicker
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!image) { setPreview(''); return; }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const pick = (f) => {
    if (f && f.type.startsWith('image/')) setImage(f);
    else if (f) notify('Choose an image file (JPG, PNG or WebP).', 'error');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!image) return notify('Add a photo of the waste first.', 'error');
    if (!pos) return notify('Choose the waste location: use your location or pick it on the map.', 'error');
    const fd = new FormData();
    fd.append('image', image);
    fd.append('latitude', pos.lat);
    fd.append('longitude', pos.lng);
    fd.append('user_message', message);
    setLoading(true);
    try {
      onResult(await submitReport(fd));
      notify('Report submitted and analysed.');
      setImage(null); setMessage(''); setPos(null);
      onDone?.();
    } catch (err) {
      notify(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const label = 'flex flex-col gap-1.5 text-sm font-semibold';
  return (
    <form onSubmit={submit} className={`${card} space-y-5 p-6 sm:p-8`}>
      <div>
        <h2 className="text-2xl font-bold">Report waste</h2>
        <p className="mt-1 text-sm text-forest-600 dark:text-forest-300">Photograph the pile, confirm where it is, and Clean Eye does the rest.</p>
      </div>

      <div
        role="button" tabIndex={0} aria-label="Choose a photo"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
        className={`grid min-h-[180px] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition ${drag ? 'border-forest-500 bg-forest-100 dark:bg-forest-800' : 'border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-950 hover:border-forest-500'}`}
      >
        {preview ? <img src={preview} alt="Selected waste" className="max-h-72 w-full object-cover" /> : (
          <span className="text-forest-600 dark:text-forest-300"><Icon name="camera" className="mx-auto mb-2 h-8 w-8" /><b>Drop a photo here</b><br />or click to browse</span>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files[0])} />
      </div>
      {preview && <button type="button" onClick={() => setImage(null)} className="text-sm underline text-forest-600 dark:text-forest-300">Remove photo</button>}

      <LocationPicker value={pos} onChange={setPos} notify={notify} />

      <label className={label}>Note for the sanitation team (optional)
        <textarea className={inp} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Overflowing bins near the main gate" />
      </label>

      <button className={`${btnPrimary} w-full`} disabled={loading}>{loading ? 'Analysing photo…' : 'Submit report'}</button>
    </form>
  );
}
