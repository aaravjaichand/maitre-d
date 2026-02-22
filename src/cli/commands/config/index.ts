import { join } from 'node:path';
import type { Command } from 'commander';
import { ConfigManager } from '../../../config/index.js';
import { CredentialStore } from '../../../storage/credential-store.js';
import { withErrorHandler } from '../../middleware/error-handler.js';
import { printInfo, printSuccess, printWarning, fmt } from '../../ui/output.js';
import { promptConfirm, CancelError } from '../../ui/prompts.js';
import { runWizard } from './wizard.js';
import { runPlatformsStep } from './steps/platforms.js';
import { runCalendarStep } from './steps/calendar.js';
import { runAIStep } from './steps/ai.js';
import { runNotificationsStep } from './steps/notifications.js';
import { runPreferencesStep } from './steps/preferences.js';
import { unlinkSync, existsSync } from 'node:fs';
import { resolvePassphrase } from './wizard.js';

function getCredentialStorePath(configManager: ConfigManager): string {
  const configDir = join(configManager.path, '..');
  return join(configDir, 'credentials.json');
}

export function registerConfigCommand(program: Command): void {
  program
    .command('config [section]')
    .description('Configure maitre-d settings')
    .action(
      withErrorHandler(async (section?: string) => {
        const configManager = new ConfigManager();
        const credentialStore = new CredentialStore(
          getCredentialStorePath(configManager),
        );

        if (!section) {
          await runWizard(configManager, credentialStore);
          return;
        }

        switch (section) {
          case 'platforms':
          case 'ai':
          case 'calendar':
          case 'notifications':
          case 'preferences': {
            await runSection(section, configManager, credentialStore);
            break;
          }
          case 'show': {
            showConfig(configManager);
            break;
          }
          case 'reset': {
            await resetConfig(configManager);
            break;
          }
          default:
            printWarning(
              `Unknown section: ${section}. Valid sections: platforms, ai, calendar, notifications, preferences, show, reset`,
            );
        }
      }),
    );
}

async function runSection(
  section: string,
  configManager: ConfigManager,
  credentialStore: CredentialStore,
): Promise<void> {
  const passphrase = await resolvePassphrase(credentialStore);
  if (!passphrase) return;

  try {
    switch (section) {
      case 'platforms': {
        const result = await runPlatformsStep(credentialStore, passphrase);
        if (Object.keys(result.platforms).length > 0) {
          configManager.set('platforms', result.platforms);
        }
        break;
      }
      case 'calendar': {
        const result = await runCalendarStep();
        configManager.set('calendar', result.calendar);
        break;
      }
      case 'ai': {
        const result = await runAIStep(credentialStore, passphrase);
        configManager.set('ai', result.ai);
        break;
      }
      case 'notifications': {
        const result = await runNotificationsStep(credentialStore, passphrase);
        configManager.set('notifications', result.notifications);
        break;
      }
      case 'preferences': {
        const result = await runPreferencesStep();
        configManager.set('userPreferences', result.userPreferences);
        break;
      }
    }
    printSuccess('Configuration updated');
  } catch (error) {
    if (error instanceof CancelError) {
      console.log('\nCancelled.');
      return;
    }
    throw error;
  }
}

function showConfig(configManager: ConfigManager): void {
  const config = configManager.getAll();
  console.log();
  console.log(fmt.bold('Current configuration:'));
  console.log(fmt.dim(`File: ${configManager.path}`));
  console.log();

  console.log(fmt.bold('Platforms:'));
  const platforms = Object.entries(config.platforms);
  if (platforms.length === 0) {
    console.log('  None configured');
  } else {
    for (const [name, settings] of platforms) {
      console.log(`  ${name}: ${settings.enabled ? 'enabled' : 'disabled'}`);
    }
  }
  console.log();

  console.log(fmt.bold('AI:'));
  if (config.ai.enabled && config.ai.provider) {
    console.log(`  Provider: ${config.ai.provider}`);
    if (config.ai.model) console.log(`  Model: ${config.ai.model}`);
    if (config.ai.baseUrl) console.log(`  Base URL: ${config.ai.baseUrl}`);
  } else {
    console.log('  Disabled');
  }
  console.log();

  console.log(fmt.bold('Calendar:'));
  if (config.calendar.provider) {
    console.log(`  Provider: ${config.calendar.provider}`);
  } else {
    console.log('  Not configured');
  }
  console.log();

  console.log(fmt.bold('Notifications:'));
  console.log(`  Terminal: always on`);
  console.log(`  Email: ${config.notifications.email.enabled ? 'enabled' : 'disabled'}`);
  console.log(`  Webhook: ${config.notifications.webhook.enabled ? 'enabled' : 'disabled'}`);
  console.log();

  if (config.userPreferences.description) {
    console.log(fmt.bold('Dining Preferences:'));
    console.log(`  ${config.userPreferences.description}`);
    console.log();
  }

  console.log(fmt.dim(`Initialized: ${config._initialized}`));
}

async function resetConfig(
  configManager: ConfigManager,
): Promise<void> {
  try {
    const confirmed = await promptConfirm({
      message: 'Reset all configuration and stored credentials? This cannot be undone.',
      initialValue: false,
    });

    if (!confirmed) {
      console.log('Reset cancelled.');
      return;
    }

    // Delete config file
    const configPath = configManager.path;
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }

    // Delete credentials file
    const credPath = getCredentialStorePath(configManager);
    if (existsSync(credPath)) {
      unlinkSync(credPath);
    }

    printSuccess('Configuration and credentials have been reset.');
    printInfo('Run `maitre-d config` to set up again.');
  } catch (error) {
    if (error instanceof CancelError) {
      console.log('\nCancelled.');
      return;
    }
    throw error;
  }
}
