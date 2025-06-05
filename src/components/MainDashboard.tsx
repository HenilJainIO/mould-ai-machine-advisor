import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, Search, Filter, Cpu, Zap, TrendingUp, ArrowLeft, X, Edit, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MachineCard from './MachineCard';
import LoadingAnimation from './LoadingAnimation';
import EmptyState from './EmptyState';
import AssignmentModal from './AssignmentModal';
import ConfigurationModal from './ConfigurationModal';
import useMouldData from '../hooks/useMouldData';
import useMachineData from '../hooks/useMachineData';

const MainDashboard = ({ configData, onEditConfiguration, onSaveConfiguration }) => {
  const [selectedMould, setSelectedMould] = useState('');
  const [oeeFilter, setOeeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mouldSearchTerm, setMouldSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showMachineCards, setShowMachineCards] = useState(false);

  // Fetch real mould data using the configuration
  const { 
    data: mouldList = [], 
    isLoading: mouldDataLoading, 
    error: mouldDataError 
  } = useMouldData({
    masterDeviceId: configData?.masterDataDeviceId || '',
    sensorId: configData?.sensorId || '',
    enabled: !!(configData?.masterDataDeviceId && configData?.sensorId)
  });

  // Fetch real machine data when mould is selected
  const { 
    data: machines = [], 
    isLoading: machineDataLoading, 
    error: machineDataError 
  } = useMachineData({
    planningDeviceId: configData?.planningDeviceId || '',
    selectedMould: selectedMould,
    enabled: !!(configData?.planningDeviceId && selectedMould && showMachineCards)
  });

  // Filter moulds based on search term
  const filteredMoulds = mouldList.filter(mould => 
    mould.toLowerCase().includes(mouldSearchTerm.toLowerCase())
  );

  const handleMouldSelection = async (mouldId) => {
    setSelectedMould(mouldId);
    setShowMachineCards(false);
    setIsAiProcessing(true);
    
    // Show cool AI processing animation for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setIsAiProcessing(false);
    setShowMachineCards(true);
  };

  const handleUnselectMould = () => {
    setSelectedMould('');
    setShowMachineCards(false);
    setIsAiProcessing(false);
    setOeeFilter('all');
    setAvailabilityFilter('all');
    setSearchTerm('');
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

  const handleConfigurationUpdate = (updatedConfig) => {
    try {
      onSaveConfiguration(updatedConfig);
      setShowConfigModal(false);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedMould && (
                <Button 
                  variant="ghost" 
                  onClick={handleUnselectMould}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Mould Recommendation</h1>
                <p className="text-sm text-gray-600">Intelligent machine assignment system</p>
              </div>
            </div>
            
            {!selectedMould && (
              <Button 
                variant="outline" 
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}

            {selectedMould && (
              <Button 
                variant="ghost" 
                onClick={handleUnselectMould}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
                Unselect Mould
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-7xl">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {mouldDataError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load mould data: {mouldDataError.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
              {/* Mould Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Select Mould</label>
                  {!mouldDataLoading && !mouldDataError && mouldList.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {mouldList.length} moulds available
                    </span>
                  )}
                </div>
                <Select 
                  value={selectedMould} 
                  onValueChange={handleMouldSelection}
                  disabled={mouldDataLoading || !!mouldDataError}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder={
                      mouldDataLoading 
                        ? "Loading moulds..." 
                        : mouldDataError 
                        ? "Error loading moulds" 
                        : "Choose mould..."
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mouldDataLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading mould data...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-2">
                          <Input
                            placeholder="Search moulds..."
                            value={mouldSearchTerm}
                            onChange={(e) => setMouldSearchTerm(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        {filteredMoulds.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            {mouldSearchTerm ? 'No moulds match your search' : 'No mould data found'}
                          </div>
                        ) : (
                          filteredMoulds.map((mould) => (
                            <SelectItem key={mould} value={mould}>{mould}</SelectItem>
                          ))
                        )}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Show filters only when mould is selected */}
              {selectedMould && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          {!selectedMould ? (
            <EmptyState />
          ) : isAiProcessing ? (
            <LoadingAnimation />
          ) : showMachineCards && machineDataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading machine data...</span>
            </div>
          ) : showMachineCards ? (
            <div className="space-y-8">
              {machineDataError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load machine data: {machineDataError.message}
                  </AlertDescription>
                </Alert>
              )}

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

              {filteredMachines.length === 0 && !machineDataError && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No machines found for this mould</h3>
                  <p className="text-gray-600">Try selecting a different mould or check your configuration.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedMachine && (
        <AssignmentModal
          machine={selectedMachine}
          mould={selectedMould}
          configData={configData}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignmentComplete}
        />
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <ConfigurationModal
          currentConfig={configData}
          onClose={() => setShowConfigModal(false)}
          onSave={handleConfigurationUpdate}
        />
      )}
    </div>
  );
};

export default MainDashboard;
