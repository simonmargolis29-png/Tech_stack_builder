'use client';

interface ToggleChipProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  role?: 'radio' | 'checkbox';
}

export function ToggleChip({ label, description, selected, onClick, role = 'radio' }: ToggleChipProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      style={{
        background: selected ? 'rgba(46,112,64,0.1)' : 'rgba(20,13,10,0.6)',
        borderColor: selected ? 'rgba(46,112,64,0.6)' : 'rgba(255,255,255,0.07)',
        boxShadow: selected ? '0 0 16px rgba(46,112,64,0.12) inset' : 'none',
        backdropFilter: 'blur(12px)',
      }}
      className={`
        w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7040]/60
        hover:border-[rgba(46,112,64,0.35)]
      `}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: selected ? '2px solid #2e7040' : '2px solid rgba(255,255,255,0.15)',
            background: selected ? '#2e7040' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            boxShadow: selected ? '0 0 8px rgba(46,112,64,0.5)' : 'none',
          }}
        >
          {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
        </div>
        <div>
          <div
            className="text-sm font-medium"
            style={{ color: selected ? '#f0ece8' : '#a89080' }}
          >
            {label}
          </div>
          {description && (
            <div
              className="text-xs mt-0.5 leading-relaxed"
              style={{ color: selected ? 'rgba(160,136,128,0.8)' : 'rgba(160,136,128,0.5)' }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

interface MultiToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function MultiToggleChip({ label, selected, onClick }: MultiToggleChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onClick}
      style={{
        background: selected ? 'rgba(46,112,64,0.12)' : 'rgba(20,13,10,0.5)',
        borderColor: selected ? 'rgba(46,112,64,0.55)' : 'rgba(255,255,255,0.07)',
        boxShadow: selected ? '0 0 14px rgba(46,112,64,0.1) inset' : 'none',
      }}
      className={`
        px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7040]/60
        hover:border-[rgba(46,112,64,0.35)]
        flex items-center gap-2.5
      `}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 5,
          border: selected ? '2px solid #2e7040' : '2px solid rgba(255,255,255,0.15)',
          background: selected ? '#2e7040' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          boxShadow: selected ? '0 0 8px rgba(46,112,64,0.4)' : 'none',
        }}
      >
        {selected && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ color: selected ? '#f0ece8' : '#a89080' }}>{label}</span>
    </button>
  );
}
