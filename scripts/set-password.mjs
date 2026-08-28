// Sets the blog password by writing its SHA-256 hash into src/site.config.mjs.
// Usage:  npm run set-password -- "my new password"
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run set-password -- "your new password"');
  process.exit(1);
}

const hash = createHash('sha256').update(password, 'utf8').digest('hex');
const configPath = fileURLToPath(new URL('../src/site.config.mjs', import.meta.url));

let config = readFileSync(configPath, 'utf8');
config = config
  .replace(/\/\/ The current password is: .*/, `// The current password is: ${password}`)
  .replace(/(export const PASSWORD_HASH =\s*\n?\s*')[0-9a-f]*(')/, `$1${hash}$2`);
writeFileSync(configPath, config);

console.log(`Password updated to "${password}".`);
console.log('Anyone who already unlocked the blog will be asked for the new password.');
