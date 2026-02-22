import type { CredentialStore } from '../../../../storage/credential-store.js';
import { promptMultiselect, promptText, promptPassword } from '../../../ui/prompts.js';
import { printSuccess } from '../../../ui/output.js';

interface PlatformsResult {
  platforms: Record<string, { enabled: boolean }>;
}

const PLATFORMS = [
  { value: 'resy' as const, label: 'Resy' },
  { value: 'opentable' as const, label: 'OpenTable' },
];

export async function runPlatformsStep(
  credentialStore: CredentialStore,
  passphrase: string,
): Promise<PlatformsResult> {
  const selected = await promptMultiselect<string>({
    message: 'Which reservation platforms do you use?',
    options: PLATFORMS,
    required: false,
  });

  const platforms: Record<string, { enabled: boolean }> = {};

  for (const platform of selected) {
    const label = PLATFORMS.find((p) => p.value === platform)?.label ?? platform;

    const email = await promptText({
      message: `${label} email:`,
      validate: (v) => {
        if (!v?.trim()) return 'Email is required';
      },
    });

    const password = await promptPassword({
      message: `${label} password:`,
      validate: (v) => {
        if (!v?.trim()) return 'Password is required';
      },
    });

    credentialStore.store(`${platform}.email`, email, passphrase);
    credentialStore.store(`${platform}.password`, password, passphrase);
    platforms[platform] = { enabled: true };
    printSuccess(`${label} credentials saved`);
  }

  return { platforms };
}
