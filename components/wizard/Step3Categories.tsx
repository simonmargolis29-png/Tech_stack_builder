'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
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

const CATEGORY_TOOLTIPS: Record<string, string> = {
  crm: 'A CRM is a digital system for managing all your customer and prospect relationships — contacts, deals, and conversations in one place. Think of it as the central address book and activity log for your sales or fan-facing team.',
  esp_map: 'This is the platform you use to send marketing emails, set up automated campaigns (like welcome sequences or abandoned cart emails), and track how people engage with your messages.',
  data_warehouse: 'A central database where all your business data lives in one organised place. It lets you run reports and analysis across all your systems — like combining website data, sales data, and marketing data to answer business questions.',
  cloud_infra: 'The servers, storage, and computing power that run your apps and websites. Instead of owning physical servers, you rent this power from companies like Amazon (AWS), Google, or Microsoft.',
  cdp: 'A Customer Data Platform joins up all the data you have about each customer — from your website, app, email, CRM, and more — into a single, complete profile for each person. This helps you personalise at scale.',
  etl: 'ETL tools move data automatically between your different systems — for example, syncing your CRM data into your data warehouse every night. They are the pipes that connect your tech stack together.',
  bi_analytics: 'BI tools turn raw data into easy-to-read charts, graphs, and dashboards. They help you and your leadership team see what\'s working and make better decisions — without needing to write code.',
  identity_auth: 'Identity and authentication tools manage how people log in to your platforms — including single sign-on (one login for multiple apps), secure password management, and multi-factor authentication.',
  cms_web: 'The platform that powers your website and lets your marketing team publish and update content — like blog posts, landing pages, or product pages — without needing a developer every time.',
  paid_media: 'The advertising platforms you use to run paid digital ads — like Google Search ads, Meta (Facebook/Instagram) ads, programmatic display, or LinkedIn sponsored content.',
  cmp: 'A Consent Management Platform (CMP) handles the cookie consent banner on your website and records what each visitor has agreed to. This is a legal requirement under GDPR in the UK and EU.',
  ab_testing: 'A/B testing tools let you run experiments on your website or app — like testing two different headlines — to see which version performs better, backed by data.',
};

export function Step3Categories({ selected, onToggle, onNext, onBack }: Step3CategoriesProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto animate-slide-left">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4ade80] mb-3">Step 2 of 3</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ece8] tracking-tight mb-2">
          Select your stack components
        </h2>
        <p style={{ color: 'rgba(168,144,128,0.7)' }} className="text-base">
          Toggle on the categories you need. Hover the <Info size={13} className="inline-block mx-0.5" style={{ color: 'rgba(74,222,128,0.6)' }} /> icon for a plain-English explanation of each.
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
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />
            {selected.length} component{selected.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-2.5 mb-10">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);
          const tooltipText = CATEGORY_TOOLTIPS[cat.id];
          const isTooltipOpen = activeTooltip === cat.id;

          return (
            <div key={cat.id} className="relative">
              <button
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
                    <div className="flex items-center gap-2">
                      <div
                        className="text-sm font-semibold leading-tight transition-colors"
                        style={{ color: isSelected ? '#f0ece8' : 'rgba(168,144,128,0.9)' }}
                      >
                        {cat.label}
                      </div>
                      {/* Info icon */}
                      {tooltipText && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltip(isTooltipOpen ? null : cat.id);
                          }}
                          onMouseEnter={() => setActiveTooltip(cat.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="flex-shrink-0 flex items-center justify-center rounded-full transition-colors duration-150"
                          style={{ color: isTooltipOpen ? '#4ade80' : 'rgba(120,100,90,0.5)' }}
                          aria-label={`What is ${cat.label}?`}
                        >
                          <Info size={13} />
                        </button>
                      )}
                    </div>
                    <div
                      className="text-xs leading-relaxed truncate mt-0.5"
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

              {/* Tooltip popup */}
              {isTooltipOpen && tooltipText && (
                <div
                  className="absolute left-0 right-0 z-50 px-4 py-3 rounded-xl text-xs leading-relaxed"
                  style={{
                    top: 'calc(100% + 6px)',
                    background: 'rgba(18,12,9,0.97)',
                    border: '1px solid rgba(46,112,64,0.35)',
                    color: 'rgba(200,180,170,0.9)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                  onMouseEnter={() => setActiveTooltip(cat.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <p className="font-semibold mb-1" style={{ color: '#4ade80' }}>{cat.label}</p>
                  {tooltipText}
                </div>
              )}
            </div>
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
