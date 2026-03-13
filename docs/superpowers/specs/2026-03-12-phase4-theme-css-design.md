# Phase 4: Five Theme CSS Treatments + Default Images — Design Spec

## Goal

Add five themed visual treatments (fantasy, steampunk, cyberpunk, modern, futuristic) that override the base layout's CSS custom properties and add light decorative touches. Bundle a default 960x540 WebP image per theme, auto-set when a GM selects a theme and the image field is empty.

## Decisions

- **Depth:** Variables + light decorative CSS (2-5 extra rules per theme). Not just color swaps, but not full animated treatments.
- **Default images:** AI-generated via dnd-art-forge, 960x540 WebP, bundled in `public/assets/themes/`
- **Auto-set behavior:** `preUpdate` hook writes default image path when theme changes and `imagePath` is empty. GM always sees the path in the edit form.
- **Generic theme:** No default image, no theme CSS file. It IS the base layout defaults.

## Theme CSS Architecture

Each theme file follows the same pattern — override custom properties, then add a few decorative rules:

```css
.audiolog-theme-{name} {
  /* Custom property overrides */
}

/* 2-5 decorative rules */
.audiolog-theme-{name} .audiolog-image { ... }
```

All five files are imported from `src/styles/index.css` **after** `base-layout.css` to ensure theme selectors win by source order (both `.audiolog-view` and `.audiolog-theme-{name}` have equal specificity — one class each).

## Theme Definitions

### Fantasy / Arcane

| Property | Value |
|----------|-------|
| `--audiolog-bg` | `#1c1026` |
| `--audiolog-border` | `1px solid rgba(147, 112, 219, 0.3)` |
| `--audiolog-radius` | `8px` |
| `--audiolog-shadow` | `0 0 20px rgba(147, 112, 219, 0.15), 0 2px 12px rgba(0, 0, 0, 0.5)` |
| `--audiolog-img-radius` | `4px 4px 0 0` |
| `--audiolog-controls-bg` | `rgba(20, 10, 35, 0.8)` |
| `--audiolog-controls-color` | `#b39ddb` |
| `--audiolog-controls-hover` | `#d1c4e9` |
| `--audiolog-transcript-color` | `rgba(179, 157, 219, 0.7)` |
| `--audiolog-transcript-bg` | `transparent` |
| `--audiolog-transcript-fade` | `#1c1026` |
| `--audiolog-font` | `Georgia, 'Times New Roman', serif` |

**Decorative:** Subtle radial gradient overlay on card background (purple center glow).

### Steampunk

| Property | Value |
|----------|-------|
| `--audiolog-bg` | `#1e1810` |
| `--audiolog-border` | `2px solid rgba(205, 160, 80, 0.4)` |
| `--audiolog-radius` | `6px` |
| `--audiolog-shadow` | `0 2px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(205, 160, 80, 0.1)` |
| `--audiolog-img-radius` | `4px 4px 0 0` |
| `--audiolog-controls-bg` | `rgba(18, 14, 8, 0.9)` |
| `--audiolog-controls-color` | `#cda050` |
| `--audiolog-controls-hover` | `#e8c878` |
| `--audiolog-transcript-color` | `rgba(205, 160, 80, 0.6)` |
| `--audiolog-transcript-bg` | `transparent` |
| `--audiolog-transcript-fade` | `#1e1810` |
| `--audiolog-font` | `'Courier New', Courier, monospace` |

**Decorative:** The `--audiolog-shadow` value combines both outer shadow and inset highlight in a single declaration. Thicker border on controls bar via separate CSS rule.

### Cyberpunk

| Property | Value |
|----------|-------|
| `--audiolog-bg` | `#0e0e1a` |
| `--audiolog-border` | `1px solid rgba(0, 255, 200, 0.3)` |
| `--audiolog-radius` | `4px` |
| `--audiolog-shadow` | `0 0 15px rgba(0, 255, 200, 0.1), 0 0 30px rgba(255, 0, 128, 0.05)` |
| `--audiolog-img-radius` | `2px 2px 0 0` |
| `--audiolog-controls-bg` | `rgba(8, 8, 18, 0.9)` |
| `--audiolog-controls-color` | `#00ffc8` |
| `--audiolog-controls-hover` | `#fff` |
| `--audiolog-transcript-color` | `rgba(0, 255, 200, 0.5)` |
| `--audiolog-transcript-bg` | `transparent` |
| `--audiolog-transcript-fade` | `#0e0e1a` |
| `--audiolog-font` | `'Courier New', Courier, monospace` |

**Decorative:** Sharp corners (4px). Dual glow shadow (cyan + magenta). Subtle top-border accent on controls bar in magenta `rgba(255, 0, 128, 0.3)`.

### Modern

| Property | Value |
|----------|-------|
| `--audiolog-bg` | `#1e1e26` |
| `--audiolog-border` | `1px solid rgba(255, 255, 255, 0.08)` |
| `--audiolog-radius` | `12px` |
| `--audiolog-shadow` | `0 4px 24px rgba(0, 0, 0, 0.4)` |
| `--audiolog-img-radius` | `10px 10px 0 0` |
| `--audiolog-controls-bg` | `rgba(0, 0, 0, 0.2)` |
| `--audiolog-controls-color` | `#aaa` |
| `--audiolog-controls-hover` | `#fff` |
| `--audiolog-transcript-color` | `rgba(255, 255, 255, 0.5)` |
| `--audiolog-transcript-bg` | `transparent` |
| `--audiolog-transcript-fade` | `#1e1e26` |
| `--audiolog-font` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |

**Decorative:** Larger radius throughout for soft card feel. Clean — minimal decorative additions beyond the variables.

### Futuristic

| Property | Value |
|----------|-------|
| `--audiolog-bg` | `#0a1428` |
| `--audiolog-border` | `1px solid rgba(100, 180, 255, 0.25)` |
| `--audiolog-radius` | `8px` |
| `--audiolog-shadow` | `0 0 20px rgba(100, 180, 255, 0.08), 0 4px 16px rgba(0, 0, 0, 0.4)` |
| `--audiolog-img-radius` | `4px 4px 0 0` |
| `--audiolog-controls-bg` | `rgba(5, 10, 25, 0.7)` |
| `--audiolog-controls-color` | `#64b4ff` |
| `--audiolog-controls-hover` | `#a0d4ff` |
| `--audiolog-transcript-color` | `rgba(100, 180, 255, 0.5)` |
| `--audiolog-transcript-bg` | `transparent` |
| `--audiolog-transcript-fade` | `#0a1428` |
| `--audiolog-font` | `'Courier New', Courier, monospace` |

**Decorative:** Opaque dark blue background (the "glass" effect comes from the blue tint and glow, not actual transparency — actual transparency creates gradient fade mismatches). Subtle blue glow on image container.

## Default Images

### Specifications

- **Format:** WebP, 960x540px (16:9 native)
- **Style:** Each image should evoke the theme's aesthetic and match the "default image concept" from the product spec
- **Location:** `public/assets/themes/{theme-name}.webp`

### Image Subjects

| Theme | Subject | Art Direction |
|-------|---------|---------------|
| Fantasy | Glowing crystal or enchanted journal | Mystical, purple/violet tones, magical energy, dark background |
| Steampunk | Phonograph cylinder | Brass/copper tones, mechanical, warm amber lighting, dark workshop |
| Cyberpunk | Neon-lit data chip | Cyan/magenta neon, dark chrome, circuit board patterns |
| Modern | Voice recorder | Clean, minimal, grey tones, studio/desk setting |
| Futuristic | Holographic datapad | Blue holographic glow, translucent, sci-fi interface |

### Generation

Use the `dnd-art-forge` plugin's image generation tools to generate each image during development. These are static assets bundled with the module — no runtime dependency on the plugin. Convert/resize to 960x540 WebP as needed.

## Default Image Auto-Set Logic

### preUpdate Hook

Registered at the top level of `src/index.ts` (outside the `init` hook — `Hooks.on` is available immediately):

```
Hooks.on("preUpdateJournalEntryPage", (page, changes, options, userId) => {
  // Only act on our page type
  // Only act when system.theme is present in changes
  const newTheme = changes?.system?.theme;
  if (!newTheme) return;

  // Check if imagePath is being set in this same update
  const imageInChanges = "imagePath" in (changes?.system ?? {});
  if (imageInChanges) return;  // GM is explicitly setting/clearing image — don't interfere

  // Only act when the document's current imagePath is empty
  if (page.system.imagePath) return;

  // Look up default image for the new theme (generic has none)
  const defaultImage = DEFAULT_THEME_IMAGES[newTheme];
  if (defaultImage) {
    changes.system.imagePath = defaultImage;
  }
})
```

### Edge Cases

- **Theme change + imagePath change in same update:** The hook checks `imageInChanges` — if the GM explicitly sets or clears imagePath in the same operation, the hook does not interfere. This means explicitly clearing imagePath while changing themes does NOT auto-set.
- **Switching to generic:** No default image for generic, so the hook does nothing. The previous theme's image path remains. This is intentional — the GM explicitly chose that image (or accepted the default), and switching to generic shouldn't silently remove it.
- **New page creation:** `preUpdate` does not fire on creation, only on updates. A newly created page starts with `generic` theme and no image. If the GM then changes the theme, the hook fires and sets the default.

### Default Image Map

A `DEFAULT_THEME_IMAGES` constant in `AudioLogPageModel.ts`:

```typescript
export const DEFAULT_THEME_IMAGES: Partial<Record<AudioLogTheme, string>> = {
  fantasy: `modules/foundry-audiolog/assets/themes/fantasy.webp`,
  steampunk: `modules/foundry-audiolog/assets/themes/steampunk.webp`,
  cyberpunk: `modules/foundry-audiolog/assets/themes/cyberpunk.webp`,
  modern: `modules/foundry-audiolog/assets/themes/modern.webp`,
  futuristic: `modules/foundry-audiolog/assets/themes/futuristic.webp`,
};
```

Note: `generic` is intentionally absent — no default image.

## File Structure

```
src/styles/
├── index.css              # imports base-layout + all 5 theme files
├── base-layout.css        # (existing, unchanged)
└── themes/
    ├── fantasy.css
    ├── steampunk.css
    ├── cyberpunk.css
    ├── modern.css
    └── futuristic.css
src/models/
└── AudioLogPageModel.ts   # Add DEFAULT_THEME_IMAGES constant
src/index.ts               # Add preUpdateJournalEntryPage hook
public/assets/themes/
├── fantasy.webp
├── steampunk.webp
├── cyberpunk.webp
├── modern.webp
└── futuristic.webp
```

## Out of Scope

- Animated effects (scan lines, glitch, glow pulses) — future polish
- Custom border images or CSS `background-image` textures from files
- Theme-specific audio playback styling (progress bars, waveforms)
- GM-configurable default images via module settings
