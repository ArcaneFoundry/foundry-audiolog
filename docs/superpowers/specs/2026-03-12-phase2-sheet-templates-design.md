# Phase 2: Sheet & Templates — Design Spec

## Goal

Replace the Phase 1 stub sheet with a fully functional `AudioLogPageSheet` that displays audio logs (image, playback controls, transcript) in view mode and provides GM configuration (file pickers, theme selector, control toggles) in edit mode.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| View/edit structure | Inline edit within journal | Standard Foundry pattern; GMs toggle between view and edit in the same journal panel |
| PARTS layout | Two-part (view + edit), not three-part | Spec suggested header + body + edit-form, but header (just title + theme selector) doesn't justify its own PART — theme selector belongs in edit, title is handled by Foundry's journal chrome. Two parts gives clean view/edit separation without over-splitting. |
| Audio playback | Local-only, per-client | Simple, no socket coordination; GM-broadcast deferred to future enhancement |
| Audio API | `AudioHelper.play()` | Returns a `Sound` reference for pause/stop; handles loading automatically |
| File pickers | Standard Foundry `FilePicker` button pattern | Text input + browse button; consistent with every core sheet |

---

## Architecture

### Sheet Class — `AudioLogPageSheet`

Factory function `createAudioLogPageSheet()` returns a class extending `JournalEntryPageHandlebarsSheet` (cast to `any` due to incomplete fvtt-types stubs).

#### DEFAULT_OPTIONS

```typescript
static DEFAULT_OPTIONS = {
  classes: ["audiolog-page-sheet"],
  form: { submitOnChange: true },
  actions: {
    play: AudioLogPageSheet.#onPlay,
    pause: AudioLogPageSheet.#onPause,
    stop: AudioLogPageSheet.#onStop,
    browseAudio: AudioLogPageSheet.#onBrowseAudio,
    browseImage: AudioLogPageSheet.#onBrowseImage,
  },
};
```

#### PARTS

```typescript
static PARTS = {
  view: {
    template: `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
    scrollable: [".audiolog-view"],
  },
  edit: {
    template: `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
  },
};
```

- **view** — Always rendered. Shows image, audio controls, transcript.
- **edit** — Only rendered when `!isView`. Shows theme selector, file pickers, control toggles, transcript textarea.

#### Instance State

- `_currentSound: Sound | null` — Tracks the active playback `Sound` object for pause/stop operations. Set by play, cleared by stop and `close()`.

#### `_prepareContext(options)`

Returns a ViewModel:

```typescript
{
  ...super._prepareContext(options),
  system: page.system,           // Full system data from the TypeDataModel
  isView: this.isView ?? true,   // View vs. edit mode flag
  themeChoices: { ... },         // Localized theme name map for <select>
  hasAudio: !!page.system.audioPath,  // Whether an audio file is configured
  imageSrc: page.system.imagePath || null,  // Resolved image source (null if none)
}
```

#### `_configureRenderOptions(options)`

Override to conditionally exclude the `edit` part from rendering:
- If `this.isView` is true, filter `options.parts` to remove `"edit"` so only the `view` part renders.
- This is the standard V13 ApplicationV2 pattern for conditionally excluding PARTS.

#### `_preparePartContext(partId, context)`

- For `view` part: passes through the base context.
- For `edit` part: passes through the base context (part exclusion is handled by `_configureRenderOptions`, not here).

#### Action Handlers

**`#onPlay(event, target)`**
- Guard: no-op if `audioPath` is empty
- If `_currentSound` exists and is paused, resume via `_currentSound.play()`
- Otherwise, `await AudioHelper.play({ src: audioPath, volume: game.settings.get("core", "globalInterfaceVolume"), loop: false })`
- Store the resolved `Sound` in `_currentSound`
- Handler must be `async` since `AudioHelper.play()` returns `Promise<Sound>`

**`#onPause(event, target)`**
- Guard: no-op if `_currentSound` is null
- Call `_currentSound.pause()`

**`#onStop(event, target)`**
- Guard: no-op if `_currentSound` is null
- Call `_currentSound.stop()`
- Set `_currentSound = null`

**`#onBrowseAudio(event, target)`**
- Create `new FilePicker({ type: "audio", current: this.document.system.audioPath, callback: (path) => this.document.update({ "system.audioPath": path }) })`
- Call `.render(true)` to open the picker dialog (not `.browse()`, which is an internal directory listing method)

**`#onBrowseImage(event, target)`**
- Same as above with `type: "image"`, field `"system.imagePath"`, and `.render(true)`

#### Cleanup

Override `close()` to call `_currentSound?.stop()` before `super.close()`, preventing orphaned audio when the sheet is closed.

---

## Templates

### `templates/audio-log-view.hbs`

Player-facing content. Structure:

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
      {{!-- Triple-stache is safe here: Foundry's HTMLField sanitizes content on save --}}
      {{{system.transcript}}}
    </div>
  {{/if}}
</div>
```

- Theme class on root `<div>` prepares for Phase 3/4 CSS (no styling applied yet)
- Controls use Font Awesome icons (bundled with Foundry)
- Buttons disabled when no audio file is configured
- Each control conditionally rendered based on GM's visibility settings

### `templates/audio-log-edit.hbs`

GM configuration form:

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

- All form inputs use `name="system.*"` for Foundry's `submitOnChange` auto-persistence
- File pickers use `data-action` to route to sheet action handlers
- Localization keys for all labels

---

## Registration Changes

The `init` hook in `src/index.ts` is updated:

- Template preloading changes from `stub-view.hbs` to `audio-log-view.hbs` and `audio-log-edit.hbs`
- Sheet registration remains the same (class reference, types, makeDefault)
- `stub-view.hbs` is deleted

---

## Localization

New keys added to `public/lang/en.json` as nested objects under `"AUDIOLOG"`, matching the existing structure (theme keys from Phase 1 are already present):

```json
{
  "AUDIOLOG": {
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
  }
}
```

Templates use `{{localize "AUDIOLOG.fields.theme"}}` etc. — Foundry resolves dot-notation keys against nested JSON automatically.

---

## Files Changed

| Action | File | Description |
|--------|------|-------------|
| Modify | `src/sheets/AudioLogPageSheet.ts` | Replace stub with full two-part sheet, action handlers, audio playback |
| Create | `templates/audio-log-view.hbs` | Player-facing view template |
| Create | `templates/audio-log-edit.hbs` | GM edit form template |
| Delete | `templates/stub-view.hbs` | Remove Phase 1 stub |
| Modify | `src/index.ts` | Update template preloading paths |
| Modify | `public/lang/en.json` | Add field and control label localization keys |

## Out of Scope

- CSS styling (Phase 3: base layout, Phase 4: theme-specific)
- Default theme images (Phase 5)
- GM-broadcast audio playback (future enhancement, tracked in vault)
- Audio progress bar / seek controls
- Volume slider (uses Foundry's global interface volume)
