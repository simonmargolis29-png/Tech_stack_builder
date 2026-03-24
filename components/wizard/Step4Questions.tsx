'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import type { CategoryId, CategoryAnswers, UserTechnicalLevel } from '@/types';
import { recognisePlatform } from '@/data/platformLookup';
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
  userTechnicalLevel: UserTechnicalLevel | null;
}

function isQuestionVisible(
  question: { minTechnicalLevel?: 'semi_technical' | 'technical' },
  userTechnicalLevel: UserTechnicalLevel | null
): boolean {
  if (!question.minTechnicalLevel) return true;
  if (!userTechnicalLevel || userTechnicalLevel === 'technical') return true;
  if (userTechnicalLevel === 'semi_technical') return question.minTechnicalLevel === 'semi_technical';
  return false; // non_technical
}

function isCategoryComplete(
  categoryId: CategoryId,
  answers: CategoryAnswers,
  userTechnicalLevel: UserTechnicalLevel | null
): boolean {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return false;
  const catAnswers = answers[categoryId] ?? {};
  return cat.questions.every((q) => {
    // Skip tech-level-filtered questions
    if (!isQuestionVisible(q, userTechnicalLevel)) return true;
    const a = catAnswers[q.id];
    if (a && (Array.isArray(a) ? a.length > 0 : a !== '')) return true;
    if (q.skipIf) {
      const depAnswer = catAnswers[q.skipIf.questionId];
      const depValues = Array.isArray(depAnswer) ? depAnswer : depAnswer ? [depAnswer] : [];
      if (depValues.some(v => q.skipIf!.values.includes(v))) return true;
    }
    return false;
  });
}

function shouldSkipQuestion(
  question: { skipIf?: { questionId: string; values: string[]; autoAnswer: string } },
  catAnswers: Record<string, string | string[]>
): boolean {
  if (!question.skipIf) return false;
  const depAnswer = catAnswers[question.skipIf.questionId];
  const depValues = Array.isArray(depAnswer) ? depAnswer : depAnswer ? [depAnswer] : [];
  return depValues.some(v => question.skipIf!.values.includes(v));
}

const DONT_KNOW = 'dont_know';

export function Step4Questions({ selectedCategories, answers, onAnswer, onNext, onBack, userTechnicalLevel }: Step4QuestionsProps) {
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questionDirection, setQuestionDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);
  const [otherText, setOtherText] = useState<Record<string, string>>({});

  const activeCatId = selectedCategories[activeCatIndex];
  const activeCategory = categories.find((c) => c.id === activeCatId)!;
  const catAnswers = answers[activeCatId] ?? {};

  // Visible questions = not skipIf-skipped AND meets tech level requirement
  const visibleQuestions = activeCategory.questions.filter(
    q => !shouldSkipQuestion(q, catAnswers) && isQuestionVisible(q, userTechnicalLevel)
  );

  // Auto-set answers for any questions that should be conditionally skipped
  useEffect(() => {
    activeCategory.questions.forEach(q => {
      if (q.skipIf && shouldSkipQuestion(q, catAnswers)) {
        const currentVal = catAnswers[q.id] as string[] | undefined;
        if (!currentVal || !currentVal.includes(q.skipIf.autoAnswer)) {
          onAnswer(activeCatId, q.id, [q.skipIf.autoAnswer]);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCatId, JSON.stringify(catAnswers)]);

  const safeQuestionIndex = Math.min(activeQuestionIndex, Math.max(0, visibleQuestions.length - 1));
  const question = visibleQuestions[safeQuestionIndex];
  const isLastCategory = activeCatIndex === selectedCategories.length - 1;
  const isLastQuestion = safeQuestionIndex === visibleQuestions.length - 1;

  const skippedQuestion = activeCategory.questions.find(
    q => q.skipIf && shouldSkipQuestion(q, catAnswers)
  );

  const currentAnswer = question ? ((catAnswers[question.id] as string[]) ?? []) : [];
  const hasAnswer = currentAnswer.length > 0;
  const isCurrentToolsQuestion = question?.id.startsWith('current_tools_') ||
    question?.id.includes('_current_tools');

  function handleToggle(value: string) {
    if (!question) return;
    if (question.type === 'single_select') {
      onAnswer(activeCatId, question.id, [value]);
    } else {
      const next = currentAnswer.includes(value)
        ? currentAnswer.filter(v => v !== value)
        : [...currentAnswer, value];
      onAnswer(activeCatId, question.id, next);
    }
  }

  function handleSkip() {
    if (!question) return;
    onAnswer(activeCatId, question.id, [DONT_KNOW]);
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
    if (safeQuestionIndex > 0) {
      setQuestionDirection('back');
      setAnimKey(k => k + 1);
      setActiveQuestionIndex(i => i - 1);
    } else if (activeCatIndex > 0) {
      const prevCatId = selectedCategories[activeCatIndex - 1];
      const prevCat = categories.find(c => c.id === prevCatId)!;
      const prevVisible = prevCat.questions.filter(
        q => !shouldSkipQuestion(q, answers[prevCatId] ?? {}) && isQuestionVisible(q, userTechnicalLevel)
      );
      setActiveCatIndex(i => i - 1);
      setActiveQuestionIndex(Math.max(0, prevVisible.length - 1));
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

  const answeredInCat = visibleQuestions.filter(q => {
    const a = catAnswers[q.id];
    return a && (Array.isArray(a) ? a.length > 0 : a !== '');
  }).length;

  if (!question) return null;

  const isDontKnow = currentAnswer.includes(DONT_KNOW);

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
                width: idx === activeCatIndex ? 28 : isCategoryComplete(catId, answers, userTechnicalLevel) ? 14 : 8,
                background:
                  idx === activeCatIndex
                    ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                    : isCategoryComplete(catId, answers, userTechnicalLevel)
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
                width: `${(answeredInCat / visibleQuestions.length) * 100}%`,
                background: 'linear-gradient(90deg, #2e7040, #4ade80)',
                boxShadow: '0 0 6px rgba(74,222,128,0.4)',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(120,100,90,0.6)' }}>
            {answeredInCat}/{visibleQuestions.length}
          </span>
        </div>
      </div>

      {/* Auto-set notice */}
      {skippedQuestion?.skipIf && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-4"
          style={{
            background: 'rgba(46,112,64,0.08)',
            border: '1px solid rgba(46,112,64,0.25)',
          }}
        >
          <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#4ade80' }} />
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(74,222,128,0.8)' }}>
            <strong>IP type auto-selected:</strong> {skippedQuestion.skipIf.autoAnswerLabel}
          </p>
        </div>
      )}

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
            {safeQuestionIndex + 1} / {visibleQuestions.length}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {visibleQuestions.map((q, i) => {
              const answered = ((catAnswers[q.id] as string[]) ?? []).length > 0;
              return (
                <div
                  key={q.id}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === safeQuestionIndex ? 20 : 6,
                    height: 6,
                    background:
                      i === safeQuestionIndex
                        ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                        : answered
                        ? 'rgba(46,112,64,0.5)'
                        : 'rgba(255,255,255,0.1)',
                    boxShadow: i === safeQuestionIndex ? '0 0 6px rgba(74,222,128,0.4)' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Question heading */}
        <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: '#f0ece8', letterSpacing: '-0.01em' }}>
          {userTechnicalLevel === 'non_technical' ? (question.labelNonTechnical ?? question.label) : question.label}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(168,144,128,0.6)' }}>
          {isCurrentToolsQuestion
            ? 'Select all that apply — helps us understand your migration context'
            : question.type === 'single_select'
            ? 'Select one'
            : 'Select all that apply'}
        </p>

        {/* Skipped / Don't know state */}
        {isDontKnow ? (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-sm" style={{ color: 'rgba(168,144,128,0.7)' }}>Skipped / Don&apos;t know</span>
            <button
              onClick={() => onAnswer(activeCatId, question.id, [])}
              className="text-xs underline"
              style={{ color: 'rgba(74,222,128,0.7)' }}
            >
              Answer instead
            </button>
          </div>
        ) : (
          /* Options */
          <>
            <div className="flex flex-wrap gap-2.5">
              {question.options.map((opt) => (
                <MultiToggleChip
                  key={opt.value}
                  label={userTechnicalLevel === 'non_technical' ? (opt.labelNonTechnical ?? opt.label) : opt.label}
                  selected={currentAnswer.includes(opt.value)}
                  onClick={() => handleToggle(opt.value)}
                />
              ))}
            </div>
            {currentAnswer.includes('other') && !isDontKnow && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Type the platform name..."
                  value={otherText[question.id] ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    setOtherText(prev => ({ ...prev, [question.id]: val }));
                    onAnswer(activeCatId, question.id + '_other_text', val);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(46,112,64,0.3)',
                    color: '#f0ece8',
                  }}
                />
                {(() => {
                  const match = recognisePlatform(otherText[question.id] ?? '');
                  if (!match) return null;
                  return (
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(46,112,64,0.1)', border: '1px solid rgba(46,112,64,0.25)' }}>
                      <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>{match.name}</span>
                      <span className="text-xs" style={{ color: 'rgba(140,120,110,0.8)' }}>· {match.category} — {match.description}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* Card actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft size={15} />
            {activeCatIndex === 0 && safeQuestionIndex === 0 ? 'Back' : 'Previous'}
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

        {/* Skip link */}
        {!isDontKnow && (
          <div className="text-center mt-3">
            <button
              onClick={handleSkip}
              className="text-xs transition-colors duration-150"
              style={{ color: 'rgba(120,100,90,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(120,100,90,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(120,100,90,0.5)')}
            >
              Skip / Don&apos;t know
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
