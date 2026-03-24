import type {
  GlobalFilters,
  WizardState,
  WizardResults,
  CategoryResult,
  ToolRecommendation,
  Tool,
  BudgetTier,
  CompanySize,
  TechnicalMaturity,
  IndustryVertical,
  Geography,
} from '@/types';
import { categories } from '@/data/categories';
import { toolsById } from '@/data/tools';

// ─── Dimension Weights ─────────────────────────────────────────────────────
// Budget and deployment are no longer collected in the UI, so they are excluded
// from scoring. Technical maturity and company size carry more weight to ensure
// tools are properly matched to the user's team profile.

const WEIGHTS = {
  technicalMaturity: 40,
  companySize: 30,
  geography: 20,
  industry: 10,
} as const;

const DISQUALIFIER_PENALTY = -80;

// ─── Core Scoring ──────────────────────────────────────────────────────────

export function scoreTool(
  tool: Tool,
  filters: GlobalFilters,
  answers: Record<string, string | string[]>
): number {
  let score = 0;
  const w = tool.scoringWeights;

  // Technical maturity — if selected and tool doesn't support it, score 0
  if (filters.technicalMaturity.length > 0) {
    score += filters.technicalMaturity.some(tm => w.technicalMaturities.includes(tm))
      ? WEIGHTS.technicalMaturity
      : 0;
  } else {
    score += WEIGHTS.technicalMaturity;
  }

  // Company size — if selected and tool doesn't match, score 0
  if (filters.companySize.length > 0) {
    score += filters.companySize.some(cs => w.companySizes.includes(cs)) ? WEIGHTS.companySize : 0;
  } else {
    score += WEIGHTS.companySize;
  }

  // Geography — disqualify if no intersection between user geo and tool geo
  if (filters.geography.length > 0 && w.geographies.length > 0) {
    const hasMatch = filters.geography.some(g => w.geographies.includes(g as Geography));
    score += hasMatch ? WEIGHTS.geography : DISQUALIFIER_PENALTY;
  } else {
    score += WEIGHTS.geography;
  }

  // Industry — empty tool industries list means fits all
  if (filters.industryVertical.length > 0) {
    if (w.industries.length === 0 || filters.industryVertical.some(iv => w.industries.includes(iv as IndustryVertical))) {
      score += WEIGHTS.industry;
    }
  } else {
    score += WEIGHTS.industry;
  }

  // Per-question bonuses
  const bonuses = w.questionBonuses;
  for (const [questionId, answerBonuses] of Object.entries(bonuses)) {
    const answer = answers[questionId];
    if (!answer) continue;

    if (Array.isArray(answer)) {
      // Skip dont_know (skipped questions) — treat as neutral
      if (answer.includes('dont_know')) continue;
      // multi-select: sum up bonuses for each selected value
      for (const val of answer) {
        score += answerBonuses[val] ?? 0;
      }
    } else {
      if (answer === 'dont_know') continue;
      score += answerBonuses[answer] ?? 0;
    }
  }

  return score;
}

// ─── Normalise scores within a category's tool set ────────────────────────

function normaliseScores(scores: Map<string, number>): Map<string, number> {
  const values = Array.from(scores.values());
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const normalised = new Map<string, number>();
  for (const [id, raw] of scores.entries()) {
    normalised.set(id, range === 0 ? 50 : Math.round(((raw - min) / range) * 100));
  }
  return normalised;
}

// ─── Reasoning String Builder ──────────────────────────────────────────────

// BudgetTier kept for type safety in case it's used elsewhere
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _budgetLabels: Record<BudgetTier, string> = {
  startup: 'startup',
  smb: 'SMB',
  midmarket: 'mid-market',
  enterprise: 'enterprise',
};

const sizeLabels: Record<CompanySize, string> = {
  lt50: 'small teams',
  '50to250': 'growing teams (50–250)',
  '250to1000': 'mid-sized organisations',
  gt1000: 'large enterprises (1,000+)',
};

const maturityLabels: Record<TechnicalMaturity, string> = {
  no_dev: 'non-technical teams',
  some_dev: 'teams with some developer support',
  inhouse_eng: 'organisations with in-house engineering',
};

function buildReasoning(
  tool: Tool,
  filters: GlobalFilters,
  answers: Record<string, string | string[]>
): string {
  const reasons: string[] = [];
  const w = tool.scoringWeights;

  const matchingMaturity = filters.technicalMaturity.find(tm => w.technicalMaturities.includes(tm));
  if (matchingMaturity) {
    reasons.push(`designed for ${maturityLabels[matchingMaturity]}`);
  }

  const matchingSize = filters.companySize.find(cs => w.companySizes.includes(cs));
  if (matchingSize) {
    reasons.push(`a strong fit for ${sizeLabels[matchingSize]}`);
  }

  const matchingIndustry = filters.industryVertical.find(iv => w.industries.includes(iv as IndustryVertical));
  if (matchingIndustry) {
    reasons.push(`purpose-built for the ${matchingIndustry} sector`);
  }

  // Add a question-specific reason for the highest bonus earned
  let topBonus = 0;
  let topReason = '';
  for (const [questionId, answerBonuses] of Object.entries(w.questionBonuses)) {
    const answer = answers[questionId];
    if (!answer) continue;
    const vals = Array.isArray(answer) ? answer : [answer];
    for (const val of vals) {
      const bonus = answerBonuses[val] ?? 0;
      if (bonus > topBonus) {
        topBonus = bonus;
        topReason = getQuestionReason(questionId, val, tool.name);
      }
    }
  }
  if (topReason) reasons.push(topReason);

  if (reasons.length === 0) {
    return `${tool.name} is a solid all-round choice for your stack based on your profile.`;
  }

  return `${tool.name} is recommended because it is ${reasons.slice(0, 3).join(', ')}.`;
}

function getQuestionReason(questionId: string, value: string, toolName: string): string {
  const map: Record<string, Record<string, string>> = {
    crm_use_case: {
      sales_pipeline: 'optimised for sales pipeline management',
      contact_management: 'great for contact and database management',
      fan_db: 'supports fan/member database use cases',
      partner_management: 'strong for partner and channel management',
    },
    crm_must_have: {
      custom_objects: 'supports highly customisable data models',
      api_access: 'offers comprehensive API access',
      workflow_automation: 'excellent workflow automation capabilities',
      reporting: 'has strong built-in reporting',
    },
    esp_channel: {
      email_only: 'focused on email delivery',
      email_sms: 'covers email and SMS in one platform',
      email_push_inapp: 'a true omnichannel messaging platform',
    },
    esp_automation: {
      basic_drip: 'easy to set up basic drip sequences',
      advanced_journeys: 'powerful journey builder for complex automation',
      ai_personalisation: 'AI-driven personalisation at scale',
    },
    dw_query: {
      ml_workloads: 'built for ML and data science workloads',
      complex_sql: 'optimised for complex analytical SQL',
      simple_reporting: 'easy to query for reporting use cases',
    },
    cdp_purpose: {
      identity_resolution: 'industry-leading identity resolution',
      audience_segmentation: 'powerful segmentation engine',
      real_time_activation: 'enables real-time channel activation',
    },
    etl_tech: {
      no_code: 'no engineering required to set up',
      low_code: 'low-code setup suitable for your team',
      engineering: 'powerful enough for an engineering-led data stack',
    },
    bi_audience: {
      client_facing: 'supports white-label client-facing dashboards',
      internal_only: 'great for internal team analytics',
      executive: 'excellent for executive-level dashboards',
    },
    cms_type: {
      ecommerce: 'the top choice for e-commerce',
      marketing_site: 'ideal for marketing website content management',
      fan_portal: 'works well for fan/member portals',
    },
    media_channels: {
      search: 'dominates search intent advertising',
      social: 'the leading social advertising platform',
      programmatic: 'a top-tier programmatic DSP',
    },
    ab_use_case: {
      feature_flags: 'the standard for feature flag management',
      web: 'excellent for no-code web A/B testing',
      full_stack: 'supports full-stack server-side experimentation',
    },
  };

  return map[questionId]?.[value] ?? '';
}

// ─── Generate Results for All Categories ──────────────────────────────────

export function generateResults(state: WizardState): WizardResults {
  const { globalFilters, selectedCategories, categoryAnswers } = state;

  const categoryResults: CategoryResult[] = selectedCategories.map((catId) => {
    const category = categories.find((c) => c.id === catId)!;
    const answers = categoryAnswers[catId] ?? {};

    const rawScores = new Map<string, number>();
    for (const toolId of category.toolIds) {
      const tool = toolsById[toolId];
      if (!tool) continue;
      rawScores.set(toolId, scoreTool(tool, globalFilters, answers));
    }

    const normScores = normaliseScores(rawScores);

    const ranked = Array.from(normScores.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        // Tie-break: more pros first, then alphabetical
        const toolA = toolsById[a[0]];
        const toolB = toolsById[b[0]];
        if (toolB.pros.length !== toolA.pros.length) return toolB.pros.length - toolA.pros.length;
        return toolA.name.localeCompare(toolB.name);
      })
      .slice(0, 3);

    const recommendations: ToolRecommendation[] = ranked.map(([toolId, score], idx) => {
      const tool = toolsById[toolId];
      return {
        tool,
        score,
        reasoning: buildReasoning(tool, globalFilters, answers),
        rank: (idx + 1) as 1 | 2 | 3,
      };
    });

    return { category, recommendations };
  });

  return {
    globalFilters,
    categoryResults,
    generatedAt: new Date().toISOString(),
  };
}
