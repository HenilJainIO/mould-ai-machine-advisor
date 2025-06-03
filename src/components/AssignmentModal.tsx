
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Target, CheckCircle, X } from 'lucide-react';

const AssignmentModal = ({ machine, mould, onClose, onAssign }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    targetQty: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.targetQty) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to planning module
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const assignmentData = {
      machineId: machine.id,
      machineName: machine.name,
      mouldId: mould,
      startTime: formData.startTime,
      targetQty: parseInt(formData.targetQty),
      planningStatus: 'planning',
      assignedAt: new Date().toISOString()
    };
    
    onAssign(assignmentData);
    setIsSubmitting(false);
  };

  const isFormValid = formData.startTime && formData.targetQty && parseInt(formData.targetQty) > 0;

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
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="h-11 border-gray-200 focus:border-blue-500"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
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
