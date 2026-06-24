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
  {
    slug: 'spady',
    title: 'Spady',
    category: 'Wellness Booking Marketplace · iOS & Android',
    year: '2026',
    summary: 'A two-sided booking marketplace connecting customers with independent wellness and grooming professionals.',
    heroImage: '/portfolio-showcase.svg',
    gallery: ['/portfolio-showcase.svg'],
    tags: ['React Native & Expo', 'Two-Sided Marketplace', 'Paystack Payments', 'Custom Brand Design'],
    featured: true,
    caseStudy: {
      challenge:
        'Independent wellness and grooming professionals — barbers, hair salons, spas, massage therapists, yoga instructors — typically run their bookings through WhatsApp, phone calls and walk-ins. It\'s informal, error-prone, and gives customers no easy way to discover, compare or trust new providers.',
      approach:
        'We built Spady end-to-end as a two-sided marketplace app: a polished discovery and booking experience for customers (practitioner search, profiles with services and galleries, live availability booking, in-app chat, favourites and review prompts), and a real business toolkit for providers (onboarding, service and staff management, scheduling, a booking calendar and an earnings dashboard). Payments run through an integrated Paystack split-payout system, so providers keep their price while the platform fee is deducted automatically on every transaction with no manual invoicing. Supabase handles authentication, real-time messaging and row-level security, all on a custom brand identity and design system built specifically for the product.',
      outcome:
        'Spady is a full cross-platform app — React Native and Expo, a single codebase for iOS and Android — currently in development ahead of launch.',
    },
    metrics: [
      { value: 2, label: 'platforms, one codebase — iOS & Android' },
      { value: 100, suffix: '%', label: 'built in-house, end-to-end' },
      { value: 0, label: 'manual invoicing — automatic split payouts' },
    ],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const formatMetric = (m: Metric): string =>
  `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`;
