
import React, { useState } from 'react';
import ConfigurationScreen from './ConfigurationScreen';
import MainDashboard from './MainDashboard';

const AIRecommendationDashboard = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [configData, setConfigData] = useState(null);

  const handleConfigurationComplete = (data) => {
    setConfigData(data);
    setIsConfigured(true);
  };

  const handleEditConfiguration = () => {
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isConfigured ? (
        <ConfigurationScreen onConfigurationComplete={handleConfigurationComplete} />
      ) : (
        <MainDashboard 
          configData={configData} 
          onEditConfiguration={handleEditConfiguration}
        />
      )}
    </div>
  );
};

export default AIRecommendationDashboard;
