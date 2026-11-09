import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Icon from './Icon';

const DEFAULT_CENTER = [26.8467, 80.9462]; // Lucknow

const pin = L.divIcon({
  className: '',
  html: '<span class="pin pin--done" style="width:28px;height:28px"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickToPlace({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 17, { duration: 0.8 });
  }, [target, map]);
  return null;
}

// value: { lat, lng } or null. onChange receives the same shape.
export default function LocationPicker({ value, onChange, notify }) {
  const [mode, setMode] = useState(null); // 'gps' | 'map' | null
  const [locating, setLocating] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);

  const place = (lat, lng) => onChange({ lat: +lat.toFixed(6), lng: +lng.toFixed(6) });

  const chooseMap = () => { setMode('map'); setAccuracy(null); };

  const useMyLocation = () => {
    setMode('gps');
    if (!navigator.geolocation) {
      notify('This browser cannot share your location. Pick the spot on the map instead.', 'error');
      return chooseMap();
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude, longitude, accuracy: acc } = p.coords;
        place(latitude, longitude);
        setAccuracy(Math.round(acc));
        setFlyTarget({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        notify(
          err.code === 1
            ? 'Location permission is blocked. Allow it in your browser, or pick the spot on the map.'
            : 'Could not get your location. Pick the spot on the map instead.',
          'error'
        );
        chooseMap();
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const option = (active) =>
    `flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition ${
      active
        ? 'border-forest-500 bg-forest-100 dark:bg-forest-800'
        : 'border-forest-200 dark:border-forest-700 hover:border-forest-400'
    }`;

  return (
    <fieldset className="space-y-3 rounded-xl border border-forest-200 dark:border-forest-800 p-4">
      <legend className="px-2 text-sm font-semibold">Where is the waste?</legend>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={useMyLocation} disabled={locating} className={option(mode === 'gps')}>
          <Icon name="map" className="h-5 w-5 text-forest-600 dark:text-forest-300" />
          <span className="text-sm font-semibold">{locating ? 'Finding you…' : 'Use my location'}</span>
          <span className="text-xs text-forest-600 dark:text-forest-300">Detect it automatically</span>
        </button>
        <button type="button" onClick={chooseMap} className={option(mode === 'map')}>
          <Icon name="camera" className="h-5 w-5 text-forest-600 dark:text-forest-300" />
          <span className="text-sm font-semibold">Choose on map</span>
          <span className="text-xs text-forest-600 dark:text-forest-300">Tap the exact spot</span>
        </button>
      </div>

      {mode && (
        <>
          <div className="relative isolate z-0 h-64 overflow-hidden rounded-xl border border-forest-200 dark:border-forest-700">
            <MapContainer
              center={value ? [value.lat, value.lng] : DEFAULT_CENTER}
              zoom={value ? 17 : 13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <ClickToPlace onPick={(lat, lng) => { place(lat, lng); setAccuracy(null); }} />
              <FlyTo target={flyTarget} />
              {value && (
                <Marker
                  position={[value.lat, value.lng]}
                  icon={pin}
                  draggable
                  eventHandlers={{
                    dragend: (e) => { const ll = e.target.getLatLng(); place(ll.lat, ll.lng); setAccuracy(null); },
                  }}
                />
              )}
            </MapContainer>
          </div>
          <p className="text-xs text-forest-600 dark:text-forest-300">
            {mode === 'gps' ? 'Pin placed from your device. ' : ''}Tap the map to drop the pin, or drag it to fine-tune.
          </p>
        </>
      )}

      <p className={`text-sm ${value ? 'font-semibold text-forest-700 dark:text-forest-200' : 'text-forest-600 dark:text-forest-300'}`}>
        {value
          ? `Selected: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}${accuracy ? ` (accurate to about ${accuracy} m)` : ''}`
          : 'No location selected yet.'}
      </p>
    </fieldset>
  );
}
