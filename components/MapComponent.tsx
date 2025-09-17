import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ControlPoint, LandParcel } from '../types';

interface MapComponentProps {
  controlPoints: ControlPoint[];
  landParcels: LandParcel[];
  onFeatureSelect: (feature: ControlPoint | LandParcel) => void;
}

// Defines the correct counter-clockwise order of control points to draw the lake boundary.
const boundaryPointOrder = [
    'CP33', 'CP34', 'CP35', 'CP36', 'CP37', 'CP38', 'CP39', 'CP40', 'CP41', 'CP1', 'CP2', 'CP3', 'CP4', 'CP5',
    'CP6', 'CP7', 'CP8', 'CP9', 'CP10', 'CP63', 'CP62', 'CP61', 'CP60', 'CP59', 'CP58', 'CP57', 'CP56', 'CP55',
    'CP54', 'CP53', 'CP52', 'CP51', 'CP50', 'CP49', 'CP48', 'CP47', 'CP46', 'CP45', 'CP44', 'CP43', 'CP42',
    'CP11', 'CP12', 'CP13', 'CP14', 'CP15', 'CP16', 'CP17', 'CP18', 'CP19', 'CP20', 'CP21', 'CP22', 'CP23',
    'CP24', 'CP25', 'CP26', 'CP27', 'CP28', 'CP29', 'CP30', 'CP31', 'CP32'
];

const MapComponent: React.FC<MapComponentProps> = ({ controlPoints, landParcels, onFeatureSelect }) => {
  const center: LatLngExpression = [-6.333, 106.743]; // Centered on Situ Pamulang
  
  const boundaryPositions: LatLngExpression[] = useMemo(() => {
    // Create a lookup map for efficient access to point data.
    const pointMap = new Map(controlPoints.map(p => [p.name, p]));
    // Map the ordered names to their coordinate data.
    return boundaryPointOrder
        .map(name => pointMap.get(name))
        .filter((p): p is ControlPoint => !!p) // Filter out any undefined points.
        .map(p => [p.lat, p.lng]);
  }, [controlPoints]);
  
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom={true} className="z-10">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Polygon pathOptions={{ color: '#10B981', fillColor: '#10B981' }} positions={boundaryPositions}>
          <Popup>Garis Sempadan Situ Pamulang</Popup>
      </Polygon>

      {controlPoints.map(point => (
        <CircleMarker 
            key={point.id} 
            center={[point.lat, point.lng]} 
            radius={5}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.8 }}
            eventHandlers={{
                click: () => onFeatureSelect(point),
            }}
        >
          <Tooltip>
            <span>{point.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}

      {landParcels.map(parcel => {
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
                 <Popup>
                    <b>Persil: {parcel.namaPemilik}</b><br/>
                    Luas: {parcel.luas} m² <br/>
                    Klik untuk detail.
                 </Popup>
             </Marker>
         )
      })}

    </MapContainer>
  );
};

export default MapComponent;