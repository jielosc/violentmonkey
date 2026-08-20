import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import helper from './safari-packager-helper.js';

const force = process.argv.includes('--force');
const source = resolve('dist-safari');
const projectLocation = resolve(process.env.SAFARI_PROJECT_LOCATION || 'build/safari-macos');
const appName = process.env.SAFARI_APP_NAME || 'Violentmonkey';
const bundleId = process.env.SAFARI_BUNDLE_IDENTIFIER || 'org.violentmonkey.Violentmonkey';
const deploymentTarget = process.env.SAFARI_MACOS_DEPLOYMENT_TARGET || '11.0';

try {
  await main();
} catch (err) {
  console.error(err.message || err);
  process.exitCode = 1;
}

async function main() {
  helper.validateConfig({ appName, bundleId, deploymentTarget });
  if (!existsSync(`${source}/manifest.json`)) {
    throw new Error(`Missing ${source}/manifest.json. Run pnpm build:safari first.`);
  }
  if (existsSync(projectLocation) && !force) {
    throw new Error(`${projectLocation} already exists. Move it aside or rerun with --force.`);
  }
  await mkdir(resolve(projectLocation, '..'), { recursive: true });
  const tool = findPackager();
  if (!tool) {
    throw new Error('Safari Web Extension Packager was not found. Install the full Xcode application.');
  }
  const args = [
    tool,
    source,
    '--project-location', projectLocation,
    '--app-name', appName,
    '--bundle-identifier', bundleId,
    '--swift',
    '--macos-only',
    '--copy-resources',
    '--no-open',
    '--no-prompt',
    ...(force ? ['--force'] : []),
  ];
  const result = spawnSync('xcrun', args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Safari Web Extension Packager exited with status ${result.status ?? 'unknown'}`);
  }
  const projectFile = await findProjectFile();
  const project = await readFile(projectFile, 'utf8');
  const updatedProject = helper.updateXcodeProject(project, { bundleId, deploymentTarget });
  await writeFile(projectFile, updatedProject);
  console.info(`macOS deployment target: ${deploymentTarget}`);
}

function findPackager() {
  for (const name of ['safari-web-extension-packager', 'safari-web-extension-converter']) {
    if (spawnSync('xcrun', ['--find', name], { stdio: 'ignore' }).status === 0) return name;
  }
}

async function findProjectFile() {
  const files = await readdir(projectLocation, { recursive: true });
  const projects = files.filter(file => file.endsWith('.xcodeproj/project.pbxproj'));
  if (projects.length !== 1) {
    throw new Error(`Expected one generated Xcode project, found ${projects.length}`);
  }
  return resolve(projectLocation, projects[0]);
}
