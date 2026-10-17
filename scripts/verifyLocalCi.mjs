#!/usr/bin/env node

import { assertFullSha, resolveReleaseManifestPath, verifyLocalCiManifest } from './localCiManifest.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--sha');
if (index < 0 || !args[index + 1]) {
  throw new Error('Usage: node scripts/verifyLocalCi.mjs --sha <full release commit SHA>');
}
const sha = assertFullSha(args[index + 1]);
const manifest = verifyLocalCiManifest({
  manifestPath: resolveReleaseManifestPath(sha),
  expectedSha: sha,
  requireReleaseMode: true,
  maxAgeHours: 24,
});
process.stdout.write(`Local CI PASS for ${sha} (${manifest.runId})\n`);
