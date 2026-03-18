import type {
  FilterOption,
  BudgetTier,
  CompanySize,
  TechnicalMaturity,
  IndustryVertical,
  Geography,
  DeploymentModel,
} from '@/types';

export const budgetTierOptions: FilterOption<BudgetTier>[] = [
  { value: 'startup', label: 'Startup', description: 'Under £10k/yr total tech spend' },
  { value: 'smb', label: 'SMB', description: '£10k – £50k/yr' },
  { value: 'midmarket', label: 'Mid-Market', description: '£50k – £200k/yr' },
  { value: 'enterprise', label: 'Enterprise', description: '£200k+/yr' },
];

export const companySizeOptions: FilterOption<CompanySize>[] = [
  { value: 'lt50', label: '<50 employees' },
  { value: '50to250', label: '50 – 250 employees' },
  { value: '250to1000', label: '250 – 1,000 employees' },
  { value: 'gt1000', label: '1,000+ employees' },
];

export const technicalMaturityOptions: FilterOption<TechnicalMaturity>[] = [
  { value: 'no_dev', label: 'No dev resource', description: 'Marketing team manages tools' },
  { value: 'some_dev', label: 'Some dev support', description: 'Occasional developer help' },
  { value: 'inhouse_eng', label: 'In-house engineering', description: 'Dedicated data/eng team' },
];

export const industryVerticalOptions: FilterOption<IndustryVertical>[] = [
  { value: 'sports', label: 'Sports' },
  { value: 'retail', label: 'Retail / E-commerce' },
  { value: 'b2b', label: 'B2B / SaaS' },
  { value: 'media', label: 'Media / Publishing' },
  { value: 'charity', label: 'Charity / NFP' },
  { value: 'agency', label: 'Agency' },
];

export const geographyOptions: FilterOption<Geography>[] = [
  { value: 'uk_eu', label: 'UK / EU', description: 'GDPR compliant' },
  { value: 'us', label: 'US', description: 'CCPA / state privacy laws' },
  { value: 'mena', label: 'MENA', description: 'PDPL (Saudi) + regional' },
  { value: 'global', label: 'Global multi-jurisdiction', description: 'All major privacy regimes' },
];

export const deploymentModelOptions: FilterOption<DeploymentModel>[] = [
  { value: 'saas_only', label: 'SaaS only', description: 'Fully managed, no infrastructure' },
  { value: 'cloud_hosted', label: 'Cloud-hosted', description: 'Managed cloud deployment' },
  { value: 'on_premise', label: 'On-premise option', description: 'Self-hosted or private cloud required' },
];
