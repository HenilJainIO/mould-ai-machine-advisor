import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import useDevices from '../hooks/useDevices';
import { AppConfiguration } from '../services/iosenseService';

interface ConfigurationScreenProps {
  onConfigurationComplete: (config: AppConfiguration) => void;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({ onConfigurationComplete }) => {
  const [formData, setFormData] = useState({
    planningDeviceId: '',
    masterDataDeviceId: '',
    sensorId: '',
    deviceType: '',
    accountId: '6710eea3340f9be7ffa61634'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: devices = [], isLoading: devicesLoading, error: devicesError } = useDevices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onConfigurationComplete(formData as AppConfiguration);
    } catch (error) {
      console.error('Configuration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  // Convert devices to options format
  const deviceOptions = devices.map(device => ({
    value: device.value,
    label: device.label
  }));

  // Get sensors from selected master data device for sensor dropdown
  const getSensorOptions = () => {
    const selectedDevice = devices.find(d => d.value === formData.masterDataDeviceId);
    if (!selectedDevice || !selectedDevice.metadata.sensors) {
      return [];
    }
    
    return selectedDevice.metadata.sensors.map(sensor => ({
      value: sensor.sensorId,
      label: sensor.sensorName 
        ? `${sensor.sensorName} (${sensor.sensorId})` 
        : sensor.sensorId
    }));
  };

  const sensorOptions = getSensorOptions();

  // Get unique device types from all fetched devices
  const getMachineTypeOptions = () => {
    const deviceTypes = new Map();
    
    devices.forEach(device => {
      if (device.metadata.devTypeID && device.metadata.devTypeName) {
        deviceTypes.set(device.metadata.devTypeID, {
          value: device.metadata.devTypeID,
          label: `${device.metadata.devTypeName} (${device.metadata.devTypeID})`
        });
      }
    });
    
    // Convert Map to array and sort by label
    return Array.from(deviceTypes.values()).sort((a, b) => a.label.localeCompare(b.label));
  };

  const machineTypeOptions = getMachineTypeOptions();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mould Configuration</h1>
          <p className="text-gray-600">Configure your system to get intelligent machine recommendations</p>
        </div>

        {/* Configuration Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center border-b border-gray-100">
            <CardTitle className="text-xl text-gray-800">System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {devicesError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load devices: {devicesError.message}
                </AlertDescription>
              </Alert>
            )}

            {devicesLoading && (
              <div className="flex items-center justify-center py-8 mb-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading devices from IoSense...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Planning Device ID */}
              <div className="space-y-2">
                <Label htmlFor="planningDeviceId" className="text-sm font-medium text-gray-700">
                  Planning Device ID
                </Label>
                <Select 
                  value={formData.planningDeviceId} 
                  onValueChange={(value) => setFormData({...formData, planningDeviceId: value})}
                  disabled={devicesLoading}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select planning device..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {deviceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Master Data Device ID */}
              <div className="space-y-2">
                <Label htmlFor="masterDataDeviceId" className="text-sm font-medium text-gray-700">
                  Master Data Device ID
                </Label>
                <Select 
                  value={formData.masterDataDeviceId} 
                  onValueChange={(value) => setFormData({...formData, masterDataDeviceId: value, sensorId: ''})}
                  disabled={devicesLoading}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select master data device..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {deviceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sensor ID */}
              <div className="space-y-2">
                <Label htmlFor="sensorId" className="text-sm font-medium text-gray-700">
                  Sensor ID (Mould Listing)
                </Label>
                <Select 
                  value={formData.sensorId} 
                  onValueChange={(value) => setFormData({...formData, sensorId: value})}
                  disabled={devicesLoading || !formData.masterDataDeviceId}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder={
                      formData.masterDataDeviceId 
                        ? "Select sensor for mould data..." 
                        : "Select master data device first..."
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {sensorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Device Type */}
              <div className="space-y-2">
                <Label htmlFor="deviceType" className="text-sm font-medium text-gray-700">
                  Machine Device Type
                </Label>
                <Select 
                  value={formData.deviceType} 
                  onValueChange={(value) => setFormData({...formData, deviceType: value})}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select device type for recommendations..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {machineTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={!isFormValid || isSubmitting || devicesLoading || !!devicesError}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Configuring System...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Complete Configuration
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Step 1 of 1: System Configuration</span>
          </div>
          {devices.length > 0 && (
            <div className="mt-2 text-xs text-green-600">
              ✓ {devices.length} devices loaded from IoSense
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationScreen;
