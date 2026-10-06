import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

// Map a written file under packages/<name>/src to that package's directory.
// Returns null for files outside a package source folder.
function detectPackageDir(filePath) {
  const abs = path.resolve(filePath);
  const match = abs.match(/^(.*\/packages\/[^/]+)\/src\//);
  return match ? match[1] : null;
}

async function main() {
  const input = await readInput();
  const file = input.tool_response?.filePath ?? input.tool_input?.file_path;

  if (!file || !/\.(ts|tsx)$/.test(file)) process.exit(0);

  const pkgDir = detectPackageDir(file);
  if (!pkgDir) process.exit(0);

  const pkgJsonPath = path.join(pkgDir, "package.json");
  if (!fs.existsSync(pkgJsonPath) || !fs.existsSync(path.join(pkgDir, "tsconfig.json"))) {
    process.exit(0);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  if (!pkg.name || !pkg.scripts?.typecheck) process.exit(0);

  const result = spawnSync("pnpm", ["--filter", pkg.name, "typecheck"], {
    cwd: pkgDir,
    encoding: "utf8",
  });

  const output = ((result.stdout ?? "") + (result.stderr ?? "")).trim();
  if (result.status !== 0 && output) {
    console.error(output);
    process.exit(2);
  }
}

main();
