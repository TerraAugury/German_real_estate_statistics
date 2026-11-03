import { existsSync, readFileSync } from 'node:fs';

/** Load KEY=value lines from .env into process.env without overriding existing variables. Unlike process.loadEnvFile, `#` inside a value is kept (passwords). */
export function loadEnv(path = '.env'): void {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^(["'])(.*)\1$/, '$2');
  }
}
