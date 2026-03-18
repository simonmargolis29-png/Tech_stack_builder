'use client';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { CategoryId } from '@/types';
import { categories } from '@/data/categories';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Button } from '@/components/ui/Button';

interface Step3CategoriesProps {
  selected: CategoryId[];
  onToggle: (id: CategoryId) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Categories({ selected, onToggle, onNext, onBack }: Step3CategoriesProps) {
  return (
    <div className="max-w-4xl mx-auto animate-slide-left">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4ade80] mb-3">Step 2 of 3</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ece8] tracking-tight mb-2">
          Select your stack components
        </h2>
        <p style={{ color: 'rgba(168,144,128,0.7)' }} className="text-base">
          Toggle on the categories you need. We'll ask a few focused questions for each one.
        </p>

        {selected.length > 0 && (
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mt-4"
            style={{
              background: 'rgba(46,112,64,0.12)',
              border: '1px solid rgba(46,112,64,0.3)',
              color: '#4ade80',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#4ade80' }}
            />
            {selected.length} component{selected.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              className="group text-left p-4 rounded-2xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7040]/60"
              style={{
                background: isSelected ? 'rgba(46,112,64,0.1)' : 'rgba(20,13,10,0.55)',
                border: isSelected
                  ? '1px solid rgba(46,112,64,0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                boxShadow: isSelected
                  ? '0 0 24px rgba(46,112,64,0.15), 0 8px 24px rgba(0,0,0,0.3)'
                  : '0 4px 16px rgba(0,0,0,0.2)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
              }}
            >
              <div className="flex flex-col gap-3">
                {/* Icon + toggle row */}
                <div className="flex items-start justify-between">
                  <CategoryIcon categoryId={cat.id} size="sm" />
                  {/* Toggle pill */}
                  <div
                    className="relative mt-0.5"
                    style={{
                      width: 32,
                      height: 18,
                      borderRadius: 9,
                      background: isSelected
                        ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                        : 'rgba(255,255,255,0.08)',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 8px rgba(46,112,64,0.5)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: '#fff',
                        transition: 'left 0.2s ease',
                        left: isSelected ? 16 : 2,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div
                    className="text-sm font-semibold leading-tight mb-1 transition-colors"
                    style={{ color: isSelected ? '#f0ece8' : 'rgba(168,144,128,0.9)' }}
                  >
                    {cat.shortLabel}
                  </div>
                  <div
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: 'rgba(120,100,90,0.8)' }}
                  >
                    {cat.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft size={15} /> Back
        </Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1 justify-center">
          {selected.length === 0 ? (
            'Select at least one component'
          ) : (
            <>Continue with {selected.length} component{selected.length !== 1 ? 's' : ''} <ArrowRight size={15} /></>
          )}
        </Button>
      </div>
    </div>
  );
}
