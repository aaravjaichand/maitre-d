import type { CredentialStore } from '../../../../storage/credential-store.js';
import type { MaitredConfig } from '../../../../types/index.js';
import { promptMultiselect, promptText, promptPassword } from '../../../ui/prompts.js';
import { printSuccess } from '../../../ui/output.js';

type NotificationsResult = { notifications: MaitredConfig['notifications'] };

const CHANNELS = [
  { value: 'email', label: 'Email (SMTP)' },
  { value: 'webhook', label: 'Webhook (HTTP POST)' },
];

export async function runNotificationsStep(
  credentialStore: CredentialStore,
  passphrase: string,
): Promise<NotificationsResult> {
  const result: MaitredConfig['notifications'] = {
    terminal: true,
    email: { enabled: false, smtpPort: 587 },
    webhook: { enabled: false, headers: {} },
  };

  const selected = await promptMultiselect<string>({
    message: 'Which notification channels would you like? (Terminal is always on)',
    options: CHANNELS,
    required: false,
  });

  if (selected.includes('email')) {
    const smtpHost = await promptText({
      message: 'SMTP host:',
      validate: (v) => {
        if (!v?.trim()) return 'SMTP host is required';
      },
    });

    const smtpPort = await promptText({
      message: 'SMTP port:',
      defaultValue: '587',
      placeholder: '587',
    });

    const smtpUser = await promptText({
      message: 'SMTP username:',
      validate: (v) => {
        if (!v?.trim()) return 'SMTP username is required';
      },
    });

    const smtpPassword = await promptPassword({
      message: 'SMTP password:',
      validate: (v) => {
        if (!v?.trim()) return 'SMTP password is required';
      },
    });

    const fromAddress = await promptText({
      message: 'From email address:',
      validate: (v) => {
        if (!v?.trim()) return 'From address is required';
      },
    });

    const toAddress = await promptText({
      message: 'To email address:',
      validate: (v) => {
        if (!v?.trim()) return 'To address is required';
      },
    });

    credentialStore.store('email.smtpPassword', smtpPassword, passphrase);
    printSuccess('SMTP password saved');

    result.email = {
      enabled: true,
      smtpHost,
      smtpPort: parseInt(smtpPort, 10),
      smtpUser,
      fromAddress,
      toAddress,
    };
  }

  if (selected.includes('webhook')) {
    const url = await promptText({
      message: 'Webhook URL:',
      validate: (v) => {
        if (!v?.trim()) return 'Webhook URL is required';
      },
    });

    result.webhook = { enabled: true, url, headers: {} };
  }

  return { notifications: result };
}
