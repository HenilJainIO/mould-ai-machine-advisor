
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingDown, AlertTriangle, Star, Zap } from 'lucide-react';

const MachineCard = ({ machine, onAssign, isRecommended }) => {
  const getOEEColor = (category) => {
    switch (category) {
      case 'best': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'average': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? 'bg-green-500' : 'bg-red-500';
  };

  const calculateOEE = (data) => {
    return Math.round((data.availability * data.performance * data.quality) / 10000);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isRecommended ? 'ring-2 ring-green-500 shadow-lg' : ''
    } ${machine.status === 'Available' ? 'bg-white' : 'bg-gray-50'}`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-medium flex items-center gap-1">
          <Star className="w-3 h-3" />
          AI Recommended
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{machine.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                className={`${getStatusColor(machine.status)} text-white text-xs px-2 py-1`}
              >
                {machine.status}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${getOEEColor(machine.oeeCategory)} text-white border-0 text-xs px-2 py-1`}
              >
                {machine.oeeCategory.toUpperCase()} OEE
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Last Production Details */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last Production
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Start:</span>
              <p className="font-medium">{machine.lastProduction.startTime}</p>
            </div>
            <div>
              <span className="text-gray-600">End:</span>
              <p className="font-medium">{machine.lastProduction.endTime}</p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-medium">{machine.lastProduction.duration}</p>
            </div>
            <div>
              <span className="text-gray-600">Actual/Target:</span>
              <p className="font-medium">
                {machine.lastProduction.actualQty}/{machine.lastProduction.targetQty}
              </p>
            </div>
          </div>
        </div>

        {/* OEE Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-blue-50 rounded-lg p-2">
            <div className="text-xl font-bold text-blue-600">
              {machine.lastProduction.availability}%
            </div>
            <div className="text-xs text-blue-600 font-medium">Availability</div>
          </div>
          <div className="text-center bg-purple-50 rounded-lg p-2">
            <div className="text-xl font-bold text-purple-600">
              {machine.lastProduction.performance}%
            </div>
            <div className="text-xs text-purple-600 font-medium">Performance</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-2">
            <div className="text-xl font-bold text-green-600">
              {machine.lastProduction.quality}%
            </div>
            <div className="text-xs text-green-600 font-medium">Quality</div>
          </div>
        </div>

        {/* Overall OEE */}
        <div className="text-center bg-gray-900 text-white rounded-lg p-3">
          <div className="text-2xl font-bold">
            {calculateOEE(machine.lastProduction)}%
          </div>
          <div className="text-sm opacity-90">Overall OEE</div>
        </div>

        {/* Issues Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Rejection Qty:
            </span>
            <span className="font-medium text-red-600">{machine.lastProduction.rejectionQty}</span>
          </div>
          <div className="text-xs text-gray-600">
            <strong>Top reason:</strong> {machine.lastProduction.topRejectionReason}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Downtime:
            </span>
            <span className="font-medium text-orange-600">{machine.lastProduction.downtimeMinutes}m</span>
          </div>
          <div className="text-xs text-gray-600">
            <strong>Top reason:</strong> {machine.lastProduction.topDowntimeReason}
          </div>
        </div>

        {/* Assign Button */}
        <Button 
          onClick={() => onAssign(machine)}
          disabled={machine.status === 'Unavailable'}
          className={`w-full mt-4 transition-all duration-200 ${
            machine.status === 'Available' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {machine.status === 'Available' ? (
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Assign Machine
            </div>
          ) : (
            'Currently Unavailable'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MachineCard;
