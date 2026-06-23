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
  const vectors = await embedder.embedDocuments(chunks);

  writeFileSync(OUT, JSON.stringify({ model: EMBED_MODEL, chunks, vectors }));
  console.log(`Embedded ${chunks.length} chunks → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
