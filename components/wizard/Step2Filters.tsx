'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { GlobalFilters, UserTechnicalLevel } from '@/types';
import { MultiToggleChip } from '@/components/ui/ToggleChip';
import { Button } from '@/components/ui/Button';
import {
  companySizeOptions,
  technicalMaturityOptions,
  industryVerticalOptions,
  geographyOptions,
} from '@/data/filters';

interface Step2FiltersProps {
  filters: GlobalFilters;
  onChange: (key: keyof GlobalFilters, value: string) => void;
  onSingleChange: (key: keyof GlobalFilters, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  userTechnicalLevel: UserTechnicalLevel | null;
  onSetTechnicalLevel: (level: UserTechnicalLevel) => void;
}

const TECH_LEVEL_OPTIONS: { value: UserTechnicalLevel; label: string; description: string }[] = [
  { value: 'non_technical', label: 'Business / Marketing', description: 'I work with platforms and tools — no coding involved' },
  { value: 'semi_technical', label: 'Marketing Operations', description: 'I configure, integrate and automate systems' },
  { value: 'technical', label: 'Developer / Engineer', description: 'I build and maintain technical infrastructure' },
];

const FILTER_QUESTIONS = [
  { key: 'companySize' as const,       label: 'How large is your organisation?',        subtitle: 'Select one', options: companySizeOptions, singleSelect: true },
  { key: 'technicalMaturity' as const, label: 'What is your technical capability?',     subtitle: 'Select one', options: technicalMaturityOptions, singleSelect: true },
  { key: 'industryVertical' as const,  label: 'Which industry are you in?',             subtitle: 'Select all that apply', options: industryVerticalOptions },
  { key: 'geography' as const,         label: 'Where do you operate?',                  subtitle: 'Select all that apply for compliance', options: geographyOptions },
] as const;

const TOTAL_SLIDES = 1 + FILTER_QUESTIONS.length; // tech level + 4 filter questions

export function Step2Filters({ filters, onChange, onSingleChange, onNext, onBack, userTechnicalLevel, onSetTechnicalLevel }: Step2FiltersProps) {
  const [qIndex, setQIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);

  const isTechLevelSlide = qIndex === 0;
  const filterQ = !isTechLevelSlide ? FILTER_QUESTIONS[qIndex - 1] : null;
  const isLast = qIndex === TOTAL_SLIDES - 1;

  const hasSelection = isTechLevelSlide
    ? userTechnicalLevel !== null
    : true; // filter questions can be skipped (no selection = no constraint)

  // Count answered slides for progress bar
  const answeredCount = (userTechnicalLevel !== null ? 1 : 0)
    + FILTER_QUESTIONS.filter(q => (filters[q.key] as string[]).length > 0).length;

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

  // Dot state for each slide
  function isDotAnswered(idx: number) {
    if (idx === 0) return userTechnicalLevel !== null;
    const fq = FILTER_QUESTIONS[idx - 1];
    return (filters[fq.key] as string[]).length > 0;
  }

  return (
    <div className="max-w-2xl mx-auto" style={{ animation: 'slideLeft 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* Step label */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#4ade80' }}>Step 1 of 3</p>
        <p className="text-sm" style={{ color: 'rgba(168,144,128,0.6)' }}>
          Tell us about yourself and your organisation so every recommendation fits your actual context.
        </p>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(answeredCount / TOTAL_SLIDES) * 100}%`,
                background: 'linear-gradient(90deg, #2e7040, #4ade80)',
                boxShadow: '0 0 8px rgba(74,222,128,0.4)',
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: answeredCount === TOTAL_SLIDES ? '#4ade80' : 'rgba(168,144,128,0.5)' }}>
            {answeredCount}/{TOTAL_SLIDES}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div key={animKey} style={slideStyle} className="glass-card p-6 sm:p-8">
        {/* Question number badge + dots */}
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
            {qIndex + 1} / {TOTAL_SLIDES}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === qIndex ? 20 : 6,
                  height: 6,
                  background:
                    i === qIndex
                      ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                      : isDotAnswered(i)
                      ? 'rgba(46,112,64,0.5)'
                      : 'rgba(255,255,255,0.1)',
                  boxShadow: i === qIndex ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Tech level slide */}
        {isTechLevelSlide && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#f0ece8', letterSpacing: '-0.02em' }}>
              How would you describe your role?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(168,144,128,0.6)' }}>
              This tailors the depth of questions at each platform
            </p>
            <div className="flex flex-col gap-3">
              {TECH_LEVEL_OPTIONS.map((opt) => {
                const selected = userTechnicalLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onSetTechnicalLevel(opt.value)}
                    className="text-left px-4 py-3.5 rounded-xl transition-all duration-200"
                    style={{
                      background: selected ? 'rgba(46,112,64,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selected ? 'rgba(46,112,64,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: selected ? '0 0 12px rgba(46,112,64,0.15) inset' : 'none',
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: selected ? '#4ade80' : '#d4c8c0' }}>
                      {opt.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(140,120,110,0.8)' }}>
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Filter question slides */}
        {!isTechLevelSlide && filterQ && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#f0ece8', letterSpacing: '-0.02em' }}>
              {filterQ.label}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(168,144,128,0.6)' }}>
              {filterQ.subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filterQ.options.map((opt) => (
                <MultiToggleChip
                  key={opt.value}
                  label={opt.label}
                  selected={(filters[filterQ.key] as string[]).includes(opt.value)}
                  onClick={() => ('singleSelect' in filterQ && filterQ.singleSelect) ? onSingleChange(filterQ.key, opt.value) : onChange(filterQ.key, opt.value)}
                />
              ))}
            </div>
          </>
        )}

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

        {/* Skip hint for filter questions */}
        {!isTechLevelSlide && (
          <p className="text-center text-xs mt-3" style={{ color: 'rgba(120,100,90,0.5)' }}>
            Not sure? You can skip — it won&apos;t block your results.
          </p>
        )}
      </div>
    </div>
  );
}
