
import React from 'react';
import { Cpu, ArrowDown, Sparkles, TrendingUp, Zap, Target } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center animate-pulse">
          <Cpu className="w-16 h-16 text-blue-500" />
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">Ready for AI-Powered Recommendations</h3>
        <p className="text-gray-600 leading-relaxed">
          Select a mould from the dropdown above to get intelligent machine recommendations based on OEE performance, availability, and production history.
        </p>
        
        {/* Arrow pointing up to mould selector */}
        <div className="flex flex-col items-center mt-8 animate-bounce">
          <ArrowDown className="w-6 h-6 text-blue-500 rotate-180 mb-2" />
          <span className="text-sm text-blue-600 font-medium">Choose a mould to get started</span>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">OEE Analysis</h4>
          <p className="text-sm text-gray-600">Smart recommendations based on Overall Equipment Effectiveness metrics</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Real-time Availability</h4>
          <p className="text-sm text-gray-600">Live machine status updates and availability tracking</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Smart Assignment</h4>
          <p className="text-sm text-gray-600">Seamless integration with planning module for efficient scheduling</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
