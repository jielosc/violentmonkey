import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ios = process.argv.includes('--ios');
const force = process.argv.includes('--force');
const source = resolve(ios ? 'dist-safari-ios' : 'dist-safari');
const projectLocation = resolve(ios ? 'build/safari-ios' : 'build/safari-macos');
const appName = process.env.SAFARI_APP_NAME || 'Violentmonkey';
const bundleId = process.env.SAFARI_BUNDLE_IDENTIFIER || 'org.violentmonkey.Violentmonkey';

if (!existsSync(`${source}/manifest.json`)) {
  console.error(`Missing ${source}/manifest.json. Run pnpm build:safari${ios ? ':ios' : ''} first.`);
  process.exitCode = 1;
} else if (existsSync(projectLocation) && !force) {
  console.error(`${projectLocation} already exists. Move it aside or rerun with --force.`);
  process.exitCode = 1;
} else {
  await mkdir(resolve('build'), { recursive: true });
  const tool = findPackager();
  if (!tool) {
    console.error('Safari Web Extension Packager was not found. Install the full Xcode application.');
    process.exitCode = 1;
  } else {
    const args = [
      tool,
      source,
      '--project-location', projectLocation,
      '--app-name', appName,
      '--bundle-identifier', bundleId,
      '--swift',
      ios ? '--ios-only' : '--macos-only',
      '--copy-resources',
      '--no-open',
      '--no-prompt',
      ...(force ? ['--force'] : []),
    ];
    const result = spawnSync('xcrun', args, { stdio: 'inherit' });
    if (result.error) throw result.error;
    process.exitCode = result.status;
  }
}

function findPackager() {
  for (const name of ['safari-web-extension-packager', 'safari-web-extension-converter']) {
    if (spawnSync('xcrun', ['--find', name], { stdio: 'ignore' }).status === 0) return name;
  }
}
