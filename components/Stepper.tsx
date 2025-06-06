
import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index <= currentStep ? 'bg-panda-pink border-panda-pink text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}
              `}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="font-semibold text-sm">{index + 1}</span>
              )}
            </div>
            <p className={`text-xs mt-1 text-center ${index <= currentStep ? 'text-panda-pink font-medium' : 'text-gray-500'}`}>{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-grow h-0.5 mx-2 ${index < currentStep ? 'bg-panda-pink' : 'bg-gray-300'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;