/**
 * LLM client — Groq-powered (FREE tier, OpenAI-compatible API).
 *
 * Free key: https://console.groq.com/keys
 * Default model: llama-3.1-70b-versatile (excellent for sales/support chat)
 *
 * Why Groq?
 *   - Generous free tier (RPM/TPM higher than OpenAI free)
 *   - Blazing fast inference (often sub-200ms)
 *   - Llama 3.1 70B quality is on par with GPT-4-class for chat
 *   - Drop-in OpenAI SDK replacement (same call shape)
 *
 * To switch back to OpenAI: change the import + baseURL.
 */

import Groq from 'groq-sdk';
import type {
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsNonStreaming,
} from 'groq-sdk/resources/chat/completions';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    if (!GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY is not set. Add it to .env.local (get a free key at https://console.groq.com/keys).'
      );
    }
    client = new Groq({ apiKey: GROQ_API_KEY });
  }
  return client;
}

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
  jsonMode?: boolean; // request JSON-formatted output
};

const DEFAULT_MODEL_FALLBACKS = [
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

export async function chatCompletion(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<string> {
  const params: ChatCompletionCreateParamsNonStreaming = {
    model: opts.model || GROQ_MODEL,
    messages: messages as ChatCompletionMessageParam[],
    temperature: opts.temperature ?? 0.75,
    max_tokens: opts.maxTokens ?? 800,
    top_p: opts.topP ?? 0.95,
    ...(opts.stop ? { stop: opts.stop } : {}),
    ...(opts.jsonMode ? { response_format: { type: 'json_object' } } : {}),
  };

  try {
    const res = await getClient().chat.completions.create(params);
    return res.choices[0]?.message?.content?.trim() || '';
  } catch (err: unknown) {
    // Auto-fallback to a different model if primary is rate-limited/decommissioned
    const error = err as { status?: number; code?: string; message?: string };
    const isModelIssue =
      error?.status === 400 || error?.code === 'model_decommissioned' || /model/i.test(error?.message || '');

    if (isModelIssue) {
      const fallback = DEFAULT_MODEL_FALLBACKS.find((m) => m !== params.model);
      if (fallback) {
        console.warn(`[llm] model ${params.model} unavailable, falling back to ${fallback}`);
        const res = await getClient().chat.completions.create({
          ...params,
          model: fallback,
        });
        return res.choices[0]?.message?.content?.trim() || '';
      }
    }
    throw err;
  }
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): AsyncGenerator<string, void, void> {
  const stream = await getClient().chat.completions.create({
    model: opts.model || GROQ_MODEL,
    messages: messages as ChatCompletionMessageParam[],
    temperature: opts.temperature ?? 0.75,
    max_tokens: opts.maxTokens ?? 800,
    top_p: opts.topP ?? 0.95,
    stream: true,
    ...(opts.stop ? { stop: opts.stop } : {}),
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

/**
 * Generate embeddings-free retrieval-augmented completion.
 * Uses simple keyword overlap; for production scale, swap with vector search.
 */
export async function ragCompletion(
  systemPrompt: string,
  userMessage: string,
  context: string[],
  opts: ChatOptions = {}
): Promise<string> {
  const contextBlock = context.length
    ? `\n\nRELEVANT KNOWLEDGE BASE:\n${context
        .map((c, i) => `[${i + 1}] ${c}`)
        .join('\n\n')}\n\nUse the above snippets to answer accurately when relevant. If the answer is not in the knowledge base, use your general knowledge but say so.`
    : '';

  return chatCompletion(
    [
      { role: 'system', content: systemPrompt + contextBlock },
      { role: 'user', content: userMessage },
    ],
    opts
  );
}

export function isLLMEnabled() {
  return Boolean(GROQ_API_KEY);
}
