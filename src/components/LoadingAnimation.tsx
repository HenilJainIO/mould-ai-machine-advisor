
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, TrendingUp, Brain, Settings, Database } from 'lucide-react';

const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Fetching machine availability data...",
    "Calculating OEE performance metrics...",
    "Analyzing production history and downtime...",
    "Generating intelligent recommendations..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Main AI Brain Animation */}
      <div className="relative mb-8">
        {/* Central Brain/AI Icon */}
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
          <Brain className="w-12 h-12 text-white" />
        </div>
        
        {/* Rotating Data Processing Icons */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="relative w-24 h-24">
            {/* Top Icon - Data Processing */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            {/* Right Icon - Settings/Analysis */}
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5 text-white" />
            </div>
            {/* Bottom Icon - Performance */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {/* Left Icon - AI Processing */}
            <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Pulsing Ring */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold text-gray-900">AI Recommendation Engine</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our intelligent system is analyzing machine performance data, OEE metrics, availability status, and production history to recommend the optimal machine for your selected module.
        </p>
        
        {/* Animated Status Steps - Scrolling */}
        <div className="mt-8 space-y-3 h-32 overflow-hidden">
          <div 
            className="transition-transform duration-800 ease-in-out"
            style={{ 
              transform: `translateY(-${currentStep * 2}rem)` 
            }}
          >
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center justify-center gap-3 text-sm h-8 mb-3 transition-all duration-300 ${
                  index === currentStep 
                    ? 'text-blue-600 font-semibold scale-105' 
                    : 'text-gray-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-8 w-96 mx-auto bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
