
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, Search, Filter, Cpu, Zap, TrendingUp } from 'lucide-react';
import MachineCard from './MachineCard';
import LoadingAnimation from './LoadingAnimation';
import EmptyState from './EmptyState';
import AssignmentModal from './AssignmentModal';

const MainDashboard = ({ configData, onEditConfiguration }) => {
  const [selectedMould, setSelectedMould] = useState('');
  const [oeeFilter, setOeeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [machines, setMachines] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Mock data for moulds
  const mouldList = [
    'Mould-A-001',
    'Mould-B-002', 
    'Mould-C-003',
    'Mould-D-004',
    'Mould-E-005'
  ];

  // Mock machine data
  const mockMachines = [
    {
      id: 'machine-001',
      name: 'Injection Machine 001',
      status: 'Available',
      oeeCategory: 'best',
      lastProduction: {
        startTime: '2024-01-15 08:00',
        endTime: '2024-01-15 16:00',
        duration: '8h 00m',
        targetQty: 1000,
        actualQty: 980,
        availability: 95,
        performance: 92,
        quality: 98,
        rejectionQty: 20,
        downtimeMinutes: 45,
        topRejectionReason: 'Surface defects',
        topDowntimeReason: 'Material shortage'
      }
    },
    {
      id: 'machine-002',
      name: 'Injection Machine 002',
      status: 'Unavailable',
      oeeCategory: 'good',
      lastProduction: {
        startTime: '2024-01-15 06:00',
        endTime: '2024-01-15 18:00',
        duration: '12h 00m',
        targetQty: 1500,
        actualQty: 1320,
        availability: 88,
        performance: 85,
        quality: 95,
        rejectionQty: 180,
        downtimeMinutes: 120,
        topRejectionReason: 'Dimensional issues',
        topDowntimeReason: 'Equipment maintenance'
      }
    },
    {
      id: 'machine-003',
      name: 'Injection Machine 003',
      status: 'Available',
      oeeCategory: 'average',
      lastProduction: {
        startTime: '2024-01-14 10:00',
        endTime: '2024-01-14 22:00',
        duration: '12h 00m',
        targetQty: 1200,
        actualQty: 1000,
        availability: 82,
        performance: 78,
        quality: 90,
        rejectionQty: 200,
        downtimeMinutes: 180,
        topRejectionReason: 'Color variation',
        topDowntimeReason: 'Tool change'
      }
    }
  ];

  const handleMouldSelection = async (mouldId) => {
    setSelectedMould(mouldId);
    setIsLoading(true);
    
    // Simulate AI recommendation processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMachines(mockMachines);
    setIsLoading(false);
  };

  const filteredMachines = machines.filter(machine => {
    const matchesOee = oeeFilter === 'all' || machine.oeeCategory === oeeFilter;
    const matchesAvailability = availabilityFilter === 'all' || machine.status.toLowerCase() === availabilityFilter;
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesOee && matchesAvailability && matchesSearch;
  });

  const availableMachines = filteredMachines.filter(m => m.status === 'Available');
  const unavailableMachines = filteredMachines.filter(m => m.status === 'Unavailable');
  
  // Get best available machine for recommendation
  const recommendedMachine = availableMachines.find(m => m.oeeCategory === 'best') || 
                            availableMachines.find(m => m.oeeCategory === 'good') ||
                            availableMachines[0];

  const handleAssignMachine = (machine) => {
    setSelectedMachine(machine);
    setShowAssignModal(true);
  };

  const handleAssignmentComplete = (assignmentData) => {
    console.log('Assignment completed:', assignmentData);
    setShowAssignModal(false);
    setSelectedMachine(null);
    // Here you would integrate with the planning module
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Module Recommendation</h1>
                <p className="text-sm text-gray-600">Intelligent machine assignment system</p>
              </div>
            </div>
            
            {!selectedMould && (
              <Button 
                variant="outline" 
                onClick={onEditConfiguration}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mould Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Mould</label>
              <Select value={selectedMould} onValueChange={handleMouldSelection}>
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Choose mould..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mouldList.map((mould) => (
                    <SelectItem key={mould} value={mould}>{mould}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* OEE Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">OEE Category</label>
              <Select value={oeeFilter} onValueChange={setOeeFilter}>
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="best">Best (90%+)</SelectItem>
                  <SelectItem value="good">Good (70-89%)</SelectItem>
                  <SelectItem value="average">Average (50-69%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Availability</label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Machines</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="unavailable">Unavailable Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!selectedMould ? (
          <EmptyState />
        ) : isLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="space-y-8">
            {/* AI Recommendation Banner */}
            {recommendedMachine && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Recommendation</h3>
                </div>
                <p className="text-green-100 mb-4">
                  Based on OEE analysis and availability, we recommend <strong>{recommendedMachine.name}</strong> for optimal performance.
                </p>
                <Button 
                  onClick={() => handleAssignMachine(recommendedMachine)}
                  className="bg-white text-green-600 hover:bg-green-50 font-medium"
                >
                  Assign Recommended Machine
                </Button>
              </div>
            )}

            {/* Available Machines */}
            {availableMachines.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Available Machines ({availableMachines.length})</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availableMachines.map((machine) => (
                    <MachineCard 
                      key={machine.id} 
                      machine={machine} 
                      onAssign={handleAssignMachine}
                      isRecommended={machine.id === recommendedMachine?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Unavailable Machines */}
            {unavailableMachines.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-900">Unavailable Machines ({unavailableMachines.length})</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {unavailableMachines.map((machine) => (
                    <MachineCard 
                      key={machine.id} 
                      machine={machine} 
                      onAssign={handleAssignMachine}
                      isRecommended={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredMachines.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No machines match your filters</h3>
                <p className="text-gray-600">Try adjusting your filter criteria to see more results.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedMachine && (
        <AssignmentModal
          machine={selectedMachine}
          mould={selectedMould}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignmentComplete}
        />
      )}
    </div>
  );
};

export default MainDashboard;
