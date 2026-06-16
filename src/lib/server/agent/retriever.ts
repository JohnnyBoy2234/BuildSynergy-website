import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { makeEmbeddings } from './llm';

type RagFile = { model: string; chunks: string[]; vectors: number[][] };

let dataPromise: Promise<RagFile> | null = null;

function loadData(): Promise<RagFile> {
  if (!dataPromise) {
    dataPromise = Promise.resolve().then(() => {
      const path = join(process.cwd(), 'static', 'rag-vectors.json');
      return JSON.parse(readFileSync(path, 'utf-8')) as RagFile;
    });
  }
  return dataPromise;
}

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
  const data = await loadData();
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
