
import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    "🔍 Scanning machine availability...",
    "📊 Calculating OEE performance metrics...",
    "🏭 Analyzing production history and downtime...",
    "⚡ Processing machine efficiency data...",
    "🤖 Generating intelligent recommendations...",
    "🎯 Optimizing machine-mould compatibility...",
    "✨ Finalizing AI-powered suggestions..."
  ];

  useEffect(() => {
    // Step cycling every 400ms
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 400);

    // Progress updates every 40ms (2% increments)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 40);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Generate floating particles positions
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i * 60) * (Math.PI / 180), // 60 degrees apart
    delay: i * 0.2 // 0.2s staggered delays
  }));

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Main AI Brain Animation Section */}
      <div className="relative mb-12">
        {/* Floating Particles System */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{
              left: `${48 + Math.cos(particle.angle) * 60}px`,
              top: `${48 + Math.sin(particle.angle) * 60}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}

        {/* Central Brain Container */}
        <div className="relative">
          {/* Pulsing Outer Ring */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
          
          {/* Rotating Outer Ring */}
          <div className="absolute inset-0 w-24 h-24 border-2 border-purple-300 rounded-full animate-spin opacity-30" style={{ animationDuration: '3s' }}></div>
          
          {/* Central Brain Icon */}
          <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <Brain className="w-12 h-12 text-white" />
            
            {/* Scanning Line Animation */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1 animate-pulse" style={{
                left: `${(progress % 50) * 2}%`,
                animationDuration: '2s'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900">AI Mould Recommendation Engine</h3>
        <p className="text-lg text-gray-600">
          Our intelligent system is analyzing machine performance data, OEE metrics, availability status, 
          and production history to recommend the optimal machine for your selected mould.
        </p>
        
        {/* Scrolling Text Steps */}
        <div className="relative h-20 overflow-hidden bg-gradient-to-b from-transparent via-gray-50 to-transparent rounded-lg">
          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
          
          {/* Scrolling Container */}
          <div 
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateY(${8 - (currentStep * 16)}px)` 
            }}
          >
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center justify-center h-16 text-sm transition-all duration-300 ${
                  index === currentStep 
                    ? 'text-blue-600 font-bold scale-105' 
                    : index < currentStep
                    ? 'text-green-600 opacity-70'
                    : 'text-gray-400 opacity-50'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Processing...</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Processing Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
