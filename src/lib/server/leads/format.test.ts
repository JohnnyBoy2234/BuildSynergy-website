import { describe, it, expect } from 'vitest';
import { chatbotLeadEmail, funnelLeadEmail } from './format';
import type { Profile } from '../agent/schemas';
import type { FunnelData } from '$lib/components/funnel/types';

describe('chatbotLeadEmail', () => {
  it('puts email + score in the subject and includes the transcript', () => {
    const profile: Profile = {
      name: 'Caleb', email: 'c@x.com', project_type: 'store', goal: 'sales', urgency: 'soon', notes: ['note a'],
    };
    const e = chatbotLeadEmail(profile, 0.85, 'contact', 'User: hi\nAssistant: hello');
    expect(e.subject).toContain('c@x.com');
    expect(e.subject).toContain('0.85');
    expect(e.text).toContain('User: hi');
    expect(e.html).toContain('store');
  });
});

describe('funnelLeadEmail', () => {
  it('summarizes the funnel fields', () => {
    const data: FunnelData = {
      service: 'New Website', hasWebsite: false, websiteUrl: '', mainGoal: 'more leads',
      timeline: 'ASAP', budget: 'R25–50k', name: 'Jane', businessName: 'Acme',
      email: 'j@acme.com', phone: '', agreed: true,
    };
    const e = funnelLeadEmail(data);
    expect(e.subject).toContain('Jane');
    expect(e.subject).toContain('Acme');
    expect(e.text).toContain('New Website');
    expect(e.text).toContain('more leads');
  });

  it('renders hasWebsite=false as No', () => {
    const data = funnelLeadEmail({
      service: '', hasWebsite: false, websiteUrl: '', mainGoal: '', timeline: '', budget: '',
      name: 'X', businessName: 'Y', email: '', phone: '', agreed: true,
    });
    expect(data.text).toContain('Has website: No');
  });
});
