#!/usr/bin/env node

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string };

console.log(`maitre-d v${pkg.version}`);
console.log();
console.log('The open-source, AI-powered restaurant reservation agent.');
console.log();
console.log('Coming soon — run `maitre-d config` to get started.');
console.log('For more info, visit: https://github.com/aaravjaichand/maitre-d');
