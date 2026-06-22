import { describe, it, expect } from 'vitest';
import { projects, getProject, formatMetric } from './portfolio';

describe('projects data', () => {
  it('has at least 3 projects with unique slugs', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every project has a hero image, at least one gallery image and at least one metric', () => {
    for (const p of projects) {
      expect(p.heroImage).toMatch(/^\/portfolio\//);
      expect(p.gallery.length).toBeGreaterThan(0);
      expect(p.metrics.length).toBeGreaterThan(0);
    }
  });

  it('has at least one featured project for the homepage teaser', () => {
    expect(projects.some((p) => p.featured)).toBe(true);
  });
});

describe('getProject', () => {
  it('returns the matching project for a known slug', () => {
    const slug = projects[0].slug;
    expect(getProject(slug)?.slug).toBe(slug);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});

describe('formatMetric', () => {
  it('joins prefix, value and suffix', () => {
    expect(formatMetric({ prefix: '+', value: 140, suffix: '%', label: 'x' })).toBe('+140%');
  });

  it('omits missing prefix/suffix', () => {
    expect(formatMetric({ value: 5, label: 'x' })).toBe('5');
  });
});
