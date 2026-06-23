import { makeLlm } from './llm';
import { loadRetriever } from './retriever';
import { getCheckpointer } from './persistence';
import { buildGraph } from './graph';

let agentPromise: ReturnType<typeof build> | null = null;

async function build() {
  const [retrieve, checkpointer] = await Promise.all([loadRetriever(), getCheckpointer()]);
  const llm = makeLlm();
  return { graph: buildGraph({ llm, retrieve }, checkpointer), llm };
}

export function getAgent() {
  if (!agentPromise) agentPromise = build();
  return agentPromise;
}
