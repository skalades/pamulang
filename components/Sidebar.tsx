
import React from 'react';
import { ControlPoint, LandParcel } from '../types';

interface SidebarProps {
  selectedFeature: ControlPoint | LandParcel | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedFeature, onClose }) => {
  if (!selectedFeature) {
    return null;
  }

  const isControlPoint = 'easting' in selectedFeature;

  return (
    <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out"
         style={{ transform: selectedFeature ? 'translateX(0)' : 'translateX(100%)' }}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isControlPoint ? `Detail Patok ${selectedFeature.name}` : `Detail Persil Lahan`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {isControlPoint ? (
            <ControlPointDetails point={selectedFeature as ControlPoint} />
          ) : (
            <LandParcelDetails parcel={selectedFeature as LandParcel} />
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
    <dt className="text-sm font-medium text-gray-500 col-span-1">{label}</dt>
    <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
  </div>
);

const ControlPointDetails: React.FC<{ point: ControlPoint }> = ({ point }) => (
  <dl>
    <DetailRow label="Nama" value={point.name} />
    <DetailRow label="Deskripsi" value={point.description} />
    <DetailRow label="Easting (UTM)" value={point.easting.toFixed(3)} />
    <DetailRow label="Northing (UTM)" value={point.northing.toFixed(3)} />
    <DetailRow label="Elevasi" value={`${point.elevation.toFixed(3)} m`} />
    <DetailRow label="Latitude" value={point.lat.toFixed(6)} />
    <DetailRow label="Longitude" value={point.lng.toFixed(6)} />
  </dl>
);

const LandParcelDetails: React.FC<{ parcel: LandParcel }> = ({ parcel }) => (
  <dl>
    <DetailRow label="Pemilik" value={parcel.namaPemilik} />
    <DetailRow label="NIB" value={parcel.nib || 'N/A'} />
    <DetailRow label="Luas" value={`${parcel.luas} m²`} />
    <DetailRow label="Tipe Hak" value={parcel.tipeHak} />
    <DetailRow label="Penggunaan" value={parcel.penggunaan} />
    <DetailRow label="Kecamatan" value={parcel.kecamatan} />
    <DetailRow label="Desa/Kel" value={parcel.desaKel} />
    <DetailRow label="Patok Terkait" value={parcel.patokIds.join(', ') || 'N/A'} />
    <DetailRow label="Bukti" value={parcel.buktiKepemilikan ? 'Ada' : 'Tidak Ada'} />
  </dl>
);

export default Sidebar;
