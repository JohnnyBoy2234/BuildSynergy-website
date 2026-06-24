export type PageView = { path: string; title: string; visits: number; time_seconds: number };
export type BrowsingSession = {
  referrer: string; session_count: number; total_time_seconds: number; page_views: PageView[];
};
export type BrowsingSeed = { notes: string[] };

const hasPath = (s: BrowsingSession, prefix: string) => s.page_views.some((pv) => pv.path.startsWith(prefix));
const visitsTo = (s: BrowsingSession, prefix: string) =>
  s.page_views.filter((pv) => pv.path.startsWith(prefix)).reduce((sum, pv) => sum + pv.visits, 0);
const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

export function behavioralScore(s: BrowsingSession): number {
  let score = 0.0;
  if (hasPath(s, '/contact')) score += 0.35;
  const pricingVisits = visitsTo(s, '/pricing');
  if (pricingVisits) score += Math.min(0.15 + 0.1 * (pricingVisits - 1), 0.35);
  score += Math.min(((s.session_count ?? 1) - 1) * 0.1, 0.2);
  score += Math.min(((s.total_time_seconds ?? 0) / 600) * 0.1, 0.1);
  return round4(Math.min(score, 1.0));
}

export function browsingToSeed(s: BrowsingSession): BrowsingSeed {
  const notes: string[] = [];
  for (const pv of s.page_views) {
    const { path } = pv;
    const visits = pv.visits ?? 1;
    if (path.startsWith('/pricing')) {
      const suffix = visits > 1 ? ` ${visits}×` : '';
      notes.push(`Viewed /pricing${suffix} before chatting — price-sensitive / evaluating cost`);
    } else if (path.startsWith('/contact')) {
      notes.push('Visited /contact — high intent, near conversion');
    } else if (path.startsWith('/portfolio/') || path.startsWith('/services/')) {
      notes.push(`Browsed ${path}`);
    }
  }
  return { notes };
}
