import {
  getWebRequestRedirectPrefix, isAuthRedirect,
} from '@/background/sync/oauth';

test('matches a Safari OAuth loopback callback with its configured port', () => {
  const redirectUri = 'http://127.0.0.1:45678/';

  expect(isAuthRedirect(`${redirectUri}?code=test`, redirectUri)).toBe(true);
  expect(isAuthRedirect('http://127.0.0.1/?code=test', redirectUri)).toBe(false);
  expect(isAuthRedirect('http://127.0.0.1:45679/?code=test', redirectUri)).toBe(false);
});

test('matches OAuth callback parameters without accepting a path prefix', () => {
  const redirectUri = 'https://example.com/oauth/callback';

  expect(isAuthRedirect(`${redirectUri}?code=test#state`, redirectUri)).toBe(true);
  expect(isAuthRedirect(`${redirectUri}-other?code=test`, redirectUri)).toBe(false);
  expect(isAuthRedirect('not a URL', redirectUri)).toBe(false);
});

test('removes a port only from the legacy webRequest match prefix', () => {
  expect(getWebRequestRedirectPrefix('http://127.0.0.1:45678/'))
  .toBe('http://127.0.0.1/');
  expect(getWebRequestRedirectPrefix('https://example.com/oauth'))
  .toBe('https://example.com/oauth');
});
