# Code Style & Conventions

## TypeScript
- Strict mode enabled, ES2022 target, ESNext modules with Bundler resolution
- No unused locals or parameters (enforced by tsconfig)
- Use `as any` casts sparingly — only for fvtt-types gaps, always with eslint-disable comment

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Module ID | kebab-case | `foundry-audiolog` |
| TS files | PascalCase | `AudioLogPageSheet.ts` |
| CSS files | kebab-case | `theme-fantasy.css` |
| Classes | PascalCase | `AudioLogPageModel` |
| Constants | UPPER_SNAKE | `MODULE_ID` |
| Template files | kebab-case | `audio-log-view.hbs` |
| Settings keys | camelCase | `defaultTheme` |

## Patterns
- **Runtime class resolution** — Foundry globals resolved inside hook callbacks via factory functions, never at module scope
- **ViewModel pattern** — Prepare context data in `_prepareContext`, never pass raw document data to templates
- **Preload templates** — Always call `loadTemplates()` in `init` hook

## Anti-Patterns
- Never use `actor.data.data` (removed in V13, use `.system`)
- Never use legacy Application class (use ApplicationV2)
- Never use jQuery in ApplicationV2 (use native DOM APIs)
- Never mutate `document.system` directly (use `document.update()`)
- Never use `Actors.registerSheet()` (use `DocumentSheetConfig.registerSheet()`)

## Build
- Vite with `cssCodeSplit: false` (Foundry loads a single `styles.css`)
- Single ES module output (`index.js`)
- `module.json` built from `module.template.json` via `scripts/build-manifest.mjs`
