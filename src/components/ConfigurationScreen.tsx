
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, ArrowRight, CheckCircle } from 'lucide-react';

const ConfigurationScreen = ({ onConfigurationComplete }) => {
  const [formData, setFormData] = useState({
    planningDeviceId: '',
    masterDataDeviceId: '',
    sensorId: '',
    deviceType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConfigurationComplete(formData);
    setIsSubmitting(false);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Module Configuration</h1>
          <p className="text-gray-600">Configure your system to get intelligent machine recommendations</p>
        </div>

        {/* Configuration Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center border-b border-gray-100">
            <CardTitle className="text-xl text-gray-800">System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
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
                    <SelectItem value="sensor-mould-01">Mould Sensor 01</SelectItem>
                    <SelectItem value="sensor-mould-02">Mould Sensor 02</SelectItem>
                    <SelectItem value="sensor-mould-03">Mould Sensor 03</SelectItem>
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={!isFormValid || isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
        </div>
      </div>
    </div>
  );
};

export default ConfigurationScreen;
