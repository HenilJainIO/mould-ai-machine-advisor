import React from 'react';
import ConfigurationScreen from './ConfigurationScreen';
import MainDashboard from './MainDashboard';
import useConfiguration from '../hooks/useConfiguration';
import LoadingAnimation from './LoadingAnimation';

const AIRecommendationDashboard = () => {
  const { 
    configuration, 
    hasConfiguration, 
    saveConfiguration, 
    clearConfiguration, 
    isLoading 
  } = useConfiguration();

  const handleConfigurationComplete = (data) => {
    try {
      saveConfiguration(data);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      // You could show a toast notification here
    }
  };

  const handleEditConfiguration = () => {
    clearConfiguration();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      {!hasConfiguration ? (
        <ConfigurationScreen onConfigurationComplete={handleConfigurationComplete} />
      ) : (
        <MainDashboard 
          configData={configuration} 
          onEditConfiguration={handleEditConfiguration}
          onSaveConfiguration={saveConfiguration}
        />
      )}
    </div>
  );
};

export default AIRecommendationDashboard;
