const {
  updateXcodeProject,
  validateConfig,
} = require('@/../scripts/safari-packager-helper');

test('accepts matching Safari package metadata', () => {
  expect(() => validateConfig({
    appName: 'Violentmonkey',
    bundleId: 'org.violentmonkey.Violentmonkey',
    deploymentTarget: '11.0',
  })).not.toThrow();
});

test.each([
  [
    { appName: 'Violent Monkey', bundleId: 'org.example.ViolentMonkey', deploymentTarget: '11.0' },
    'SAFARI_APP_NAME',
  ],
  [
    { appName: 'Violentmonkey', bundleId: 'violentmonkey', deploymentTarget: '11.0' },
    'SAFARI_BUNDLE_IDENTIFIER',
  ],
  [
    { appName: 'Violentmonkey', bundleId: 'org.example.Other', deploymentTarget: '11.0' },
    'must end with .Violentmonkey',
  ],
  [
    { appName: 'Violentmonkey', bundleId: 'org.example.Violentmonkey', deploymentTarget: 'latest' },
    'SAFARI_MACOS_DEPLOYMENT_TARGET',
  ],
])('rejects invalid Safari package metadata', (config, message) => {
  expect(() => validateConfig(config)).toThrow(message);
});

test('normalizes and verifies generated Xcode project settings', () => {
  const source = `
    MACOSX_DEPLOYMENT_TARGET = 15.7;
    PRODUCT_BUNDLE_IDENTIFIER = org.example.Violentmonkey;
    MACOSX_DEPLOYMENT_TARGET = 10.14;
    PRODUCT_BUNDLE_IDENTIFIER = org.example.Violentmonkey.Extension;
  `;
  const result = updateXcodeProject(source, {
    bundleId: 'org.example.Violentmonkey',
    deploymentTarget: '11.0',
  });

  expect(result).not.toContain('15.7');
  expect(result).not.toContain('10.14');
  expect(result.match(/MACOSX_DEPLOYMENT_TARGET = 11\.0;/g)).toHaveLength(2);
});

test('rejects unexpected generated Xcode project settings', () => {
  expect(() => updateXcodeProject('MACOSX_DEPLOYMENT_TARGET = 15.7;', {
    bundleId: 'org.example.Violentmonkey',
    deploymentTarget: '11.0',
  })).toThrow('unexpected bundle identifiers');
});
