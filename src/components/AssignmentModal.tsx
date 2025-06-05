import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Target, CheckCircle, X, Check, Settings, Database } from 'lucide-react';
import { iosenseService } from '../services/iosenseService';

const AssignmentModal = ({ machine, mould, onClose, onAssign, configData }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    targetQty: ''
  });
  const [useDummyDevice, setUseDummyDevice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [tempStartTime, setTempStartTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const processingSteps = [
    "🔄 Updating inventory...",
    "💰 Calculating costs...", 
    "📋 Generating work orders...",
    "⚙️ Configuring machine parameters...",
    "✅ Finalizing assignment..."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.targetQty) return;
    
    setIsSubmitting(true);
    setShowProcessing(true);

    // Processing animation with step cycling
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev + 1) % processingSteps.length);
    }, 400);

    try {
      // Call the createPlanningRow API
      await iosenseService.createPlanningRow({
        machineName: machine.name,
        mouldName: mould,
        targetQuantity: parseInt(formData.targetQty),
        startTime: formData.startTime,
        useDummyDevice: useDummyDevice,
        planningDeviceId: configData?.planningDeviceId || ''
      });

      // Show processing for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(stepInterval);
      setShowProcessing(false);
      setShowSuccess(true);
      
      // Show success celebration for 3 seconds
      setTimeout(() => {
        const assignmentData = {
          machineId: machine.id,
          machineName: machine.name,
          mouldId: mould,
          startTime: formData.startTime,
          targetQty: parseInt(formData.targetQty),
          planningStatus: 'planning',
          assignedAt: new Date().toISOString(),
          deviceUsed: useDummyDevice ? 'Planwise_Production_test' : configData?.planningDeviceId
        };
        
        onAssign(assignmentData);
        setIsSubmitting(false);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to create planning row:', error);
      clearInterval(stepInterval);
      setShowProcessing(false);
      setIsSubmitting(false);
      // Handle error - could show error message here
      alert('Failed to add to planning. Please try again.');
    }
  };

  const handleApplyDateTime = () => {
    setFormData({...formData, startTime: tempStartTime});
    setShowDatePicker(false);
  };

  const isFormValid = formData.startTime && formData.targetQty && parseInt(formData.targetQty) > 0;

  // Confetti particles for success animation
  const confettiParticles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3000,
    duration: 3000 + Math.random() * 2000,
    color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'][Math.floor(Math.random() * 5)]
  }));

  if (showProcessing) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-white">
          <div className="text-center py-8">
            {/* Spinning Gear Animation */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-spin">
              <Settings className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Assignment</h3>
            
            {/* Processing Steps */}
            <div className="space-y-2 mb-6">
              {processingSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`text-sm transition-all duration-300 ${
                    index === processingStep 
                      ? 'text-blue-600 font-semibold' 
                      : index < processingStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-400"
                style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showSuccess) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-white overflow-hidden">
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {confettiParticles.map((particle) => (
              <div
                key={particle.id}
                className={`absolute w-2 h-2 ${particle.color} animate-bounce`}
                style={{
                  left: `${particle.left}%`,
                  top: '-10px',
                  animationDelay: `${particle.delay}ms`,
                  animationDuration: `${particle.duration}ms`,
                  transform: 'translateY(400px)'
                }}
              ></div>
            ))}
          </div>
          
          <div className="text-center py-8 relative z-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-scale-in shadow-2xl">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Successfully Assigned!</h3>
            <p className="text-gray-600 mb-2">
              <strong>{machine.name}</strong> has been assigned to mould <strong>{mould}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Added to planning module and ready for production
            </p>
            
            {/* Celebration Elements */}
            <div className="flex justify-center space-x-1 mt-6">
              {['🎉', '✨', '🎊', '✨', '🎉'].map((emoji, i) => (
                <div
                  key={i}
                  className="text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Assign Machine to Planning
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Assignment Details</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Machine:</strong> {machine.name}</div>
              <div><strong>Mould:</strong> {mould}</div>
              <div><strong>Status:</strong> <span className="text-green-600">Available</span></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </Label>
              {showDatePicker ? (
                <div className="space-y-2">
                  <Input
                    type="datetime-local"
                    value={tempStartTime}
                    onChange={(e) => setTempStartTime(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyDateTime}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!tempStartTime}
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowDatePicker(false);
                        setTempStartTime('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={formData.startTime ? new Date(formData.startTime).toLocaleString() : ''}
                    placeholder="Select start time..."
                    readOnly
                    className="h-11 border-gray-200 cursor-pointer"
                    onClick={() => {
                      setShowDatePicker(true);
                      setTempStartTime(formData.startTime);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDatePicker(true);
                      setTempStartTime(formData.startTime);
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Target Quantity */}
            <div className="space-y-2">
              <Label htmlFor="targetQty" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Quantity
              </Label>
              <Input
                id="targetQty"
                type="number"
                placeholder="Enter target quantity..."
                value={formData.targetQty}
                onChange={(e) => setFormData({...formData, targetQty: e.target.value})}
                className="h-11 border-gray-200 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            {/* Device Toggle */}
            <div className="space-y-2">
              <Label htmlFor="useDummyDevice" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Device Selection
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="useDummyDevice"
                  checked={useDummyDevice}
                  onCheckedChange={(value) => setUseDummyDevice(value)}
                />
                <span className="text-sm text-gray-600">
                  {useDummyDevice ? 'Using Dummy Device (Planwise_Production_test)' : `Using Planning Device (${configData?.planningDeviceId || 'Not configured'})`}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Toggle to use either your configured planning device or the dummy test device for creating planning entries.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Add to Planning
                </div>
              </Button>
            </div>
          </form>

          {/* Integration Note */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> This assignment will be automatically added to the Planning Module with status "Planning". 
              The machine timeline will begin tracking once production starts.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentModal;
