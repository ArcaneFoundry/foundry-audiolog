---
paths:
  - "src/**/*.ts"
  - "templates/**/*.hbs"
---

# Foundry VTT V13 API Rules

## Runtime Class Resolution

Foundry classes are globals set during boot, not importable ES modules. Always resolve inside hook callbacks:

```typescript
Hooks.once("init", () => {
  const BaseSheet = foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet;
  // Define your class here using BaseSheet
});
```

## Journal Page Sheet API

`JournalEntryPageHandlebarsSheet` has a **different PARTS system** than generic ApplicationV2:

- Define `static VIEW_PARTS` (view mode) and `static EDIT_PARTS` (edit mode) — NOT `static PARTS`
- `_configureRenderParts(options)` returns whichever set matches `this.isView`
- Edit parts should include parent header/footer: `header: BaseSheet.EDIT_PARTS.header`, `content: {...}`, `footer: BaseSheet.EDIT_PARTS.footer`
- View parts typically just have `content: { template: "...", scrollable: [...] }`
- The part name `content` is special — `_preparePartContext` routes it to `_prepareContentContext()`

## ApplicationV2 Actions

- Define in `static DEFAULT_OPTIONS.actions` — Foundry merges via prototype chain
- Action handlers are static methods, `this` is the app instance at runtime
- Triggered by `data-action="actionName"` in templates
- For class expressions (factory pattern), assign actions after class definition since the class name isn't bound during definition

## Document Mutations

Always use `document.update()` — never mutate `.system` directly.

## Audio Playback

- `foundry.audio.AudioHelper.play({ src, volume, loop })` returns a `Sound` reference
- `Sound.pause()` / `Sound.play()` for pause/resume
- `Sound.stop()` to stop
- `Sound.paused` is a boolean getter
- Clean up sounds on sheet close to prevent orphaned playback

## FilePicker

```typescript
new FilePicker({ type: "audio"|"image", current: path, callback: (path) => { ... } }).render(true);
```

## Registration (init hook)

1. `CONFIG.JournalEntryPage.dataModels["module-id.typeName"] = Model`
2. `DocumentSheetConfig.registerSheet(JournalEntryPage, moduleId, Sheet, { types: [...], makeDefault: true })`
3. `loadTemplates([...paths])` for preloading

## API Docs

When unsure about an API, fetch: `https://foundryvtt.com/api/classes/...`
Source on server: `/opt/foundryvtt/public/scripts/foundry.mjs`
