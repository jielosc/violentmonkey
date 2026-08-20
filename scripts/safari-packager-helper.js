const APP_NAME_RE = /^[A-Za-z][A-Za-z0-9-]*$/;
const BUNDLE_ID_RE = /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
const VERSION_RE = /^\d+(?:\.\d+){0,2}$/;

function validateConfig({ appName, bundleId, deploymentTarget }) {
  if (!APP_NAME_RE.test(appName)) {
    throw new Error('SAFARI_APP_NAME must start with a letter and contain only letters, numbers, or hyphens');
  }
  if (!BUNDLE_ID_RE.test(bundleId)) {
    throw new Error('SAFARI_BUNDLE_IDENTIFIER must be a reverse-DNS bundle identifier');
  }
  if (bundleId.split('.').at(-1) !== appName) {
    throw new Error(`SAFARI_BUNDLE_IDENTIFIER must end with .${appName}`);
  }
  if (!VERSION_RE.test(deploymentTarget)) {
    throw new Error('SAFARI_MACOS_DEPLOYMENT_TARGET must be a numeric macOS version');
  }
}

function updateXcodeProject(source, { bundleId, deploymentTarget }) {
  const appId = `PRODUCT_BUNDLE_IDENTIFIER = ${bundleId};`;
  const extensionId = `PRODUCT_BUNDLE_IDENTIFIER = ${bundleId}.Extension;`;
  if (!source.includes(appId) || !source.includes(extensionId)) {
    throw new Error('Generated Xcode project contains unexpected bundle identifiers');
  }
  let replacements = 0;
  const result = source.replace(
    /MACOSX_DEPLOYMENT_TARGET = [^;]+;/g,
    () => {
      replacements += 1;
      return `MACOSX_DEPLOYMENT_TARGET = ${deploymentTarget};`;
    },
  );
  if (!replacements) {
    throw new Error('Generated Xcode project contains no macOS deployment target');
  }
  return result;
}

module.exports = {
  updateXcodeProject,
  validateConfig,
};
