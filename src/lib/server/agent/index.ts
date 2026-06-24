import { makeLlm } from './llm';
import { loadRetriever } from './retriever';
import { buildGraph } from './graph';

let agentPromise: ReturnType<typeof build> | null = null;

async function build() {
  const retrieve = await loadRetriever();
  const llm = makeLlm();
  return { graph: buildGraph({ llm, retrieve }), llm };
}

export function getAgent() {
  if (!agentPromise) agentPromise = build();
  return agentPromise;
}
