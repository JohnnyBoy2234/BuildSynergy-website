import { ChatGroq } from '@langchain/groq';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { env } from '$env/dynamic/private';

export const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
export const EMBED_MODEL = 'text-embedding-004'; // Gemini; keep identical at build + query time

export function makeLlm(): ChatGroq {
  return new ChatGroq({ model: MODEL, apiKey: env.GROQ_API_KEY, temperature: 0 });
}

export function makeEmbeddings(): GoogleGenerativeAIEmbeddings {
  return new GoogleGenerativeAIEmbeddings({ model: EMBED_MODEL, apiKey: env.GOOGLE_API_KEY });
}
