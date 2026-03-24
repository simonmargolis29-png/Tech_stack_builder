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

      {/* Category list */}
      <div className="flex flex-col gap-2.5 mb-10">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              className="w-full text-left px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7040]/60"
              style={{
                background: isSelected ? 'rgba(46,112,64,0.1)' : 'rgba(20,13,10,0.55)',
                border: isSelected
                  ? '1px solid rgba(46,112,64,0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                boxShadow: isSelected
                  ? '0 0 24px rgba(46,112,64,0.12), 0 4px 16px rgba(0,0,0,0.2)'
                  : '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <div className="flex items-center gap-4">
                <CategoryIcon categoryId={cat.id} size="sm" />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold leading-tight mb-0.5 transition-colors"
                    style={{ color: isSelected ? '#f0ece8' : 'rgba(168,144,128,0.9)' }}
                  >
                    {cat.label}
                  </div>
                  <div
                    className="text-xs leading-relaxed truncate"
                    style={{ color: 'rgba(120,100,90,0.7)' }}
                  >
                    {cat.description}
                  </div>
                </div>

                {/* Toggle pill */}
                <div
                  className="relative flex-shrink-0"
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: isSelected
                      ? 'linear-gradient(90deg, #2e7040, #4ade80)'
                      : 'rgba(255,255,255,0.08)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(46,112,64,0.5)' : 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s ease',
                      left: isSelected ? 21 : 3,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  />
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
