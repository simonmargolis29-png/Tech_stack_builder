'use client';

import type { WizardStep } from '@/types';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Components' },
  { id: 3, label: 'Deep Dive' },
  { id: 4, label: 'Results' },
];

interface StepIndicatorProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
  completedSteps: WizardStep[];
}

export function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
  const displayStep = currentStep === 1 ? 0 : currentStep - 1;

  return (
    <nav className="flex items-center gap-1" aria-label="Progress">
      {STEPS.map((step, idx) => {
        const stepNum = (step.id + 1) as WizardStep;
        const isCompleted = completedSteps.includes(stepNum);
        const isActive = displayStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => isCompleted && onStepClick?.(stepNum)}
              disabled={!isCompleted}
              aria-current={isActive ? 'step' : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer disabled:cursor-default"
              style={{
                background: isActive ? 'rgba(46,112,64,0.15)' : 'transparent',
                color: isActive ? '#4ade80' : isCompleted ? 'rgba(74,222,128,0.6)' : 'rgba(100,80,72,0.6)',
              }}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-200"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #2e7040, #4ade80)'
                    : isCompleted
                    ? 'rgba(46,112,64,0.25)'
                    : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : isCompleted ? '#4ade80' : 'rgba(100,80,72,0.5)',
                  boxShadow: isActive ? '0 0 8px rgba(46,112,64,0.5)' : 'none',
                }}
              >
                {isCompleted && !isActive ? (
                  <svg width="7" height="6" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </button>

            {idx < STEPS.length - 1 && (
              <div
                className="w-4 h-px mx-0.5 transition-all duration-500"
                style={{
                  background: completedSteps.includes((step.id + 1) as WizardStep)
                    ? 'rgba(46,112,64,0.4)'
                    : 'rgba(255,255,255,0.06)',
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
