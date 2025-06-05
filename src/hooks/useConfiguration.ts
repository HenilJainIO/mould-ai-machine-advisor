import { useState, useEffect } from 'react';
import { iosenseService, AppConfiguration } from '../services/iosenseService';

interface UseConfigurationResult {
  configuration: AppConfiguration | null;
  hasConfiguration: boolean;
  saveConfiguration: (config: AppConfiguration) => void;
  clearConfiguration: () => void;
  isLoading: boolean;
}

export const useConfiguration = (): UseConfigurationResult => {
  const [configuration, setConfiguration] = useState<AppConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load configuration on component mount
    try {
      const loadedConfig = iosenseService.loadConfiguration();
      setConfiguration(loadedConfig);
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveConfiguration = (config: AppConfiguration) => {
    try {
      iosenseService.saveConfiguration(config);
      setConfiguration(config);
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  };

  const clearConfiguration = () => {
    try {
      iosenseService.clearConfiguration();
      setConfiguration(null);
    } catch (error) {
      console.error('Error clearing configuration:', error);
      throw error;
    }
  };

  return {
    configuration,
    hasConfiguration: configuration !== null,
    saveConfiguration,
    clearConfiguration,
    isLoading,
  };
};

export default useConfiguration; 