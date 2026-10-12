// Optional AI layer. Runs on Node's native type stripping: `node server/explain.ts`.
// This folder is excluded from tsconfig (no @types/node installed). Nothing here stores or logs inputs.
import { createServer } from 'node:http';
import { guard, type Guarded } from './guard.ts';
import { buildUserMessage, SYSTEM_PROMPT } from './prompt.ts';
import { validateRequest, type ExplainRequest } from './validate.ts';

const PORT = 8787;
const MODEL = 'claude-haiku-5-5';
const MAX_BODY_BYTES = 8 * 1024;

async function askModel(req: ExplainRequest, apiKey: string): Promise<string | null> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      thinking: { type: 'disabled' }, // thinking is on by default and would eat the token budget
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(req) }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    stop_reason?: string;
    content?: Array<{ type: string; text?: string }>;
  };
  if (data.stop_reason !== 'end_turn') return null; // cut off: never show half an answer
  return data.content?.find((b) => b.type === 'text')?.text ?? null;
}

async function explain(req: ExplainRequest): Promise<Guarded> {
  const fallback: Guarded = { text: req.approvedText, source: 'fallback' };
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) return fallback;
  try {
    const modelText = await askModel(req, apiKey);
    return modelText === null ? fallback : guard(modelText, req.approvedText, req.overall);
  } catch {
    return fallback; // network error or timeout
  }
}

async function readBody(stream: AsyncIterable<Buffer>): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = createServer(async (req, res) => {
  const send = (status: number, body: unknown): void => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST' || req.url !== '/api/explain') return send(404, { error: 'not found' });
  let parsed: unknown;
  try {
    parsed = await readBody(req);
  } catch {
    return send(400, { error: 'bad request' });
  }
  const checked = validateRequest(parsed);
  if (!checked.ok) return send(400, { error: checked.error });
  send(200, await explain(checked.value));
});

server.listen(PORT, '127.0.0.1');
process.stdout.write(
  `explain server on :${PORT} (${process.env['ANTHROPIC_API_KEY'] ? 'key set' : 'no key: fallback only'})\n`,
);
