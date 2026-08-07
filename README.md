# Foundry Audiolog

Adds an **Audio Log** `JournalEntryPage` type to Foundry VTT — immersive audio
diaries with themed visual treatments, playback controls, and optional imagery
and transcripts.

## Installation

In Foundry's **Add-on Modules → Install Module**, paste this manifest URL:

```
https://raw.githubusercontent.com/ArcaneFoundry/foundry-audiolog/main/module.json
```

Or download a release zip from the
[releases page](https://github.com/ArcaneFoundry/foundry-audiolog/releases).

Compatibility: Foundry v13 minimum, verified on v14.

## Usage

Create a journal entry, add a page, and pick the **Audio Log** page type. Set
an audio file, an optional image, and an optional transcript. The page renders
with native playback controls and the themed treatment.

## Development

```bash
npm test
npm run typecheck
npm run build
npm run ci
npm run zip
```

`npm run deploy` builds the complete `dist/` payload and synchronizes it to a
live Foundry server's module directory. Override `REMOTE`, `REMOTE_DIR`, or
`REMOTE_CHOWN` to target your own host.

## License

MIT — see [LICENSE](LICENSE).
