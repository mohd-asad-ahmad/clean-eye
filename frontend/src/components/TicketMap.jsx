import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import SeverityBadge from './SeverityBadge';
import { severityLevel, formatDate } from '../lib/severity';
import { btnPrimary } from '../lib/ui';

const pinIcon = (t) => L.divIcon({
  className: '',
  html: `<span class="pin ${t.status === 'RESOLVED' ? 'pin--done' : 'pin--' + severityLevel(t.severity_score)}"></span>`,
  iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -12],
});

// Keeps the map sized correctly when the layout around it changes
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);
  return null;
}

// Flies to the selected report and opens its popup
function Focus({ selected, markers }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.latitude, selected.longitude], 16, { duration: 0.8 });
    const id = setTimeout(() => markers.current[selected.id]?.openPopup(), 900);
    return () => clearTimeout(id);
  }, [selected, map, markers]);
  return null;
}

export default function TicketMap({ tickets, selected, onSelect, onResolve }) {
  const markers = useRef({});
  return (
    <MapContainer center={[26.8467, 80.9462]} zoom={13} className="h-full w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <ResizeFix />
      <Focus selected={selected} markers={markers} />
      {tickets.map((t) => (
        <Marker key={t.id} position={[t.latitude, t.longitude]} icon={pinIcon(t)}
          ref={(m) => { if (m) markers.current[t.id] = m; }}
          eventHandlers={{ click: () => onSelect(t) }}>
          <Popup>
            <div className="grid w-56 gap-1.5 text-sm">
              <img src={t.image_url} alt="Reported waste" className="h-28 w-full rounded-lg object-cover" />
              <h3 className="text-base font-bold">{t.waste_category}</h3>
              <SeverityBadge score={t.severity_score} />
              <p>{t.estimated_volume}, {t.assigned_department}</p>
              {t.user_message && <p className="italic">“{t.user_message}”</p>}
              <p className="text-xs opacity-70">Reported {formatDate(t.created_at)}</p>
              {t.status === 'OPEN'
                ? <button className={`${btnPrimary} !px-3 !py-2 text-sm`} onClick={() => onResolve(t.id)}>Mark as cleaned</button>
                : <p className="font-semibold text-forest-600">Cleaned up</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
