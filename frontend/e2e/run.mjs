// Sequential runner for the committed E2E specs. The suite is cumulative:
// each module adds NN-*.spec.mjs files and CI runs them all, so later wiring
// can't silently break earlier flows. Usage: npm run test:e2e
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const specs = readdirSync(dir)
  .filter((f) => f.endsWith(".spec.mjs"))
  .sort();

let failed = 0;
let first = true;
for (const spec of specs) {
  if (!first) {
    // Let the previous spec's browser processes fully release memory before
    // launching the next one — matters on memory-constrained dev machines.
    await new Promise((r) => setTimeout(r, 8000));
  }
  first = false;
  console.log(`\n── ${spec} ──`);
  const result = spawnSync(process.execPath, [join(dir, spec)], { stdio: "inherit" });
  if (result.status !== 0) {
    failed++;
    console.error(`FAIL ${spec}`);
  }
}

console.log(`\n${specs.length - failed}/${specs.length} spec files passed`);
process.exit(failed === 0 ? 0 : 1);
