export function isAuthRedirect(url, redirectUri) {
  if (!url) return false;
  try {
    const actual = new URL(url);
    const expected = new URL(redirectUri);
    return actual.origin === expected.origin && actual.pathname === expected.pathname;
  } catch {
    return false;
  }
}

export const getWebRequestRedirectPrefix = redirectUri => (
  redirectUri.replace(/:\d+(?=\/)/, '')
);
