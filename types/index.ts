// ─── Global Filter Types ───────────────────────────────────────────────────────

export type BudgetTier = 'startup' | 'smb' | 'midmarket' | 'enterprise';
export type CompanySize = 'lt50' | '50to250' | '250to1000' | 'gt1000';
export type TechnicalMaturity = 'no_dev' | 'some_dev' | 'inhouse_eng';
export type IndustryVertical = 'sports' | 'retail' | 'b2b' | 'media' | 'charity' | 'agency';
export type Geography = 'uk_eu' | 'us' | 'mena' | 'global';
export type DeploymentModel = 'saas_only' | 'cloud_hosted' | 'on_premise';

export interface GlobalFilters {
  budgetTier: BudgetTier[];
  companySize: CompanySize[];
  technicalMaturity: TechnicalMaturity[];
  industryVertical: IndustryVertical[];
  geography: Geography[];
  deploymentModel: DeploymentModel[];
}

// ─── Category Types ────────────────────────────────────────────────────────────

export type CategoryId =
  | 'crm'
  | 'esp_map'
  | 'data_warehouse'
  | 'cloud_infra'
  | 'cdp'
  | 'etl'
  | 'bi_analytics'
  | 'identity_auth'
  | 'cms_web'
  | 'paid_media'
  | 'cmp'
  | 'ab_testing';

export interface Category {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string; // emoji used in UI
  questions: Question[];
  toolIds: string[];
}

// ─── Question Types ────────────────────────────────────────────────────────────

export type QuestionType = 'single_select' | 'multi_select';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  label: string;
  type: QuestionType;
  options: QuestionOption[];
}

// ─── Tool Types ────────────────────────────────────────────────────────────────

export type PricingBand =
  | 'free'
  | 'under_500'
  | '500_to_2k'
  | '2k_to_10k'
  | '10k_plus'
  | 'custom_enterprise';

export interface ToolScoringWeights {
  budgetTiers: BudgetTier[];
  companySizes: CompanySize[];
  technicalMaturities: TechnicalMaturity[];
  industries: IndustryVertical[]; // empty = fits all
  geographies: Geography[]; // empty = fits all
  deploymentModels: DeploymentModel[];
  questionBonuses: Record<string, Record<string, number>>;
}

export interface Tool {
  id: string;
  name: string;
  categoryId: CategoryId;
  website: string;
  pricingBand: PricingBand;
  pricingLabel: string;
  pros: string[];
  integrationNotes: string;
  scoringWeights: ToolScoringWeights;
}

// ─── Wizard State ──────────────────────────────────────────────────────────────

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type CategoryAnswers = Record<string, Record<string, string | string[]>>;

export interface WizardState {
  currentStep: WizardStep;
  globalFilters: GlobalFilters;
  selectedCategories: CategoryId[];
  categoryAnswers: CategoryAnswers;
  activeCategoryIndex: number; // used within step 4
}

// ─── Result Types ──────────────────────────────────────────────────────────────

export interface ToolRecommendation {
  tool: Tool;
  score: number;
  reasoning: string;
  rank: 1 | 2 | 3;
}

export interface CategoryResult {
  category: Category;
  recommendations: ToolRecommendation[];
}

export interface WizardResults {
  globalFilters: GlobalFilters;
  categoryResults: CategoryResult[];
  generatedAt: string;
}

// ─── Filter Option ─────────────────────────────────────────────────────────────

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}
