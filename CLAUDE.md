# Foundry Audiology — Claude Instructions

## Working Directory

Claude sessions start from this repo root (`~/CodeProjects/foundry-audiolog`).

## Project Vault

This project has an Obsidian vault for issue tracking, handoffs, and project docs at:

```
~/Vaults/Code Projects/FoundryVTT/FoundryAudiology/
```

The vault is managed by the **vaultkeeper** plugin. On session start:

1. Read this file (you're here)
2. Read the vault's `CLAUDE.md` at the path above for vault structure and automation details
3. Check `Active/` in the vault for in-progress issues
4. Read the latest handoff in `Handoffs/` if one exists
5. Present a brief summary and **wait for the user's direction**

| Vault Document | Purpose |
|----------------|---------|
| `CLAUDE.md` | Vault structure, folder layout, automation expectations |
| `Active/` | In-progress issue tracking documents |
| `Handoffs/` | Session handoff documents with resume prompts |
| `Project/` | Architecture, coding style, dependencies, changelog |
| `Archive/` | Completed issues |

## Skills

Always invoke these skills when working on this project:

- **forgewright:foundry-vtt-dev** — Foundry VTT V13+ module development, hooks, ApplicationV2, JournalEntryPage, settings. Use for all code changes.
- **forgewright:ui-ux-engineer** — Themed UI design, immersive visual treatments. Use for all styling and visual work.

## Build & Dev

```bash
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
npm run build
```

Verify the build succeeds with no TypeScript errors.

### 2. Deploy to Foundry server

```bash
rsync -avz --delete "dist/" root@foundry.digitalframeworks.org:/var/foundrydata/Data/modules/foundry-audiolog/
```
