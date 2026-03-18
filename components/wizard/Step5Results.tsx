'use client';

import type { WizardResults, ToolRecommendation } from '@/types';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ToolLogo } from '@/components/ui/ToolLogo';
import { Button } from '@/components/ui/Button';
import { Printer, RotateCcw } from 'lucide-react';

interface Step5ResultsProps {
  results: WizardResults;
  onReset: () => void;
}

const budgetLabels: Record<string, string> = {
  startup: 'Startup (<£10k)',
  smb: 'SMB (£10–50k)',
  midmarket: 'Mid-Market (£50–200k)',
  enterprise: 'Enterprise (£200k+)',
};
const sizeLabels: Record<string, string> = {
  lt50: '<50 employees',
  '50to250': '50–250 employees',
  '250to1000': '250–1,000 employees',
  gt1000: '1,000+ employees',
};
const maturityLabels: Record<string, string> = {
  no_dev: 'No dev resource',
  some_dev: 'Some dev support',
  inhouse_eng: 'In-house engineering',
};
const industryLabels: Record<string, string> = {
  sports: 'Sports',
  retail: 'Retail',
  b2b: 'B2B',
  media: 'Media',
  charity: 'Charity/NFP',
  agency: 'Agency',
};
const geoLabels: Record<string, string> = {
  uk_eu: 'UK/EU (GDPR)',
  us: 'US (CCPA)',
  mena: 'MENA (PDPL)',
  global: 'Global',
};
const deployLabels: Record<string, string> = {
  saas_only: 'SaaS only',
  cloud_hosted: 'Cloud-hosted',
  on_premise: 'On-premise option',
};

function handlePrint() {
  window.print();
}

interface PrimaryCardProps {
  rec: ToolRecommendation;
}

function PrimaryCard({ rec }: PrimaryCardProps) {
  const { tool, reasoning } = rec;
  return (
    <div
      className="glass-card p-5 sm:p-6"
      style={{ boxShadow: '0 0 40px rgba(46,112,64,0.1), 0 16px 48px rgba(0,0,0,0.3)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <ToolLogo website={tool.website} name={tool.name} size={44} />
          <div>
            <h4 className="font-bold text-lg leading-tight" style={{ color: '#f0ece8' }}>{tool.name}</h4>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium mt-1 inline-block"
              style={{ background: 'rgba(46,112,64,0.12)', color: '#4ade80', border: '1px solid rgba(46,112,64,0.25)' }}
            >
              {tool.pricingLabel}
            </span>
          </div>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: 'rgba(46,112,64,0.15)',
            border: '1px solid rgba(46,112,64,0.4)',
            color: '#4ade80',
          }}
        >
          Top pick
        </span>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(46,112,64,0.1)', marginBottom: '1rem' }} />

      {/* Reasoning */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(200,180,170,0.85)' }}>
        {reasoning}
      </p>

      {/* Pros bullets */}
      <ul className="space-y-1.5">
        {tool.pros.slice(0, 3).map((pro, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(168,144,128,0.85)' }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2e7040' }} />
            {pro}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AlsoConsiderRowProps {
  rec: ToolRecommendation;
}

function AlsoConsiderRow({ rec }: AlsoConsiderRowProps) {
  const { tool, reasoning } = rec;
  return (
    <div
      className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(20,13,10,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(46,112,64,0.25)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
      }}
    >
      <ToolLogo website={tool.website} name={tool.name} size={32} />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold" style={{ color: '#d4c8c0' }}>{tool.name}</span>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(140,120,110,0.8)' }}>{reasoning}</p>
      </div>
      <span
        className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(168,144,128,0.7)',
        }}
      >
        {tool.pricingLabel}
      </span>
    </div>
  );
}

export function Step5Results({ results, onReset }: Step5ResultsProps) {
  const { globalFilters, categoryResults, generatedAt } = results;

  const date = new Date(generatedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Build profile pills from arrays
  const filterPills: string[] = [
    ...globalFilters.budgetTier.map(v => budgetLabels[v]).filter(Boolean),
    ...globalFilters.companySize.map(v => sizeLabels[v]).filter(Boolean),
    ...globalFilters.technicalMaturity.map(v => maturityLabels[v]).filter(Boolean),
    ...globalFilters.industryVertical.map(v => industryLabels[v]).filter(Boolean),
    ...globalFilters.geography.map(v => geoLabels[v]).filter(Boolean),
    ...globalFilters.deploymentModel.map(v => deployLabels[v]).filter(Boolean),
  ];

  return (
    <div className="max-w-4xl mx-auto" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
      {/* Page header */}
      <div className="mb-10" data-print-hide="false">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4ade80' }}>
              Your recommendations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: '#f0ece8' }}>
              Your tech stack
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(120,100,90,0.7)' }}>
              Generated {date} · {categoryResults.length} component{categoryResults.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-2 items-center flex-wrap" data-print-hide>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer size={14} /> Export PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw size={14} /> Start over
            </Button>
          </div>
        </div>

        {/* Profile pills */}
        {filterPills.length > 0 && (
          <div
            className="flex flex-wrap gap-2 p-4 rounded-2xl"
            style={{
              background: 'rgba(20,13,10,0.5)',
              border: '1px solid rgba(46,112,64,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider self-center mr-1" style={{ color: 'rgba(74,222,128,0.5)' }}>
              Profile
            </span>
            {filterPills.map((pill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(200,180,170,0.8)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category sections */}
      <div className="space-y-14" role="region" aria-label="Your recommendations">
        {categoryResults.map((cr, sectionIdx) => {
          const [primary, ...others] = cr.recommendations;
          return (
            <section
              key={cr.category.id}
              style={{ animation: `fadeUp 0.5s ease-out ${sectionIdx * 0.05}s both` }}
            >
              {/* Section header */}
              <div
                className="flex items-center gap-3 mb-5 pb-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <CategoryIcon categoryId={cr.category.id} size="md" />
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#f0ece8' }}>{cr.category.label}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(120,100,90,0.6)' }}>
                    {cr.category.description}
                  </p>
                </div>
              </div>

              {/* Primary pick */}
              {primary && <PrimaryCard rec={primary} />}

              {/* Also consider */}
              {others.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(168,144,128,0.5)' }}>
                    Also consider
                  </p>
                  <div className="space-y-2">
                    {others.map((rec) => (
                      <AlsoConsiderRow key={rec.tool.id} rec={rec} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="mt-16 rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(20,13,10,0.5)',
          border: '1px solid rgba(46,112,64,0.1)',
          backdropFilter: 'blur(12px)',
        }}
        data-print-hide
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0ece8' }}>
          Want to explore a different profile?
        </h3>
        <p className="text-sm mb-5" style={{ color: 'rgba(120,100,90,0.7)' }}>
          Change your budget, team size, or add more stack components.
        </p>
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw size={14} /> Build another stack
        </Button>
      </div>
    </div>
  );
}
