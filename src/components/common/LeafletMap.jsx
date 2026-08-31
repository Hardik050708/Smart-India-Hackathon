import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon paths for web bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Emergency Red & Normal Blue SVG Icons
const createCustomIcon = (isEmergency, isSelected) => {
  const color = isEmergency ? '#ef4444' : isSelected ? '#ff9f1c' : '#0f5257';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function LocationPickerMarker({ position, onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={createCustomIcon(false, true)}>
      <Popup>
        <div className="text-xs font-semibold">
          Selected Pin Location<br/>
          Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10);
    }
  }, [center, map]);
  return null;
}

export const LeafletMap = ({
  mode = 'viewer', // 'viewer' | 'picker'
  challenges = [],
  selectedPosition = { lat: 23.3441, lng: 85.3096 }, // Ranchi default
  onPositionPick = () => {},
  height = '350px'
}) => {
  const [centerPosition, setCenterPosition] = useState([selectedPosition.lat, selectedPosition.lng]);

  useEffect(() => {
    setCenterPosition([selectedPosition.lat, selectedPosition.lng]);
  }, [selectedPosition.lat, selectedPosition.lng]);

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 relative z-10">
      <MapContainer
        center={centerPosition}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={centerPosition} />

        {mode === 'picker' && (
          <LocationPickerMarker
            position={selectedPosition}
            onPositionChange={(lat, lng) => onPositionPick({ lat, lng })}
          />
        )}

        {mode === 'viewer' && challenges.map(item => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createCustomIcon(item.isEmergency, false)}
          >
            <Popup>
              <div className="p-1 max-w-xs text-slate-800">
                <div className="flex items-center space-x-1.5 mb-1">
                  {item.isEmergency && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      EMERGENCY ({item.priorityScore})
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs leading-snug text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  District: <strong className="text-slate-700">{item.district}</strong> • Upvotes: {item.upvotes}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
