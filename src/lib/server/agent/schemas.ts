import { z } from 'zod';

export const InferenceSchema = z.object({
  claim: z.string(),
  confidence: z.number().gt(0).lte(1),
  reasoning: z.string(),
});

// graph.py:64 TurnAnalysis
export const TurnAnalysisSchema = z.object({
  name: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  project_type: z.string().nullable().default(null),
  goal: z.string().nullable().default(null),
  urgency: z.string().nullable().default(null),
  extraction_quality: z.enum(['good', 'poor']).default('good'),
  inferred_project_type: InferenceSchema.nullable().default(null),
  inferred_goal: InferenceSchema.nullable().default(null),
  inferred_urgency: InferenceSchema.nullable().default(null),
  inferred_notes: z.array(InferenceSchema).default([]),
  intents: z.array(z.enum(['question', 'intake'])).default([]),
});
export type TurnAnalysis = z.infer<typeof TurnAnalysisSchema>;

export const GradeSchema = z.object({ score: z.enum(['good', 'poor']) });
export const DocGradeSchema = z.object({ score: z.enum(['relevant', 'irrelevant']) });
export const AnswerGradeSchema = z.object({ score: z.enum(['grounded', 'hallucination']) });
export const RecommendationSchema = z.object({
  action: z.enum(['portfolio', 'contact', 'newsletter']),
  message: z.string(),
});

export type Profile = {
  name: string | null; email: string | null; project_type: string | null;
  goal: string | null; urgency: string | null; notes: string[];
};
