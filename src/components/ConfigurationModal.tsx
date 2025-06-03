
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, CheckCircle, X, ArrowLeft } from 'lucide-react';

const ConfigurationModal = ({ currentConfig, onClose, onSave }) => {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Edit Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                  <SelectItem value="planning-001">Planning Device 001</SelectItem>
                  <SelectItem value="planning-002">Planning Device 002</SelectItem>
                  <SelectItem value="planning-003">Planning Device 003</SelectItem>
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
                  <SelectItem value="master-001">Master Data Device 001</SelectItem>
                  <SelectItem value="master-002">Master Data Device 002</SelectItem>
                  <SelectItem value="master-003">Master Data Device 003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sensor ID */}
            <div className="space-y-2">
              <Label htmlFor="sensorId" className="text-sm font-medium text-gray-700">
                Sensor ID (Module Listing)
              </Label>
              <Select 
                value={formData.sensorId} 
                onValueChange={(value) => setFormData({...formData, sensorId: value})}
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select sensor for module data..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="sensor-mould-01">Module Sensor 01</SelectItem>
                  <SelectItem value="sensor-mould-02">Module Sensor 02</SelectItem>
                  <SelectItem value="sensor-mould-03">Module Sensor 03</SelectItem>
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
                  <SelectItem value="injection-molding">Injection Molding Machines</SelectItem>
                  <SelectItem value="cnc-machines">CNC Machines</SelectItem>
                  <SelectItem value="assembly-lines">Assembly Lines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Main
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
