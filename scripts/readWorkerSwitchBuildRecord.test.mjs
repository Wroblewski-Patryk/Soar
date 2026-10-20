import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { COMPOSE_FILES, readWorkerSwitchBuildRecord } from './readWorkerSwitchBuildRecord.mjs';

const sha = 'a'.repeat(40);
const sourceUri = `https://github.com/Wroblewski-Patryk/Soar.git#${sha}`;
const buildId = 'builder/node/abc123';
const roles = ['api', 'workers-market-data', 'workers-market-stream', 'workers-backtest', 'workers-execution'];
const digest = (value) => `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const response = (value) => ({ status: 0, stdout: JSON.stringify(value) });

const fixture = ({ missingAttestation = false, wrongSubject = false, wrongAttestedSha = false } = {}) => {
  const config = {
    architecture: 'amd64', os: 'linux', config: { Labels: { 'org.opencontainers.image.revision': sha } },
  };
  const configDigest = digest(config);
  const manifest = { mediaType: 'application/vnd.oci.image.manifest.v1+json', config: { digest: configDigest } };
  const platformDigest = digest(manifest);
  const statement = {
    _type: 'https://in-toto.io/Statement/v1', predicateType: 'https://slsa.dev/provenance/v1',
    subject: [{ digest: { sha256: platformDigest.slice(7) } }],
    predicate: {
      buildDefinition: {
        externalParameters: {
          configSource: { uri: sourceUri, digest: { sha1: wrongAttestedSha ? 'f'.repeat(40) : sha },
            path: 'apps/api/Dockerfile' },
          request: { args: { target: 'runtime' } },
        },
        resolvedDependencies: [{ uri: sourceUri, digest: { sha1: sha } }],
      },
      runDetails: { metadata: { invocationId: 'invocation123' } },
    },
  };
  const statementDigest = digest(statement);
  const attestationManifest = {
    mediaType: 'application/vnd.oci.image.manifest.v1+json',
    subject: { digest: wrongSubject ? `sha256:${'f'.repeat(64)}` : platformDigest },
    layers: [{ mediaType: 'application/vnd.in-toto+json', digest: statementDigest,
      annotations: { 'in-toto.io/predicate-type': 'https://slsa.dev/provenance/v1' } }],
  };
  const attestationDigest = digest(attestationManifest);
  const index = {
    mediaType: 'application/vnd.oci.image.index.v1+json',
    manifests: [
      { digest: platformDigest, platform: { os: 'linux', architecture: 'amd64' } },
      ...missingAttestation ? [] : [{ digest: attestationDigest,
        platform: { os: 'unknown', architecture: 'unknown' },
        annotations: { 'vnd.docker.reference.type': 'attestation-manifest',
          'vnd.docker.reference.digest': platformDigest } }],
    ],
  };
  const indexDigest = digest(index);
  const imageRef = `registry.example/soar-api@${indexDigest}`;
  const metadata = {
    'buildx.build.ref': buildId,
    'containerimage.digest': indexDigest,
    'containerimage.descriptor': { mediaType: 'application/vnd.oci.image.index.v1+json', digest: indexDigest },
    'buildx.build.provenance': {
      invocation: {
        configSource: { uri: sourceUri, digest: { sha1: sha }, entryPoint: 'apps/api/Dockerfile' },
        parameters: { args: { 'build-arg:SOURCE_COMMIT': sha, target: 'runtime' } },
      },
      materials: [{ uri: sourceUri, digest: { sha1: sha } }],
    },
  };
  const sourceBinding = {
    status: 'PASS', headSha: sha, sourceCommit: sha, pinnedImageRef: imageRef,
    imageId: indexDigest, revisionLabel: sha,
  };
  const image = [{ Id: indexDigest }];
  const platformImage = [{ Id: platformDigest,
    Config: { Labels: { 'org.opencontainers.image.revision': sha } },
    Identity: { Build: [{ Ref: 'abc123' }] } }];
  const compose = Object.fromEntries(roles.map((role) => [role, { image: imageRef }]));
  const blobs = new Map([[configDigest, config], [statementDigest, statement]]);
  const runDocker = (args) => {
    if (args[0] === 'buildx' && args.at(-1) === imageRef) return response(index);
    if (args[0] === 'buildx' && args.at(-1) === `registry.example/soar-api@${platformDigest}`) {
      return response(manifest);
    }
    if (args[0] === 'buildx' && args.at(-1) === `registry.example/soar-api@${attestationDigest}`) {
      return response(attestationManifest);
    }
    if (args[0] === 'image' && args[2] === '--platform') return response(platformImage);
    if (args[0] === 'image') return response(image);
    if (args[0] === 'compose' && COMPOSE_FILES.includes(args[2])) return response({ services: compose });
    throw new Error(`unexpected Docker call: ${args.join(' ')}`);
  };
  const runRegistry = (url) => {
    const selected = [...blobs].find(([key]) => url.endsWith(`/blobs/${key}`));
    return selected ? response(selected[1]) : { status: 1 };
  };
  const verify = () => readWorkerSwitchBuildRecord({
    metadata, sourceBinding, expectedSha: sha, imageRef, runDocker, runRegistry,
  });
  return { verify, metadata, sourceBinding, image, platformImage, index, manifest,
    attestationManifest, statement, config, compose, blobs, imageRef, indexDigest,
    platformDigest, configDigest, attestationDigest };
};

test('real digest chain and registry attestation bind source, subject, config and build identifiers', () => {
  const f = fixture();
  assert.deepEqual(f.verify(), {
    status: 'PASS', issues: [], sourceSha: sha, buildId: 'invocation123',
    buildRef: buildId, attestationDigest: f.attestationDigest,
    imageRef: f.imageRef, manifestDigest: f.indexDigest,
    platformManifestDigest: f.platformDigest, configDigest: f.configDigest,
    imageId: f.indexDigest,
  });
});

test('edited Buildx ref and missing local build identity fail', () => {
  const altered = fixture();
  altered.metadata['buildx.build.ref'] = 'builder/node/changed';
  assert.deepEqual(altered.verify(), { status: 'FAIL', issues: ['BUILD_ID_IMAGE_MISMATCH'] });
  const missing = fixture();
  delete missing.platformImage[0].Identity;
  assert.deepEqual(missing.verify(), { status: 'FAIL', issues: ['BUILD_ID_IMAGE_MISMATCH'] });
});

test('rewritten metadata SHA cannot override the registry attested Git source', () => {
  const altered = fixture();
  altered.metadata['buildx.build.provenance'].invocation.configSource.digest.sha1 = 'f'.repeat(40);
  assert.deepEqual(altered.verify(), { status: 'FAIL', issues: ['BUILD_SOURCE_PROVENANCE_MISMATCH'] });
  const falseAttestation = fixture({ wrongAttestedSha: true });
  assert.deepEqual(falseAttestation.verify(),
    { status: 'FAIL', issues: ['BUILD_ATTESTATION_PROVENANCE_MISMATCH'] });
});

test('missing attestation, wrong subject and altered attestation blob fail', () => {
  const missing = fixture({ missingAttestation: true });
  assert.deepEqual(missing.verify(), { status: 'FAIL', issues: ['BUILD_ATTESTATION_MISSING'] });
  const subject = fixture({ wrongSubject: true });
  assert.deepEqual(subject.verify(), { status: 'FAIL', issues: ['BUILD_ATTESTATION_SUBJECT_MISMATCH'] });
  const altered = fixture();
  altered.statement.predicate.runDetails.metadata.invocationId = 'forged';
  assert.deepEqual(altered.verify(), { status: 'FAIL', issues: ['BUILD_ATTESTATION_PROVENANCE_MISMATCH'] });
});

test('swapped index, config, image ID and role image fail', () => {
  const index = fixture();
  index.metadata['containerimage.digest'] = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(index.verify(), { status: 'FAIL', issues: ['BUILD_INDEX_DIGEST_MISMATCH'] });
  const config = fixture();
  config.config.config.Labels['org.opencontainers.image.revision'] = 'f'.repeat(40);
  assert.deepEqual(config.verify(), { status: 'FAIL', issues: ['BUILD_CONFIG_READBACK_MISMATCH'] });
  const image = fixture();
  image.image[0].Id = `sha256:${'f'.repeat(64)}`;
  assert.deepEqual(image.verify(), { status: 'FAIL', issues: ['BUILD_IMAGE_READBACK_MISMATCH'] });
  const role = fixture();
  role.compose['workers-backtest'].image = `registry.example/soar-api@sha256:${'f'.repeat(64)}`;
  assert.deepEqual(role.verify(), { status: 'FAIL', issues: ['BUILD_ROLE_IMAGE_MISMATCH'] });
});

test('missing metadata and mutable reference fail before registry reads', () => {
  const missing = fixture();
  missing.metadata['buildx.build.ref'] = undefined;
  assert.deepEqual(missing.verify(), { status: 'FAIL', issues: ['BUILD_ID_MISSING'] });
  const mutable = readWorkerSwitchBuildRecord({ metadata: {}, sourceBinding: { status: 'PASS', headSha: sha,
    sourceCommit: sha }, expectedSha: sha, imageRef: 'registry.example/soar-api:latest' });
  assert.deepEqual(mutable, { status: 'FAIL', issues: ['BUILD_IMAGE_NOT_PINNED'] });
});
