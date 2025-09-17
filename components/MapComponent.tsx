import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, CircleMarker, Tooltip, LayersControl, LayerGroup } from 'react-leaflet';
// FIX: Renamed `Map` from leaflet to `LeafletMap` to avoid conflict with the built-in ES6 `Map`.
import { LatLngExpression, Map as LeafletMap, Control, DomUtil } from 'leaflet';
import { ControlPoint, LandParcel } from '../types';

interface MapComponentProps {
  controlPoints: ControlPoint[];
  landParcels: LandParcel[];
  selectedFeature: ControlPoint | LandParcel | null;
  onFeatureSelect: (feature: ControlPoint | LandParcel) => void;
}

const boundaryPointOrder = [
    'CP33', 'CP34', 'CP35', 'CP36', 'CP37', 'CP38', 'CP39', 'CP40', 'CP41', 'CP1', 'CP2', 'CP3', 'CP4', 'CP5',
    'CP6', 'CP7', 'CP8', 'CP9', 'CP10', 'CP63', 'CP62', 'CP61', 'CP60', 'CP59', 'CP58', 'CP57', 'CP56', 'CP55',
    'CP54', 'CP53', 'CP52', 'CP51', 'CP50', 'CP49', 'CP48', 'CP47', 'CP46', 'CP45', 'CP44', 'CP43', 'CP42',
    'CP11', 'CP12', 'CP13', 'CP14', 'CP15', 'CP16', 'CP17', 'CP18', 'CP19', 'CP20', 'CP21', 'CP22', 'CP23',
    'CP24', 'CP25', 'CP26', 'CP27', 'CP28', 'CP29', 'CP30', 'CP31', 'CP32'
];

// Custom Legend Component
const Legend = ({ map }: { map: LeafletMap | null }) => {
  useEffect(() => {
    if (map) {
      const legend = new Control({ position: 'bottomleft' });

      legend.onAdd = () => {
        const div = DomUtil.create('div', 'info legend bg-surface/80 dark:bg-dark-surface/80 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600');
        div.innerHTML = `
          <h4 class="font-bold text-sm mb-2 text-on-surface dark:text-dark-on-surface">Legenda</h4>
          <div class="flex items-center mb-1">
            <i class="w-4 h-1 mr-2" style="background: #26a69a; border: 2px solid #00796b;"></i><span class="text-xs text-on-surface-muted dark:text-dark-on-surface-muted">Garis Sempadan</span>
          </div>
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 mr-2 rounded-full" style="background: #ef4444; border: 1px solid #dc2626;"></i><span class="text-xs text-on-surface-muted dark:text-dark-on-surface-muted">Patok Kontrol</span>
          </div>
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 mr-2 rounded-full" style="background: #fbbf24; border: 2px solid #f59e0b;"></i><span class="text-xs text-on-surface-muted dark:text-dark-on-surface-muted">Patok Terpilih</span>
          </div>
           <div class="flex items-center">
            <img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" class="w-3 h-5 mr-2" alt="marker icon" />
            <span class="text-xs text-on-surface-muted dark:text-dark-on-surface-muted">Persil Lahan</span>
          </div>
        `;
        return div;
      };

      legend.addTo(map);

      return () => {
        if (map && legend) {
          legend.remove();
        }
      };
    }
  }, [map]);

  return null;
};


const MapComponent: React.FC<MapComponentProps> = ({ controlPoints, landParcels, selectedFeature, onFeatureSelect }) => {
  const mapRef = useRef<LeafletMap>(null);
  const center: LatLngExpression = [-6.333, 106.743];
  
  const boundaryPositions: LatLngExpression[] = useMemo(() => {
    const pointMap = new Map(controlPoints.map(p => [p.name, p]));
    return boundaryPointOrder
        .map(name => pointMap.get(name))
        .filter((p): p is ControlPoint => !!p)
        .map(p => [p.lat, p.lng]);
  }, [controlPoints]);

  useEffect(() => {
    if (mapRef.current && selectedFeature) {
        let lat, lng;
        if ('easting' in selectedFeature) { // Is ControlPoint
            lat = selectedFeature.lat;
            lng = selectedFeature.lng;
        } else { // Is LandParcel
            const relatedPoints = controlPoints.filter(p => selectedFeature.patokIds.includes(p.name.replace('CP0', 'CP')));
            if (relatedPoints.length > 0) {
                lat = relatedPoints.reduce((sum, p) => sum + p.lat, 0) / relatedPoints.length;
                lng = relatedPoints.reduce((sum, p) => sum + p.lng, 0) / relatedPoints.length;
            }
        }
        if(lat && lng) {
            mapRef.current.flyTo([lat, lng], 17);
        }
    }
  }, [selectedFeature, controlPoints]);

  
  return (
    <MapContainer ref={mapRef} center={center} zoom={15} scrollWheelZoom={true} className="z-10">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Polygon pathOptions={{ color: '#00796b', fillColor: '#26a69a', weight: 2 }} positions={boundaryPositions}>
          <Popup>Garis Sempadan Situ Pamulang</Popup>
      </Polygon>

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Control Points">
          <LayerGroup>
            {controlPoints.map(point => {
              const isSelected = selectedFeature?.id === point.id && 'easting' in selectedFeature;
              return (
                  <CircleMarker 
                      key={point.id} 
                      center={[point.lat, point.lng]} 
                      radius={isSelected ? 10 : 5}
                      pathOptions={{ 
                          color: isSelected ? '#f59e0b' : '#dc2626', 
                          fillColor: isSelected ? '#fbbf24' : '#ef4444', 
                          fillOpacity: 1,
                          weight: isSelected ? 3 : 1,
                      }}
                      eventHandlers={{
                          click: () => onFeatureSelect(point),
                      }}
                  >
                    <Tooltip>
                      <span>{point.name}</span>
                    </Tooltip>
                    <Popup>
                      <div className="font-sans text-on-surface dark:text-dark-on-surface min-w-[250px]">
                          <h3 className="font-bold text-base mb-2 border-b pb-1">
                              Detail Patok: {point.name}
                          </h3>
                          <table className="w-full text-sm">
                              <tbody>
                                  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="font-semibold pr-2 py-1">Deskripsi</td><td className="text-right">{point.description}</td></tr>
                                  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="font-semibold pr-2 py-1">Easting</td><td className="text-right">{point.easting.toFixed(3)}</td></tr>
                                  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="font-semibold pr-2 py-1">Northing</td><td className="text-right">{point.northing.toFixed(3)}</td></tr>
                                  <tr><td className="font-semibold pr-2 py-1">Elevasi</td><td className="text-right">{point.elevation.toFixed(3)} m</td></tr>
                              </tbody>
                          </table>
                      </div>
                    </Popup>
                  </CircleMarker>
              );
            })}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Land Parcels">
          <LayerGroup>
            {landParcels.map(parcel => {
              const isSelected = selectedFeature?.id === parcel.id && !('easting' in selectedFeature);
              const relatedPoints = controlPoints.filter(p => parcel.patokIds.includes(p.name.replace('CP0', 'CP')));
              if (relatedPoints.length === 0) return null;

              const avgLat = relatedPoints.reduce((sum, p) => sum + p.lat, 0) / relatedPoints.length;
              const avgLng = relatedPoints.reduce((sum, p) => sum + p.lng, 0) / relatedPoints.length;

              return (
                  <Marker 
                      key={parcel.id} 
                      position={[avgLat, avgLng]}
                      eventHandlers={{
                          click: () => onFeatureSelect(parcel),
                      }}
                  >
                      <div className={isSelected ? 'pulsing-marker' : ''}></div>
                      <Popup>
                          <b>Persil: {parcel.namaPemilik}</b><br/>
                          Luas: {parcel.luas} m² <br/>
                          Klik untuk membuka detail.
                      </Popup>
                  </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <Legend map={mapRef.current} />
    </MapContainer>
  );
};

export default MapComponent;