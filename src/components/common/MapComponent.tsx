import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon paths for web bundlers safely
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (e) {
    console.warn('Leaflet icon config notice:', e);
  }
}

export interface ChallengeMapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  lat: number;
  lng?: number;
  lon?: number;
  priorityScore?: number;
  priority_score?: number;
  isEmergency?: boolean;
  is_emergency?: boolean;
  severityLevel?: string;
  severity_level?: string;
  status?: string;
  upvotes?: number;
}

export interface MapComponentProps {
  mode?: 'viewer' | 'picker' | 'heatmap';
  challenges?: ChallengeMapItem[];
  selectedPosition?: { lat: number; lng: number };
  onPositionPick?: (coords: { lat: number; lng: number }) => void;
  height?: string;
  show5kmRadius?: boolean;
  activeDistrict?: string;
}

// Custom SVG Icons with Pulse Rings for Critical Emergencies
const createCustomIcon = (isEmergency: boolean, isSelected: boolean) => {
  const color = isEmergency ? '#EF4444' : isSelected ? '#10B981' : '#0F172A';
  const pulseHtml = isEmergency
    ? `<div class="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></div>`
    : '';

  const svg = `
    <div class="relative flex items-center justify-center">
      ${pulseHtml}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="30" height="30" class="drop-shadow-md">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

function LocationPickerMarker({
  position,
  onPositionChange,
  showRadius
}: {
  position: { lat: number; lng: number };
  onPositionChange: (lat: number, lng: number) => void;
  showRadius?: boolean;
}) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <>
      <Marker position={[position.lat, position.lng]} icon={createCustomIcon(false, true)}>
        <Popup>
          <div className="text-xs font-semibold text-slate-900">
            <span className="text-emerald-700 font-bold">📍 Incident GPS Anchor</span><br />
            Lat: {position.lat.toFixed(4)}, Lon: {position.lng.toFixed(4)}
          </div>
        </Popup>
      </Marker>
      {showRadius && (
        <Circle
          center={[position.lat, position.lng]}
          radius={5000} // 5km Haversine Deduplication Radius
          pathOptions={{
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.15,
            dashArray: '4, 8'
          }}
        />
      )}
    </>
  ) : null;
}

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 9, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  mode = 'viewer',
  challenges = [],
  selectedPosition = { lat: 23.3441, lng: 85.3096 }, // Ranchi Center
  onPositionPick = () => {},
  height = '400px',
  show5kmRadius = true,
  activeDistrict
}) => {
  const [centerPosition, setCenterPosition] = useState<[number, number]>([
    selectedPosition.lat,
    selectedPosition.lng
  ]);

  useEffect(() => {
    setCenterPosition([selectedPosition.lat, selectedPosition.lng]);
  }, [selectedPosition.lat, selectedPosition.lng]);

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 relative z-10 bg-slate-100">
      <MapContainer
        center={centerPosition}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &bull; Govt of Jharkhand GIS'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={centerPosition} />

        {mode === 'picker' && (
          <LocationPickerMarker
            position={selectedPosition}
            showRadius={show5kmRadius}
            onPositionChange={(lat, lng) => onPositionPick({ lat, lng })}
          />
        )}

        {(mode === 'viewer' || mode === 'heatmap') && challenges.map((item) => {
          const lat = item.lat;
          const lon = item.lng ?? item.lon ?? 85.3096;
          const isEmergency = Boolean(item.isEmergency ?? item.is_emergency ?? (item.priorityScore && item.priorityScore > 85));
          const score = item.priorityScore ?? item.priority_score ?? 50;

          return (
            <React.Fragment key={item.id}>
              <Marker
                position={[lat, lon]}
                icon={createCustomIcon(isEmergency, false)}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-slate-800 font-sans">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      {isEmergency ? (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                          Critical Hazard ({score})
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Score: {score}
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs leading-snug text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{item.description}</p>
                    <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <span>District: <strong className="text-slate-700">{item.district}</strong></span>
                      {item.upvotes !== undefined && <span>👍 {item.upvotes} upvotes</span>}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* 5km Radius Circle overlay for emergencies */}
              {isEmergency && show5kmRadius && (
                <Circle
                  center={[lat, lon]}
                  radius={5000}
                  pathOptions={{
                    color: '#EF4444',
                    fillColor: '#EF4444',
                    fillOpacity: 0.12,
                    weight: 1.5,
                    dashArray: '3, 6'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend (Linear.app aesthetic) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 text-[11px] font-medium text-slate-700 space-y-1.5 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></span>
          <span>Critical Hazard (Score &gt; 85)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
          <span>Selected / Standard Issue</span>
        </div>
        {show5kmRadius && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="w-2.5 h-0.5 bg-emerald-600 border-dashed"></span>
            <span>5km Geo-Dedup Radius</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
