/**
 * Bundles and runs the headless render smoke test with zero extra tooling:
 * esbuild ships with Vite, and React renders to a string in plain Node.
 *
 *   npm run smoke
 */
let build;
try {
  ({ build } = await import('esbuild')); // shipped as a transitive dependency of Vite
} catch {
  console.error('esbuild is required to bundle the smoke test. Run `npm install` first.');
  process.exit(1);
}
import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const entry = path.join(repo, 'scripts/smoke/render-smoke.jsx');
const outDir = path.join(repo, 'node_modules/.cache/sih-smoke');
const outfile = path.join(outDir, 'render-smoke.cjs');

await mkdir(outDir, { recursive: true });

console.log('Bundling headless render smoke test...');
await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  logLevel: 'error',
  loader: { '.css': 'empty' },
  define: {
    'process.env.NODE_ENV': '"production"',
    // Vite injects import.meta.env; stand in for it so api.js can load under Node.
    'import.meta.env': '__sihEnv'
  },
  banner: { js: 'var __sihEnv = { VITE_API_URL: "" };' },
  absWorkingDir: repo
});

const run = spawnSync(process.execPath, [outfile], { stdio: 'inherit', cwd: repo });

if (run.status === 0) {
  console.log('\nPortal smoke test: OK');
} else {
  console.error('\nPortal smoke test: FAILED (see checks above)');
}
process.exit(run.status ?? 1);
