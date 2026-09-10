#!/usr/bin/env node
// Pre-submit checks from App Dev Lessons Learned Parts 4 and 6. Run: node scripts/preflight.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', '.expo', 'ios', 'android', 'dist']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx|js|cjs|mjs|json)$/.test(e.name)) files.push(p);
  }
})(ROOT);

let failed = false;
const fail = (msg) => { failed = true; console.error('FAIL ' + msg); };
const envNames = new Set();

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  if (!rel.startsWith('scripts/')) {
    const code = src.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
    if (/process\.env\.[A-Z0-9_]+!(?!=)/.test(code)) fail(`${rel}: process.env.X! non-null assertion (Lesson 6.1)`);
  }
  if (/^\s*(export\s+)?const\s+\w+\s*=\s*(createClient|Purchases\.configure|new\s+SQLiteStorage)\(/m.test(src))
    fail(`${rel}: client constructed at module scope (Lesson 6.2)`);
  if (/(metro|babel)\.config\.(js|cjs)$/.test(rel) && /unstable_|experimental_/.test(src))
    fail(`${rel}: unstable_/experimental_ flag (Lesson 6.5)`);
  for (const m of src.matchAll(/EXPO_PUBLIC_[A-Z0-9_]+/g)) envNames.add(m[0]);
}

const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
if (appJson.expo?.ios?.supportsTablet !== false) fail('app.json: ios.supportsTablet must be false for 1.0 (Lesson 2.1)');
if (!appJson.expo?.ios?.bundleIdentifier) fail('app.json: ios.bundleIdentifier missing');

console.log('EXPO_PUBLIC_* read by the code (diff this against `eas env:list production`):');
for (const n of [...envNames].sort()) console.log('  ' + n);

if (failed) { console.error('\npreflight: FAILED'); process.exit(1); }
console.log('\npreflight: ok');
