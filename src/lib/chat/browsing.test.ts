import { describe, it, expect } from 'vitest';
import { emptySession, recordView, addTime } from './browsing';

describe('recordView', () => {
  it('appends a new page with visits=1', () => {
    const s = recordView(emptySession(), '/pricing', 'Pricing');
    expect(s.page_views).toEqual([{ path: '/pricing', title: 'Pricing', visits: 1, time_seconds: 0 }]);
  });

  it('increments visits and updates title on a repeat path', () => {
    let s = recordView(emptySession(), '/pricing', 'Pricing');
    s = recordView(s, '/pricing', 'Pricing v2');
    expect(s.page_views).toHaveLength(1);
    expect(s.page_views[0].visits).toBe(2);
    expect(s.page_views[0].title).toBe('Pricing v2');
  });

  it('does not mutate the input session', () => {
    const a = emptySession();
    recordView(a, '/x', 'X');
    expect(a.page_views).toHaveLength(0);
  });
});

describe('addTime', () => {
  it('adds seconds to the matching page and the total', () => {
    let s = recordView(emptySession(), '/about', 'About');
    s = addTime(s, '/about', 30);
    expect(s.page_views[0].time_seconds).toBe(30);
    expect(s.total_time_seconds).toBe(30);
  });

  it('ignores non-positive durations', () => {
    let s = recordView(emptySession(), '/about', 'About');
    s = addTime(s, '/about', 0);
    expect(s.total_time_seconds).toBe(0);
  });
});
