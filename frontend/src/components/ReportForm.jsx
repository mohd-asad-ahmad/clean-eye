import { useEffect, useRef, useState } from 'react';
import { submitReport, errorMessage } from '../api/client';

const DEFAULT_POS = { lat: '26.8467', lng: '80.9462' }; // Lucknow

export default function ReportForm({ onResult, notify }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [pos, setPos] = useState(DEFAULT_POS);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!image) { setPreview(''); return; }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const pick = (file) => {
    if (file && file.type.startsWith('image/')) setImage(file);
    else if (file) notify('Choose an image file (JPG, PNG or WebP).', 'error');
  };

  const locate = () => {
    if (!navigator.geolocation) return notify('This browser cannot share your location.', 'error');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude.toFixed(6), lng: p.coords.longitude.toFixed(6) });
        setLocating(false);
      },
      () => {
        setLocating(false);
        notify('Location blocked. Enter coordinates manually.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!image) return notify('Add a photo of the waste first.', 'error');
    if (isNaN(parseFloat(pos.lat)) || isNaN(parseFloat(pos.lng))) return notify('Enter valid coordinates.', 'error');

    const fd = new FormData();
    fd.append('image', image);
    fd.append('latitude', pos.lat);
    fd.append('longitude', pos.lng);
    fd.append('user_message', message);

    setLoading(true);
    try {
      onResult(await submitReport(fd));
      notify('Report submitted and analysed.', 'success');
      setImage(null);
      setMessage('');
    } catch (err) {
      notify(errorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Report waste</h2>
      <p className="muted">Photograph the pile, confirm where it is, and Clean Eye does the rest.</p>

      <div
        className={`drop ${drag ? 'drop--over' : ''} ${preview ? 'drop--filled' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
        role="button" tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
        aria-label="Choose a photo"
      >
        {preview ? (
          <img src={preview} alt="Selected waste" />
        ) : (
          <span><strong>Drop a photo here</strong><br />or click to browse</span>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files[0])} />
      </div>
      {preview && <button type="button" className="link" onClick={() => setImage(null)}>Remove photo</button>}

      <fieldset>
        <legend>Location</legend>
        <div className="row">
          <label>Latitude
            <input value={pos.lat} onChange={(e) => setPos({ ...pos, lat: e.target.value })} inputMode="decimal" />
          </label>
          <label>Longitude
            <input value={pos.lng} onChange={(e) => setPos({ ...pos, lng: e.target.value })} inputMode="decimal" />
          </label>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={locate} disabled={locating}>
          {locating ? 'Finding you…' : 'Use my location'}
        </button>
      </fieldset>

      <label>Note for the sanitation team (optional)
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Overflowing bins near the main gate" />
      </label>

      <button className="btn btn--primary" disabled={loading}>
        {loading ? 'Analysing photo…' : 'Submit report'}
      </button>
    </form>
  );
}
