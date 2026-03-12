# Phase 1: Core Data Model & Registration — Design Spec

## Overview

Implement the foundational layer of Foundry Audiology: the custom `audiolog` JournalEntryPage type, its data model, registration pipeline, and a minimal stub sheet to validate everything works end-to-end in Foundry V13.

## Approach

**Approach A: Minimal Stub Sheet** — Create the data model, register the page type, and add a bare-bones Handlebars sheet that renders stored fields as plain text/inputs. No styling, no audio playback, no themes. The stub is replaced entirely in Phase 2.

**Rationale:** Validates the full registration pipeline before investing in UI. Clean separation — isolates data model bugs from sheet bugs.

---

## 1. Module Manifest Changes

Update `module.template.json` to declare the custom document type for server-side validation:

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

- `htmlFields` tells the server to sanitize the transcript field
- `filePathFields` tells the server which fields contain media file paths
- The type key `audiolog` is declared without namespace prefix in the manifest; Foundry automatically prefixes it to `foundry-audiolog.audiolog` in client code

---

## 2. Data Model — AudioLogPageModel

**File:** `src/models/AudioLogPageModel.ts`

Extends `foundry.abstract.TypeDataModel` via factory pattern (runtime class resolution inside `init` hook).

### Schema

| Field | Field Type | Default | Notes |
|-------|-----------|---------|-------|
| `audioPath` | `FilePathField` | `""` | categories: `["AUDIO"]` |
| `imagePath` | `FilePathField` | `""` | categories: `["IMAGE"]` |
| `theme` | `StringField` | `"generic"` | choices: `generic`, `fantasy`, `steampunk`, `cyberpunk`, `modern`, `futuristic` |
| `transcript` | `HTMLField` | `""` | blank allowed, server-sanitized |
| `controls` | `SchemaField` | — | Nested object |
| `controls.play` | `BooleanField` | `true` | Show play button |
| `controls.pause` | `BooleanField` | `true` | Show pause button |
| `controls.stop` | `BooleanField` | `true` | Show stop button |

### Implementation Pattern

```typescript
function createAudioLogPageModel() {
  const fields = foundry.data.fields;
  return class AudioLogPageModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
      return {
        audioPath: new fields.FilePathField({ required: false, categories: ["AUDIO"] }),
        imagePath: new fields.FilePathField({ required: false, categories: ["IMAGE"] }),
        theme: new fields.StringField({
          required: true,
          initial: "generic",
          choices: ["generic", "fantasy", "steampunk", "cyberpunk", "modern", "futuristic"],
        }),
        transcript: new fields.HTMLField({ required: false, blank: true }),
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

### Type Shims

`src/types/foundry.d.ts` — minimal declarations for:
- `foundry.abstract.TypeDataModel`
- `foundry.data.fields` (FilePathField, StringField, HTMLField, BooleanField, SchemaField)
- `CONFIG.JournalEntryPage.dataModels`
- `foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet`
- `DocumentSheetConfig.registerSheet()`

---

## 3. Stub Sheet — AudioLogPageSheet

**File:** `src/sheets/AudioLogPageSheet.ts`

Extends `JournalEntryPageHandlebarsSheet` (V13 Handlebars-ready base for page sheets) via factory pattern.

### Class

```typescript
function createAudioLogPageSheet() {
  const BaseSheet = foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet;
  return class AudioLogPageSheet extends BaseSheet {
    static DEFAULT_OPTIONS = {
      classes: ["audiolog-page-sheet"],
    };

    static PARTS = {
      content: { template: "modules/foundry-audiolog/templates/stub-view.hbs" },
    };

    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      const page = this.document;
      context.system = page.system;
      context.isView = this.isView;
      return context;
    }
  };
}
```

### Stub Template

**File:** `templates/stub-view.hbs`

Plain diagnostic view — no styling, no audio playback:
- **View mode:** Displays theme, audio path, image path, transcript text, control flags
- **Edit mode:** Simple form inputs (text inputs for paths, select for theme, checkboxes for controls, textarea for transcript)

Uses `{{system.theme}}`, `{{system.audioPath}}`, etc. since custom type data lives on `page.system`.

---

## 4. Registration (init hook)

In `src/index.ts`, the `init` hook performs:

1. **Create classes** via factory functions (runtime class resolution)
2. **Register data model:** `CONFIG.JournalEntryPage.dataModels["foundry-audiolog.audiolog"] = AudioLogPageModel`
3. **Register sheet:** `DocumentSheetConfig.registerSheet(JournalEntryPage, "foundry-audiolog", AudioLogPageSheet, { types: ["foundry-audiolog.audiolog"], makeDefault: true, label: "AUDIOLOG.pageType" })`
4. **Preload templates:** `loadTemplates(["modules/foundry-audiolog/templates/stub-view.hbs"])`

---

## 5. Localization

Update `public/lang/en.json`:

```json
{
  "AUDIOLOG": {
    "title": "Foundry Audiology",
    "pageType": "Audio Log"
  },
  "TYPES": {
    "JournalEntryPage": {
      "foundry-audiolog.audiolog": "Audio Log"
    }
  }
}
```

The `TYPES.JournalEntryPage.foundry-audiolog.audiolog` key is what Foundry uses for the "Add Page" dropdown label.

---

## 6. Files Created/Modified

| Action | File |
|--------|------|
| Modify | `module.template.json` — add `documentTypes` |
| Create | `src/models/AudioLogPageModel.ts` — data model |
| Create | `src/sheets/AudioLogPageSheet.ts` — stub sheet |
| Create | `src/types/foundry.d.ts` — type shims |
| Create | `templates/stub-view.hbs` — stub template |
| Modify | `src/index.ts` — registration in init hook |
| Modify | `public/lang/en.json` — localization keys |

---

## 7. Acceptance Criteria

- [ ] "Audio Log" appears in the Journal Entry "Add Page" dropdown
- [ ] Creating an Audio Log page stores data with correct defaults (theme: generic, all controls: true)
- [ ] Opening the page shows all stored field values
- [ ] Editing fields persists changes to the document
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Module loads in Foundry V13 without console errors

---

## 8. Theme Values

Six total themes (five styled + one generic):

| ID | Name | Purpose |
|----|------|---------|
| `generic` | Generic | **Default.** Minimal styling, GM's image drives the look |
| `fantasy` | Fantasy/Arcane | Glowing runes, parchment, magical crystal |
| `steampunk` | Steampunk | Brass gears, vacuum tubes, phonograph |
| `cyberpunk` | Cyberpunk | Neon accents, dark chrome, holographic |
| `modern` | Modern | Clean recorder/dictaphone, professional |
| `futuristic` | Futuristic | Sleek sci-fi datapad, holographic waveform |

The generic theme will receive only base layout CSS in Phase 3 — no decorative treatment.
