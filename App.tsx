import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import AreaHistoryChart from './components/AreaHistoryChart';
import { controlPointsData, landParcelsData, areaHistoryData } from './constants/data';
import { ControlPoint, LandParcel } from './types';

function App() {
  const [selectedFeature, setSelectedFeature] = useState<ControlPoint | LandParcel | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFeatureSelect = (feature: ControlPoint | LandParcel) => {
    setSelectedFeature(feature);
  };

  const handleSidebarClose = () => {
    setSelectedFeature(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex flex-col h-screen antialiased">
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="flex-grow grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 gap-4 p-4">
        {/* Main content area: Map */}
        <div className="lg:col-span-2 relative flex flex-col min-h-0">
          <div className="relative flex-grow rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
             <MapComponent 
                controlPoints={controlPointsData}
                landParcels={landParcelsData}
                selectedFeature={selectedFeature}
                onFeatureSelect={handleFeatureSelect}
             />
             <Sidebar selectedFeature={selectedFeature} onClose={handleSidebarClose} />
          </div>
        </div>
        
        {/* Right column with Chart */}
        <div className="lg:col-span-1 min-h-0">
           <AreaHistoryChart data={areaHistoryData} />
        </div>
      </main>
    </div>
  );
}

export default App;