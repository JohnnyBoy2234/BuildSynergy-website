import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import type { BaseMessage } from '@langchain/core/messages';
import type { Profile } from './schemas';
import type { BrowsingSession } from './browsing';

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer, default: () => [] }),
  profile: Annotation<Profile>,
  alert_human: Annotation<boolean>,
  retrieved_docs: Annotation<string>,
  pending_message: Annotation<string>,
  retry_counts: Annotation<Record<string, number>>({ reducer: (_a, b) => b, default: () => ({}) }),
  lead_score: Annotation<number>,
  intents: Annotation<string[]>({ reducer: (_a, b) => b, default: () => [] }),
  questions_asked: Annotation<string[]>({ reducer: (_a, b) => b, default: () => [] }),
  browsing: Annotation<BrowsingSession | null>,
  // ephemeral RAG routing signal (overwritten each turn)
  answer_grade: Annotation<string>,
  recommendation_action: Annotation<string>,
});

export type AgentStateType = typeof AgentState.State;
