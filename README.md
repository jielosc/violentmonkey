# Violentmonkey

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jinjaccalgkegednnccohejagnlnfdag.svg)](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
[![Firefox Add-ons](https://img.shields.io/amo/v/violentmonkey.svg)](https://addons.mozilla.org/firefox/addon/violentmonkey)
[![Microsoft Edge Add-on](https://img.shields.io/badge/dynamic/json?label=microsoft%20edge%20add-on&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Feeagobfjdenkkddmbclomhiblgggliao)](https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao)

Violentmonkey provides userscripts support for browsers.
It works on browsers with [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) support.

## Safari for macOS (ready-to-install preview)

This fork includes a packaged Safari Web Extension for macOS, so you can try Violentmonkey in
Safari without building or signing an Xcode project yourself.

**[Download Violentmonkey Safari for macOS 2.48.0 Preview](https://github.com/jielosc/violentmonkey/releases/download/safari-v2.48.0-preview.1/Violentmonkey-Safari-macOS-2.48.0-preview.zip)**

It supports macOS 11 or later and Safari 15.4 or later on both Apple silicon and Intel Macs.
Unzip the download, move `Violentmonkey.app` to Applications, open it once, then enable
Violentmonkey under **Safari > Settings > Extensions**. If macOS blocks the first launch, confirm
it under **System Settings > Privacy & Security**.

This is a community preview from this fork, not an official upstream release. The app is signed
with an Apple Development certificate but is not notarized or distributed through the Mac App
Store. Back up your userscripts before testing, and see [SAFARI.md](SAFARI.md) for compatibility
details and known Safari limitations.

More details can be found [here](https://violentmonkey.github.io/).

Join our Discord server:

[![Discord](https://img.shields.io/discord/995346102003965952?label=discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/XHtUNSm6Xc)

## Automated Builds for Testers

* [CI workflows](https://github.com/violentmonkey/violentmonkey/actions/workflows/ci.yml) (only for signed-in github.com users)
* [nightly.link latest](https://nightly.link/violentmonkey/violentmonkey/workflows/ci/master?preview) (to download any other build replace `github.com` with `nightly.link` in the artifact URL)

A test build is generated automatically for changes between beta releases. It can be installed as an unpacked extension in Chrome and Chromium-based browsers or as a temporary extension in Firefox. It's likely to have bugs so do an export in Violentmonkey settings first. This zip is available only if you're logged-in on GitHub site. Open an entry in the [CI workflows](https://github.com/violentmonkey/violentmonkey/actions/workflows/ci.yml) table and click the `Violentmonkey-...` link at the bottom to download it.

## Workflows

### Development

Install [Node.js](https://nodejs.org/) and PNPM.
The version of Node.js should match `"node"` key in `package.json`.

``` sh
# Install dependencies
$ pnpm ci

# Watch and compile
$ pnpm dev
```

Then load the extension from 'dist/'.

### Test + lint

``` sh
$ pnpm run ci
```

### Build

To release a new version, we must build the assets and upload them to web stores.

``` sh
# Build for normal releases
$ pnpm build

# Build for self-hosted release that has an update_url
$ pnpm build:selfHosted
```

### Safari

Use the [ready-to-install macOS preview](https://github.com/jielosc/violentmonkey/releases/tag/safari-v2.48.0-preview.1),
or build the dedicated Safari Web Extension from source:

``` sh
$ pnpm build:safari
```

See [SAFARI.md](SAFARI.md) for temporary installation, Xcode packaging, platform-specific behavior,
and Safari API limitations.

### Release

See [RELEASE](RELEASE.md) for the release flow.

## Related Projects

- [Violentmonkey for Opera Presto](https://github.com/violentmonkey/violentmonkey-oex)
- [Violentmonkey for Maxthon](https://github.com/violentmonkey/violentmonkey-mx)
