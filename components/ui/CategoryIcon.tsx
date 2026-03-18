import {
  Users, Mail, Database, Cloud, Layers, GitMerge,
  BarChart3, ShieldCheck, Globe, Megaphone, Lock, FlaskConical,
} from 'lucide-react';
import type { CategoryId } from '@/types';

type IconConfig = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  gradient: string;
  glow: string;
  bg: string;
};

const configs: Record<CategoryId, IconConfig> = {
  crm: {
    Icon: Users,
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    glow: 'rgba(168,85,247,0.4)',
    bg: 'rgba(124,58,237,0.15)',
  },
  esp_map: {
    Icon: Mail,
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    glow: 'rgba(59,130,246,0.4)',
    bg: 'rgba(37,99,235,0.15)',
  },
  data_warehouse: {
    Icon: Database,
    gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
    glow: 'rgba(20,184,166,0.4)',
    bg: 'rgba(13,148,136,0.15)',
  },
  cloud_infra: {
    Icon: Cloud,
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    glow: 'rgba(56,189,248,0.4)',
    bg: 'rgba(2,132,199,0.15)',
  },
  cdp: {
    Icon: Layers,
    gradient: 'linear-gradient(135deg, #4f46e5, #818cf8)',
    glow: 'rgba(129,140,248,0.4)',
    bg: 'rgba(79,70,229,0.15)',
  },
  etl: {
    Icon: GitMerge,
    gradient: 'linear-gradient(135deg, #ea580c, #fb923c)',
    glow: 'rgba(251,146,60,0.4)',
    bg: 'rgba(234,88,12,0.15)',
  },
  bi_analytics: {
    Icon: BarChart3,
    gradient: 'linear-gradient(135deg, #ca8a04, #facc15)',
    glow: 'rgba(250,204,21,0.4)',
    bg: 'rgba(202,138,4,0.15)',
  },
  identity_auth: {
    Icon: ShieldCheck,
    gradient: 'linear-gradient(135deg, #e11d48, #f43f5e)',
    glow: 'rgba(244,63,94,0.4)',
    bg: 'rgba(225,29,72,0.15)',
  },
  cms_web: {
    Icon: Globe,
    gradient: 'linear-gradient(135deg, #16a34a, #4ade80)',
    glow: 'rgba(74,222,128,0.4)',
    bg: 'rgba(22,163,74,0.15)',
  },
  paid_media: {
    Icon: Megaphone,
    gradient: 'linear-gradient(135deg, #db2777, #f472b6)',
    glow: 'rgba(244,114,182,0.4)',
    bg: 'rgba(219,39,119,0.15)',
  },
  cmp: {
    Icon: Lock,
    gradient: 'linear-gradient(135deg, #475569, #94a3b8)',
    glow: 'rgba(148,163,184,0.4)',
    bg: 'rgba(71,85,105,0.15)',
  },
  ab_testing: {
    Icon: FlaskConical,
    gradient: 'linear-gradient(135deg, #65a30d, #a3e635)',
    glow: 'rgba(163,230,53,0.4)',
    bg: 'rgba(101,163,13,0.15)',
  },
};

interface CategoryIconProps {
  categoryId: CategoryId;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { container: 36, icon: 16 },
  md: { container: 48, icon: 22 },
  lg: { container: 64, icon: 28 },
};

export function CategoryIcon({ categoryId, size = 'md' }: CategoryIconProps) {
  const config = configs[categoryId];
  const { container, icon } = sizes[size];

  return (
    <div
      style={{
        width: container,
        height: container,
        borderRadius: size === 'lg' ? 16 : size === 'md' ? 12 : 10,
        background: config.gradient,
        boxShadow: `0 4px 16px ${config.glow}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <config.Icon size={icon} strokeWidth={1.8} className="text-white" />
    </div>
  );
}
