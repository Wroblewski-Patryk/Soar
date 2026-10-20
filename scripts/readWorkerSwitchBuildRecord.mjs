import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const SHA = /^[0-9a-f]{40}$/i;
const DIGEST = /^sha256:[0-9a-f]{64}$/i;
const PINNED = /^([^@\s]+)@(sha256:[0-9a-f]{64})$/i;
const SOURCE = 'https://github.com/Wroblewski-Patryk/Soar.git';
const ROLES = ['api', 'workers-market-data', 'workers-market-stream', 'workers-backtest', 'workers-execution'];
export const COMPOSE_FILES = ['docker-compose.coolify.yml', 'docker-compose.coolify.shared-api-image.yml'];

const fail = (code) => ({ status: 'FAIL', issues: [code] });
const runDockerDefault = (args) => spawnSync('docker', args, {
  encoding: 'utf8', timeout: 30_000, maxBuffer: 4 * 1024 * 1024,
});
const runRegistryDefault = (url) => spawnSync('curl', [
  '--fail', '--silent', '--show-error', '--location', '--max-time', '15', url,
], { timeout: 20_000, maxBuffer: 8 * 1024 * 1024 });
const sha256 = (value) => `sha256:${createHash('sha256').update(value).digest('hex')}`;
const lower = (value) => typeof value === 'string' ? value.toLowerCase() : '';
const parseResult = (result, digest) => {
  if (result?.status !== 0 || result.stdout === undefined) return null;
  const bytes = Buffer.isBuffer(result.stdout) ? result.stdout : Buffer.from(result.stdout);
  if (digest && sha256(bytes) !== digest.toLowerCase()) return null;
  try { return JSON.parse(bytes.toString('utf8')); } catch { return null; }
};
const readJson = (runDocker, args) => {
  try { return parseResult(runDocker(args)); } catch { return null; }
};
const readDigestJson = (runDocker, args, digest) => {
  try { return parseResult(runDocker(args), digest); } catch { return null; }
};
const readBlob = (runRegistry, repository, digest) => {
  const slash = repository.indexOf('/');
  if (slash < 1) return null;
  const host = repository.slice(0, slash);
  const name = repository.slice(slash + 1);
  if (!/^[a-z0-9.:-]+$/i.test(host) || !/^[a-z0-9._/-]+$/i.test(name) ||
      name.split('/').some((part) => !part || part === '.' || part === '..')) return null;
  const local = /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(host);
  const url = `${local ? 'http' : 'https'}://${host}/v2/${name}/blobs/${digest}`;
  try { return parseResult(runRegistry(url), digest); } catch { return null; }
};

export const readWorkerSwitchBuildRecord = ({
  metadata,
  sourceBinding,
  expectedSha,
  imageRef,
  runDocker = runDockerDefault,
  runRegistry = runRegistryDefault,
  composeFiles = COMPOSE_FILES,
  composeEnvFile,
} = {}) => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return fail('BUILD_RECORD_MISSING');
  if (!SHA.test(expectedSha ?? '') || sourceBinding?.status !== 'PASS' ||
      lower(sourceBinding.headSha) !== lower(expectedSha) ||
      lower(sourceBinding.sourceCommit) !== lower(expectedSha)) {
    return fail('BUILD_SOURCE_HEAD_MISMATCH');
  }
  const pinned = typeof imageRef === 'string' && imageRef.match(PINNED);
  if (!pinned) return fail('BUILD_IMAGE_NOT_PINNED');
  const [, repository, indexDigest] = pinned;
  if (sourceBinding.pinnedImageRef !== imageRef ||
      lower(sourceBinding.imageId) !== lower(indexDigest) ||
      lower(sourceBinding.revisionLabel) !== lower(expectedSha)) {
    return fail('BUILD_SOURCE_IMAGE_BINDING_MISMATCH');
  }
  const provenance = metadata['buildx.build.provenance'];
  const source = provenance?.invocation?.configSource;
  const sourceUri = `${SOURCE}#${expectedSha}`;
  const materials = provenance?.materials;
  const arguments_ = provenance?.invocation?.parameters?.args;
  const buildRef = metadata['buildx.build.ref'];
  if (typeof buildRef !== 'string' || !/^[^\s/]+\/[^\s/]+\/[a-z0-9]+$/i.test(buildRef)) {
    return fail('BUILD_ID_MISSING');
  }
  if (source?.uri !== sourceUri || lower(source?.digest?.sha1) !== lower(expectedSha) ||
      source?.entryPoint !== 'apps/api/Dockerfile' ||
      !Array.isArray(materials) ||
      !materials.some((item) => item?.uri === sourceUri &&
        lower(item?.digest?.sha1) === lower(expectedSha)) ||
      lower(arguments_?.['build-arg:SOURCE_COMMIT']) !== lower(expectedSha) ||
      arguments_?.target !== 'runtime') {
    return fail('BUILD_SOURCE_PROVENANCE_MISMATCH');
  }
  if (lower(metadata['containerimage.digest']) !== lower(indexDigest) ||
      lower(metadata['containerimage.descriptor']?.digest) !== lower(indexDigest) ||
      metadata['containerimage.descriptor']?.mediaType !== 'application/vnd.oci.image.index.v1+json') {
    return fail('BUILD_INDEX_DIGEST_MISMATCH');
  }
  const index = readDigestJson(runDocker, ['buildx', 'imagetools', 'inspect', '--raw', imageRef], indexDigest);
  if (index?.mediaType !== 'application/vnd.oci.image.index.v1+json' ||
      !Array.isArray(index.manifests)) return fail('BUILD_INDEX_UNAVAILABLE');
  const platform = index.manifests.filter((item) =>
    item?.platform?.os === 'linux' && item?.platform?.architecture === 'amd64' &&
    (!item.platform.variant || item.platform.variant === ''));
  if (platform.length !== 1 || !DIGEST.test(platform[0]?.digest ?? '')) {
    return fail('BUILD_PLATFORM_MANIFEST_AMBIGUOUS');
  }
  const platformDigest = platform[0].digest.toLowerCase();
  const manifest = readDigestJson(runDocker,
    ['buildx', 'imagetools', 'inspect', '--raw', `${repository}@${platformDigest}`], platformDigest);
  const configDigest = manifest?.config?.digest;
  if (!DIGEST.test(configDigest ?? '')) return fail('BUILD_CONFIG_DIGEST_INVALID');
  if (metadata['containerimage.config.digest'] &&
      lower(metadata['containerimage.config.digest']) !== lower(configDigest)) {
    return fail('BUILD_CONFIG_DIGEST_MISMATCH');
  }
  const config = readBlob(runRegistry, repository, configDigest);
  if (config?.architecture !== 'amd64' || config?.os !== 'linux' ||
      lower(config?.config?.Labels?.['org.opencontainers.image.revision']) !== lower(expectedSha)) {
    return fail('BUILD_CONFIG_READBACK_MISMATCH');
  }
  const attestations = index.manifests.filter((item) =>
    item?.annotations?.['vnd.docker.reference.type'] === 'attestation-manifest' &&
    lower(item?.annotations?.['vnd.docker.reference.digest']) === platformDigest);
  if (attestations.length !== 1 || !DIGEST.test(attestations[0]?.digest ?? '')) {
    return fail('BUILD_ATTESTATION_MISSING');
  }
  const attestationDigest = attestations[0].digest.toLowerCase();
  const attestationManifest = readDigestJson(runDocker,
    ['buildx', 'imagetools', 'inspect', '--raw', `${repository}@${attestationDigest}`],
    attestationDigest);
  const layers = attestationManifest?.layers;
  if (lower(attestationManifest?.subject?.digest) !== platformDigest ||
      !Array.isArray(layers) || layers.length !== 1 ||
      layers[0]?.mediaType !== 'application/vnd.in-toto+json' ||
      layers[0]?.annotations?.['in-toto.io/predicate-type'] !== 'https://slsa.dev/provenance/v1' ||
      !DIGEST.test(layers[0]?.digest ?? '')) {
    return fail('BUILD_ATTESTATION_SUBJECT_MISMATCH');
  }
  const statement = readBlob(runRegistry, repository, layers[0].digest);
  const attestedSource = statement?.predicate?.buildDefinition?.externalParameters?.configSource;
  const dependencies = statement?.predicate?.buildDefinition?.resolvedDependencies;
  const invocationId = statement?.predicate?.runDetails?.metadata?.invocationId;
  if (statement?._type !== 'https://in-toto.io/Statement/v1' ||
      statement?.predicateType !== 'https://slsa.dev/provenance/v1' ||
      !Array.isArray(statement.subject) || statement.subject.length !== 1 ||
      lower(statement.subject[0]?.digest?.sha256) !== platformDigest.slice(7) ||
      attestedSource?.uri !== sourceUri ||
      lower(attestedSource?.digest?.sha1) !== lower(expectedSha) ||
      attestedSource?.path !== 'apps/api/Dockerfile' ||
      !Array.isArray(dependencies) ||
      !dependencies.some((item) => item?.uri === sourceUri &&
        lower(item?.digest?.sha1) === lower(expectedSha)) ||
      statement?.predicate?.buildDefinition?.externalParameters?.request?.args?.target !== 'runtime' ||
      typeof invocationId !== 'string' || !/^[a-z0-9]+$/i.test(invocationId)) {
    return fail('BUILD_ATTESTATION_PROVENANCE_MISMATCH');
  }
  const image = readJson(runDocker, ['image', 'inspect', imageRef]);
  const platformImage = readJson(runDocker, ['image', 'inspect', '--platform', 'linux/amd64', imageRef]);
  if (!Array.isArray(image) || image.length !== 1 ||
      lower(image[0].Id) !== lower(indexDigest) ||
      !Array.isArray(platformImage) || platformImage.length !== 1 ||
      lower(platformImage[0].Id) !== platformDigest ||
      lower(platformImage[0].Config?.Labels?.['org.opencontainers.image.revision']) !== lower(expectedSha)) {
    return fail('BUILD_IMAGE_READBACK_MISMATCH');
  }
  const localBuildIds = platformImage[0].Identity?.Build;
  if (!Array.isArray(localBuildIds) || localBuildIds.length !== 1 ||
      localBuildIds[0]?.Ref !== buildRef.split('/').at(-1)) {
    return fail('BUILD_ID_IMAGE_MISMATCH');
  }
  for (const file of composeFiles) {
    const args = ['compose'];
    if (composeEnvFile) args.push('--env-file', composeEnvFile);
    args.push('-f', file, 'config', '--format', 'json');
    const compose = readJson(runDocker, args);
    if (!compose?.services) return fail('BUILD_COMPOSE_UNAVAILABLE');
    if (ROLES.some((role) => compose.services[role]?.image !== imageRef ||
        compose.services[role]?.build !== undefined)) {
      return fail('BUILD_ROLE_IMAGE_MISMATCH');
    }
  }
  return {
    status: 'PASS', issues: [], sourceSha: expectedSha.toLowerCase(), buildId: invocationId,
    buildRef, attestationDigest,
    imageRef, manifestDigest: indexDigest.toLowerCase(), platformManifestDigest: platformDigest,
    configDigest: configDigest.toLowerCase(), imageId: image[0].Id.toLowerCase(),
  };
};

export const readWorkerSwitchBuildMetadata = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
};
