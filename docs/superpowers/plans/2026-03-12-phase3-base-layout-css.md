# Phase 3: Base Layout CSS — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared base layout CSS for the audio log view card, including CSS custom properties as theme hooks, collapsible transcript, and minimal edit-mode styling.

**Architecture:** Single `base-layout.css` file defines all layout rules and CSS custom properties. The view template gets a transcript wrapper + toggle button. The sheet gets one new action handler. No tests — this is pure CSS/template work verified visually in Foundry.

**Tech Stack:** CSS (custom properties, flexbox, pseudo-elements), Handlebars templates, TypeScript (one action handler)

**Spec:** `docs/superpowers/specs/2026-03-12-phase3-base-layout-css-design.md`

---

## Chunk 1: Template & Localization Changes

### Task 1: Update view template with transcript wrapper and toggle

**Files:**
- Modify: `templates/audio-log-view.hbs`

The current template has a bare `.audiolog-transcript` div. We need to wrap it in `.audiolog-transcript-wrapper` and add a toggle button. Also tighten up the `.audiolog-controls` whitespace so `:not(:has(*))` isn't needed — use Handlebars `~` whitespace control to strip whitespace between `{{#if}}` blocks.

- [ ] **Step 1: Update `templates/audio-log-view.hbs`**

Replace the entire file content with:

```hbs
<div class="audiolog-view audiolog-theme-{{system.theme}}">
  {{#if imageSrc}}
    <div class="audiolog-image">
      <img src="{{imageSrc}}" alt="" />
    </div>
  {{/if}}

  <div class="audiolog-controls">
    {{~#if system.controls.play~}}
      <button type="button" data-action="play" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-play"></i>
      </button>
    {{~/if~}}
    {{~#if system.controls.pause~}}
      <button type="button" data-action="pause" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-pause"></i>
      </button>
    {{~/if~}}
    {{~#if system.controls.stop~}}
      <button type="button" data-action="stop" {{#unless hasAudio}}disabled{{/unless}}>
        <i class="fa-solid fa-stop"></i>
      </button>
    {{~/if~}}
  </div>

  {{#if system.transcript}}
    <div class="audiolog-transcript-wrapper">
      <div class="audiolog-transcript">
        {{{system.transcript}}}
      </div>
      <button type="button" class="audiolog-transcript-toggle" data-action="toggleTranscript">
        {{localize "AUDIOLOG.controls.showTranscript"}}
      </button>
    </div>
  {{/if}}
</div>
```

Key changes from current template:
- Added `~` whitespace control on the control `{{#if}}` blocks so `.audiolog-controls` is truly empty (no text nodes) when all controls are unchecked — enabling CSS `:empty` selector
- Wrapped `.audiolog-transcript` in `.audiolog-transcript-wrapper`
- Added `.audiolog-transcript-toggle` button with `data-action="toggleTranscript"`

- [ ] **Step 2: Verify the build still passes**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add templates/audio-log-view.hbs
git commit -m "feat: add transcript wrapper and toggle button to view template"
```

---

### Task 2: Add localization keys

**Files:**
- Modify: `public/lang/en.json`

- [ ] **Step 1: Add show/hide transcript keys to `public/lang/en.json`**

Add two new keys inside the `AUDIOLOG.controls` object:

```json
"controls": {
  "play": "Play",
  "pause": "Pause",
  "stop": "Stop",
  "showTranscript": "Show transcript",
  "hideTranscript": "Hide transcript"
}
```

- [ ] **Step 2: Commit**

```bash
git add public/lang/en.json
git commit -m "feat: add show/hide transcript localization keys"
```

---

### Task 3: Add toggleTranscript action handler

**Files:**
- Modify: `src/sheets/AudioLogPageSheet.ts`

- [ ] **Step 1: Add the `onToggleTranscript` static method**

Add this method after the existing `onStop` method (after line 127):

```typescript
    /**
     * Toggle the transcript between collapsed and expanded.
     */
    static onToggleTranscript(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, target: HTMLElement) {
      const wrapper = target.closest(".audiolog-transcript-wrapper");
      if (!wrapper) return;
      const isExpanded = wrapper.hasAttribute("data-expanded");
      if (isExpanded) {
        wrapper.removeAttribute("data-expanded");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target.textContent = (game.i18n as any).localize("AUDIOLOG.controls.showTranscript");
      } else {
        wrapper.setAttribute("data-expanded", "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target.textContent = (game.i18n as any).localize("AUDIOLOG.controls.hideTranscript");
      }
    }
```

- [ ] **Step 2: Register the action in the `Object.assign` block**

In the `Object.assign(AudioLogPageSheet.DEFAULT_OPTIONS.actions, { ... })` block at line 174, add:

```typescript
    toggleTranscript: AudioLogPageSheet.onToggleTranscript,
```

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/sheets/AudioLogPageSheet.ts
git commit -m "feat: add toggleTranscript action handler"
```

---

## Chunk 2: Base Layout CSS

### Task 4: Create base-layout.css with custom properties and view layout

**Files:**
- Create: `src/styles/base-layout.css`
- Modify: `src/styles/index.css`

This is the main CSS file. It defines custom properties on `.audiolog-view` and all child layout rules.

- [ ] **Step 1: Create `src/styles/base-layout.css`**

```css
/* ==========================================================================
   Audio Log — Base Layout
   Shared layout styles for all themes. The "generic" theme IS these defaults.
   Themes override by reassigning custom properties on .audiolog-theme-<name>.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Custom Properties (Theme API)
   -------------------------------------------------------------------------- */
.audiolog-view {
  --audiolog-bg: transparent;
  --audiolog-border: 1px solid rgba(255, 255, 255, 0.1);
  --audiolog-radius: 8px;
  --audiolog-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  --audiolog-img-radius: 4px 4px 0 0;
  --audiolog-controls-bg: rgba(0, 0, 0, 0.4);
  --audiolog-controls-color: rgba(255, 255, 255, 0.8);
  --audiolog-controls-hover: #fff;
  --audiolog-transcript-color: rgba(255, 255, 255, 0.7);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #1a1a2e;
  --audiolog-font: inherit;
}

/* --------------------------------------------------------------------------
   Card Container
   -------------------------------------------------------------------------- */
.audiolog-view {
  max-width: 560px;
  margin: 0 auto;
  background: var(--audiolog-bg);
  border: var(--audiolog-border);
  border-radius: var(--audiolog-radius);
  box-shadow: var(--audiolog-shadow);
  font-family: var(--audiolog-font);
  overflow: hidden;
}

/* First-child radius fallback when image is absent */
.audiolog-view > :first-child:not(.audiolog-image) {
  border-radius: var(--audiolog-radius) var(--audiolog-radius) 0 0;
}

/* --------------------------------------------------------------------------
   Image
   -------------------------------------------------------------------------- */
.audiolog-image img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--audiolog-img-radius);
}

/* --------------------------------------------------------------------------
   Controls Bar
   -------------------------------------------------------------------------- */
.audiolog-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--audiolog-controls-bg);
}

/* Hide when all controls are disabled by GM */
.audiolog-controls:empty {
  display: none;
}

.audiolog-controls button {
  background: none;
  border: none;
  color: var(--audiolog-controls-color);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.audiolog-controls button:hover:not(:disabled) {
  color: var(--audiolog-controls-hover);
}

.audiolog-controls button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* --------------------------------------------------------------------------
   Transcript Wrapper
   -------------------------------------------------------------------------- */
.audiolog-transcript-wrapper {
  background: var(--audiolog-transcript-bg);
}

/* --------------------------------------------------------------------------
   Transcript (collapsible)
   -------------------------------------------------------------------------- */
.audiolog-transcript {
  position: relative;
  padding: 1rem 1rem 0;
  color: var(--audiolog-transcript-color);
  line-height: 1.6;
  max-height: 4.5em;
  overflow: hidden;
}

/* Gradient fade on collapsed transcript */
.audiolog-transcript::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2em;
  background: linear-gradient(to bottom, transparent, var(--audiolog-transcript-fade));
  pointer-events: none;
}

/* Expanded state */
.audiolog-transcript-wrapper[data-expanded] .audiolog-transcript {
  max-height: none;
}

.audiolog-transcript-wrapper[data-expanded] .audiolog-transcript::after {
  display: none;
}

/* --------------------------------------------------------------------------
   Transcript Toggle Button
   -------------------------------------------------------------------------- */
.audiolog-transcript-toggle {
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: var(--audiolog-controls-color);
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: center;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.audiolog-transcript-toggle:hover {
  opacity: 1;
}

/* --------------------------------------------------------------------------
   Edit Mode
   -------------------------------------------------------------------------- */
.audiolog-edit .form-group {
  margin-bottom: 0.75rem;
}

.audiolog-edit fieldset {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
}

.audiolog-edit fieldset legend {
  padding: 0 0.5rem;
  font-weight: 600;
}

.audiolog-edit fieldset label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-right: 1rem;
}
```

- [ ] **Step 2: Update `src/styles/index.css` to import the base layout**

Replace the file contents with:

```css
/**
 * Foundry Audiology — Stylesheet entry point
 *
 * Import theme and component stylesheets here as they are created.
 * Vite will bundle everything into a single styles.css.
 */
@import "./base-layout.css";
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build. Check that `dist/styles.css` contains the base layout rules.

- [ ] **Step 4: Commit**

```bash
git add src/styles/base-layout.css src/styles/index.css
git commit -m "feat: add base layout CSS with custom properties theme API"
```

---

### Task 5: Deploy and verify in Foundry

- [ ] **Step 1: Deploy to server**

```bash
rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/
```

- [ ] **Step 2: Manual verification checklist**

In Foundry (Ctrl+F5 to clear cache):

1. **View mode with image + audio + transcript:**
   - Card is centered, max 560px wide
   - Image displays at 16:9 aspect ratio
   - Controls bar shows below image with centered icons
   - Transcript shows ~3 lines with gradient fade
   - "Show transcript" button expands transcript, text changes to "Hide transcript"
   - Clicking "Hide transcript" re-collapses

2. **View mode without image:**
   - Controls bar is at the top of the card with rounded top corners

3. **View mode with all controls unchecked:**
   - Controls bar is hidden (no empty bar visible)

4. **Edit mode:**
   - Form groups have consistent spacing
   - Controls fieldset has a visible border and legend

- [ ] **Step 3: Commit any fixes if needed, then final commit**

Stage only the changed files and commit. (Skip this step if no fixes needed.)
