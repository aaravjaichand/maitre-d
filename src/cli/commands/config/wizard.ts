import type { ConfigManager } from '../../../config/index.js';
import type { CredentialStore } from '../../../storage/credential-store.js';
import { clack, CancelError, promptPassword } from '../../ui/prompts.js';
import { printError } from '../../ui/output.js';
import { runPlatformsStep } from './steps/platforms.js';
import { runCalendarStep } from './steps/calendar.js';
import { runAIStep } from './steps/ai.js';
import { runNotificationsStep } from './steps/notifications.js';
import { runPreferencesStep } from './steps/preferences.js';

/**
 * Resolve the encryption passphrase. On first run, prompts to create and
 * confirm. On subsequent runs, verifies against the stored sentinel.
 * Returns null if cancelled or verification fails.
 */
export async function resolvePassphrase(
  credentialStore: CredentialStore,
): Promise<string | null> {
  const envPassphrase = process.env['MAITRED_PASSPHRASE'];
  if (envPassphrase) return envPassphrase;

  const isFirstRun = !credentialStore.listKeys().length;

  const passphrase = await promptPassword({
    message: isFirstRun
      ? 'Create an encryption passphrase for your credentials:'
      : 'Enter your encryption passphrase:',
    validate: (v) => {
      if (!v || v.length < 4) return 'Passphrase must be at least 4 characters';
    },
  });

  if (isFirstRun) {
    const confirm = await promptPassword({
      message: 'Confirm passphrase:',
    });
    if (confirm !== passphrase) {
      printError('Passphrases do not match');
      return null;
    }
    credentialStore.storeSentinel(passphrase);
  } else if (!credentialStore.verifyPassphrase(passphrase)) {
    printError('Incorrect passphrase');
    return null;
  }

  return passphrase;
}

export async function runWizard(
  configManager: ConfigManager,
  credentialStore: CredentialStore,
): Promise<void> {
  try {
    clack.intro('Welcome to maitre-d setup');

    const passphrase = await resolvePassphrase(credentialStore);
    if (!passphrase) return;

    // Step 1: Platforms
    clack.log.step('Step 1/5 — Reservation Platforms');
    const platformsResult = await runPlatformsStep(credentialStore, passphrase);

    // Step 2: Calendar
    clack.log.step('Step 2/5 — Calendar Integration');
    const calendarResult = await runCalendarStep();

    // Step 3: AI
    clack.log.step('Step 3/5 — AI Provider');
    const aiResult = await runAIStep(credentialStore, passphrase);

    // Step 4: Notifications
    clack.log.step('Step 4/5 — Notifications');
    const notificationsResult = await runNotificationsStep(credentialStore, passphrase);

    // Step 5: Preferences
    clack.log.step('Step 5/5 — Dining Preferences');
    const preferencesResult = await runPreferencesStep();

    // Write all config at once
    if (platformsResult.platforms && Object.keys(platformsResult.platforms).length > 0) {
      configManager.set('platforms', platformsResult.platforms);
    }
    configManager.set('calendar', calendarResult.calendar);
    configManager.set('ai', aiResult.ai);
    configManager.set('notifications', notificationsResult.notifications);
    configManager.set('userPreferences', preferencesResult.userPreferences);
    configManager.set('_initialized', true);

    clack.outro('Setup complete! Try `maitre-d find` to search for restaurants.');
  } catch (error) {
    if (error instanceof CancelError) {
      clack.cancel('Setup cancelled');
      return;
    }
    throw error;
  }
}
