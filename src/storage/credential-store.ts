import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

interface EncryptedEntry {
  iv: string;
  ciphertext: string;
  authTag: string;
  salt: string;
}

type CredentialData = Record<string, EncryptedEntry>;

/**
 * Encrypted credential storage using AES-256-GCM.
 * Each value is encrypted with a unique IV and salt.
 * File permissions are set to 0o600 (owner read/write only).
 */
export class CredentialStore {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /** Store an encrypted credential. */
  store(key: string, value: string, passphrase: string): void {
    const data = this.readFile();
    const salt = randomBytes(32);
    const iv = randomBytes(16);
    const derivedKey = scryptSync(passphrase, salt, 32);

    const cipher = createCipheriv('aes-256-gcm', derivedKey, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    data[key] = {
      iv: iv.toString('hex'),
      ciphertext: encrypted.toString('hex'),
      authTag: authTag.toString('hex'),
      salt: salt.toString('hex'),
    };

    this.writeFile(data);
  }

  /** Retrieve and decrypt a credential. */
  retrieve(key: string, passphrase: string): string {
    const data = this.readFile();
    const entry = data[key];

    if (!entry) {
      throw new Error(`Credential not found: ${key}`);
    }

    const salt = Buffer.from(entry.salt, 'hex');
    const iv = Buffer.from(entry.iv, 'hex');
    const ciphertext = Buffer.from(entry.ciphertext, 'hex');
    const authTag = Buffer.from(entry.authTag, 'hex');
    const derivedKey = scryptSync(passphrase, salt, 32);

    const decipher = createDecipheriv('aes-256-gcm', derivedKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  }

  /** Delete a credential. */
  delete(key: string): void {
    const data = this.readFile();
    delete data[key];
    this.writeFile(data);
  }

  /** Check if a credential exists. */
  has(key: string): boolean {
    const data = this.readFile();
    return key in data;
  }

  /** List all stored credential keys. */
  listKeys(): string[] {
    const data = this.readFile();
    return Object.keys(data);
  }

  private readFile(): CredentialData {
    if (!existsSync(this.filePath)) {
      return {};
    }
    const content = readFileSync(this.filePath, 'utf8');
    return JSON.parse(content) as CredentialData;
  }

  private writeFile(data: CredentialData): void {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
    writeFileSync(this.filePath, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
      mode: 0o600,
    });
  }
}
