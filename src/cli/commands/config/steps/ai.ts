import type { CredentialStore } from '../../../../storage/credential-store.js';
import { promptSelect, promptText, promptPassword } from '../../../ui/prompts.js';
import { printSuccess } from '../../../ui/output.js';

interface AIResult {
  ai: {
    provider?: string;
    model?: string;
    baseUrl?: string;
    temperature: number;
    enabled: boolean;
  };
}

const AI_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google (Gemini)' },
  { value: 'ollama', label: 'Ollama (local)' },
  { value: 'openai-compatible', label: 'OpenAI-compatible endpoint' },
  { value: 'skip', label: 'Skip — no AI features' },
];

const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-5-20250929',
  google: 'gemini-2.0-flash',
};

export async function runAIStep(
  credentialStore: CredentialStore,
  passphrase: string,
): Promise<AIResult> {
  const provider = await promptSelect<string>({
    message: 'Which AI provider would you like to use?',
    options: AI_PROVIDERS,
  });

  if (provider === 'skip') {
    return {
      ai: { temperature: 0.3, enabled: false },
    };
  }

  if (provider === 'ollama') {
    const baseUrl = await promptText({
      message: 'Ollama base URL:',
      defaultValue: 'http://localhost:11434',
      placeholder: 'http://localhost:11434',
    });

    const model = await promptText({
      message: 'Model name:',
      defaultValue: 'llama3.2',
      placeholder: 'llama3.2',
    });

    return {
      ai: { provider, model, baseUrl, temperature: 0.3, enabled: true },
    };
  }

  if (provider === 'openai-compatible') {
    const baseUrl = await promptText({
      message: 'Base URL:',
      validate: (v) => {
        if (!v?.trim()) return 'Base URL is required';
      },
    });

    const apiKey = await promptPassword({
      message: 'API key:',
      validate: (v) => {
        if (!v?.trim()) return 'API key is required';
      },
    });

    const model = await promptText({
      message: 'Model name:',
      validate: (v) => {
        if (!v?.trim()) return 'Model name is required';
      },
    });

    credentialStore.store('openai-compatible.apiKey', apiKey, passphrase);
    printSuccess('API key saved');

    return {
      ai: { provider, model, baseUrl, temperature: 0.3, enabled: true },
    };
  }

  // Cloud providers: openai, anthropic, google
  const apiKey = await promptPassword({
    message: `${AI_PROVIDERS.find((p) => p.value === provider)?.label} API key:`,
    validate: (v) => {
      if (!v?.trim()) return 'API key is required';
    },
  });

  credentialStore.store(`${provider}.apiKey`, apiKey, passphrase);
  printSuccess('API key saved');

  const defaultModel = DEFAULT_MODELS[provider];
  const model = await promptText({
    message: 'Model name:',
    defaultValue: defaultModel,
    placeholder: defaultModel,
  });

  return {
    ai: { provider, model, temperature: 0.3, enabled: true },
  };
}
