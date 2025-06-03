
import React from 'react';
import { Cpu, Zap, TrendingUp } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        {/* Central AI Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
          <Cpu className="w-10 h-10 text-white" />
        </div>
        
        {/* Orbiting Icons */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="relative w-20 h-20">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">AI Recommendation in Progress</h3>
        <p className="text-gray-600 max-w-md">
          Our intelligent system is analyzing machine performance, availability, and OEE metrics to find the best match for your mould.
        </p>
        
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-1 mt-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
        
        {/* Status Text */}
        <div className="mt-4 text-sm text-gray-500">
          <div className="animate-pulse">Analyzing production data and machine capabilities...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
