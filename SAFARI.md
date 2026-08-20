# Safari support

Violentmonkey provides a dedicated Safari Web Extension build for macOS. It shares the normal
Manifest V2 implementation because it preserves the mature content-script and
background-page injection path without depending on Chromium-only `userScripts` and `offscreen`
APIs.

## Requirements and support level

- Safari 15.4 or later.
- macOS 11 or later for the generated containing app.
- Node.js and pnpm versions matching `package.json` for source builds.
- Full Xcode when creating a signed macOS containing app. A current Safari release can also
  load the built extension directory temporarily for macOS testing.
- Apple Developer Program membership for App Store or Developer ID distribution.

The build is designed for Safari 15.4 and later, the first release where Apple documents support
for both Manifest V2 and Manifest V3. The current smoke-test baseline is Safari 26.5 on macOS
15.7.8. Older supported Safari releases still need regression testing before an official release.

## Build

```sh
pnpm install --frozen-lockfile
pnpm build:safari
```

The command creates `dist-safari/`. The manifest keeps a persistent background page so Safari does
not unload it between frequent WebRequest events.

In a current macOS Safari release, enable its Developer features, choose **Safari > Settings >
Developer > Add Temporary Extension…**, and select `dist-safari/`.

## Package with Xcode

Install the full Xcode application, then run:

```sh
pnpm package:safari
```

The generated projects are written under `build/`. Override the default app metadata when needed:

```sh
SAFARI_APP_NAME=Violentmonkey \
SAFARI_BUNDLE_IDENTIFIER=com.example.Violentmonkey \
SAFARI_MACOS_DEPLOYMENT_TARGET=11.0 \
pnpm package:safari
```

The helper uses Apple's current `safari-web-extension-packager` and falls back to the older
`safari-web-extension-converter` name. Apple's generated project derives the containing app bundle
identifier from the app name, so the helper validates that the final bundle identifier component
exactly matches `SAFARI_APP_NAME`. It also normalizes every generated macOS deployment target to
11.0 by default. Use `SAFARI_PROJECT_LOCATION` for another output directory and use `--force` only
when intentionally replacing an existing generated project.

## Distribution status

The `dist-safari/` directory and CI artifact are development builds, not normally installable
end-user applications. This initial integration intentionally does not change the release workflow.
An official Safari release requires the project maintainers to choose an Apple team and distribution
channel, then sign and notarize the containing app and extension on macOS. That release work should
be reviewed separately because it introduces credentials and ongoing maintenance responsibilities.

## Compatibility behavior

The Safari build keeps script installation, matching, editing, value storage, page/content
injection, ordinary cross-origin requests, cloud sync, commands, popups, and settings on the shared
code path. Safari-specific behavior includes:

- Both `chrome.*` and `browser.*` namespaces and Promise APIs are accepted by Safari, so the normal
  messaging bridge is reused.
- Safari does not support `webRequestBlocking`. Request observation remains enabled on macOS, but
  forbidden request-header rewriting, response-header rewriting, and XHR cookie isolation cannot
  be guaranteed. Ordinary headers and cross-origin requests continue through the background XHR.
- Safari does not expose the extension notifications and downloads permissions used by the shared
  manifest. The Safari manifest omits them, native `GM_notification` delivery is unavailable, and
  downloads use the non-API fallback where possible.
- Safari ignores file-scheme permissions, so local `file://` userscript injection is disabled.
- Safari implements `storage.sync` as local storage. Violentmonkey's own supported cloud-sync
  providers remain the way to sync scripts across devices.
- Website access remains subject to Safari's per-site permission controls. Users should grant the
  extension access to the sites where scripts need to run.

These constraints are Safari platform limitations rather than packaging warnings. See Apple's
[compatibility assessment](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility),
[packaging guide](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari),
and [permissions guide](https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions).
