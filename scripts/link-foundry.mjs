#!/usr/bin/env node

/**
 * Cross-platform symlink of dist/ into the local Foundry VTT modules directory.
 *
 * Usage:  node scripts/link-foundry.mjs [/custom/foundry/data/path]
 *
 * Platform detection:
 *   macOS   → ~/Library/Application Support/FoundryVTT/Data/modules
 *   Windows → %LOCALAPPDATA%/FoundryVTT/Data/modules
 *   Linux   → ~/.local/share/FoundryVTT/Data/modules
 */

import { existsSync, mkdirSync, rmSync, symlinkSync, readlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { homedir, platform } from "node:os";

const MODULE_ID = "foundry-audiolog";
const distDir = resolve("dist");

function getFoundryDataPath() {
  const explicit = process.argv[2] || process.env.FOUNDRY_DATA_PATH;
  if (explicit) return explicit;

  const home = homedir();
  switch (platform()) {
    case "darwin":
      return join(home, "Library", "Application Support", "FoundryVTT", "Data");
    case "win32":
      return join(process.env.LOCALAPPDATA || join(home, "AppData", "Local"), "FoundryVTT", "Data");
    case "linux":
      return join(home, ".local", "share", "FoundryVTT", "Data");
    default:
      console.error(`Unknown platform: ${platform()}. Pass the Foundry data path as an argument.`);
      process.exit(1);
  }
}

const dataPath = getFoundryDataPath();
const modulesDir = join(dataPath, "modules");
const linkPath = join(modulesDir, MODULE_ID);

if (!existsSync(distDir)) {
  console.error(`dist/ not found. Run 'npm run build' first.`);
  process.exit(1);
}

if (!existsSync(modulesDir)) {
  mkdirSync(modulesDir, { recursive: true });
  console.log(`Created: ${modulesDir}`);
}

if (existsSync(linkPath)) {
  try {
    const existing = readlinkSync(linkPath);
    if (existing === distDir) {
      console.log(`Already linked: ${linkPath} → ${distDir}`);
      process.exit(0);
    }
  } catch { /* not a symlink, remove it */ }
  rmSync(linkPath, { recursive: true, force: true });
}

const type = platform() === "win32" ? "junction" : "dir";
symlinkSync(distDir, linkPath, type);

console.log(`Linked: ${linkPath} → ${distDir}`);
