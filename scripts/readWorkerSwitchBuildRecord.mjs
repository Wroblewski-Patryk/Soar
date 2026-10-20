import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

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
const readJson = (runDocker, args) => {
  try {
    const result = runDocker(args);
    if (result?.status !== 0 || typeof result.stdout !== 'string') return null;
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
};

export const readWorkerSwitchBuildRecord = ({
  metadata,
  sourceBinding,
  expectedSha,
  imageRef,
  runDocker = runDockerDefault,
  composeFiles = COMPOSE_FILES,
  composeEnvFile,
} = {}) => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return fail('BUILD_RECORD_MISSING');
  if (!SHA.test(expectedSha ?? '') || sourceBinding?.status !== 'PASS' ||
      sourceBinding.headSha?.toLowerCase() !== expectedSha.toLowerCase() ||
      sourceBinding.sourceCommit?.toLowerCase() !== expectedSha.toLowerCase()) {
    return fail('BUILD_SOURCE_HEAD_MISMATCH');
  }
  const pinned = typeof imageRef === 'string' && imageRef.match(PINNED);
  if (!pinned) return fail('BUILD_IMAGE_NOT_PINNED');
  const [, repository, indexDigest] = pinned;
  if (sourceBinding.pinnedImageRef !== imageRef ||
      sourceBinding.imageId?.toLowerCase() !== indexDigest.toLowerCase() ||
      sourceBinding.revisionLabel?.toLowerCase() !== expectedSha.toLowerCase()) {
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
  if (source?.uri !== sourceUri || source?.digest?.sha1?.toLowerCase() !== expectedSha.toLowerCase() ||
      source?.entryPoint !== 'apps/api/Dockerfile' ||
      !Array.isArray(materials) ||
      !materials.some((item) => item?.uri === sourceUri &&
        item?.digest?.sha1?.toLowerCase() === expectedSha.toLowerCase()) ||
      arguments_?.['build-arg:SOURCE_COMMIT']?.toLowerCase() !== expectedSha.toLowerCase() ||
      arguments_?.target !== 'runtime') {
    return fail('BUILD_SOURCE_PROVENANCE_MISMATCH');
  }
  if (metadata['containerimage.digest']?.toLowerCase() !== indexDigest.toLowerCase() ||
      metadata['containerimage.descriptor']?.digest?.toLowerCase() !== indexDigest.toLowerCase() ||
      metadata['containerimage.descriptor']?.mediaType !== 'application/vnd.oci.image.index.v1+json') {
    return fail('BUILD_INDEX_DIGEST_MISMATCH');
  }
  const index = readJson(runDocker, ['buildx', 'imagetools', 'inspect', '--raw', imageRef]);
  if (index?.mediaType !== 'application/vnd.oci.image.index.v1+json' ||
      !Array.isArray(index.manifests)) return fail('BUILD_INDEX_UNAVAILABLE');
  const platform = index.manifests.filter((item) =>
    item?.platform?.os === 'linux' && item?.platform?.architecture === 'amd64' &&
    (!item.platform.variant || item.platform.variant === ''));
  if (platform.length !== 1 || !DIGEST.test(platform[0]?.digest ?? '')) {
    return fail('BUILD_PLATFORM_MANIFEST_AMBIGUOUS');
  }
  const platformDigest = platform[0].digest.toLowerCase();
  const manifest = readJson(runDocker, ['buildx', 'imagetools', 'inspect', '--raw', `${repository}@${platformDigest}`]);
  const configDigest = manifest?.config?.digest;
  if (!DIGEST.test(configDigest ?? '')) return fail('BUILD_CONFIG_DIGEST_INVALID');
  if (metadata['containerimage.config.digest'] &&
      metadata['containerimage.config.digest'].toLowerCase() !== configDigest.toLowerCase()) {
    return fail('BUILD_CONFIG_DIGEST_MISMATCH');
  }
  const image = readJson(runDocker, ['image', 'inspect', imageRef]);
  const platformImage = readJson(runDocker, ['image', 'inspect', '--platform', 'linux/amd64', imageRef]);
  if (!Array.isArray(image) || image.length !== 1 ||
      image[0].Id?.toLowerCase() !== indexDigest.toLowerCase() ||
      !Array.isArray(platformImage) || platformImage.length !== 1 ||
      platformImage[0].Id?.toLowerCase() !== platformDigest ||
      platformImage[0].Config?.Labels?.['org.opencontainers.image.revision']?.toLowerCase() !== expectedSha.toLowerCase()) {
    return fail('BUILD_IMAGE_READBACK_MISMATCH');
  }
  const localBuildId = platformImage[0].Identity?.Build?.Ref;
  if (localBuildId && localBuildId !== buildRef.split('/').at(-1)) {
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
    status: 'PASS', issues: [], sourceSha: expectedSha.toLowerCase(), buildId: buildRef,
    imageRef, manifestDigest: indexDigest.toLowerCase(), platformManifestDigest: platformDigest,
    configDigest: configDigest.toLowerCase(), imageId: image[0].Id.toLowerCase(),
  };
};

export const readWorkerSwitchBuildMetadata = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
};
