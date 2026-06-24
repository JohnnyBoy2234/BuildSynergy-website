import { describe, it, expect } from 'vitest';
import { behavioralScore, browsingToSeed, type BrowsingSession } from './browsing';

const session = (overrides: Partial<BrowsingSession> = {}): BrowsingSession => ({
  referrer: '', session_count: 1, total_time_seconds: 0, page_views: [], ...overrides,
});

describe('behavioralScore', () => {
  it('adds 0.35 for a /contact visit', () => {
    const s = session({ page_views: [{ path: '/contact', title: 'Contact', visits: 1, time_seconds: 10 }] });
    expect(behavioralScore(s)).toBeCloseTo(0.35, 4);
  });

  it('caps the total at 1.0', () => {
    const s = session({
      session_count: 10, total_time_seconds: 6000,
      page_views: [
        { path: '/contact', title: 'C', visits: 1, time_seconds: 10 },
        { path: '/pricing', title: 'P', visits: 5, time_seconds: 10 },
      ],
    });
    expect(behavioralScore(s)).toBeLessThanOrEqual(1.0);
  });
});

describe('browsingToSeed', () => {
  it('notes a /services/ visit', () => {
    const s = session({ page_views: [{ path: '/services/web-design', title: 'X', visits: 1, time_seconds: 5 }] });
    expect(browsingToSeed(s).notes.join(' ')).toContain('/services/web-design');
  });

  it('notes a pricing visit', () => {
    const s = session({ page_views: [{ path: '/pricing', title: 'P', visits: 2, time_seconds: 5 }] });
    expect(browsingToSeed(s).notes.join(' ')).toContain('pricing');
  });
});
