import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import SeverityBadge from './SeverityBadge';
import { severityLevel, formatDate } from '../lib/severity';

const pinIcon = (t) =>
  L.divIcon({
    className: '',
    html: `<span class="pin ${t.status === 'RESOLVED' ? 'pin--done' : 'pin--' + severityLevel(t.severity_score)}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.latitude, target.longitude], 16, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function TicketMap({ tickets, selected, onSelect, onResolve }) {
  return (
    <MapContainer center={[26.8467, 80.9462]} zoom={13} className="map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FlyTo target={selected} />
      {tickets.map((t) => (
        <Marker
          key={t.id}
          position={[t.latitude, t.longitude]}
          icon={pinIcon(t)}
          eventHandlers={{ click: () => onSelect(t) }}
        >
          <Popup>
            <div className="popup">
              <img src={t.image_url} alt="Reported waste" />
              <h3>{t.waste_category}</h3>
              <SeverityBadge score={t.severity_score} />
              <p>{t.estimated_volume}, {t.assigned_department}</p>
              {t.user_message && <p className="popup__note">“{t.user_message}”</p>}
              <p className="muted">Reported {formatDate(t.created_at)}</p>
              {t.status === 'OPEN' ? (
                <button className="btn btn--primary btn--sm" onClick={() => onResolve(t.id)}>Mark as cleaned</button>
              ) : (
                <p className="done">Cleaned up</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
