import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DayGuide } from '../data';
import { MapPin, BookOpen, HandHeart } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  id: string;
  name: string;
  coord: [number, number];
  dataRef?: DayGuide;
}

interface HajjMapProps {
  locations: Location[];
}

export const HajjMap: React.FC<HajjMapProps> = ({ locations }) => {
  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10 z-10 relative">
      <MapContainer 
        center={[21.3891, 39.8579]} 
        zoom={12} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coord} icon={customIcon}>
            <Popup className="hajj-popup max-w-sm">
              <div className="p-1 max-h-[400px] overflow-y-auto">
                <h3 className="text-lg font-serif font-bold text-[#c9a227] mb-2">{loc.name}</h3>
                {loc.dataRef ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">{loc.dataRef.intro}</p>
                    
                    {loc.dataRef.actions && loc.dataRef.actions.length > 0 && (
                      <div>
                        <h4 className="font-bold flex items-center gap-1 text-sm border-b pb-1 mb-2">
                          <MapPin className="w-3 h-3" /> Actions
                        </h4>
                        <ul className="space-y-2 text-xs text-gray-600">
                          {loc.dataRef.actions.slice(0, 3).map((act, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="font-bold text-[#c9a227] whitespace-nowrap">[{act.type}]</span>
                              <span>{act.description}</span>
                            </li>
                          ))}
                          {loc.dataRef.actions.length > 3 && (
                            <li className="text-[#c9a227] text-center pt-1 border-t border-black/5">+ {loc.dataRef.actions.length - 3} more actions (see below)</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {loc.dataRef.prayers && loc.dataRef.prayers.length > 0 && (
                      <div>
                        <h4 className="font-bold flex items-center gap-1 text-sm border-b pb-1 mb-2">
                          <BookOpen className="w-3 h-3" /> Key Prayers
                        </h4>
                        <div className="space-y-3">
                          {loc.dataRef.prayers.slice(0, 2).map((prayer, i) => (
                            <div key={i} className="bg-slate-50 p-2 rounded border border-black/5">
                              <div className="text-xs font-bold text-[#c9a227] mb-1">{prayer.scenario}</div>
                              <div className="text-right font-serif text-sm mb-1" dir="rtl">{prayer.arabic}</div>
                              <div className="text-[10px] text-gray-500 leading-relaxed">{prayer.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Information for this location is available in the guide below.</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
