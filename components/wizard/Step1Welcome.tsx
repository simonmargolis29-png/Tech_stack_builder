'use client';

import { ArrowRight, Zap, Package, ScanSearch, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Step1WelcomeProps {
  onNext: () => void;
}

const features = [
  {
    icon: ScanSearch,
    label: 'Personalised to you',
    desc: 'Tailored to your budget, team size, and technical capability',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    icon: Zap,
    label: 'Fast results',
    desc: 'Answer ~15 questions and get a full stack recommendation in under 5 minutes',
    gradient: 'linear-gradient(135deg, #ca8a04, #facc15)',
    glow: 'rgba(250,204,21,0.2)',
  },
  {
    icon: Package,
    label: '50+ tools evaluated',
    desc: 'Across 12 stack categories — from CRM to data warehouse to paid media',
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    glow: 'rgba(56,189,248,0.2)',
  },
  {
    icon: Layers,
    label: 'Fully explained',
    desc: 'Each recommendation includes reasoning, pricing band, and integration notes',
    gradient: 'linear-gradient(135deg, #2e7040, #4ade80)',
    glow: 'rgba(74,222,128,0.2)',
  },
];

export function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-up">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
        style={{
          background: 'rgba(46,112,64,0.1)',
          border: '1px solid rgba(46,112,64,0.3)',
          color: '#4ade80',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
        Free to use · No sign-up required
      </div>

      {/* Headline */}
      <h1
        className="text-5xl sm:text-6xl font-bold tracking-tight mb-5 leading-[1.08]"
      >
        <span className="gradient-text-white-green">Build your ideal</span>
        <br />
        <span className="gradient-text">tech stack</span>
      </h1>

      <p
        className="text-lg sm:text-xl leading-relaxed mb-12 max-w-xl"
        style={{ color: 'rgba(168,144,128,0.9)' }}
      >
        Answer a few questions about your organisation and get expert-level,
        personalised recommendations across your entire marketing and data technology stack.
      </p>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3 w-full mb-10 max-w-2xl">
        {features.map((f) => (
          <div
            key={f.label}
            className="glass-card glass-card-hover text-left p-5"
            style={{ boxShadow: `0 0 24px ${f.glow}` }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: f.gradient, boxShadow: `0 4px 12px ${f.glow}` }}
            >
              <f.icon size={17} className="text-white" strokeWidth={1.8} />
            </div>
            <div className="text-sm font-semibold text-[#f0ece8] mb-1">{f.label}</div>
            <div className="text-xs leading-relaxed" style={{ color: 'rgba(140,120,110,0.8)' }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onNext} className="gap-3">
        Get started
        <ArrowRight size={17} />
      </Button>

      {/* Stack preview chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-10">
        {['CRM', 'ESP / MAP', 'Data Warehouse', 'CDP', 'BI & Analytics', 'Paid Media', 'CMS', 'ETL', 'Identity', 'CMP', 'A/B Testing', 'Cloud'].map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(168,144,128,0.6)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
