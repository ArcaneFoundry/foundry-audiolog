# Phase 4: Five Theme CSS Treatments + Default Images — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five themed CSS treatments that override base layout custom properties, bundle AI-generated default images per theme, and auto-set default images when a GM selects a theme.

**Architecture:** Five small CSS files (one per theme) imported after `base-layout.css`. A `DEFAULT_THEME_IMAGES` constant maps theme names to bundled asset paths. A `preUpdateJournalEntryPage` hook auto-sets the default image when the theme changes and `imagePath` is empty. Images generated via dnd-art-forge plugin.

**Tech Stack:** CSS custom properties, TypeScript (Foundry hooks), WebP images via AI generation

**Spec:** `docs/superpowers/specs/2026-03-12-phase4-theme-css-design.md`

---

## Chunk 1: Theme CSS Files

### Task 1: Create fantasy theme CSS

**Files:**
- Create: `src/styles/themes/fantasy.css`

- [ ] **Step 1: Create `src/styles/themes/fantasy.css`**

```css
/* ==========================================================================
   Theme: Fantasy / Arcane
   Deep purple-black with arcane violet glow. Serif typography.
   ========================================================================== */

.audiolog-theme-fantasy {
  --audiolog-bg: #1c1026;
  --audiolog-border: 1px solid rgba(147, 112, 219, 0.3);
  --audiolog-radius: 8px;
  --audiolog-shadow: 0 0 20px rgba(147, 112, 219, 0.15), 0 2px 12px rgba(0, 0, 0, 0.5);
  --audiolog-img-radius: 4px 4px 0 0;
  --audiolog-controls-bg: rgba(20, 10, 35, 0.8);
  --audiolog-controls-color: #b39ddb;
  --audiolog-controls-hover: #d1c4e9;
  --audiolog-transcript-color: rgba(179, 157, 219, 0.7);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #1c1026;
  --audiolog-font: Georgia, 'Times New Roman', serif;
}

/* Subtle arcane radial glow on card background */
.audiolog-theme-fantasy {
  background:
    radial-gradient(ellipse at 50% 30%, rgba(147, 112, 219, 0.06) 0%, transparent 70%),
    var(--audiolog-bg);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/themes/fantasy.css
git commit -m "feat: add fantasy theme CSS"
```

---

### Task 2: Create steampunk theme CSS

**Files:**
- Create: `src/styles/themes/steampunk.css`

- [ ] **Step 1: Create `src/styles/themes/steampunk.css`**

```css
/* ==========================================================================
   Theme: Steampunk
   Dark leather-brown with brass accents. Monospace typography.
   ========================================================================== */

.audiolog-theme-steampunk {
  --audiolog-bg: #1e1810;
  --audiolog-border: 2px solid rgba(205, 160, 80, 0.4);
  --audiolog-radius: 6px;
  --audiolog-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(205, 160, 80, 0.1);
  --audiolog-img-radius: 4px 4px 0 0;
  --audiolog-controls-bg: rgba(18, 14, 8, 0.9);
  --audiolog-controls-color: #cda050;
  --audiolog-controls-hover: #e8c878;
  --audiolog-transcript-color: rgba(205, 160, 80, 0.6);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #1e1810;
  --audiolog-font: 'Courier New', Courier, monospace;
}

/* Thicker border on controls bar for brass plate feel */
.audiolog-theme-steampunk .audiolog-controls {
  border-top: 2px solid rgba(205, 160, 80, 0.3);
  border-bottom: 2px solid rgba(205, 160, 80, 0.2);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/themes/steampunk.css
git commit -m "feat: add steampunk theme CSS"
```

---

### Task 3: Create cyberpunk theme CSS

**Files:**
- Create: `src/styles/themes/cyberpunk.css`

- [ ] **Step 1: Create `src/styles/themes/cyberpunk.css`**

```css
/* ==========================================================================
   Theme: Cyberpunk
   Near-black with neon cyan + magenta accents. Sharp corners. Monospace.
   ========================================================================== */

.audiolog-theme-cyberpunk {
  --audiolog-bg: #0e0e1a;
  --audiolog-border: 1px solid rgba(0, 255, 200, 0.3);
  --audiolog-radius: 4px;
  --audiolog-shadow: 0 0 15px rgba(0, 255, 200, 0.1), 0 0 30px rgba(255, 0, 128, 0.05);
  --audiolog-img-radius: 2px 2px 0 0;
  --audiolog-controls-bg: rgba(8, 8, 18, 0.9);
  --audiolog-controls-color: #00ffc8;
  --audiolog-controls-hover: #fff;
  --audiolog-transcript-color: rgba(0, 255, 200, 0.5);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #0e0e1a;
  --audiolog-font: 'Courier New', Courier, monospace;
}

/* Magenta accent on controls bar top edge */
.audiolog-theme-cyberpunk .audiolog-controls {
  border-top: 1px solid rgba(255, 0, 128, 0.3);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/themes/cyberpunk.css
git commit -m "feat: add cyberpunk theme CSS"
```

---

### Task 4: Create modern theme CSS

**Files:**
- Create: `src/styles/themes/modern.css`

- [ ] **Step 1: Create `src/styles/themes/modern.css`**

```css
/* ==========================================================================
   Theme: Modern
   Clean dark grey with subtle borders. Large radius. System sans-serif.
   ========================================================================== */

.audiolog-theme-modern {
  --audiolog-bg: #1e1e26;
  --audiolog-border: 1px solid rgba(255, 255, 255, 0.08);
  --audiolog-radius: 12px;
  --audiolog-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  --audiolog-img-radius: 10px 10px 0 0;
  --audiolog-controls-bg: rgba(0, 0, 0, 0.2);
  --audiolog-controls-color: #aaa;
  --audiolog-controls-hover: #fff;
  --audiolog-transcript-color: rgba(255, 255, 255, 0.5);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #1e1e26;
  --audiolog-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/themes/modern.css
git commit -m "feat: add modern theme CSS"
```

---

### Task 5: Create futuristic theme CSS

**Files:**
- Create: `src/styles/themes/futuristic.css`

- [ ] **Step 1: Create `src/styles/themes/futuristic.css`**

```css
/* ==========================================================================
   Theme: Futuristic
   Dark blue with soft blue glow. Glass-panel feel via blue tint. Monospace.
   ========================================================================== */

.audiolog-theme-futuristic {
  --audiolog-bg: #0a1428;
  --audiolog-border: 1px solid rgba(100, 180, 255, 0.25);
  --audiolog-radius: 8px;
  --audiolog-shadow: 0 0 20px rgba(100, 180, 255, 0.08), 0 4px 16px rgba(0, 0, 0, 0.4);
  --audiolog-img-radius: 4px 4px 0 0;
  --audiolog-controls-bg: rgba(5, 10, 25, 0.7);
  --audiolog-controls-color: #64b4ff;
  --audiolog-controls-hover: #a0d4ff;
  --audiolog-transcript-color: rgba(100, 180, 255, 0.5);
  --audiolog-transcript-bg: transparent;
  --audiolog-transcript-fade: #0a1428;
  --audiolog-font: 'Courier New', Courier, monospace;
}

/* Subtle blue glow around image */
.audiolog-theme-futuristic .audiolog-image {
  box-shadow: 0 0 12px rgba(100, 180, 255, 0.1);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/themes/futuristic.css
git commit -m "feat: add futuristic theme CSS"
```

---

### Task 6: Wire up theme imports and build

**Files:**
- Modify: `src/styles/index.css`

- [ ] **Step 1: Update `src/styles/index.css`**

Add theme imports **after** the base-layout import:

```css
/**
 * Foundry Audiology — Stylesheet entry point
 *
 * Import theme and component stylesheets here as they are created.
 * Vite will bundle everything into a single styles.css.
 */
@import "./base-layout.css";
@import "./themes/fantasy.css";
@import "./themes/steampunk.css";
@import "./themes/cyberpunk.css";
@import "./themes/modern.css";
@import "./themes/futuristic.css";
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Clean build. `dist/styles.css` should be larger (all theme rules bundled).

- [ ] **Step 3: Commit**

```bash
git add src/styles/index.css
git commit -m "feat: wire up all theme CSS imports"
```

---

## Chunk 2: Default Image Auto-Set Logic

### Task 7: Add DEFAULT_THEME_IMAGES constant

**Files:**
- Modify: `src/models/AudioLogPageModel.ts`

- [ ] **Step 1: Add the constant after the existing `AUDIO_LOG_THEMES` block**

Add after line 13 (after the `AudioLogTheme` type export):

```typescript
/**
 * Default bundled images for each theme.
 * Paths are relative to the Foundry module root (public/ maps to module root at runtime).
 * Generic is absent — it has no default image.
 */
export const DEFAULT_THEME_IMAGES: Partial<Record<AudioLogTheme, string>> = {
  fantasy: "modules/foundry-audiolog/assets/themes/fantasy.webp",
  steampunk: "modules/foundry-audiolog/assets/themes/steampunk.webp",
  cyberpunk: "modules/foundry-audiolog/assets/themes/cyberpunk.webp",
  modern: "modules/foundry-audiolog/assets/themes/modern.webp",
  futuristic: "modules/foundry-audiolog/assets/themes/futuristic.webp",
};
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/models/AudioLogPageModel.ts
git commit -m "feat: add DEFAULT_THEME_IMAGES constant"
```

---

### Task 8: Add preUpdateJournalEntryPage hook

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add the import**

Add `DEFAULT_THEME_IMAGES` to the existing import from `AudioLogPageModel.ts`. Update line 9:

```typescript
import { createAudioLogPageModel, DEFAULT_THEME_IMAGES } from "./models/AudioLogPageModel.js";
```

- [ ] **Step 2: Add the hook at top level (after the imports, before `Hooks.once("init", ...)`)**

Insert after line 12 (after `const PAGE_TYPE = ...`):

```typescript
/**
 * Auto-set the default theme image when a GM changes the theme
 * and the imagePath field is currently empty.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on("preUpdateJournalEntryPage", (page: any, changes: any, _options: any, _userId: any) => {
  // Only act on our page type
  if (page.type !== PAGE_TYPE) return;

  // Only act when theme is changing
  const newTheme = changes?.system?.theme;
  if (!newTheme) return;

  // If imagePath is being explicitly set/cleared in this same update, don't interfere
  const imageInChanges = "imagePath" in (changes?.system ?? {});
  if (imageInChanges) return;

  // Only act when the document's current imagePath is empty
  if (page.system.imagePath) return;

  // Look up default image for the new theme (generic has none)
  // newTheme being truthy guarantees changes.system exists
  const defaultImage = DEFAULT_THEME_IMAGES[newTheme as keyof typeof DEFAULT_THEME_IMAGES];
  if (defaultImage) {
    changes.system.imagePath = defaultImage;
  }
});
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: auto-set default theme image on theme change"
```

---

## Chunk 3: Default Images + Deploy

### Task 9: Generate and bundle default theme images

**Files:**
- Create: `public/assets/themes/fantasy.webp`
- Create: `public/assets/themes/steampunk.webp`
- Create: `public/assets/themes/cyberpunk.webp`
- Create: `public/assets/themes/modern.webp`
- Create: `public/assets/themes/futuristic.webp`

Use the `dnd-art-forge` plugin's image generation tools. For each image:

- [ ] **Step 1: Generate fantasy image**

Prompt direction: "A glowing magical crystal resting on an ancient enchanted journal, mystical purple and violet tones, arcane energy wisps, dark background, fantasy RPG style, 16:9 landscape"

Save to `public/assets/themes/fantasy.webp` (960x540 WebP).

- [ ] **Step 2: Generate steampunk image**

Prompt direction: "A brass phonograph cylinder on a workbench, copper and brass tones, mechanical gears visible, warm amber lighting, dark Victorian workshop background, steampunk style, 16:9 landscape"

Save to `public/assets/themes/steampunk.webp` (960x540 WebP).

- [ ] **Step 3: Generate cyberpunk image**

Prompt direction: "A glowing neon data chip floating above a dark chrome surface, cyan and magenta neon light, circuit board patterns, dark background, cyberpunk style, 16:9 landscape"

Save to `public/assets/themes/cyberpunk.webp` (960x540 WebP).

- [ ] **Step 4: Generate modern image**

Prompt direction: "A sleek digital voice recorder on a minimal desk, clean grey tones, studio lighting, subtle shadows, modern minimalist style, 16:9 landscape"

Save to `public/assets/themes/modern.webp` (960x540 WebP).

- [ ] **Step 5: Generate futuristic image**

Prompt direction: "A translucent holographic datapad floating in space, blue holographic glow, sci-fi interface elements, dark background, futuristic style, 16:9 landscape"

Save to `public/assets/themes/futuristic.webp` (960x540 WebP).

- [ ] **Step 6: Verify all images exist, check dimensions, resize if needed**

Run: `ls -la public/assets/themes/`
Expected: 5 WebP files, each roughly 50-200KB.

Check dimensions: `sips -g pixelWidth -g pixelHeight public/assets/themes/*.webp`
Expected: 960x540 for each. If any differ, resize with:
`sips -z 540 960 public/assets/themes/{name}.webp`

- [ ] **Step 7: Commit**

```bash
git add public/assets/themes/
git commit -m "feat: add default theme images"
```

---

### Task 10: Build, deploy, and verify in Foundry

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: Clean build. `dist/` should contain `assets/themes/*.webp` files (copied from `public/`).

- [ ] **Step 2: Verify dist assets**

Run: `ls -la dist/assets/themes/`
Expected: All 5 WebP files present.

- [ ] **Step 3: Deploy to server**

```bash
rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/
```

- [ ] **Step 4: Manual verification checklist**

In Foundry (Ctrl+F5 to clear cache):

1. **Theme switching (edit mode):**
   - Create a new Audio Log page (starts on generic, no image)
   - Change theme to Fantasy — imagePath auto-fills with `modules/foundry-audiolog/assets/themes/fantasy.webp`
   - Switch to Steampunk — imagePath updates to steampunk.webp (since previous was a default and field is a default path)
   - Note: if previous image was a default, the field is non-empty so the hook won't fire. This is expected — the GM accepted the default.

2. **Each theme view mode:**
   - Fantasy: purple glow border, serif font, radial gradient overlay, crystal image
   - Steampunk: brass border, monospace font, embossed shadow, phonograph image
   - Cyberpunk: cyan border, sharp corners, magenta controls accent, data chip image
   - Modern: subtle border, large radius, clean shadow, recorder image
   - Futuristic: blue glow border, blue tint bg, datapad image

3. **Custom image preserved:**
   - Set a custom image on a themed page
   - Switch to a different theme
   - Custom image should remain (not overwritten)

4. **Generic theme:**
   - Switch to generic — no auto-image, previous image path remains
