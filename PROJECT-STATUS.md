# Foundry Audiolog — Project Status

Last updated: 2026-07-12

## Current state

- Foundry VTT module version 0.1.1.
- The manifest declares Foundry v13 as the minimum and v14.360 as verified.
  This dependency pass typechecks against v14.364; it did not run a v13 runtime
  smoke test, so it does not independently re-verify the minimum-version claim.
- Builds an Audio Log `JournalEntryPage` type with native playback and optional
  image/transcript presentation.
- Release artifacts are produced in `dist/`. `npm run deploy` rebuilds and
  synchronizes that complete payload to the live Foundry module directory.
- Dependency hardening on 2026-07-12 upgraded Vite to 8.1.4, Vitest to 4.1.10,
  and the community-maintained Foundry v14.364 type definitions. The previous 15-advisory
  graph (including two critical findings) is reduced to one development-only
  Showdown advisory reported twice through the type package; upstream currently
  publishes no fixed Showdown release. Production dependency audit is clean.

## Verification contract

```bash
npm run ci
npm audit
npm audit --omit=dev
```

## Next step

Add focused behavioral tests when the next runtime feature changes; the current
test command is configured but the repository has no test files.
