export interface FunnelData {
  service: string;
  hasWebsite: boolean | null;
  websiteUrl: string;
  mainGoal: string;
  timeline: string;
  budget: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  agreed: boolean;
}

export function emptyFunnelData(): FunnelData {
  return {
    service: '',
    hasWebsite: null,
    websiteUrl: '',
    mainGoal: '',
    timeline: '',
    budget: '',
    name: '',
    businessName: '',
    email: '',
    phone: '',
    agreed: false,
  };
}

export const SERVICE_OPTIONS = [
  'New Website', 'Website Redesign', 'WhatsApp Integration',
  'Contact or Quote Forms', 'AI Chatbot', 'Google Visibility',
  'Company Profile', 'Photography or Video', 'Website Maintenance', 'Not Sure Yet',
];

export const TIMELINE_OPTIONS = ['ASAP', '1–3 months', 'Just exploring'];

export const BUDGET_OPTIONS = ['Under R10k', 'R10–25k', 'R25–50k', 'R50k+', 'Not sure yet'];
