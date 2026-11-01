import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';

// The review gate runs inside every astro build, so a build without the npm script cannot skip it (spec section 10).
const reviewGate = { name: 'review-gate', hooks: { 'astro:build:start': () => execFileSync('node_modules/.bin/tsx', ['scripts/check-review.ts'], { stdio: 'inherit' }) } };
export default defineConfig({ trailingSlash: 'ignore', build: { format: 'directory' }, integrations: [reviewGate] });
