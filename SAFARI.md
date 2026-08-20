# Safari support

Violentmonkey provides dedicated Safari Web Extension builds for macOS and for iOS/iPadOS. They
share the normal Manifest V2 implementation because it preserves the mature content-script and
background-page injection path without depending on Chromium-only `userScripts` and `offscreen`
APIs.

## Requirements

- Safari 15.4 or later.
- Node.js and pnpm versions matching `package.json` for source builds.
- Full Xcode when creating a signed macOS or iOS containing app. A current Safari release can also
  load the built extension directory temporarily for macOS testing.
- Apple Developer Program membership for App Store or Developer ID distribution.

## Build

```sh
pnpm install --frozen-lockfile
pnpm build:safari
pnpm build:safari:ios
```

The commands create `dist-safari/` and `dist-safari-ios/`. The macOS manifest keeps a persistent
background page so Safari does not unload it between frequent WebRequest events. The iOS manifest
uses a nonpersistent background page and omits APIs that Safari does not provide on iOS.

In a current macOS Safari release, enable its Developer features, choose **Safari > Settings >
Developer > Add Temporary Extension…**, and select `dist-safari/`.

## Package with Xcode

Install the full Xcode application, then run:

```sh
pnpm package:safari
pnpm package:safari:ios
```

The generated projects are written under `build/`. Override the default app metadata when needed:

```sh
SAFARI_APP_NAME=Violentmonkey \
SAFARI_BUNDLE_IDENTIFIER=com.example.violentmonkey \
pnpm package:safari
```

The helper uses Apple's current `safari-web-extension-packager` and falls back to the older
`safari-web-extension-converter` name. Use `--force` only when intentionally replacing an existing
generated project.

## Compatibility behavior

The Safari builds keep script installation, matching, editing, value storage, page/content
injection, cross-origin requests, cookies, downloads where the platform exposes them, cloud sync,
commands, popups, and settings on the shared code path. Safari-specific behavior includes:

- Both `chrome.*` and `browser.*` namespaces and Promise APIs are accepted by Safari, so the normal
  messaging bridge is reused.
- Safari does not support `webRequestBlocking`. Request observation remains enabled on macOS, but
  forbidden request-header rewriting, response-header rewriting, and XHR cookie isolation cannot
  be guaranteed. Ordinary headers and cross-origin requests continue through the background XHR.
- iOS Safari does not provide WebRequest or context-menu APIs. Injection falls back to the content
  script's `GetInjected` message, OAuth completion is detected with `tabs.onUpdated`, and unavailable
  context menus and notifications are skipped safely.
- Safari ignores file-scheme permissions, so local `file://` userscript injection is disabled.
- Safari implements `storage.sync` as local storage. Violentmonkey's own supported cloud-sync
  providers remain the way to sync scripts across devices.
- Website access remains subject to Safari's per-site permission controls. Users should grant the
  extension access to the sites where scripts need to run.

These constraints are Safari platform limitations rather than packaging warnings. See Apple's
[compatibility assessment](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility),
[packaging guide](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari),
and [permissions guide](https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions).
