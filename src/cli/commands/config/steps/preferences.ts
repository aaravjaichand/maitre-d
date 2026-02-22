import { promptText } from '../../../ui/prompts.js';

interface PreferencesResult {
  userPreferences: { description?: string };
}

export async function runPreferencesStep(): Promise<PreferencesResult> {
  const description = await promptText({
    message:
      'Describe your dining preferences (optional — helps AI recommendations):',
    placeholder: 'e.g., "I love omakase, natural wine bars, and cozy Italian spots in the West Village"',
    defaultValue: '',
  });

  if (!description.trim()) {
    return { userPreferences: {} };
  }

  return { userPreferences: { description } };
}
