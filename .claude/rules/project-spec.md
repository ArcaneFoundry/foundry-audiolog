# Product Specification

## What It Is

A custom "Audio Log" JournalEntryPage type for Foundry VTT. Players open a journal page and see a themed container with an image, playback controls, and an optional transcript. GMs configure the audio file, image, theme, and control visibility.

## Six Themes

Each theme is a distinct design language, not a color swap:

| Theme | Aesthetic | Default Image Concept |
|-------|-----------|----------------------|
| **generic** (default) | Minimal, inherits Foundry styling | None — GM's image drives the look |
| **fantasy** | Parchment, burnt edges, arcane glow, runic borders | Glowing crystal or enchanted journal |
| **steampunk** | Brass plate, rivets, leather trim, porthole frame | Phonograph cylinder |
| **cyberpunk** | Dark chrome, neon edges, scan lines, glitch effects | Neon-lit data chip |
| **modern** | Clean card layout, subtle shadows, rounded frames | Voice recorder |
| **futuristic** | Translucent glass, holographic elements, hex viewport | Holographic datapad |

## Audio Playback

- Local-only per-client (no socket coordination — GM-broadcast is a future enhancement)
- Uses `AudioHelper.play()`, not raw Sound class
- Respects Foundry's global interface volume
- Sheet close stops orphaned audio

## Phased Roadmap

1. ~~Core Data Model, Registration & Stub Sheet~~ (done, merged)
2. **Sheet & Templates** (in progress on `feature/ISSUE-2-sheet-templates`)
3. Base Layout CSS
4. Five Theme CSS Treatments
5. Polish & First Release (v0.1.0)
6. Future: GM-broadcast audio via sockets
