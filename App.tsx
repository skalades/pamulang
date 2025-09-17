
import React, { useState } from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import AreaHistoryChart from './components/AreaHistoryChart';
import { controlPointsData, landParcelsData, areaHistoryData } from './constants/data';
import { ControlPoint, LandParcel } from './types';

function App() {
  const [selectedFeature, setSelectedFeature] = useState<ControlPoint | LandParcel | null>(null);

  const handleFeatureSelect = (feature: ControlPoint | LandParcel) => {
    setSelectedFeature(feature);
  };

  const handleSidebarClose = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Main content area */}
        <div className="flex-grow flex flex-col gap-4 w-full lg:w-2/3">
          {/* Map container */}
          <div className="relative flex-grow rounded-lg shadow-lg overflow-hidden">
             <MapComponent 
                controlPoints={controlPointsData}
                landParcels={landParcelsData}
                onFeatureSelect={handleFeatureSelect}
             />
             <Sidebar selectedFeature={selectedFeature} onClose={handleSidebarClose} />
          </div>
        </div>
        
        {/* Chart/Data Visualization area */}
        <div className="w-full lg:w-1/3 h-96 lg:h-auto">
           <AreaHistoryChart data={areaHistoryData} />
        </div>
      </main>
    </div>
  );
}

export default App;
