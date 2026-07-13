Repo-internal guidance. This repository is covered by the
`developing-arcane-foundry-vtt-modules` skill.

# Purpose

Foundry VTT module providing the `audiolog` JournalEntryPage type, audio
playback, optional imagery, and transcripts. The manifest declares v13 as the
minimum; current compile-time verification targets v14.364.

# Architecture

- `src/index.ts` registers the page data model, sheet, and render hooks.
- `src/models/AudioLogPageModel.ts` defines the page schema.
- `src/sheets/AudioLogPageSheet.ts` owns the native Foundry sheet.
- `src/styles/index.css` imports the base layout and theme styles bundled by Vite.
- `scripts/build-manifest.mjs` copies the release manifest into `dist/`.

# Commands

```bash
npm test
npm run typecheck
npm run build
npm run ci
npm run deploy
npm run zip
```

# Release notes

`npm run deploy` builds the complete `dist/` payload and synchronizes it to
`/var/foundrydata/Data/modules/foundry-audiolog` on the live Foundry server.
Override `REMOTE`, `REMOTE_DIR`, or `REMOTE_CHOWN` when targeting another host.

# Current state

See `PROJECT-STATUS.md`.
