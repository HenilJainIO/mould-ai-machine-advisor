
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Target, CheckCircle, X, Check } from 'lucide-react';

const AssignmentModal = ({ machine, mould, onClose, onAssign }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    targetQty: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tempStartTime, setTempStartTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.targetQty) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to planning module
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    
    // Show success animation for 2 seconds then close
    setTimeout(() => {
      const assignmentData = {
        machineId: machine.id,
        machineName: machine.name,
        moduleId: mould,
        startTime: formData.startTime,
        targetQty: parseInt(formData.targetQty),
        planningStatus: 'planning',
        assignedAt: new Date().toISOString()
      };
      
      onAssign(assignmentData);
      setIsSubmitting(false);
      setShowSuccess(false);
    }, 2000);
  };

  const handleApplyDateTime = () => {
    setFormData({...formData, startTime: tempStartTime});
    setShowDatePicker(false);
  };

  const isFormValid = formData.startTime && formData.targetQty && parseInt(formData.targetQty) > 0;

  if (showSuccess) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-white">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-scale-in">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Added!</h3>
            <p className="text-gray-600">
              {machine.name} has been assigned to module {mould} and added to the planning module.
            </p>
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
              <div><strong>Module:</strong> {mould}</div>
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
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Add to Planning
                  </div>
                )}
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
