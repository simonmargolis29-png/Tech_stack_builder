import type { ToolRecommendation } from '@/types';
import { ToolLogo } from './ToolLogo';
import { Lightbulb, Check, Plug, DollarSign } from 'lucide-react';

const pricingBandLabel: Record<string, string> = {
  free: 'Free',
  under_500: 'Under £500/mo',
  '500_to_2k': '£500–£2k/mo',
  '2k_to_10k': '£2k–£10k/mo',
  '10k_plus': '£10k+/mo',
  custom_enterprise: 'Custom pricing',
};

const rankStyle = [
  { label: '1st', bg: 'rgba(46,112,64,0.15)', color: '#4ade80', border: 'rgba(46,112,64,0.4)', glow: 'rgba(46,112,64,0.2)' },
  { label: '2nd', bg: 'rgba(37,99,235,0.1)', color: '#60a5fa', border: 'rgba(37,99,235,0.3)', glow: 'rgba(37,99,235,0.1)' },
  { label: '3rd', bg: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: 'rgba(124,58,237,0.3)', glow: 'rgba(124,58,237,0.1)' },
] as const;

interface ToolCardProps {
  recommendation: ToolRecommendation;
}

export function ToolCard({ recommendation }: ToolCardProps) {
  const { tool, reasoning, rank } = recommendation;
  const rs = rankStyle[rank - 1];

  return (
    <div
      className="glass-card glass-card-hover flex flex-col gap-4 p-5 relative overflow-hidden"
      style={{
        animationDelay: `${(rank - 1) * 0.1}s`,
        boxShadow: `0 0 40px ${rs.glow}, 0 16px 48px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Rank badge */}
      <div
        className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}
      >
        {rs.label} pick
      </div>

      {/* Tool header */}
      <div className="flex items-start gap-3 pr-14">
        <ToolLogo website={tool.website} name={tool.name} size={44} />
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f0ece8] font-semibold text-base leading-tight">{tool.name}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(46,112,64,0.12)', color: '#4ade80', border: '1px solid rgba(46,112,64,0.25)' }}
            >
              <DollarSign size={10} />
              {pricingBandLabel[tool.pricingBand]}
            </span>
          </div>
          <p className="text-xs text-[rgba(168,144,128,0.7)] mt-1">{tool.pricingLabel}</p>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(46,112,64,0.1)' }} />

      {/* Why recommended */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={12} className="text-[#4ade80]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(168,144,128,0.6)]">Why recommended</span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'rgba(200,180,170,0.85)' }}
        >
          {reasoning}
        </p>
      </div>

      {/* Pros */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Check size={12} className="text-[#4ade80]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(168,144,128,0.6)]">Key strengths</span>
        </div>
        <ul className="space-y-1.5">
          {tool.pros.slice(0, 4).map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(168,144,128,0.8)' }}>
              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#2e7040] flex-shrink-0" />
              {pro}
            </li>
          ))}
        </ul>
      </div>

      {/* Integration notes */}
      <div
        className="rounded-xl px-3.5 py-3 mt-auto"
        style={{ background: 'rgba(46,112,64,0.05)', border: '1px solid rgba(46,112,64,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Plug size={11} className="text-[rgba(46,112,64,0.7)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(46,112,64,0.6)]">Integration notes</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(140,120,110,0.8)' }}>
          {tool.integrationNotes}
        </p>
      </div>
    </div>
  );
}
