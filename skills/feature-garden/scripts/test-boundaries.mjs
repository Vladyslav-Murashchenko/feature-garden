import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function findProjectRoot(startDir) {
  let dir = startDir;
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, "package.json"))) return dir;
    dir = dirname(dir);
  }
  throw new Error("Could not find project root (no package.json found)");
}

const ROOT = findProjectRoot(dirname(fileURLToPath(import.meta.url)));
process.chdir(ROOT);

const SRC = "src";
const LIBS_DIR = join(SRC, "libs");
const libName = readdirSync(LIBS_DIR).find((entry) => {
  const full = join(LIBS_DIR, entry);
  return existsSync(full) && !entry.startsWith(".");
});
if (!libName) {
  throw new Error(`No library found in ${LIBS_DIR}`);
}
const LIB_DIR = join(LIBS_DIR, libName);
const FEATURE_DIR = join(SRC, "features", "feature");
const NESTED_DIR = join(FEATURE_DIR, "nested-feature");
const SHARED_FEATURE_DIR = join(SRC, "shared-features", "shared-feature");

let pass = 0;
let fail = 0;
const errors = [];

// --- Helpers ---

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function removeFile(filePath) {
  if (existsSync(filePath)) rmSync(filePath);
}

function removeDir(dirPath) {
  if (existsSync(dirPath)) rmSync(dirPath, { recursive: true });
}

function lintFile(filePath) {
  try {
    execFileSync("node_modules/.bin/eslint", ["--no-cache", filePath], {
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

function expectPass(label, filePath) {
  process.stdout.write(`  Check: ${label} ... `);
  if (lintFile(filePath)) {
    console.log("PASS");
    pass++;
  } else {
    console.log("FAIL (expected no errors)");
    errors.push(`${label}: expected PASS but got lint errors`);
    fail++;
  }
}

function expectFail(label, filePath) {
  process.stdout.write(`  Check: ${label} ... `);
  if (lintFile(filePath)) {
    console.log("FAIL (expected errors but got none)");
    errors.push(`${label}: expected FAIL but lint passed`);
    fail++;
  } else {
    console.log("PASS");
    pass++;
  }
}

// --- Prepare ---

writeFile(join(LIB_DIR, "lib.ts"), 'export const lib = "lib";\n');

writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);
writeFile(
  join(FEATURE_DIR, "index.ts"),
  'export { feature } from "./feature";\n',
);

writeFile(
  join(NESTED_DIR, "nested-feature.ts"),
  'export const nestedFeature = "nestedFeature";\n',
);
writeFile(
  join(NESTED_DIR, "index.ts"),
  'export { nestedFeature } from "./nested-feature";\n',
);

writeFile(
  join(SHARED_FEATURE_DIR, "shared-feature.ts"),
  'export const sharedFeature = "sharedFeature";\n',
);
writeFile(
  join(SHARED_FEATURE_DIR, "index.ts"),
  'export { sharedFeature } from "./shared-feature";\n',
);

// --- Test 1: feature imports domain (allowed) ---

console.log("Test 1: feature imports lib");
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  `import { lib } from "@/libs/${libName}/lib";\nexport const feature = lib;\n`,
);
expectPass("feature -> lib", join(FEATURE_DIR, "feature.ts"));
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);

// --- Test 2: lib imports feature (forbidden) ---

console.log("Test 2: lib imports feature");
writeFile(
  join(LIB_DIR, "lib.ts"),
  'import { feature } from "@/features/feature";\nexport const lib = feature;\n',
);
expectFail("lib -> feature", join(LIB_DIR, "lib.ts"));
writeFile(join(LIB_DIR, "lib.ts"), 'export const lib = "lib";\n');

// --- Test 3: feature imports nested-feature via index (allowed) ---

console.log("Test 3: feature imports nested-feature via index");
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'import { nestedFeature } from "./nested-feature";\nexport const feature = nestedFeature;\n',
);
expectPass("feature -> nested-feature/index", join(FEATURE_DIR, "feature.ts"));
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);

// --- Test 4: feature imports nested-feature.ts directly (forbidden) ---

console.log("Test 4: feature imports nested-feature.ts directly");
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'import { nestedFeature } from "./nested-feature/nested-feature";\nexport const feature = nestedFeature;\n',
);
expectFail(
  "feature -> nested-feature/nested-feature.ts",
  join(FEATURE_DIR, "feature.ts"),
);
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);

// --- Test 5: feature imports shared-feature (allowed) ---

console.log("Test 5: feature imports shared-feature");
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'import { sharedFeature } from "@/shared-features/shared-feature";\nexport const feature = sharedFeature;\n',
);
expectPass("feature -> shared-feature", join(FEATURE_DIR, "feature.ts"));
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);

// --- Test 6: feature imports shared-feature private module (forbidden) ---

console.log("Test 6: feature imports shared-feature private module");
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'import { sharedFeature } from "@/shared-features/shared-feature/shared-feature";\nexport const feature = sharedFeature;\n',
);
expectFail(
  "feature -> shared-feature/shared-feature.ts",
  join(FEATURE_DIR, "feature.ts"),
);
writeFile(
  join(FEATURE_DIR, "feature.ts"),
  'export const feature = "feature";\n',
);

// --- Test 7: shared-feature imports feature (forbidden) ---

console.log("Test 7: shared-feature imports feature");
writeFile(
  join(SHARED_FEATURE_DIR, "shared-feature.ts"),
  'import { feature } from "@/features/feature";\nexport const sharedFeature = feature;\n',
);
expectFail(
  "shared-feature -> feature",
  join(SHARED_FEATURE_DIR, "shared-feature.ts"),
);
writeFile(
  join(SHARED_FEATURE_DIR, "shared-feature.ts"),
  'export const sharedFeature = "sharedFeature";\n',
);

// --- Test 8: nested-feature imports from parent feature (forbidden) ---

console.log("Test 8: nested-feature imports from parent feature");
writeFile(
  join(NESTED_DIR, "nested-feature.ts"),
  'import { feature } from "..";\nexport const nestedFeature = feature;\n',
);
expectFail("nested-feature -> feature", join(NESTED_DIR, "nested-feature.ts"));
writeFile(
  join(NESTED_DIR, "nested-feature.ts"),
  'export const nestedFeature = "nestedFeature";\n',
);

// --- Test 9: cycle via relative imports (forbidden) ---

console.log("Test 9: cycle via relative imports");
writeFile(
  join(LIB_DIR, "lib.ts"),
  'import { libB } from "./lib-b";\nexport const lib = libB;\n',
);
writeFile(
  join(LIB_DIR, "lib-b.ts"),
  'import { lib } from "./lib";\nexport const libB = lib;\n',
);
expectFail("cycle (relative): lib <-> lib-b", join(LIB_DIR, "lib.ts"));
writeFile(join(LIB_DIR, "lib.ts"), 'export const lib = "lib";\n');
removeFile(join(LIB_DIR, "lib-b.ts"));

// --- Test 10: cycle via absolute imports (forbidden) ---

console.log("Test 10: cycle via absolute imports");
writeFile(
  join(LIB_DIR, "lib.ts"),
  `import { libB } from "@/libs/${libName}/lib-b";\nexport const lib = libB;\n`,
);
writeFile(
  join(LIB_DIR, "lib-b.ts"),
  `import { lib } from "@/libs/${libName}/lib";\nexport const libB = lib;\n`,
);
expectFail("cycle (absolute): lib <-> lib-b", join(LIB_DIR, "lib.ts"));
writeFile(join(LIB_DIR, "lib.ts"), 'export const lib = "lib";\n');
removeFile(join(LIB_DIR, "lib-b.ts"));

// --- Test 11: cycle via mixed imports (forbidden) ---

console.log("Test 11: cycle via mixed imports");
writeFile(
  join(LIB_DIR, "lib.ts"),
  'import { libB } from "./lib-b";\nexport const lib = libB;\n',
);
writeFile(
  join(LIB_DIR, "lib-b.ts"),
  `import { lib } from "@/libs/${libName}/lib";\nexport const libB = lib;\n`,
);
expectFail(
  "cycle (mixed): lib -> lib-b (relative), lib-b -> lib (absolute)",
  join(LIB_DIR, "lib.ts"),
);
writeFile(join(LIB_DIR, "lib.ts"), 'export const lib = "lib";\n');
removeFile(join(LIB_DIR, "lib-b.ts"));

// --- Cleanup ---

removeDir(FEATURE_DIR);
removeDir(SHARED_FEATURE_DIR);
removeFile(join(LIB_DIR, "lib.ts"));
removeFile(join(LIB_DIR, "lib-b.ts"));

// --- Summary ---

console.log();
console.log(`=== Results: ${pass} passed, ${fail} failed ===`);

if (errors.length > 0) {
  console.log();
  console.log("Failures:");
  for (const err of errors) {
    console.log(`  - ${err}`);
  }
  process.exit(1);
}
