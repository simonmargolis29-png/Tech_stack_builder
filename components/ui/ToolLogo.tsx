'use client';

import { useState } from 'react';

interface ToolLogoProps {
  website: string;
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(/[\s/()]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const gradients = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #2563eb, #3b82f6)',
  'linear-gradient(135deg, #0d9488, #14b8a6)',
  'linear-gradient(135deg, #ea580c, #fb923c)',
  'linear-gradient(135deg, #ca8a04, #facc15)',
  'linear-gradient(135deg, #e11d48, #f43f5e)',
  'linear-gradient(135deg, #16a34a, #4ade80)',
  'linear-gradient(135deg, #db2777, #f472b6)',
  'linear-gradient(135deg, #4f46e5, #818cf8)',
  'linear-gradient(135deg, #0284c7, #38bdf8)',
];

function hashGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function ToolLogo({ website, name, size = 40 }: ToolLogoProps) {
  const [error, setError] = useState(false);
  const initials = getInitials(name);
  const gradient = hashGradient(name);
  const radius = size * 0.2;

  if (error) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: gradient,
          borderRadius: radius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.32,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
          letterSpacing: '-0.02em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.95)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://logo.clearbit.com/${website}`}
        alt={`${name} logo`}
        width={size * 0.7}
        height={size * 0.7}
        loading="lazy"
        onError={() => setError(true)}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}
