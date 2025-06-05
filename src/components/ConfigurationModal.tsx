import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, CheckCircle, X, ArrowLeft, Edit, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useDevices from '../hooks/useDevices';
import { AppConfiguration } from '../services/iosenseService';

interface ConfigurationModalProps {
  currentConfig?: AppConfiguration | null;
  onClose: () => void;
  onSave: (config: AppConfiguration) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ currentConfig, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    planningDeviceId: currentConfig?.planningDeviceId || '',
    masterDataDeviceId: currentConfig?.masterDataDeviceId || '',
    sensorId: currentConfig?.sensorId || '',
    deviceType: currentConfig?.deviceType || '',
    accountId: currentConfig?.accountId || '6710eea3340f9be7ffa61634'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: devices = [], isLoading: devicesLoading, error: devicesError } = useDevices();

  // Update form data when currentConfig changes
  useEffect(() => {
    if (currentConfig) {
      setFormData({
        planningDeviceId: currentConfig.planningDeviceId || '',
        masterDataDeviceId: currentConfig.masterDataDeviceId || '',
        sensorId: currentConfig.sensorId || '',
        deviceType: currentConfig.deviceType || '',
        accountId: currentConfig.accountId || '6710eea3340f9be7ffa61634'
      });
    }
  }, [currentConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave(formData as AppConfiguration);
      setIsSubmitting(false);
      setIsEditing(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error saving configuration:', error);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  const getSelectDisplayValue = (value: string, options: { value: string; label: string }[]) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : 'Not selected';
  };

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Edit Configuration' : 'Current Configuration'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {devicesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load devices: {devicesError.message}
              </AlertDescription>
            </Alert>
          )}

          {!isEditing ? (
            // Read-only view
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-4">Current Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Planning Device ID</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">
                      {getSelectDisplayValue(formData.planningDeviceId, deviceOptions)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Master Data Device ID</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">
                      {getSelectDisplayValue(formData.masterDataDeviceId, deviceOptions)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sensor ID (Mould Listing)</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">
                      {getSelectDisplayValue(formData.sensorId, sensorOptions)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Machine Device Type</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">
                      {getSelectDisplayValue(formData.deviceType, machineTypeOptions)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Main
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center gap-2"
                  disabled={devicesLoading || !!devicesError}
                >
                  <Edit className="w-4 h-4" />
                  Edit Configuration
                </Button>
              </div>
            </div>
          ) : (
            // Edit form
            <form onSubmit={handleSubmit} className="space-y-6">
              {devicesLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading devices...</span>
                </div>
              )}

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

              {/* Submit buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting || devicesLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
