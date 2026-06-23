import { makeEmbeddings } from './llm';
// Imported (not read from static/ at runtime) so the corpus is bundled into the
// serverless function — static/ assets are not on the Vercel function filesystem.
import ragData from './rag-vectors.json';

type RagFile = { model: string; chunks: string[]; vectors: number[][] };

const data = ragData as RagFile;

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/**
 * Returns a query fn: (query, k) => top-k chunk strings, ranked by cosine
 * similarity against the build-time-embedded corpus. Only the query is embedded
 * at runtime; corpus vectors come from static/rag-vectors.json.
 */
export async function loadRetriever() {
  const embeddings = makeEmbeddings();
  return async (query: string, k = 3): Promise<string[]> => {
    const q = await embeddings.embedQuery(query);
    return data.vectors
      .map((v, i) => ({ i, score: cosine(q, v) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, k)
      .map(({ i }) => data.chunks[i]);
  };
}
