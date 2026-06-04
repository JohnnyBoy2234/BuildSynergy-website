export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  description: string;
}

export const team: TeamMember[] = [
  {
    id: 'strategy',
    initials: 'JT',
    name: 'Jonathan',
    role: 'Founder and Strategy Lead',
    description: 'Business direction, client strategy, and digital modernisation.',
  },
  {
    id: 'design',
    initials: 'CD',
    name: 'Creative',
    role: 'Creative Designer',
    description: 'Website design, visual direction, and premium brand presentation.',
  },
  {
    id: 'dev',
    initials: 'WD',
    name: 'Development',
    role: 'Web Developer',
    description: 'Fast, responsive, and professional website builds.',
  },
  {
    id: 'content',
    initials: 'CM',
    name: 'Content',
    role: 'Content and Media Specialist',
    description: 'Website copy, photography, video, and company profiles.',
  },
  {
    id: 'seo',
    initials: 'SV',
    name: 'Visibility',
    role: 'SEO and Visibility Specialist',
    description: 'Google visibility, SEO foundations, and online discoverability.',
  },
  {
    id: 'support',
    initials: 'SG',
    name: 'Support',
    role: 'Support and Maintenance Lead',
    description: 'Website updates, ongoing support, and post-launch improvements.',
  },
];
