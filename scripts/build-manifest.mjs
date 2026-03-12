import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(fileURLToPath(import.meta.url), "../..");

const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
);
const tpl = JSON.parse(
  fs.readFileSync(path.join(root, "module.template.json"), "utf8")
);

/** Stamp version from package.json */
tpl.version = pkg.version;

/** Keep URLs in sync with repo slug */
const owner = "ArcaneFoundry";
const repo = "foundry-audiolog";
tpl.manifest = `https://raw.githubusercontent.com/${owner}/${repo}/main/module.json`;
tpl.download = `https://github.com/${owner}/${repo}/releases/latest/download/${repo}.zip`;

/** Write to dist/ */
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(
  path.join(root, "dist", "module.json"),
  JSON.stringify(tpl, null, 2),
  "utf8"
);

/** Copy lang files to dist */
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/** Copy templates recursively (if present) */
const tplDir = path.join(root, "templates");
if (fs.existsSync(tplDir)) {
  copyDirRecursive(tplDir, path.join(root, "dist", "templates"));
}

console.log("Manifest built → dist/module.json");
