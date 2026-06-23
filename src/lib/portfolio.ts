export interface Metric {
  prefix?: string;
  value: number;   // integer; count-up animates 0 → value
  suffix?: string;
  label: string;
}

export interface CaseStudy {
  challenge: string;
  approach: string;
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  heroImage: string;
  gallery: string[];
  tags: string[];
  liveUrl?: string;
  featured?: boolean;
  caseStudy: CaseStudy;
  metrics: Metric[];
}

export const projects: Project[] = [
  {
    slug: 'mzanzihomes',
    title: 'MzanziHomes',
    category: 'Full Platform Build',
    year: '2026',
    summary: 'A zero-commission rental marketplace connecting tenants directly with landlords across South Africa.',
    heroImage: '/portfolio/mzanzihomes/hero.png',
    gallery: ['/portfolio/mzanzihomes/landlords.png', '/portfolio/mzanzihomes/tenants.png'],
    tags: ['Full-Stack Build', 'Marketplace', 'Zero Commission', 'Landlord Tools'],
    liveUrl: 'https://mzanzihomes.com',
    featured: true,
    caseStudy: {
      challenge:
        'South African renters and landlords are stuck paying steep agent commissions and dealing with unverified listings, while landlords have no simple way to manage tenants, contracts and rent collection directly.',
      approach:
        'We built MzanziHomes from the ground up — a two-sided marketplace with verified listings, direct landlord-tenant communication, secure digital leases, auto-invoicing and a full property management dashboard, all on a zero-commission model.',
      outcome:
        'The platform is feature-complete and in final testing ahead of public launch, with the full tenant and landlord experience built end-to-end and ready to onboard South Africa\'s first listings.',
    },
    metrics: [
      { value: 0, suffix: '%', label: 'commission for tenants or landlords' },
      { value: 100, suffix: '%', label: 'built in-house, end-to-end' },
      { value: 2, label: 'dedicated dashboards — landlord & tenant' },
    ],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const formatMetric = (m: Metric): string =>
  `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`;
