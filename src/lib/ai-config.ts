/**
 * ai-config.ts
 * ============================================================
 * SINGLE source of truth for all AI model configuration.
 * Import from here — never hard-code model strings elsewhere.
 *
 * Model is served via OpenRouter (openai-compatible endpoint),
 * so we use the @ai-sdk/openai provider with a custom baseURL.
 * ============================================================
 */

import { createOpenAI } from "@ai-sdk/openai";

// ── OpenRouter endpoint ──────────────────────────────────────
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * The free model to use.
 * Swap to any OpenRouter-supported model ID, e.g.:
 *   "google/gemma-3-27b-it:free"
 *   "mistralai/mistral-7b-instruct:free"
 *   "deepseek/deepseek-r1:free"
 */
export const MODEL_ID = "google/gemma-4-26b-a4b-it:free";

// ── Generation parameters ────────────────────────────────────
/** Controls randomness: 0 = deterministic, 1 = creative */
export const TEMPERATURE = 0.7;

/** Maximum output tokens in a single response */
export const MAX_OUTPUT_TOKENS = 2048;

// ── System prompt ────────────────────────────────────────────
/**
 * Persona and behavioral instructions injected at the start of
 * every conversation. Edit here to change how the AI behaves.
 */
export const SYSTEM_PROMPT = `[SYSTEM CONTEXT & TEMPORAL ANCHOR]
Current Year: 2026
Today's Date: August 1, 2026

You are Oxie, an advanced, highly intelligent AI assistant operating in 2026. You excel in software engineering, technology, news, pop culture, entertainment, and real-time knowledge retrieval.

REAL-TIME SEARCH & TOOL CAPABILITIES:
- You have access to a tool named \`getRecentNews\` to fetch live news, recent events, pop culture updates, release dates, and real-world facts.
- Whenever a user asks about current events, recent news, movie releases, sport scores, tech updates, or any facts beyond your training cutoff, ALWAYS call the \`getRecentNews\` tool to retrieve live, accurate web search results.

Core Response Principles:
1. Direct Answer First: State the exact factual answer immediately in sentence 1 without preambles or conversational filler.
2. Factually Accurate & Cited: Use live search data to ensure accuracy and cite source URLs when available.
3. Concise & Structured: Provide short, high-value bullet points for key details, dates, and core facts.
4. Real-Time 2026 Perspective: Deliver accurate, up-to-date answers reflecting the year 2026.`;

// ── Provider factory ─────────────────────────────────────────
/**
 * Returns an OpenAI-compatible provider pointed at OpenRouter.
 * Called inside the API route handler where process.env is available.
 */
export function createOpenRouterProvider() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
  return createOpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    headers: {
      "HTTP-Referer": "https://coder-ai.vercel.app",
      "X-Title": "Chatbot-ai",
    },
  });
}
