export const SCORE_THRESHOLD = 0.65;

const FIELD_POINTS: Record<string, number> = { email: 2, project_type: 3, goal: 3, urgency: 2 };
const MAX_POINTS = Object.values(FIELD_POINTS).reduce((a, b) => a + b, 0); // 10

const PRICING_KEYWORDS = ['how much', 'pricing', 'cost', 'do you do', 'can you build', 'price', 'rate', 'charge'];
const URGENCY_KEYWORDS = ['asap', 'deadline', 'urgent', 'as soon as', 'need it', 'by '];
const BUDGET_KEYWORDS = ['budget', 'how much', 'pricing', 'cost', ' r ', 'afford'];

type Msg = { type: string; content: string };

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

function fieldCompleteness(profile: Record<string, unknown>): number {
  const filled = Object.entries(FIELD_POINTS).reduce(
    (sum, [field, pts]) => (profile[field] ? sum + pts : sum), 0);
  return filled / MAX_POINTS;
}

function engagementScore(questionsAsked: string[]): number {
  const turnDepth = Math.min(questionsAsked.length / 8, 1.0);
  const qs = questionsAsked.map((q) => q.toLowerCase());
  const pricingHit = qs.some((q) => PRICING_KEYWORDS.some((kw) => q.includes(kw))) ? 0.4 : 0.0;
  const otherQs = qs.filter((q) => !PRICING_KEYWORDS.some((kw) => q.includes(kw)));
  const otherScore = Math.min(otherQs.length * 0.15, 0.6);
  return Math.min(turnDepth + pricingHit + otherScore, 1.0);
}

function intentSignalScore(messages: Msg[]): number {
  const allText = messages
    .filter((m) => m.type === 'human' && typeof m.content === 'string')
    .map((m) => m.content.toLowerCase())
    .join(' ');
  const urgency = URGENCY_KEYWORDS.some((kw) => allText.includes(kw)) ? 0.6 : 0.0;
  const budget = BUDGET_KEYWORDS.some((kw) => allText.includes(kw)) ? 0.4 : 0.0;
  return Math.min(urgency + budget, 1.0);
}

export function computeLeadScore(
  profile: Record<string, unknown>,
  messages: Msg[],
  questionsAsked: string[],
  behavioral = 0.0,
): number {
  const completeness = fieldCompleteness(profile);
  const engagement = engagementScore(questionsAsked);
  const intent = intentSignalScore(messages);
  return round4(completeness * 0.45 + engagement * 0.25 + intent * 0.15 + behavioral * 0.15);
}
