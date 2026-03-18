'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { GlobalFilters } from '@/types';
import { MultiToggleChip } from '@/components/ui/ToggleChip';
import { Button } from '@/components/ui/Button';
import {
  budgetTierOptions,
  companySizeOptions,
  technicalMaturityOptions,
  industryVerticalOptions,
  geographyOptions,
  deploymentModelOptions,
} from '@/data/filters';

interface Step2FiltersProps {
  filters: GlobalFilters;
  onChange: (key: keyof GlobalFilters, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  { key: 'budgetTier' as const,       label: 'What is your annual technology budget?',   subtitle: 'Select all that apply', options: budgetTierOptions },
  { key: 'companySize' as const,       label: 'How large is your organisation?',           subtitle: 'Select all that apply', options: companySizeOptions },
  { key: 'technicalMaturity' as const, label: 'What is your technical capability?',        subtitle: 'Select all that apply', options: technicalMaturityOptions },
  { key: 'industryVertical' as const,  label: 'Which industry are you in?',                subtitle: 'Select all that apply', options: industryVerticalOptions },
  { key: 'geography' as const,         label: 'Where do you operate?',                     subtitle: 'Select all that apply for compliance', options: geographyOptions },
  { key: 'deploymentModel' as const,   label: 'What deployment model do you need?',        subtitle: 'Select all that apply', options: deploymentModelOptions },
] as const;

export function Step2Filters({ filters, onChange, onNext, onBack }: Step2FiltersProps) {
  const [qIndex, setQIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);

  const question = QUESTIONS[qIndex];
  const selectedValues = filters[question.key] as string[];
  const hasSelection = selectedValues.length > 0;
  const isLast = qIndex === QUESTIONS.length - 1;

  // Count how many questions have at least one answer
  const answeredCount = QUESTIONS.filter(q => (filters[q.key] as string[]).length > 0).length;

  function goForward() {
    setDirection('forward');
    setAnimKey(k => k + 1);
    if (isLast) {
      onNext();
    } else {
      setQIndex(i => i + 1);
    }
  }

  function goBack() {
    if (qIndex === 0) {
      onBack();
    } else {
      setDirection('back');
      setAnimKey(k => k + 1);
      setQIndex(i => i - 1);
    }
  }

  const slideStyle: React.CSSProperties = {
    animation: direction === 'forward'
      ? 'slideLeft 0.35s cubic-bezier(0.16,1,0.3,1) both'
      : 'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
  };

  return (
    <div className="max-w-2xl mx-auto" style={{ animation: 'slideLeft 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* Step label */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#4ade80' }}>Step 1 of 3</p>
        <p className="text-sm" style={{ color: 'rgba(168,144,128,0.6)' }}>
          These filters ensure every recommendation fits your actual context.
        </p>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(answeredCount / QUESTIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, #2e7040, #4ade80)',
                boxShadow: '0 0 8px rgba(74,222,128,0.4)',
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: answeredCount === QUESTIONS.length ? '#4ade80' : 'rgba(168,144,128,0.5)' }}>
            {answeredCount}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div
        key={animKey}
        style={slideStyle}
        className="glass-card p-6 sm:p-8"
      >
        {/* Question number badge */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: 'rgba(46,112,64,0.15)',
              border: '1px solid rgba(46,112,64,0.3)',
              color: '#4ade80',
              letterSpacing: '0.05em',
            }}
          >
            {qIndex + 1} / {QUESTIONS.length}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {QUESTIONS.map((q, i) => {
              const answered = (filters[q.key] as string[]).length > 0;
              return (
                <div
                  key={q.key}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === qIndex ? 20 : 6,
                    height: 6,
                    background:
                      i === qIndex
                        ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                        : answered
                        ? 'rgba(46,112,64,0.5)'
                        : 'rgba(255,255,255,0.1)',
                    boxShadow: i === qIndex ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Question heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#f0ece8', letterSpacing: '-0.02em' }}>
          {question.label}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(168,144,128,0.6)' }}>
          {question.subtitle}
        </p>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options.map((opt) => (
            <MultiToggleChip
              key={opt.value}
              label={opt.label}
              selected={selectedValues.includes(opt.value)}
              onClick={() => onChange(question.key, opt.value)}
            />
          ))}
        </div>

        {/* Card actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={goBack}>
            <ArrowLeft size={15} />
            {qIndex === 0 ? 'Back' : 'Previous'}
          </Button>
          <Button
            onClick={goForward}
            disabled={!hasSelection}
            className="flex-1 justify-center"
          >
            {isLast ? (
              <>Choose stack components <ArrowRight size={15} /></>
            ) : (
              <>Continue <ArrowRight size={15} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
