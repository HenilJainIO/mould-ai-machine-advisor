
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, CheckCircle, X, ArrowLeft, Edit } from 'lucide-react';

const ConfigurationModal = ({ currentConfig, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    planningDeviceId: currentConfig?.planningDeviceId || '',
    masterDataDeviceId: currentConfig?.masterDataDeviceId || '',
    sensorId: currentConfig?.sensorId || '',
    deviceType: currentConfig?.deviceType || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(formData);
    setIsSubmitting(false);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  const getSelectDisplayValue = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : 'Not selected';
  };

  const deviceOptions = [
    { value: 'planning-001', label: 'Planning Device 001' },
    { value: 'planning-002', label: 'Planning Device 002' },
    { value: 'planning-003', label: 'Planning Device 003' }
  ];

  const masterDataOptions = [
    { value: 'master-001', label: 'Master Data Device 001' },
    { value: 'master-002', label: 'Master Data Device 002' },
    { value: 'master-003', label: 'Master Data Device 003' }
  ];

  const sensorOptions = [
    { value: 'sensor-mould-01', label: 'Mould Sensor 01' },
    { value: 'sensor-mould-02', label: 'Mould Sensor 02' },
    { value: 'sensor-mould-03', label: 'Mould Sensor 03' }
  ];

  const machineTypeOptions = [
    { value: 'injection-molding', label: 'Injection Molding Machines' },
    { value: 'cnc-machines', label: 'CNC Machines' },
    { value: 'assembly-lines', label: 'Assembly Lines' }
  ];

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
                      {getSelectDisplayValue(formData.masterDataDeviceId, masterDataOptions)}
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
                >
                  <Edit className="w-4 h-4" />
                  Edit Configuration
                </Button>
              </div>
            </div>
          ) : (
            // Edit form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Planning Device ID */}
              <div className="space-y-2">
                <Label htmlFor="planningDeviceId" className="text-sm font-medium text-gray-700">
                  Planning Device ID
                </Label>
                <Select 
                  value={formData.planningDeviceId} 
                  onValueChange={(value) => setFormData({...formData, planningDeviceId: value})}
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
                  onValueChange={(value) => setFormData({...formData, masterDataDeviceId: value})}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select master data device..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {masterDataOptions.map(option => (
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
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select sensor for mould data..." />
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

              {/* Action Buttons */}
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
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Update Configuration
                    </div>
                  )}
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
