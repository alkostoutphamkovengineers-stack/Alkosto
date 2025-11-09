import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv(envPath = '.env') {
  const envFile = resolve(process.cwd(), envPath);
  if (!existsSync(envFile)) return;

  const lines = readFileSync(envFile, 'utf-8').split('\n');
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const [key, ...vals] = line.split('=');
    if (!key) continue;
    const value = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
loadEnv();