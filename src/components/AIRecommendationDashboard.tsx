
import React, { useState, useEffect } from 'react';
import ConfigurationScreen from './ConfigurationScreen';
import MainDashboard from './MainDashboard';

const AIRecommendationDashboard = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [configData, setConfigData] = useState(null);

  // Check if configuration exists in localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('aiModuleConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfigData(parsedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleConfigurationComplete = (data) => {
    // Save configuration to localStorage
    localStorage.setItem('aiModuleConfig', JSON.stringify(data));
    setConfigData(data);
    setIsConfigured(true);
  };

  const handleEditConfiguration = () => {
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
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
