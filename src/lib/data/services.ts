export type ServiceSize = 'featured' | 'large' | 'medium' | 'small';

export interface Service {
  id: string;
  title: string;
  description: string;
  size: ServiceSize;
}

export const services: Service[] = [
  {
    id: 'websites',
    title: 'Premium Business Websites',
    description: 'Modern, professional websites designed to represent your business and win customer trust.',
    size: 'featured',
  },
  {
    id: 'redesign',
    title: 'Website Redesigns',
    description: 'Upgrade an outdated website into a cleaner, faster, and more credible online presence.',
    size: 'large',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Integration',
    description: 'Give customers a direct, simple way to contact your business from your website.',
    size: 'large',
  },
  {
    id: 'forms',
    title: 'Contact and Quote Forms',
    description: 'Make it easy for customers to enquire, request pricing, or ask for more information.',
    size: 'large',
  },
  {
    id: 'mobile',
    title: 'Mobile Optimisation',
    description: 'Ensure your website works beautifully across phones, tablets, and computers.',
    size: 'medium',
  },
  {
    id: 'chatbot',
    title: 'AI Chatbot Integration',
    description: 'A helpful website assistant that answers common customer questions automatically.',
    size: 'medium',
  },
  {
    id: 'google',
    title: 'Google Maps and Business Setup',
    description: 'Help customers find and trust your business in Google Search and Maps.',
    size: 'medium',
  },
  {
    id: 'seo',
    title: 'SEO Foundations',
    description: 'Structure your website so search engines can better discover your business.',
    size: 'medium',
  },
  {
    id: 'profile',
    title: 'Company Profile PDFs',
    description: 'Professional company documents that support your sales process.',
    size: 'small',
  },
  {
    id: 'media',
    title: 'Photography and Video',
    description: 'Better visuals that show customers the quality of your work.',
    size: 'small',
  },
  {
    id: 'analytics',
    title: 'Website Analytics',
    description: 'Understand how visitors find and use your website.',
    size: 'small',
  },
  {
    id: 'maintenance',
    title: 'Ongoing Maintenance',
    description: 'Keep your website updated, supported, and working properly after launch.',
    size: 'small',
  },
];
