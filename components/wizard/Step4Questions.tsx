'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { CategoryId, CategoryAnswers } from '@/types';
import { categories } from '@/data/categories';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { MultiToggleChip } from '@/components/ui/ToggleChip';
import { Button } from '@/components/ui/Button';

interface Step4QuestionsProps {
  selectedCategories: CategoryId[];
  answers: CategoryAnswers;
  onAnswer: (categoryId: CategoryId, questionId: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function isCategoryComplete(categoryId: CategoryId, answers: CategoryAnswers): boolean {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return false;
  const catAnswers = answers[categoryId] ?? {};
  return cat.questions.every((q) => {
    const a = catAnswers[q.id];
    if (!a) return false;
    return Array.isArray(a) ? a.length > 0 : a !== '';
  });
}

export function Step4Questions({ selectedCategories, answers, onAnswer, onNext, onBack }: Step4QuestionsProps) {
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questionDirection, setQuestionDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);

  const activeCatId = selectedCategories[activeCatIndex];
  const activeCategory = categories.find((c) => c.id === activeCatId)!;
  const catAnswers = answers[activeCatId] ?? {};
  const isLastCategory = activeCatIndex === selectedCategories.length - 1;
  const question = activeCategory.questions[activeQuestionIndex];
  const isLastQuestion = activeQuestionIndex === activeCategory.questions.length - 1;

  // Current question answer (always treated as multi-select)
  const currentAnswer = (catAnswers[question.id] as string[]) ?? [];
  const hasAnswer = currentAnswer.length > 0;

  function handleToggle(value: string) {
    const next = currentAnswer.includes(value)
      ? currentAnswer.filter(v => v !== value)
      : [...currentAnswer, value];
    onAnswer(activeCatId, question.id, next);
  }

  function handleNext() {
    if (isLastQuestion) {
      if (isLastCategory) {
        onNext();
      } else {
        setActiveCatIndex(i => i + 1);
        setActiveQuestionIndex(0);
        setQuestionDirection('forward');
        setAnimKey(k => k + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setQuestionDirection('forward');
      setAnimKey(k => k + 1);
      setActiveQuestionIndex(i => i + 1);
    }
  }

  function handleBack() {
    if (activeQuestionIndex > 0) {
      setQuestionDirection('back');
      setAnimKey(k => k + 1);
      setActiveQuestionIndex(i => i - 1);
    } else if (activeCatIndex > 0) {
      const prevCatId = selectedCategories[activeCatIndex - 1];
      const prevCat = categories.find(c => c.id === prevCatId)!;
      setActiveCatIndex(i => i - 1);
      setActiveQuestionIndex(prevCat.questions.length - 1);
      setQuestionDirection('back');
      setAnimKey(k => k + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  }

  const slideStyle: React.CSSProperties = {
    animation: questionDirection === 'forward'
      ? 'slideLeft 0.35s cubic-bezier(0.16,1,0.3,1) both'
      : 'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
  };

  // Count answered questions in current category
  const answeredInCat = activeCategory.questions.filter(q => {
    const a = catAnswers[q.id];
    if (!a) return false;
    return Array.isArray(a) ? a.length > 0 : a !== '';
  }).length;

  return (
    <div className="max-w-2xl mx-auto" style={{ animation: 'slideLeft 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4ade80' }}>Step 3 of 3</p>

        {/* Category progress dots */}
        <div className="flex items-center gap-1.5 mb-5">
          {selectedCategories.map((catId, idx) => (
            <div
              key={catId}
              className="rounded-full transition-all duration-300"
              style={{
                height: 4,
                width: idx === activeCatIndex ? 28 : isCategoryComplete(catId, answers) ? 14 : 8,
                background:
                  idx === activeCatIndex
                    ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                    : isCategoryComplete(catId, answers)
                    ? 'rgba(46,112,64,0.5)'
                    : 'rgba(255,255,255,0.08)',
                boxShadow: idx === activeCatIndex ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
              }}
            />
          ))}
          <span className="text-xs ml-2" style={{ color: 'rgba(120,100,90,0.7)' }}>
            {activeCatIndex + 1} / {selectedCategories.length}
          </span>
        </div>

        {/* Category title */}
        <div className="flex items-center gap-3.5 mb-1">
          <CategoryIcon categoryId={activeCategory.id} size="md" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#f0ece8' }}>
              {activeCategory.label}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(120,100,90,0.7)' }}>
              {activeCategory.description}
            </p>
          </div>
        </div>

        {/* Question progress bar */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(answeredInCat / activeCategory.questions.length) * 100}%`,
                background: 'linear-gradient(90deg, #2e7040, #4ade80)',
                boxShadow: '0 0 6px rgba(74,222,128,0.4)',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(120,100,90,0.6)' }}>
            {answeredInCat}/{activeCategory.questions.length}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div
        key={animKey}
        style={slideStyle}
        className="glass-card p-6 sm:p-8"
      >
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
            {activeQuestionIndex + 1} / {activeCategory.questions.length}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {activeCategory.questions.map((q, i) => {
              const answered = ((catAnswers[q.id] as string[]) ?? []).length > 0;
              return (
                <div
                  key={q.id}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeQuestionIndex ? 20 : 6,
                    height: 6,
                    background:
                      i === activeQuestionIndex
                        ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                        : answered
                        ? 'rgba(46,112,64,0.5)'
                        : 'rgba(255,255,255,0.1)',
                    boxShadow: i === activeQuestionIndex ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Question heading */}
        <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#f0ece8', letterSpacing: '-0.01em' }}>
          {question.label}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(168,144,128,0.6)' }}>
          Select all that apply
        </p>

        {/* Options */}
        <div className="flex flex-wrap gap-2.5">
          {question.options.map((opt) => (
            <MultiToggleChip
              key={opt.value}
              label={opt.label}
              selected={currentAnswer.includes(opt.value)}
              onClick={() => handleToggle(opt.value)}
            />
          ))}
        </div>

        {/* Card actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft size={15} />
            {activeCatIndex === 0 && activeQuestionIndex === 0 ? 'Back' : 'Previous'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex-1 justify-center"
          >
            {isLastQuestion && isLastCategory ? (
              <>See my recommendations <ArrowRight size={15} /></>
            ) : isLastQuestion ? (
              <>
                Next: {categories.find(c => c.id === selectedCategories[activeCatIndex + 1])?.shortLabel}
                <ArrowRight size={15} />
              </>
            ) : (
              <>Continue <ArrowRight size={15} /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
