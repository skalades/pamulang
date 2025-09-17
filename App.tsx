import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import AreaHistoryChart from './components/AreaHistoryChart';
import ChatComponent from './components/ChatComponent';
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
      <main className="flex-grow flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Main content area */}
        <div className="flex-grow flex flex-col gap-4 w-full lg:w-2/3 relative">
          {/* Map container */}
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
        
        {/* Right column with Chart and Chat */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
           {/* Chart */}
           <div className="lg:max-h-[45%] flex-shrink-0">
             <AreaHistoryChart data={areaHistoryData} />
           </div>
           {/* Chat */}
           <div className="flex-grow min-h-0">
             <ChatComponent />
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;