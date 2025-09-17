import React from 'react';
import { ControlPoint, LandParcel } from '../types';

interface SidebarProps {
  selectedFeature: ControlPoint | LandParcel | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedFeature, onClose }) => {
  // The sidebar is only visible if a feature is selected AND it's a Land Parcel (not a Control Point).
  const isVisible = !!selectedFeature && !('easting' in selectedFeature);
  const isControlPoint = selectedFeature && 'easting' in selectedFeature;
  const featureToShow = isControlPoint ? null : selectedFeature as LandParcel;


  return (
    <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-96 backdrop-blur-sm bg-surface/80 dark:bg-dark-surface/80 shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 h-full flex flex-col">
        {featureToShow && (
          <>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3 mb-4">
              <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">
                Detail Persil Lahan
              </h2>
              <button onClick={onClose} className="text-on-surface-muted dark:text-dark-on-surface-muted hover:text-on-surface dark:hover:text-dark-on-surface">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-grow pr-2">
              <LandParcelDetails parcel={featureToShow} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700/50">
    <dt className="text-sm font-medium text-on-surface-muted dark:text-dark-on-surface-muted">{label}</dt>
    <dd className="text-sm text-on-surface dark:text-dark-on-surface text-right font-medium">{value}</dd>
  </div>
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
    <DetailRow label="Bukti" value={
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parcel.buktiKepemilikan ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {parcel.buktiKepemilikan ? 'Ada' : 'Tidak Ada'}
        </span>
    } />
  </dl>
);

export default Sidebar;