export interface PlatformInfo {
  name: string;
  category: string;
  description: string;
}

const lookup: Record<string, PlatformInfo> = {
  netsuite: { name: 'NetSuite', category: 'ERP / CRM', description: 'Oracle NetSuite — enterprise ERP and CRM platform' },
  sap: { name: 'SAP', category: 'ERP', description: 'SAP — enterprise resource planning and business management' },
  marketo: { name: 'Marketo', category: 'Marketing Automation', description: 'Adobe Marketo — B2B marketing automation platform' },
  pardot: { name: 'Pardot', category: 'Marketing Automation', description: 'Salesforce Pardot — B2B marketing automation' },
  eloqua: { name: 'Oracle Eloqua', category: 'Marketing Automation', description: 'Oracle Eloqua — enterprise marketing automation' },
  sendgrid: { name: 'SendGrid', category: 'ESP', description: 'Twilio SendGrid — email delivery and API platform' },
  mailgun: { name: 'Mailgun', category: 'ESP', description: 'Mailgun — email sending and delivery API' },
  emarsys: { name: 'Emarsys', category: 'ESP / CDP', description: 'SAP Emarsys — marketing automation and customer engagement' },
  'customer.io': { name: 'Customer.io', category: 'ESP / Marketing Automation', description: 'Customer.io — lifecycle email and messaging automation' },
  customerio: { name: 'Customer.io', category: 'ESP / Marketing Automation', description: 'Customer.io — lifecycle email and messaging automation' },
  'campaign monitor': { name: 'Campaign Monitor', category: 'ESP', description: 'Campaign Monitor — email marketing platform' },
  'constant contact': { name: 'Constant Contact', category: 'ESP', description: 'Constant Contact — email marketing for small businesses' },
  getresponse: { name: 'GetResponse', category: 'ESP', description: 'GetResponse — email marketing and automation' },
  tealium: { name: 'Tealium', category: 'CDP / Tag Management', description: 'Tealium — customer data platform and tag management' },
  blueconic: { name: 'BlueConic', category: 'CDP', description: 'BlueConic — customer data platform' },
  lytics: { name: 'Lytics', category: 'CDP', description: 'Lytics — customer data platform' },
  mixpanel: { name: 'Mixpanel', category: 'Analytics', description: 'Mixpanel — product and user behaviour analytics' },
  amplitude: { name: 'Amplitude', category: 'Analytics', description: 'Amplitude — product analytics and experimentation' },
  heap: { name: 'Heap', category: 'Analytics', description: 'Heap — digital insights and user analytics' },
  'adobe analytics': { name: 'Adobe Analytics', category: 'Analytics', description: 'Adobe Analytics — enterprise web and marketing analytics' },
  'google analytics': { name: 'Google Analytics', category: 'Analytics', description: 'Google Analytics — free web analytics platform' },
  hotjar: { name: 'Hotjar', category: 'Analytics', description: 'Hotjar — website heatmaps and session recordings' },
  fullstory: { name: 'FullStory', category: 'Analytics', description: 'FullStory — digital experience intelligence' },
  domo: { name: 'Domo', category: 'BI / Analytics', description: 'Domo — cloud business intelligence platform' },
  qlik: { name: 'Qlik', category: 'BI / Analytics', description: 'Qlik — business intelligence and data analytics' },
  'qlik sense': { name: 'Qlik Sense', category: 'BI / Analytics', description: 'Qlik Sense — self-service business intelligence' },
  'looker studio': { name: 'Looker Studio', category: 'BI / Analytics', description: 'Google Looker Studio — free data visualisation and reporting' },
  'power automate': { name: 'Power Automate', category: 'Automation', description: 'Microsoft Power Automate — workflow and process automation' },
  n8n: { name: 'n8n', category: 'Automation', description: 'n8n — open-source workflow automation' },
  workato: { name: 'Workato', category: 'Integration', description: 'Workato — enterprise automation and integration platform' },
  mulesoft: { name: 'MuleSoft', category: 'Integration', description: 'MuleSoft (Salesforce) — API and integration platform' },
  stitch: { name: 'Stitch', category: 'ETL / Data Pipeline', description: 'Stitch (Talend) — cloud ETL and data integration' },
  'adobe experience manager': { name: 'Adobe Experience Manager', category: 'CMS', description: 'AEM — enterprise content management and digital experience' },
  aem: { name: 'Adobe Experience Manager', category: 'CMS', description: 'AEM — enterprise content management and digital experience' },
  drupal: { name: 'Drupal', category: 'CMS', description: 'Drupal — open-source content management system' },
  squarespace: { name: 'Squarespace', category: 'CMS / Web', description: 'Squarespace — website builder and CMS' },
  wix: { name: 'Wix', category: 'CMS / Web', description: 'Wix — website builder platform' },
  'campaign manager': { name: 'Campaign Manager 360', category: 'Paid Media', description: 'Google Campaign Manager 360 — ad serving and measurement' },
  'amazon ads': { name: 'Amazon Ads', category: 'Paid Media', description: 'Amazon Advertising — retail media and sponsored ads' },
  xandr: { name: 'Xandr', category: 'Paid Media / DSP', description: 'Xandr (Microsoft) — programmatic advertising platform' },
  zendesk: { name: 'Zendesk', category: 'Customer Support', description: 'Zendesk — customer support and helpdesk platform' },
  intercom: { name: 'Intercom', category: 'Customer Support / Messaging', description: 'Intercom — customer messaging and engagement platform' },
  freshdesk: { name: 'Freshdesk', category: 'Customer Support', description: 'Freshdesk — customer support software' },
};

export function recognisePlatform(input: string): PlatformInfo | null {
  const key = input.trim().toLowerCase();
  if (!key) return null;
  // Exact match
  if (lookup[key]) return lookup[key];
  // Partial match on keys
  const partialKey = Object.keys(lookup).find(k => key.includes(k) || k.includes(key));
  if (partialKey) return lookup[partialKey];
  return null;
}
