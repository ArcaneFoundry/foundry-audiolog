# Phase 3: Base Layout CSS — Design Spec

## Goal

Add shared layout styles for the audio log journal page view that all six themes inherit. The `generic` theme is the base itself — no extra file needed. Edit mode gets minimal functional styling only.

## Decisions

- **Card layout**: Centered card, `max-width: 560px`, vertical stack (image → controls bar → transcript)
- **Image**: 16:9 landscape aspect ratio via `object-fit: cover`, hero element
- **Controls**: Horizontal media-player bar spanning card width, separating image from transcript
- **Transcript**: Collapsible — shows ~3 lines by default with gradient fade-out; toggle expands to full height
- **Theme API**: CSS custom properties on `.audiolog-view` so themes only reassign variables instead of overriding properties

## CSS Custom Properties

Defined on `.audiolog-view`, consumed by child selectors:

| Variable | Purpose | Default |
|----------|---------|---------|
| `--audiolog-bg` | Card background | `transparent` |
| `--audiolog-border` | Card border | `1px solid rgba(255,255,255,0.1)` |
| `--audiolog-radius` | Card border-radius | `8px` |
| `--audiolog-shadow` | Card box-shadow | `0 2px 12px rgba(0,0,0,0.3)` |
| `--audiolog-img-radius` | Image corner rounding | `4px 4px 0 0` (top corners match card) |
| `--audiolog-controls-bg` | Controls bar background | `rgba(0,0,0,0.4)` |
| `--audiolog-controls-color` | Controls icon color | `rgba(255,255,255,0.8)` |
| `--audiolog-controls-hover` | Controls hover color | `#fff` |
| `--audiolog-transcript-color` | Transcript text color | `rgba(255,255,255,0.7)` |
| `--audiolog-transcript-bg` | Transcript area background | `transparent` |
| `--audiolog-font` | Font family (applied to `.audiolog-view`) | `inherit` |

## View Layout (`.audiolog-view`)

```
┌──────────────────────────────────┐
│         .audiolog-image          │
│    ┌────────────────────────┐    │
│    │   img (16:9, cover)    │    │
│    └────────────────────────┘    │
│                                  │
│       .audiolog-controls         │
│    [ ▶ ]    [ ⏸ ]    [ ⏹ ]     │
│                                  │
│       .audiolog-transcript       │
│    First ~3 lines visible...     │
│    ░░░ gradient fade ░░░░░░░░    │
│    [Show transcript ▼]           │
└──────────────────────────────────┘
         max-width: 560px
         margin: 0 auto
```

### `.audiolog-view`
- `max-width: 560px`, `margin: 0 auto`
- Uses custom properties for `background`, `border`, `border-radius`, `box-shadow`, `font-family`
- `overflow: hidden` to contain child border-radius

### `.audiolog-image`
- `width: 100%`, no padding
- `img`: `width: 100%`, `aspect-ratio: 16/9`, `object-fit: cover`, `display: block`
- Border-radius via `--audiolog-img-radius`

### `.audiolog-controls`
- `display: flex`, `justify-content: center`, `align-items: center`, `gap: 1rem`
- `padding: 0.75rem 1rem`
- Background via `--audiolog-controls-bg`
- `button`: reset to transparent, icon-sized, color via `--audiolog-controls-color`, hover via `--audiolog-controls-hover`
- Disabled state: reduced opacity, no pointer events

### `.audiolog-transcript-wrapper`
A wrapper div containing both the transcript content and the toggle button, so `--audiolog-transcript-bg` covers both elements consistently for theme authors.

### `.audiolog-transcript` (inside wrapper)
- `padding: 1rem 1rem 0`
- Color via `--audiolog-transcript-color`
- **Collapsed state** (default): `max-height: 4.5em` (approx 3 lines), `overflow: hidden`, `::after` pseudo-element gradient fade at bottom
- **Expanded state** (`.audiolog-transcript-wrapper[data-expanded] .audiolog-transcript`): `max-height: none`, gradient hidden
- Expanded state is purely cosmetic (DOM attribute) — it is acceptable to lose on re-render; player can re-expand with one click

### `.audiolog-transcript-toggle` (inside wrapper)
- Small text-link style button, `padding: 0.5rem 1rem`
- Text values: "Show transcript" / "Hide transcript"

### Empty controls fallback
- When all control buttons are unchecked by the GM, the `.audiolog-controls` div renders empty. CSS hides it: `.audiolog-controls:empty { display: none }`
- The `:empty` selector works because Handlebars `{{#if}}` blocks produce no whitespace when all are false

### No image fallback
- When `.audiolog-image` is absent (no `imagePath`), the first visible child needs top border-radius. Use `:first-child` selector: `.audiolog-view > :first-child { border-radius: var(--audiolog-radius) var(--audiolog-radius) 0 0 }`

## Transcript Toggle

Requires a small addition to the sheet:

1. Add a transcript wrapper with toggle button to the view template:
   ```hbs
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
   ```

2. Add `toggleTranscript` action handler in `AudioLogPageSheet` that toggles `data-expanded` on the `.audiolog-transcript-wrapper` element and swaps button text between show/hide strings.

3. Add localization keys to `public/lang/en.json`:
   - `AUDIOLOG.controls.showTranscript`: `"Show transcript"`
   - `AUDIOLOG.controls.hideTranscript`: `"Hide transcript"`

## Edit Mode (`.audiolog-edit`)

Minimal styling only — Foundry's standard form classes handle most of it:

- Clean spacing between `.form-group` elements
- `fieldset` border and padding for the controls checkbox group
- Consistent label widths
- No card layout, no theme variables

## File Structure

```
src/styles/
├── index.css          # @import "./base-layout.css"
└── base-layout.css    # All view layout + custom properties + edit basics
```

Phase 4 will add `src/styles/themes/*.css` files that only reassign custom property values on `.audiolog-theme-{name}`.

## Template Changes

- `audio-log-view.hbs`: Add transcript toggle button, wrap transcript content for collapse behavior
- `public/lang/en.json`: Add `showTranscript` / `hideTranscript` keys
- `AudioLogPageSheet.ts`: Add `toggleTranscript` action handler

## Out of Scope

- Theme-specific styles (Phase 4)
- Default theme images (Phase 5)
- Audio progress bar / timestamp (future)
- Animations / transitions (Phase 4/5)
