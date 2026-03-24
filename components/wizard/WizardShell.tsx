'use client';

import { useState, useCallback } from 'react';
import type { WizardStep, WizardState, GlobalFilters, CategoryId, CategoryAnswers, WizardResults, UserTechnicalLevel } from '@/types';
import { generateResults } from '@/lib/recommendations';
import { StepIndicator } from './StepIndicator';
import { Step1Welcome } from './Step1Welcome';
import { Step2Filters } from './Step2Filters';
import { Step3Categories } from './Step3Categories';
import { Step4Questions } from './Step4Questions';
import { Step5Results } from './Step5Results';

const initialFilters: GlobalFilters = {
  budgetTier: [],
  companySize: [],
  technicalMaturity: [],
  industryVertical: [],
  geography: [],
  deploymentModel: [],
};

const initialState: WizardState = {
  currentStep: 1,
  globalFilters: initialFilters,
  selectedCategories: [],
  categoryAnswers: {},
  activeCategoryIndex: 0,
  userTechnicalLevel: null,
};

export function WizardShell() {
  const [state, setState] = useState<WizardState>(initialState);
  const [results, setResults] = useState<WizardResults | null>(null);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const markStepComplete = useCallback((step: WizardStep) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const setUserTechnicalLevel = useCallback((level: UserTechnicalLevel) => {
    setState(prev => ({ ...prev, userTechnicalLevel: level }));
  }, []);

  const toggleGlobalFilter = useCallback((key: keyof GlobalFilters, value: string) => {
    setState(prev => {
      const current = prev.globalFilters[key] as string[];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, globalFilters: { ...prev.globalFilters, [key]: next } };
    });
  }, []);

  const toggleCategory = useCallback((id: CategoryId) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter((c) => c !== id)
        : [...prev.selectedCategories, id],
    }));
  }, []);

  const setCategoryAnswer = useCallback((categoryId: CategoryId, questionId: string, value: string | string[]) => {
    setState((prev) => ({
      ...prev,
      categoryAnswers: {
        ...prev.categoryAnswers,
        [categoryId]: { ...(prev.categoryAnswers[categoryId] ?? {}), [questionId]: value },
      },
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(initialState);
    setResults(null);
    setCompletedSteps([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenerateResults = useCallback(() => {
    const r = generateResults(state);
    setResults(r);
    markStepComplete(4);
    goToStep(5);
  }, [state, markStepComplete, goToStep]);

  const { currentStep } = state;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#0c0806' }}>
      {/* Background: radial glow at top */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% -5%, rgba(46,112,64,0.18) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 dot-grid opacity-40"
        style={{ zIndex: 0 }}
      />

      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(12,8,6,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(46,112,64,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2e7040, #4ade80)', boxShadow: '0 2px 8px rgba(46,112,64,0.4)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span
              className="text-sm font-semibold transition-colors duration-200"
              style={{ color: '#c8bdb8' }}
            >
              Stack Builder
            </span>
          </button>

          {currentStep > 1 && currentStep < 5 && (
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          )}

          {currentStep > 1 && (
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 text-xs cursor-pointer transition-colors duration-200"
              style={{ color: 'rgba(168,144,128,0.5)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(168,144,128,0.9)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(168,144,128,0.5)')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="relative z-10 px-5 sm:px-8 pt-24 pb-16">
        {currentStep === 1 && (
          <Step1Welcome onNext={() => { markStepComplete(1); goToStep(2); }} />
        )}
        {currentStep === 2 && (
          <Step2Filters
            filters={state.globalFilters}
            onChange={toggleGlobalFilter}
            onNext={() => { markStepComplete(2); goToStep(3); }}
            onBack={() => goToStep(1)}
            userTechnicalLevel={state.userTechnicalLevel}
            onSetTechnicalLevel={setUserTechnicalLevel}
          />
        )}
        {currentStep === 3 && (
          <Step3Categories
            selected={state.selectedCategories}
            onToggle={toggleCategory}
            onNext={() => { markStepComplete(3); goToStep(4); }}
            onBack={() => goToStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4Questions
            selectedCategories={state.selectedCategories}
            answers={state.categoryAnswers}
            onAnswer={setCategoryAnswer}
            onNext={handleGenerateResults}
            onBack={() => goToStep(3)}
            userTechnicalLevel={state.userTechnicalLevel}
          />
        )}
        {currentStep === 5 && results && (
          <Step5Results results={results} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
