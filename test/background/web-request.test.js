import {
  addWebRequestListener, canUseWebRequestExtraInfoSpec,
} from '@/background/utils/web-request';

const originalSafari = __.SAFARI;

afterEach(() => {
  __.SAFARI = originalSafari;
});

test('omits unsupported extraInfoSpec in Safari', () => {
  __.SAFARI = true;
  const event = { addListener: jest.fn() };
  const listener = jest.fn();
  const filter = { urls: ['<all_urls>'] };

  expect(canUseWebRequestExtraInfoSpec()).toBe(false);
  addWebRequestListener(event, listener, filter, ['requestHeaders']);

  expect(event.addListener).toHaveBeenCalledWith(listener, filter);
});

test('forwards extraInfoSpec in supported browsers', () => {
  __.SAFARI = false;
  const event = { addListener: jest.fn() };
  const listener = jest.fn();
  const filter = { urls: ['<all_urls>'] };
  const extraInfoSpec = ['blocking', 'requestHeaders'];

  expect(canUseWebRequestExtraInfoSpec()).toBe(true);
  addWebRequestListener(event, listener, filter, extraInfoSpec);

  expect(event.addListener).toHaveBeenCalledWith(listener, filter, extraInfoSpec);
});

test('omits an empty extraInfoSpec', () => {
  __.SAFARI = false;
  const event = { addListener: jest.fn() };
  const listener = jest.fn();
  const filter = { urls: ['<all_urls>'] };

  addWebRequestListener(event, listener, filter, []);

  expect(event.addListener).toHaveBeenCalledWith(listener, filter);
});
