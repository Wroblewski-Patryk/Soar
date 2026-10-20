#!/usr/bin/env node

import path from 'node:path';
import { readWorkerSwitchSourceBinding } from './readWorkerSwitchSourceBinding.mjs';
import { readWorkerSwitchBuildMetadata, readWorkerSwitchBuildRecord } from './readWorkerSwitchBuildRecord.mjs';

const args = process.argv.slice(2);
const value = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const metadataPath = value('--build-metadata');
const expectedSha = value('--expected-sha');
const composeEnvFile = value('--compose-env-file');
if (!metadataPath || !expectedSha || (args.length !== 4 && args.length !== 6) ||
    (args.length === 6 && !composeEnvFile)) {
  process.stderr.write('[ops:worker-switch:build-record] FAIL USAGE: --build-metadata <json> --expected-sha <full-sha> [--compose-env-file <path>]\n');
  process.exitCode = 1;
} else {
  const result = readWorkerSwitchBuildRecord({
    metadata: readWorkerSwitchBuildMetadata(path.resolve(metadataPath)),
    sourceBinding: readWorkerSwitchSourceBinding(), expectedSha,
    imageRef: process.env.API_STACK_IMAGE, composeEnvFile,
  });
  process.stdout.write(`[ops:worker-switch:build-record] ${result.status === 'PASS' ? 'PASS_LOCAL_BUILD_ONLY' : `FAIL ${result.issues.join(',')}`}\n`);
  if (result.status === 'PASS') {
    process.stdout.write(`sourceSha=${result.sourceSha} attestedBuildId=${result.buildId} buildRef=${result.buildRef} manifestDigest=${result.manifestDigest} platformManifestDigest=${result.platformManifestDigest} attestationDigest=${result.attestationDigest} configDigest=${result.configDigest} imageId=${result.imageId}\n`);
  } else process.exitCode = 1;
}
