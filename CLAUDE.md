# Foundry Audiology — Claude Instructions

## Project Vault

The Obsidian vault at `~/Vaults/Code Projects/FoundryVTT/FoundryAudiology/` contains project documentation:

| Document | Purpose |
|----------|---------|
| **Specifications.md** | Feature design, audio log page type, five style themes, technical architecture, data schema, and Foundry API approach. **Read before implementing anything.** |
| **Development Tasks.md** | Ordered task list for implementation. **Check this first** to understand what to work on next. |

## Skills

Always invoke these skills when working on this project:

- **forgewright:foundry-vtt-dev** — Foundry VTT V13+ module development, hooks, ApplicationV2, JournalEntryPage, settings. Use for all code changes.
- **forgewright:ui-ux-engineer** — Themed UI design, immersive visual treatments. Use for all styling and visual work.

## Build & Dev

```bash
cd ~/CodeProjects/foundry-audiolog

npm run build        # Typecheck + Vite build + manifest
npm run dev          # Vite watch mode
npm run typecheck    # TypeScript only
npm run test         # Vitest
npm run link:foundry # Symlink dist/ into local Foundry modules
```

## Post-Task Workflow

After completing any task:

### 1. Build the project

```bash
cd ~/CodeProjects/foundry-audiolog && npm run build
```

Verify the build succeeds with no TypeScript errors.

### 2. Update Development Tasks

Update `~/Vaults/Code Projects/FoundryVTT/FoundryAudiology/Development Tasks.md`:
- Mark completed tasks as `[x]`
- Add notes for notable decisions

### 3. Deploy to Foundry server

```bash
rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/
```
