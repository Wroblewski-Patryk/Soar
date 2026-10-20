import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPOSE_FILES, readWorkerSwitchBuildRecord } from './readWorkerSwitchBuildRecord.mjs';

const sha = 'a'.repeat(40);
const indexDigest = `sha256:${'b'.repeat(64)}`;
const platformDigest = `sha256:${'c'.repeat(64)}`;
const configDigest = `sha256:${'d'.repeat(64)}`;
const imageRef = `registry.example/soar-api@${indexDigest}`;
const sourceUri = `https://github.com/Wroblewski-Patryk/Soar.git#${sha}`;
const buildId = 'builder/node/abc123';
const roles = ['api', 'workers-market-data', 'workers-market-stream', 'workers-backtest', 'workers-execution'];

const metadata = () => ({
  'buildx.build.ref': buildId,
  'containerimage.digest': indexDigest,
  'containerimage.descriptor': {
    mediaType: 'application/vnd.oci.image.index.v1+json', digest: indexDigest,
  },
  'buildx.build.provenance': {
    invocation: {
      configSource: { uri: sourceUri, digest: { sha1: sha }, entryPoint: 'apps/api/Dockerfile' },
      parameters: { args: { 'build-arg:SOURCE_COMMIT': sha, target: 'runtime' } },
    },
    materials: [{ uri: sourceUri, digest: { sha1: sha } }],
  },
});
const binding = () => ({
  status: 'PASS', headSha: sha, sourceCommit: sha, pinnedImageRef: imageRef,
  imageId: indexDigest, revisionLabel: sha,
});
const responses = () => ({
  index: { mediaType: 'application/vnd.oci.image.index.v1+json', manifests: [
    { digest: platformDigest, platform: { os: 'linux', architecture: 'amd64' } },
    { digest: `sha256:${'e'.repeat(64)}`, platform: { os: 'unknown', architecture: 'unknown' } },
  ] },
  manifest: { config: { digest: configDigest } },
  image: [{ Id: indexDigest }],
  platformImage: [{ Id: platformDigest, Config: { Labels: { 'org.opencontainers.image.revision': sha } },
    Identity: { Build: { Ref: 'abc123' } } }],
  compose: Object.fromEntries(roles.map((role) => [role, { image: imageRef }])),
});
const docker = (values) => (args) => {
  let result;
  if (args[0] === 'buildx' && args.at(-1) === imageRef) result = values.index;
  else if (args[0] === 'buildx' && args.at(-1) === `registry.example/soar-api@${platformDigest}`) {
    result = values.manifest;
  } else if (args[0] === 'image' && args[2] === '--platform') result = values.platformImage;
  else if (args[0] === 'image') result = values.image;
  else if (args[0] === 'compose' && COMPOSE_FILES.includes(args[2])) result = { services: values.compose };
  else throw new Error(`unexpected Docker call: ${args.join(' ')}`);
  return { status: 0, stdout: JSON.stringify(result) };
};
const verify = (m = metadata(), b = binding(), values = responses(), ref = imageRef) =>
  readWorkerSwitchBuildRecord({ metadata: m, sourceBinding: b, expectedSha: sha,
    imageRef: ref, runDocker: docker(values) });

test('one runtime build links Git source, builder ID, OCI index, config and all five Compose roles', () => {
  assert.deepEqual(verify(), {
    status: 'PASS', issues: [], sourceSha: sha, buildId, imageRef,
    manifestDigest: indexDigest, platformManifestDigest: platformDigest,
    configDigest, imageId: indexDigest,
  });
  const pulledElsewhere = responses();
  delete pulledElsewhere.platformImage[0].Identity;
  assert.equal(verify(metadata(), binding(), pulledElsewhere).status, 'PASS');
});

test('missing builder record, dirty source and mutable tag fail closed', () => {
  assert.deepEqual(verify(null), { status: 'FAIL', issues: ['BUILD_RECORD_MISSING'] });
  assert.deepEqual(verify(metadata(), { status: 'FAIL', issues: ['SOURCE_TREE_DIRTY'] }),
    { status: 'FAIL', issues: ['BUILD_SOURCE_HEAD_MISMATCH'] });
  assert.deepEqual(verify(metadata(), binding(), responses(), `soar-api:${sha}`),
    { status: 'FAIL', issues: ['BUILD_IMAGE_NOT_PINNED'] });
  const wrongBinding = binding();
  wrongBinding.imageId = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(verify(metadata(), wrongBinding),
    { status: 'FAIL', issues: ['BUILD_SOURCE_IMAGE_BINDING_MISMATCH'] });
});

test('builder source and build ID cannot be replaced by a matching label or ARG', () => {
  const wrongSource = metadata();
  wrongSource['buildx.build.provenance'].invocation.configSource.digest.sha1 = 'f'.repeat(40);
  assert.deepEqual(verify(wrongSource), { status: 'FAIL', issues: ['BUILD_SOURCE_PROVENANCE_MISMATCH'] });
  const baseTarget = metadata();
  baseTarget['buildx.build.provenance'].invocation.parameters.args.target = 'base';
  assert.deepEqual(verify(baseTarget), { status: 'FAIL', issues: ['BUILD_SOURCE_PROVENANCE_MISMATCH'] });
  const missingId = metadata();
  delete missingId['buildx.build.ref'];
  assert.deepEqual(verify(missingId), { status: 'FAIL', issues: ['BUILD_ID_MISSING'] });
  const otherBuild = responses();
  otherBuild.platformImage[0].Identity.Build.Ref = 'other';
  assert.deepEqual(verify(metadata(), binding(), otherBuild),
    { status: 'FAIL', issues: ['BUILD_ID_IMAGE_MISMATCH'] });
});

test('manifest, config, image ID and role drift fail closed', () => {
  const wrongIndex = metadata();
  wrongIndex['containerimage.digest'] = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(verify(wrongIndex), { status: 'FAIL', issues: ['BUILD_INDEX_DIGEST_MISMATCH'] });
  const wrongConfig = metadata();
  wrongConfig['containerimage.config.digest'] = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(verify(wrongConfig), { status: 'FAIL', issues: ['BUILD_CONFIG_DIGEST_MISMATCH'] });
  const swappedImage = responses();
  swappedImage.image[0].Id = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(verify(metadata(), binding(), swappedImage),
    { status: 'FAIL', issues: ['BUILD_IMAGE_READBACK_MISMATCH'] });
  const otherRole = responses();
  otherRole.compose['workers-backtest'].image = `registry.example/soar-api@sha256:${'f'.repeat(64)}`;
  assert.deepEqual(verify(metadata(), binding(), otherRole),
    { status: 'FAIL', issues: ['BUILD_ROLE_IMAGE_MISMATCH'] });
  const rebuilt = responses();
  rebuilt.compose.api.build = { context: '.' };
  assert.deepEqual(verify(metadata(), binding(), rebuilt),
    { status: 'FAIL', issues: ['BUILD_ROLE_IMAGE_MISMATCH'] });
});
