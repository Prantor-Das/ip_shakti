import 'server-only';

import type { Language } from '@/lib/i18n/languages';
import { env } from '@/lib/env';

interface BhashiniConfig {
  callbackUrl: string;
  authName: string;
  authValue: string;
  serviceId: string;
}

interface ConfigResponse {
  pipelineResponseConfig?: Array<{ taskType?: string; config?: Array<{ serviceId?: string }> }>;
  pipelineInferenceAPIEndPoint?: {
    callbackUrl?: string;
    inferenceApiKey?: { name?: string; value?: string };
  };
}

interface TranslationResponse {
  pipelineResponse?: Array<{ output?: Array<{ target?: string }> }>;
}

const CONFIG_TTL_MS = 15 * 60 * 1000;
const TIMEOUT_MS = 12_000;
const configCache = new Map<string, { expiresAt: number; config: BhashiniConfig }>();

async function fetchJson<T>(
  url: string,
  init: RequestInit,
  parentSignal?: AbortSignal
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const signal = parentSignal
        ? AbortSignal.any([controller.signal, parentSignal])
        : controller.signal;
      const response = await fetch(url, { ...init, signal });
      if (!response.ok) throw new Error(`Bhashini request failed: ${response.status}`);
      return (await response.json()) as T;
    } catch (error: unknown) {
      lastError = error;
      if (attempt === 1) throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Bhashini request failed');
}

async function pipelineConfig(
  from: Language,
  to: Language,
  signal?: AbortSignal
): Promise<BhashiniConfig> {
  const key = `${from}:${to}`;
  const cached = configCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.config;
  const userId = env.BHASHINI_USER_ID;
  const apiKey = env.BHASHINI_ULCA_API_KEY;
  const pipelineId = env.BHASHINI_PIPELINE_ID;
  if (!userId || !apiKey || !pipelineId) throw new Error('Bhashini is not configured');
  const response = await fetchJson<ConfigResponse>(
    'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', userID: userId, ulcaApiKey: apiKey },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: { language: { sourceLanguage: from, targetLanguage: to } },
          },
        ],
        pipelineRequestConfig: { pipelineId },
      }),
    },
    signal
  );
  const task = response.pipelineResponseConfig?.find((item) => item.taskType === 'translation');
  const serviceId = task?.config?.[0]?.serviceId;
  const endpoint = response.pipelineInferenceAPIEndPoint;
  if (
    !serviceId ||
    !endpoint?.callbackUrl ||
    !endpoint.inferenceApiKey?.name ||
    !endpoint.inferenceApiKey.value
  )
    throw new Error('Bhashini returned an incomplete pipeline configuration');
  const config = {
    callbackUrl: endpoint.callbackUrl,
    authName: endpoint.inferenceApiKey.name,
    authValue: endpoint.inferenceApiKey.value,
    serviceId,
  };
  configCache.set(key, { expiresAt: Date.now() + CONFIG_TTL_MS, config });
  return config;
}

export async function translate(
  text: string,
  from: Language,
  to: Language,
  signal?: AbortSignal
): Promise<string> {
  if (from === to || !text) return text;
  const config = await pipelineConfig(from, to, signal);
  const response = await fetchJson<TranslationResponse>(
    config.callbackUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [config.authName]: config.authValue },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: { sourceLanguage: from, targetLanguage: to },
              serviceId: config.serviceId,
            },
          },
        ],
        inputData: { input: [{ source: text }] },
      }),
    },
    signal
  );
  const translated = response.pipelineResponse?.[0]?.output?.[0]?.target;
  if (!translated) throw new Error('Bhashini returned no translation');
  return translated;
}
