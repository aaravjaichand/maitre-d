import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CredentialStore } from './credential-store.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('CredentialStore', () => {
  let tempDir: string;
  let store: CredentialStore;
  const passphrase = 'test-passphrase-123';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-cred-test-'));
    store = new CredentialStore(join(tempDir, 'credentials.enc'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should store and retrieve a credential', () => {
    store.store('resy-token', 'my-secret-token', passphrase);
    const retrieved = store.retrieve('resy-token', passphrase);
    expect(retrieved).toBe('my-secret-token');
  });

  it('should throw on wrong passphrase', () => {
    store.store('resy-token', 'my-secret-token', passphrase);
    expect(() => store.retrieve('resy-token', 'wrong-passphrase')).toThrow();
  });

  it('should throw on nonexistent key', () => {
    expect(() => store.retrieve('nonexistent', passphrase)).toThrow(
      'Credential not found: nonexistent',
    );
  });

  it('should store and retrieve multiple keys', () => {
    store.store('key1', 'value1', passphrase);
    store.store('key2', 'value2', passphrase);
    store.store('key3', 'value3', passphrase);

    expect(store.retrieve('key1', passphrase)).toBe('value1');
    expect(store.retrieve('key2', passphrase)).toBe('value2');
    expect(store.retrieve('key3', passphrase)).toBe('value3');
  });

  it('should delete a credential', () => {
    store.store('key1', 'value1', passphrase);
    expect(store.has('key1')).toBe(true);

    store.delete('key1');
    expect(store.has('key1')).toBe(false);
  });

  it('should check if a key exists', () => {
    expect(store.has('resy-token')).toBe(false);
    store.store('resy-token', 'token-value', passphrase);
    expect(store.has('resy-token')).toBe(true);
  });

  it('should list all keys', () => {
    store.store('key1', 'val1', passphrase);
    store.store('key2', 'val2', passphrase);
    const keys = store.listKeys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys).toHaveLength(2);
  });

  it('should handle special characters in values', () => {
    const specialValue = 'p@$$w0rd!#%^&*()_+-={}[]|\\:";\'<>?,./~`';
    store.store('special', specialValue, passphrase);
    expect(store.retrieve('special', passphrase)).toBe(specialValue);
  });

  it('should overwrite existing key', () => {
    store.store('key', 'original', passphrase);
    store.store('key', 'updated', passphrase);
    expect(store.retrieve('key', passphrase)).toBe('updated');
  });

  it('should store and verify sentinel', () => {
    store.storeSentinel(passphrase);
    expect(store.verifyPassphrase(passphrase)).toBe(true);
    expect(store.verifyPassphrase('wrong-passphrase')).toBe(false);
  });

  it('should return true when no sentinel exists', () => {
    expect(store.verifyPassphrase(passphrase)).toBe(true);
  });
});
