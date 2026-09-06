import React from 'react';
import { MapPin } from 'lucide-react';
import { MapComponent } from './MapComponent';

/**
 * GIS fallback list: if Leaflet cannot initialise (blocked CDN, unsupported browser,
 * offline demo) the panel degrades to a coordinate roster instead of taking the
 * whole stakeholder view down with it.
 */
const MapFallback = ({ challenges = [], height = '400px' }) => (
  <div
    style={{ height }}
    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col space-y-2"
  >
    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
      Map unavailable &mdash; reported coordinates
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
      {challenges.length === 0 && (
        <p className="text-xs text-slate-500">No geotagged reports in the current selection.</p>
      )}
      {challenges.map(c => (
        <div
          key={c.id}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] flex items-center justify-between gap-3"
        >
          <span className="truncate font-semibold text-slate-800">{c.title}</span>
          <span className="font-mono text-slate-500 shrink-0">
            {Number(c.lat).toFixed(3)}, {Number(c.lng ?? c.lon ?? 0).toFixed(3)}
            {c.priorityScore !== undefined ? ` • ${c.priorityScore}` : ''}
          </span>
        </div>
      ))}
    </div>
  </div>
);

class MapBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('Leaflet map failed to mount, using coordinate fallback:', error);
  }

  render() {
    if (this.state.failed) return <MapFallback {...this.props} />;
    return this.props.children;
  }
}

export const LeafletMap = (props) => (
  <MapBoundary>
    <MapComponent {...props} />
  </MapBoundary>
);

export default LeafletMap;
