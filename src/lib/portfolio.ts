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

const SHOTS = ['/portfolio/placeholders/shot-1.svg', '/portfolio/placeholders/shot-2.svg'];

// NOTE: placeholder content below — swap titles, copy, images and metrics for real work.
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
    slug: 'northwind-plumbing',
    title: 'Northwind Plumbing',
    category: 'Website & Local SEO',
    year: '2026',
    summary: 'A trades website that turns local searches into booked call-outs.',
    heroImage: '/portfolio/northwind-plumbing/hero.svg',
    gallery: SHOTS,
    tags: ['SvelteKit', 'Local SEO', 'Lead Capture'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Northwind relied on word of mouth and a dated one-page site that never showed up for "emergency plumber near me". Enquiries were unpredictable and easy to miss.',
      approach:
        'We rebuilt the site around the jobs people actually search for, wired up a quote form that lands straight in their inbox, and set up Google Business and local SEO so nearby customers find them first.',
      outcome:
        'Within three months the site ranked on page one for their core local terms and the team was fielding a steady stream of qualified call-out requests.',
    },
    metrics: [
      { prefix: '+', value: 140, suffix: '%', label: 'more enquiries in 3 months' },
      { value: 1, suffix: 'st', label: 'page Google for core terms' },
      { value: 24, suffix: '/7', label: 'quote form capture' },
    ],
  },
  {
    slug: 'cape-coffee-co',
    title: 'Cape Coffee Co.',
    category: 'Brand & Website',
    year: '2026',
    summary: 'A brand and storefront site for a growing Cape Town roastery.',
    heroImage: '/portfolio/cape-coffee-co/hero.svg',
    gallery: SHOTS,
    tags: ['Branding', 'Web Design', 'Photography'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Great coffee, forgettable brand. Cape Coffee looked like every other roastery online and could not justify their premium price on the shelf or the screen.',
      approach:
        'We built a distinctive visual identity — logo, palette and type — then carried it into a site that tells their sourcing story and makes the beans easy to browse.',
      outcome:
        'A coherent brand that finally matches the product, with a site that lifted average order value and wholesale enquiries.',
    },
    metrics: [
      { prefix: '+', value: 32, suffix: '%', label: 'average order value' },
      { prefix: '+', value: 18, suffix: '', label: 'wholesale enquiries / mo' },
      { value: 3, suffix: 'x', label: 'time on site vs old' },
    ],
  },
  {
    slug: 'summit-legal',
    title: 'Summit Legal',
    category: 'Website & Lead Capture',
    year: '2025',
    summary: 'A credibility-first site that books consultations for a boutique firm.',
    heroImage: '/portfolio/summit-legal/hero.svg',
    gallery: SHOTS,
    tags: ['Web Design', 'Lead Capture', 'Copywriting'],
    featured: false,
    caseStudy: {
      challenge:
        'A respected firm with a website that undersold them. Prospective clients could not tell what the firm specialised in or how to start a conversation.',
      approach:
        'We restructured the site around their practice areas, sharpened the copy to speak to client problems, and added a consultation request flow with clear next steps.',
      outcome:
        'A site that reads as senior and trustworthy, with consultation requests arriving pre-qualified and ready to book.',
    },
    metrics: [
      { prefix: '+', value: 90, suffix: '%', label: 'consultation requests' },
      { value: 2, suffix: 'x', label: 'qualified leads' },
      { value: 40, suffix: '%', label: 'less admin back-and-forth' },
    ],
  },
  {
    slug: 'tasklane-app',
    title: 'TaskLane',
    category: 'Mobile App',
    year: '2025',
    summary: 'A field-service app that keeps technicians and the office in sync.',
    heroImage: '/portfolio/tasklane-app/hero.svg',
    gallery: SHOTS,
    tags: ['iOS', 'Android', 'Product Design'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Jobs were tracked on paper and WhatsApp. Technicians double-booked, the office chased updates, and nothing was searchable after the fact.',
      approach:
        'We designed and built a cross-platform app: technicians see their day, update job status on the move, and the office gets a live view without phoning around.',
      outcome:
        'A single source of truth for every job, fewer missed appointments, and an office that finally trusts the schedule.',
    },
    metrics: [
      { value: 60, suffix: '%', label: 'fewer missed jobs' },
      { value: 4, suffix: 'hrs', label: 'admin saved / week' },
      { prefix: '+', value: 25, suffix: '%', label: 'jobs completed / day' },
    ],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const formatMetric = (m: Metric): string =>
  `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`;
