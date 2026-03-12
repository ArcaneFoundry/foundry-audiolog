# Phase 1: Core Data Model, Registration & Stub Sheet — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register a custom `audiolog` JournalEntryPage type with data model and stub sheet so it's usable end-to-end in Foundry V13.

**Architecture:** Factory pattern for runtime class resolution (Foundry globals aren't available at ES module parse time). Data model extends `TypeDataModel` with `defineSchema()`. Stub sheet extends `JournalEntryPageHandlebarsSheet` with a single diagnostic template. All registration happens in the `init` hook.

**Tech Stack:** TypeScript, Foundry VTT V13 API (fvtt-types provides most type declarations), Handlebars templates, Vite build.

**Type caveat:** fvtt-types marks some V13 journal sheet classes as "TODO: Stub" — `isView`, `DEFAULT_OPTIONS`, and `PARTS` may not be fully typed. If typecheck fails on these, the fix is to either (a) drop `override` keywords from static properties in class expressions, (b) use `// @ts-expect-error` with a comment explaining the fvtt-types gap, or (c) add a targeted `src/types/foundry-augments.d.ts` to fill the gap. The code is correct at runtime — only the type declarations are incomplete.

**Design Spec:** `docs/superpowers/specs/2026-03-11-phase1-core-data-model-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `module.template.json` | Add `documentTypes` declaration for server-side validation |
| Create | `src/models/AudioLogPageModel.ts` | Data model factory with `defineSchema()` |
| Create | `src/sheets/AudioLogPageSheet.ts` | Stub sheet factory extending `JournalEntryPageHandlebarsSheet` |
| Create | `templates/stub-view.hbs` | Diagnostic view/edit template |
| Modify | `src/index.ts` | Registration: data model, sheet, template preload |
| Modify | `public/lang/en.json` | Localization keys for page type and UI labels |

---

## Chunk 1: Foundation

### Task 1: Module Manifest — Declare Document Type

**Files:**
- Modify: `module.template.json`

- [ ] **Step 1: Add `documentTypes` to module.template.json**

Add the `documentTypes` block after the `license` field. This tells Foundry's server that `audiolog` is a valid JournalEntryPage sub-type and which fields need server-side processing.

```json
"documentTypes": {
  "JournalEntryPage": {
    "audiolog": {
      "htmlFields": ["transcript"],
      "filePathFields": {
        "audioPath": ["AUDIO"],
        "imagePath": ["IMAGE"]
      }
    }
  }
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('module.template.json','utf8')); console.log('Valid JSON')"`
Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add module.template.json
git commit -m "feat: declare audiolog document type in module manifest"
```

---

### Task 2: Data Model — AudioLogPageModel

**Files:**
- Create: `src/models/AudioLogPageModel.ts`

- [ ] **Step 1: Create the data model factory**

Create `src/models/AudioLogPageModel.ts` with a factory function that returns the `AudioLogPageModel` class. The factory pattern defers class creation until the `init` hook when Foundry globals are available.

```typescript
/**
 * Theme identifiers for audio log visual treatments.
 */
export const AUDIO_LOG_THEMES = [
  "generic",
  "fantasy",
  "steampunk",
  "cyberpunk",
  "modern",
  "futuristic",
] as const;

export type AudioLogTheme = (typeof AUDIO_LOG_THEMES)[number];

/**
 * Factory that creates the AudioLogPageModel class at runtime.
 * Must be called inside the `init` hook — Foundry globals are not
 * available at ES module parse time.
 */
export function createAudioLogPageModel() {
  const fields = foundry.data.fields;

  return class AudioLogPageModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
      return {
        audioPath: new fields.FilePathField({
          required: false,
          categories: ["AUDIO"],
        }),
        imagePath: new fields.FilePathField({
          required: false,
          categories: ["IMAGE"],
        }),
        theme: new fields.StringField({
          required: true,
          initial: "generic",
          choices: AUDIO_LOG_THEMES.reduce(
            (acc, t) => ({ ...acc, [t]: `AUDIOLOG.themes.${t}` }),
            {} as Record<string, string>,
          ),
        }),
        transcript: new fields.HTMLField({
          required: false,
          blank: true,
        }),
        controls: new fields.SchemaField({
          play: new fields.BooleanField({ initial: true }),
          pause: new fields.BooleanField({ initial: true }),
          stop: new fields.BooleanField({ initial: true }),
        }),
      };
    }
  };
}
```

Notes:
- `AUDIO_LOG_THEMES` is exported as a const array so it can be reused by the sheet and future code.
- `choices` on StringField uses an object mapping value → localization key. This enables Foundry to display localized theme names in select dropdowns.
- `FilePathField` with `required: false` allows empty strings (no file selected yet).
- The `controls` SchemaField nests three BooleanFields that default to `true`.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: No errors. If fvtt-types has issues with any field constructors, adjust types accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/models/AudioLogPageModel.ts
git commit -m "feat: add AudioLogPageModel with defineSchema"
```

---

### Task 3: Stub Template

**Files:**
- Create: `templates/stub-view.hbs`

- [ ] **Step 1: Create the stub Handlebars template**

Create `templates/stub-view.hbs`. This is a diagnostic template that renders all data model fields in both view and edit modes. No styling — pure function. It will be replaced entirely in Phase 2.

The template must handle two modes:
- **View mode** (`isView === true`): Display field values as read-only text
- **Edit mode** (`isView === false`): Show form inputs bound to `system.*` field names

```handlebars
{{!-- Stub diagnostic template — replaced in Phase 2 --}}
<div class="audiolog-stub">
  {{#if isView}}
    <h3>Audio Log (Stub View)</h3>
    <dl>
      <dt>Theme</dt>
      <dd>{{system.theme}}</dd>

      <dt>Audio</dt>
      <dd>{{#if system.audioPath}}{{system.audioPath}}{{else}}<em>No audio file</em>{{/if}}</dd>

      <dt>Image</dt>
      <dd>{{#if system.imagePath}}{{system.imagePath}}{{else}}<em>No image</em>{{/if}}</dd>

      <dt>Controls</dt>
      <dd>Play: {{system.controls.play}} | Pause: {{system.controls.pause}} | Stop: {{system.controls.stop}}</dd>

      {{#if system.transcript}}
        <dt>Transcript</dt>
        <dd>{{{system.transcript}}}</dd>
      {{/if}}
    </dl>
  {{else}}
    <h3>Audio Log (Stub Edit)</h3>

    <div class="form-group">
      <label for="system.theme">Theme</label>
      <select name="system.theme">
        {{selectOptions themeChoices selected=system.theme}}
      </select>
    </div>

    <div class="form-group">
      <label for="system.audioPath">Audio File</label>
      <input type="text" name="system.audioPath" value="{{system.audioPath}}" placeholder="path/to/audio.ogg" />
    </div>

    <div class="form-group">
      <label for="system.imagePath">Image</label>
      <input type="text" name="system.imagePath" value="{{system.imagePath}}" placeholder="path/to/image.webp" />
    </div>

    <fieldset>
      <legend>Visible Controls</legend>
      <label><input type="checkbox" name="system.controls.play" {{checked system.controls.play}} /> Play</label>
      <label><input type="checkbox" name="system.controls.pause" {{checked system.controls.pause}} /> Pause</label>
      <label><input type="checkbox" name="system.controls.stop" {{checked system.controls.stop}} /> Stop</label>
    </fieldset>

    <div class="form-group">
      <label for="system.transcript">Transcript</label>
      <textarea name="system.transcript" rows="6">{{system.transcript}}</textarea>
    </div>
  {{/if}}
</div>
```

Notes:
- `{{{system.transcript}}}` uses triple-braces for HTML content (already server-sanitized).
- `{{selectOptions}}` and `{{checked}}` are Foundry's built-in Handlebars helpers.
- `themeChoices` will be prepared in the sheet's `_prepareContext()`.
- Form field `name` attributes use `system.*` dot notation — Foundry's form handling maps these to document update paths.

- [ ] **Step 2: Commit**

```bash
git add templates/stub-view.hbs
git commit -m "feat: add stub diagnostic template for audio log pages"
```

---

### Task 4: Stub Sheet — AudioLogPageSheet

**Files:**
- Create: `src/sheets/AudioLogPageSheet.ts`

- [ ] **Step 1: Create the stub sheet factory**

Create `src/sheets/AudioLogPageSheet.ts`. Factory pattern, same as the data model.

```typescript
import { AUDIO_LOG_THEMES } from "../models/AudioLogPageModel.js";

export const MODULE_ID = "foundry-audiolog";

/**
 * Factory that creates the AudioLogPageSheet class at runtime.
 * Must be called inside the `init` hook.
 */
export function createAudioLogPageSheet() {
  const BaseSheet =
    foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet;

  return class AudioLogPageSheet extends BaseSheet {
    static DEFAULT_OPTIONS = {
      classes: ["audiolog-page-sheet"],
      form: {
        submitOnChange: true,
      },
    };

    static PARTS = {
      content: {
        template: `modules/${MODULE_ID}/templates/stub-view.hbs`,
      },
    };

    async _prepareContext(options: object) {
      const context = await super._prepareContext(options);
      const page = this.document;
      // isView may not be typed in fvtt-types stubs — it exists at runtime
      const isView = (this as any).isView ?? true;
      return {
        ...context,
        system: page.system,
        isView,
        themeChoices: Object.fromEntries(
          AUDIO_LOG_THEMES.map((t) => [
            t,
            game.i18n.localize(`AUDIOLOG.themes.${t}`),
          ]),
        ),
      };
    }
  };
}
```

Notes:
- `submitOnChange: true` auto-saves when the GM changes any form field.
- `themeChoices` builds a `{ value: label }` object for `{{selectOptions}}` in the template.
- `isView` is a built-in runtime accessor on `JournalEntryPageSheet` — true when viewing, false when editing. fvtt-types may not have it typed (stubs are incomplete), so we use a safe cast with fallback.
- `static DEFAULT_OPTIONS` and `static PARTS` omit `override` — TypeScript can't verify the override relationship on class expressions returned from factories, and fvtt-types stubs may not declare them.
- `_prepareContext` uses `options: object` — the exact fvtt-types render options type may not resolve; `object` is safe and the runtime type is correct.
- `this.document` returns the `JournalEntryPage` instance; `.system` holds our typed data.
- Import uses `.js` extension per ESM convention (TypeScript compiles `.ts` → `.js`).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: No errors. If fvtt-types stubs cause issues with `super._prepareContext()` or `this.document`, use targeted `as any` casts with comments explaining the gap. The code is correct at runtime.

- [ ] **Step 3: Commit**

```bash
git add src/sheets/AudioLogPageSheet.ts
git commit -m "feat: add stub AudioLogPageSheet with diagnostic view"
```

---

### Task 5: Registration — Wire Everything Up

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Rewrite index.ts with full registration**

Replace the contents of `src/index.ts` with:

```typescript
/**
 * Foundry Audiology — Audio Logs for Foundry VTT
 *
 * Registers a custom "audiolog" JournalEntryPage type with themed visual
 * treatments, audio playback controls, and optional transcripts.
 */

import { createAudioLogPageModel } from "./models/AudioLogPageModel.js";
import { createAudioLogPageSheet, MODULE_ID } from "./sheets/AudioLogPageSheet.js";

const PAGE_TYPE = `${MODULE_ID}.audiolog`;

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing`);

  // Create classes (runtime resolution of Foundry globals)
  const AudioLogPageModel = createAudioLogPageModel();
  const AudioLogPageSheet = createAudioLogPageSheet();

  // Register the audiolog page type data model
  CONFIG.JournalEntryPage.dataModels[PAGE_TYPE] = AudioLogPageModel;

  // Register the stub sheet as the default for audiolog pages
  DocumentSheetConfig.registerSheet(JournalEntryPage, MODULE_ID, AudioLogPageSheet, {
    types: [PAGE_TYPE],
    makeDefault: true,
    label: "AUDIOLOG.pageType",
  });

  // Preload templates
  loadTemplates([`modules/${MODULE_ID}/templates/stub-view.hbs`]);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
});
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: register audiolog page type, data model, and stub sheet"
```

---

### Task 6: Localization

**Files:**
- Modify: `public/lang/en.json`

- [ ] **Step 1: Update en.json with all required keys**

Replace `public/lang/en.json` with:

```json
{
  "AUDIOLOG": {
    "title": "Foundry Audiology",
    "pageType": "Audio Log",
    "themes": {
      "generic": "Generic",
      "fantasy": "Fantasy / Arcane",
      "steampunk": "Steampunk",
      "cyberpunk": "Cyberpunk",
      "modern": "Modern",
      "futuristic": "Futuristic"
    }
  },
  "TYPES": {
    "JournalEntryPage": {
      "foundry-audiolog.audiolog": "Audio Log"
    }
  }
}
```

Notes:
- `TYPES.JournalEntryPage.foundry-audiolog.audiolog` is the key Foundry uses for the "Add Page" dropdown.
- `AUDIOLOG.themes.*` keys are referenced by both the data model `choices` and the sheet's `themeChoices`.
- `AUDIOLOG.pageType` is the sheet registration label.

- [ ] **Step 2: Commit**

```bash
git add public/lang/en.json
git commit -m "feat: add localization keys for audio log page type and themes"
```

---

### Task 7: Build & Verify

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Typecheck passes, Vite builds `dist/index.js` and `dist/module.json`, no errors.

- [ ] **Step 2: Verify dist output**

Run: `ls dist/` and `cat dist/module.json | head -20`
Expected: `index.js`, `module.json`, `styles.css` exist. `module.json` contains `documentTypes` block.

- [ ] **Step 3: Check template is in dist**

The `templates/` directory is NOT inside `public/` or `src/`, so Vite won't copy it automatically. Check if the `build-manifest.mjs` script copies it (it copies `templates/` if present at project root).

Run: `ls dist/templates/`
Expected: `stub-view.hbs` exists. If not, the build script already handles this — it copies `templates/` recursively to `dist/templates/`.

- [ ] **Step 4: Deploy to Foundry for manual testing**

Run: `rsync -avz --delete "dist/" deploy@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/`

Manual verification in Foundry:
1. Enable the module in a world
2. Open a Journal Entry → click "Add Page" → verify "Audio Log" appears in the type dropdown
3. Create an Audio Log page → verify it opens with the stub view
4. Switch to edit mode → verify form fields appear for all schema properties
5. Change theme, type a transcript, toggle controls → verify changes persist
6. Check browser console for any errors

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address issues found during Foundry testing"
```

- [ ] **Step 6: Push all commits**

```bash
git push
```
