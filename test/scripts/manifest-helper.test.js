const ORIGINAL_TARGET = process.env.TARGET;
const ORIGINAL_MV3 = process.env.MV3;

afterEach(() => {
  setEnv('TARGET', ORIGINAL_TARGET);
  setEnv('MV3', ORIGINAL_MV3);
  jest.resetModules();
});

test('builds a Safari macOS manifest', () => {
  const { readManifest, getBrowserTargets } = loadFor('safari');
  const manifest = readManifest();

  expect(getBrowserTargets()).toBe('Safari >= 15.4');
  expect(manifest.manifest_version).toBe(2);
  expect(manifest.minimum_chrome_version).toBeUndefined();
  expect(manifest.browser_specific_settings).toEqual({
    safari: { strict_min_version: '15.4' },
  });
  expect(manifest.background.persistent).toBe(true);
  expect(manifest.permissions).toContain('webRequest');
  expect(manifest.permissions).not.toContain('webRequestBlocking');
  expect(manifest.commands._execute_browser_action).toBeUndefined();
  expect(manifest.browser_action.browser_style).toBeUndefined();
});

function loadFor(target) {
  process.env.TARGET = target;
  delete process.env.MV3;
  jest.resetModules();
  return require('@/../scripts/manifest-helper');
}

function setEnv(key, value) {
  if (value == null) delete process.env[key];
  else process.env[key] = value;
}
