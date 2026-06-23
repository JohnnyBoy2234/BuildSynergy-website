import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';

const DATA_DIR = 'data';
const OUT = 'src/lib/server/agent/rag-vectors.json';
const EMBED_MODEL = 'gemini-embedding-001'; // MUST match llm.ts EMBED_MODEL

async function main() {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.txt'));
  const docs = files.map((f) => readFileSync(join(DATA_DIR, f), 'utf-8'));

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const chunks = (await splitter.createDocuments(docs)).map((d) => d.pageContent);

  const embedder = new GoogleGenerativeAIEmbeddings({
    model: EMBED_MODEL,
    apiKey: process.env.GOOGLE_API_KEY,
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  // Batch + retry: a single large embedDocuments call hits Google's batch/rate
  // limits and silently returns empty vectors. Embed in small batches and verify.
  const BATCH = 20;
  const vectors: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    let vecs: number[][] = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      vecs = await embedder.embedDocuments(batch);
      if (vecs.every((v) => v && v.length > 0)) break;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
    if (!vecs.every((v) => v && v.length > 0)) {
      throw new Error(`empty vectors in batch starting at chunk ${i} after retries`);
    }
    vectors.push(...vecs);
    process.stdout.write(`  embedded ${vectors.length}/${chunks.length}\r`);
  }
  if (vectors.some((v) => v.length !== vectors[0].length)) {
    throw new Error('inconsistent vector dimensions');
  }

  writeFileSync(OUT, JSON.stringify({ model: EMBED_MODEL, chunks, vectors }));
  console.log(`Embedded ${chunks.length} chunks → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
