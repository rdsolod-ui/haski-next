import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.join(process.cwd(), "out");
const manifestName = "artifact-manifest.sha256";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.name !== manifestName) files.push(fullPath);
  }
  return files;
}

const lines = [];
for (const file of (await walk(root)).sort()) {
  const digest = createHash("sha256").update(await readFile(file)).digest("hex");
  lines.push(`${digest}  ${path.relative(root, file).split(path.sep).join("/")}`);
}

await writeFile(path.join(root, manifestName), `${lines.join("\n")}\n`, "utf8");
console.log(`Artifact manifest OK: ${lines.length} files.`);
