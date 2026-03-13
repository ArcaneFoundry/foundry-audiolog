# Foundry Audiology

Audio Log journal pages for Foundry VTT — immersive audio diaries (Bioshock-style) with themed visual treatments, playback controls, and optional transcripts.

**Module ID:** `foundry-audiolog`
**GitHub:** ArcaneFoundry/foundry-audiolog
**Foundry:** V13 only (system-agnostic)

## Architecture

```
src/
├── index.ts              # Entry point — init/ready hooks, registration
├── models/
│   └── AudioLogPageModel.ts  # TypeDataModel schema (audio, image, theme, transcript, controls)
├── sheets/
│   └── AudioLogPageSheet.ts  # JournalEntryPageHandlebarsSheet subclass
└── styles/
    └── index.css         # Style entry point (themes planned in styles/themes/)
templates/
├── audio-log-view.hbs   # Player-facing: image, playback controls, transcript
└── audio-log-edit.hbs   # GM-facing: theme selector, file pickers, controls config, transcript
public/
└── lang/en.json          # Localization keys
```

### Key Patterns

- **Runtime class resolution** — Foundry globals aren't available at import time. Both `AudioLogPageModel` and `AudioLogPageSheet` use factory functions called inside the `init` hook.
- **Journal page sheet API** — Uses `VIEW_PARTS` / `EDIT_PARTS` (not generic `PARTS`). Parent class `_configureRenderParts()` switches between them based on `isView`.
- **`as any` casts** — Required because `fvtt-types` V13 journal stubs are incomplete. Target removal when types improve.

### Data Model Fields

`audioPath` (FilePathField), `imagePath` (FilePathField), `theme` (StringField, 6 choices), `transcript` (HTMLField), `controls.play/pause/stop` (BooleanField)

### Themes

Six options: `generic` (default/minimal), `fantasy`, `steampunk`, `cyberpunk`, `modern`, `futuristic`. Applied via CSS class `.audiolog-theme-{{theme}}` on root view div.

## Build & Dev

```bash
npm run build        # Typecheck + Vite build + manifest
npm run dev          # Vite watch mode
npm run typecheck    # TypeScript only
npm run test         # Vitest
npm run link:foundry # Symlink dist/ into local Foundry modules
```

## Deploy

```bash
rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/
```

After deploying, refresh Foundry with Ctrl+F5 (aggressive caching).

## Post-Task Workflow

After completing any task:
1. Run `npm run build` — verify no TypeScript errors
2. Deploy to server with the rsync command above
3. Test in Foundry

## Skills

Always invoke when working on this project:
- **forgewright:foundry-vtt-dev** — Foundry VTT V13+ module development
- **forgewright:ui-ux-engineer** — Themed UI design and visual treatments

## Issue Tracking

Use GitHub issues (ArcaneFoundry/foundry-audiolog) for all task tracking.

## Session Continuity

Read `.claude/status.md` at the start of every session — it tracks what was last worked on, current TODOs, and key insights. **Update it at the end of every session or when the user asks for a handoff.**
