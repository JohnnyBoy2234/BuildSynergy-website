import { describe, it, expect } from 'vitest';
import { computeLeadScore, SCORE_THRESHOLD } from './scoring';

const msg = (type: 'human' | 'ai', content: string) => ({ type, content });

describe('computeLeadScore', () => {
  it('scores an empty profile at zero', () => {
    expect(computeLeadScore({}, [], [], 0)).toBe(0);
  });

  it('weights field completeness at 0.45', () => {
    // all 4 fields filled => completeness 1.0 => 0.45 contribution
    const profile = { email: 'a@b.c', project_type: 'site', goal: 'leads', urgency: 'soon' };
    expect(computeLeadScore(profile, [], [], 0)).toBeCloseTo(0.45, 4);
  });

  it('detects pricing questions in engagement', () => {
    const score = computeLeadScore({}, [], ['how much does it cost'], 0);
    expect(score).toBeGreaterThan(0); // pricing hit contributes via 0.25 weight
  });

  it('adds behavioral signal at 0.15 weight', () => {
    expect(computeLeadScore({}, [], [], 1.0)).toBeCloseTo(0.15, 4);
  });

  it('picks up urgency language from human messages', () => {
    const score = computeLeadScore({}, [msg('human', 'I need this asap')], [], 0);
    expect(score).toBeGreaterThan(0);
  });

  it('exposes the threshold constant', () => {
    expect(SCORE_THRESHOLD).toBe(0.65);
  });
});
