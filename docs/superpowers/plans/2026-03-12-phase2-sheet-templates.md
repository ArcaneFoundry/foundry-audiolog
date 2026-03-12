# Phase 2: Sheet & Templates Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Phase 1 stub sheet with a fully functional two-part AudioLogPageSheet — view mode (image, audio controls, transcript) and edit mode (file pickers, theme selector, control toggles).

**Architecture:** Two-part PARTS layout (view + edit). View always renders for all users; edit conditionally renders for GMs via `_configureRenderOptions()`. Audio playback is local-only using `AudioHelper.play()` with a stored `Sound` reference for pause/stop. File pickers use Foundry's standard `FilePicker` pattern.

**Tech Stack:** TypeScript, Foundry VTT V13 API (ApplicationV2 / HandlebarsApplicationMixin / JournalEntryPageHandlebarsSheet), Handlebars templates, Vite build

**Design Spec:** `docs/superpowers/specs/2026-03-12-phase2-sheet-templates-design.md`

**Skills:** @forgewright:foundry-vtt-dev for all Foundry API code, @forgewright:ui-ux-engineer if any styling questions arise

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/sheets/AudioLogPageSheet.ts` | Full sheet class: PARTS, actions, audio playback, file pickers, cleanup |
| Create | `templates/audio-log-view.hbs` | Player-facing template: image, playback controls, transcript |
| Create | `templates/audio-log-edit.hbs` | GM edit form: theme selector, file pickers, control toggles, transcript |
| Delete | `templates/stub-view.hbs` | Phase 1 stub — replaced entirely |
| Modify | `src/index.ts` | Update template preloading paths |
| Modify | `public/lang/en.json` | Add localization keys for field labels and control names |

No new source files are created — the sheet factory file is rewritten in place. No test files for this phase (Foundry sheet classes require the full Foundry runtime, which Vitest can't provide without extensive mocking that would test mocks, not Foundry).

---

## Chunk 1: Templates & Localization

### Task 1: Create the view template

**Files:**
- Create: `templates/audio-log-view.hbs`

- [ ] **Step 1: Create `templates/audio-log-view.hbs`**

```handlebars
<div class="audiolog-view audiolog-theme-{{system.theme}}">
  {{#if imageSrc}}
    <div class="audiolog-image">
      <img src="{{imageSrc}}" alt="" />
    </div>
  {{/if}}

  <div class="audiolog-controls">
    {{#if system.controls.play}}
      <button type="button" data-action="play" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-play"></i>
      </button>
    {{/if}}
    {{#if system.controls.pause}}
      <button type="button" data-action="pause" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-pause"></i>
      </button>
    {{/if}}
    {{#if system.controls.stop}}
      <button type="button" data-action="stop" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-stop"></i>
      </button>
    {{/if}}
  </div>

  {{#if system.transcript}}
    <div class="audiolog-transcript">
      {{!-- Triple-stache is safe: Foundry's HTMLField sanitizes on save --}}
      {{{system.transcript}}}
    </div>
  {{/if}}
</div>
```

Key details:
- `audiolog-theme-{{system.theme}}` class on root div prepares for Phase 3/4 CSS theming (no styles yet)
- `data-action="play|pause|stop"` wires buttons to sheet action handlers via ApplicationV2's action system
- `{{#unless hasAudio}}disabled{{/unless}}` disables controls when no audio file is configured
- `{{#if system.controls.play}}` etc. conditionally renders each button based on GM's visibility settings
- `{{{system.transcript}}}` uses triple-stache for unescaped HTML (safe because `HTMLField` sanitizes on save)

- [ ] **Step 2: Commit**

```bash
git add templates/audio-log-view.hbs
git commit -m "feat(templates): add audio-log-view.hbs for player-facing content"
```

---

### Task 2: Create the edit template

**Files:**
- Create: `templates/audio-log-edit.hbs`

- [ ] **Step 1: Create `templates/audio-log-edit.hbs`**

```handlebars
<div class="audiolog-edit">
  <div class="form-group">
    <label>{{localize "AUDIOLOG.fields.theme"}}</label>
    <select name="system.theme">
      {{selectOptions themeChoices selected=system.theme}}
    </select>
  </div>

  <div class="form-group">
    <label>{{localize "AUDIOLOG.fields.audioPath"}}</label>
    <div class="form-fields">
      <input type="text" name="system.audioPath" value="{{system.audioPath}}"
             placeholder="path/to/audio.ogg" />
      <button type="button" data-action="browseAudio" class="file-picker">
        <i class="fa-solid fa-folder-open"></i>
      </button>
    </div>
  </div>

  <div class="form-group">
    <label>{{localize "AUDIOLOG.fields.imagePath"}}</label>
    <div class="form-fields">
      <input type="text" name="system.imagePath" value="{{system.imagePath}}"
             placeholder="path/to/image.webp" />
      <button type="button" data-action="browseImage" class="file-picker">
        <i class="fa-solid fa-folder-open"></i>
      </button>
    </div>
  </div>

  <fieldset>
    <legend>{{localize "AUDIOLOG.fields.controls"}}</legend>
    <label>
      <input type="checkbox" name="system.controls.play" {{checked system.controls.play}} />
      {{localize "AUDIOLOG.controls.play"}}
    </label>
    <label>
      <input type="checkbox" name="system.controls.pause" {{checked system.controls.pause}} />
      {{localize "AUDIOLOG.controls.pause"}}
    </label>
    <label>
      <input type="checkbox" name="system.controls.stop" {{checked system.controls.stop}} />
      {{localize "AUDIOLOG.controls.stop"}}
    </label>
  </fieldset>

  <div class="form-group">
    <label>{{localize "AUDIOLOG.fields.transcript"}}</label>
    <textarea name="system.transcript" rows="6">{{system.transcript}}</textarea>
  </div>
</div>
```

Key details:
- All inputs use `name="system.*"` dot notation — Foundry's `submitOnChange` auto-persists via `document.update()`
- `{{selectOptions themeChoices selected=system.theme}}` renders the theme dropdown from the ViewModel's `themeChoices` map
- `{{checked system.controls.play}}` renders `checked` attribute for boolean fields
- `data-action="browseAudio|browseImage"` wires file picker buttons to sheet action handlers
- `{{localize "AUDIOLOG.fields.*"}}` uses Foundry's i18n system with nested key resolution

- [ ] **Step 2: Commit**

```bash
git add templates/audio-log-edit.hbs
git commit -m "feat(templates): add audio-log-edit.hbs for GM configuration form"
```

---

### Task 3: Add localization keys

**Files:**
- Modify: `public/lang/en.json`

- [ ] **Step 1: Add field and control labels to `public/lang/en.json`**

The existing file has this structure:
```json
{
  "AUDIOLOG": {
    "title": "Foundry Audiology",
    "pageType": "Audio Log",
    "themes": { ... }
  },
  "TYPES": { ... }
}
```

Add `"fields"` and `"controls"` objects inside `"AUDIOLOG"`, after the existing `"themes"` block:

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
    },
    "fields": {
      "theme": "Theme",
      "audioPath": "Audio File",
      "imagePath": "Image",
      "controls": "Visible Controls",
      "transcript": "Transcript"
    },
    "controls": {
      "play": "Play",
      "pause": "Pause",
      "stop": "Stop"
    }
  },
  "TYPES": {
    "JournalEntryPage": {
      "foundry-audiolog.audiolog": "Audio Log"
    }
  }
}
```

These keys are referenced by `{{localize "AUDIOLOG.fields.theme"}}` etc. in the templates. Foundry resolves dot-notation keys against nested JSON automatically.

- [ ] **Step 2: Commit**

```bash
git add public/lang/en.json
git commit -m "feat(i18n): add field and control label localization keys"
```

---

## Chunk 2: Sheet Class

### Task 4: Rewrite AudioLogPageSheet with PARTS and context

**Files:**
- Modify: `src/sheets/AudioLogPageSheet.ts` (full rewrite of the factory function's returned class)

This is the core task. The existing stub at `src/sheets/AudioLogPageSheet.ts` (lines 1-61) gets replaced with the full sheet class. The file keeps the same exports (`MODULE_ID`, `createAudioLogPageSheet`).

- [ ] **Step 1: Rewrite `src/sheets/AudioLogPageSheet.ts`**

Replace the entire file contents with:

```typescript
import { AUDIO_LOG_THEMES } from "../models/AudioLogPageModel.js";

export const MODULE_ID = "foundry-audiolog";

/**
 * Factory that creates the AudioLogPageSheet class at runtime.
 * Must be called inside the `init` hook — Foundry globals are not
 * available at ES module parse time.
 */
export function createAudioLogPageSheet() {
  // fvtt-types V13 stubs for JournalEntryPageHandlebarsSheet are incomplete ("TODO: Stub").
  // Cast to `any` to allow class extension without type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BaseSheet = foundry.applications.sheets.journal
    .JournalEntryPageHandlebarsSheet as any;

  class AudioLogPageSheet extends BaseSheet {
    /**
     * Currently playing Sound instance, or null if nothing is playing.
     * Used by pause/stop handlers and cleaned up on close().
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _currentSound: any = null;

    static DEFAULT_OPTIONS = {
      classes: ["audiolog-page-sheet"],
      form: {
        submitOnChange: true,
      },
      // Actions are assigned after class definition (see below) because
      // static self-references like AudioLogPageSheet.onPlay don't work
      // inside class expressions — the name isn't bound yet.
      actions: {} as Record<string, Function>,
    };

    static PARTS = {
      view: {
        template: `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
        scrollable: [".audiolog-view"],
      },
      edit: {
        template: `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
      },
    };

    /**
     * Conditionally exclude the edit PART when in view mode.
     * Standard V13 ApplicationV2 pattern for conditional PARTS rendering.
     */
    _configureRenderOptions(options: any) {
      super._configureRenderOptions(options);
      const isView = (this as any).isView ?? true;
      if (isView && options.parts) {
        options.parts = options.parts.filter((p: string) => p !== "edit");
      }
    }

    async _prepareContext(options: object) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = await super._prepareContext(options as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      const isView = (this as any).isView ?? true;

      return {
        ...context,
        system: page.system,
        isView,
        hasAudio: !!page.system.audioPath,
        imageSrc: page.system.imagePath || null,
        themeChoices: Object.fromEntries(
          AUDIO_LOG_THEMES.map((t) => [
            t,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (game.i18n as any).localize(`AUDIOLOG.themes.${t}`),
          ]),
        ),
      };
    }

    // --- Action Handlers ---
    // Static methods referenced by DEFAULT_OPTIONS.actions.
    // In ApplicationV2, action handlers receive (event, target) and `this`
    // is the application instance.

    /**
     * Play audio. Resumes if paused, otherwise starts fresh.
     */
    static async onPlay(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      const audioPath = page.system.audioPath;
      if (!audioPath) return;

      // If we have a paused sound, resume it.
      // Sound.paused is a boolean getter in Foundry V13.
      if (this._currentSound && this._currentSound.paused) {
        this._currentSound.play();
        return;
      }

      // Start fresh playback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const volume = (game.settings as any).get("core", "globalInterfaceVolume");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._currentSound = await (foundry.audio as any).AudioHelper.play({
        src: audioPath,
        volume: volume ?? 0.5,
        loop: false,
      });
    }

    /**
     * Pause the currently playing sound.
     */
    static onPause(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      if (!this._currentSound) return;
      this._currentSound.pause();
    }

    /**
     * Stop the currently playing sound and clear the reference.
     */
    static onStop(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      if (!this._currentSound) return;
      this._currentSound.stop();
      this._currentSound = null;
    }

    /**
     * Open a FilePicker for audio file selection.
     */
    static onBrowseAudio(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (FilePicker as any)({
        type: "audio",
        current: page.system.audioPath ?? "",
        callback: (path: string) => {
          page.update({ "system.audioPath": path });
        },
      }).render(true);
    }

    /**
     * Open a FilePicker for image file selection.
     */
    static onBrowseImage(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (FilePicker as any)({
        type: "image",
        current: page.system.imagePath ?? "",
        callback: (path: string) => {
          page.update({ "system.imagePath": path });
        },
      }).render(true);
    }

    /**
     * Stop any playing audio before the sheet closes.
     */
    async close(options?: object) {
      this._currentSound?.stop();
      this._currentSound = null;
      return super.close(options);
    }
  };

  // Assign actions after class definition — self-references like
  // AudioLogPageSheet.onPlay don't work inside the class expression body
  // because the class name isn't bound until the expression completes.
  AudioLogPageSheet.DEFAULT_OPTIONS.actions = {
    play: AudioLogPageSheet.onPlay,
    pause: AudioLogPageSheet.onPause,
    stop: AudioLogPageSheet.onStop,
    browseAudio: AudioLogPageSheet.onBrowseAudio,
    browseImage: AudioLogPageSheet.onBrowseImage,
  };

  return AudioLogPageSheet;
}
```

Key implementation notes for the engineer:

1. **Action handlers are static methods assigned after class definition.** TypeScript class expressions can't self-reference during the class body, so `DEFAULT_OPTIONS.actions` starts empty and is populated after the class expression completes. The handlers use `this` typed via `InstanceType<typeof AudioLogPageSheet>`.

2. **`_currentSound` is typed as `any`** because fvtt-types doesn't fully type the `Sound` class. At runtime it's a Foundry `Sound` object with `.play()`, `.pause()`, `.stop()`, and `.paused` (boolean getter).

3. **`_preparePartContext` is intentionally omitted.** The spec describes it as a pass-through for both parts. Since the base class provides this default behavior, overriding it would be dead code. Part exclusion is handled by `_configureRenderOptions` instead.

4. **`_configureRenderOptions`** filters the `options.parts` array to exclude `"edit"` when in view mode. This is the correct V13 pattern — Foundry populates `options.parts` with all PARTS keys by default, and overrides can filter them.

5. **`AudioHelper.play()`** is accessed via `foundry.audio.AudioHelper` — it's a global, not an import. Returns `Promise<Sound>`.

6. **`FilePicker`** is a Foundry global. The `.render(true)` call opens the picker dialog. The callback receives the selected path string.

7. **`game.settings.get("core", "globalInterfaceVolume")`** returns the user's interface volume (0–1 float). Falls back to 0.5 if somehow undefined.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd ~/CodeProjects/foundry-audiolog && npx tsc --noEmit`
Expected: No errors (or only pre-existing warnings unrelated to our changes)

- [ ] **Step 3: Commit**

```bash
git add src/sheets/AudioLogPageSheet.ts
git commit -m "feat(sheet): replace stub with full two-part AudioLogPageSheet

Two PARTS (view + edit), audio playback via AudioHelper.play(),
FilePicker integration, and close() cleanup."
```

---

### Task 5: Update index.ts template preloading

**Files:**
- Modify: `src/index.ts:42` (the `loadTemplates` call)

- [ ] **Step 1: Update `loadTemplates` in `src/index.ts`**

Change line 42 from:

```typescript
  loadTemplates([`modules/${MODULE_ID}/templates/stub-view.hbs`]);
```

to:

```typescript
  loadTemplates([
    `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
    `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
  ]);
```

- [ ] **Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat(init): preload audio-log-view and audio-log-edit templates"
```

---

### Task 6: Delete the stub template

**Files:**
- Delete: `templates/stub-view.hbs`

- [ ] **Step 1: Delete `templates/stub-view.hbs`**

```bash
rm templates/stub-view.hbs
```

This template is no longer referenced anywhere — the sheet PARTS now point to `audio-log-view.hbs` and `audio-log-edit.hbs`.

- [ ] **Step 2: Commit**

```bash
git add -u templates/stub-view.hbs
git commit -m "chore: remove Phase 1 stub template (replaced by audio-log-view/edit)"
```

---

## Chunk 3: Build & Verify

### Task 7: Full build and verification

**Files:**
- No changes — verification only

- [ ] **Step 1: Run the full build**

```bash
cd ~/CodeProjects/foundry-audiolog && npm run build
```

Expected: Clean build with no TypeScript errors. Output in `dist/` includes:
- `dist/index.js` — bundled module code
- `dist/styles.css` — CSS (minimal, just the index.css import)
- `dist/module.json` — manifest
- `dist/templates/audio-log-view.hbs` — view template
- `dist/templates/audio-log-edit.hbs` — edit template
- `dist/lang/en.json` — localization

- [ ] **Step 2: Verify templates are in dist**

```bash
ls -la dist/templates/
```

Expected: `audio-log-view.hbs` and `audio-log-edit.hbs` present. `stub-view.hbs` should NOT be present.

- [ ] **Step 3: Verify dist/lang/en.json has new keys**

```bash
cat dist/lang/en.json | python3 -m json.tool
```

Expected: `AUDIOLOG.fields` and `AUDIOLOG.controls` objects present with all keys.

- [ ] **Step 4: Commit any remaining changes (if any)**

If the build produced any changes (e.g., updated manifests), stage and commit them:

```bash
git status
# If clean: no commit needed
# If changes: git add <files> && git commit -m "chore: update build artifacts"
```

---

## Post-Plan: Vault & Deploy

After all tasks are complete:

1. **Update vault issue:** Set ISSUE-2 status to `in-progress`, add progress log entry, record branch name
2. **Build:** `cd ~/CodeProjects/foundry-audiolog && npm run build`
3. **Deploy:** `rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/`
4. **Manual test in Foundry:**
   - Create a new Audio Log page in a journal entry
   - Verify view mode shows image area, controls, transcript
   - Verify edit mode shows theme selector, file pickers, control toggles, transcript textarea
   - Test audio playback: play, pause, stop
   - Test file pickers: browse audio, browse image
   - Test submitOnChange: change theme, toggle controls
   - Test close cleanup: play audio, close journal, verify audio stops
