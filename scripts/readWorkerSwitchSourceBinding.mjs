import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FULL_SHA = /^[0-9a-f]{40}$/i;
const IMAGE_ID = /^sha256:[0-9a-f]{64}$/i;
const PINNED_REF = /^(?:sha256:[0-9a-f]{64}|[^@\s]+@sha256:[0-9a-f]{64})$/i;
export const IMAGE_INSPECT_FORMAT = '{{.Id}}\t{{index .Config.Labels "org.opencontainers.image.revision"}}';

const defaultRunGit = (args) => spawnSync('git', args, {
  encoding: 'utf8', timeout: 15_000, maxBuffer: 1024 * 1024,
});
const defaultRunDocker = (args) => spawnSync('docker', args, {
  encoding: 'utf8', timeout: 15_000, maxBuffer: 1024 * 1024,
});
const fail = (code) => ({ status: 'FAIL', issues: [code] });

export const readWorkerSwitchSourceBinding = ({
  root = ROOT,
  sourceCommit = process.env.SOURCE_COMMIT,
  imageRef = process.env.API_STACK_IMAGE,
  runGit = defaultRunGit,
  runDocker = defaultRunDocker,
} = {}) => {
  if (typeof sourceCommit !== 'string' || !FULL_SHA.test(sourceCommit)) {
    return fail('SOURCE_COMMIT_INVALID');
  }
  if (typeof imageRef !== 'string' || !PINNED_REF.test(imageRef)) {
    return fail('CANDIDATE_IMAGE_NOT_PINNED');
  }
  const execute = (run, args) => {
    try {
      const result = run(args);
      return result?.status === 0 && typeof result.stdout === 'string' ? result.stdout : null;
    } catch {
      return null;
    }
  };
  const headRaw = execute(runGit, ['-C', root, 'rev-parse', 'HEAD']);
  const headSha = headRaw?.trim();
  if (!headSha || !FULL_SHA.test(headSha)) return fail('SOURCE_HEAD_UNAVAILABLE');
  const statusRaw = execute(runGit, [
    '-C', root, 'status', '--porcelain=v1', '--untracked-files=all', '--ignore-submodules=none',
  ]);
  if (statusRaw === null) return fail('SOURCE_STATUS_UNAVAILABLE');
  if (statusRaw.trim()) return fail('SOURCE_TREE_DIRTY');
  if (headSha.toLowerCase() !== sourceCommit.toLowerCase()) {
    return fail('SOURCE_COMMIT_HEAD_MISMATCH');
  }
  const imageRaw = execute(runDocker, ['image', 'inspect', '--format', IMAGE_INSPECT_FORMAT, imageRef]);
  if (imageRaw === null) return fail('CANDIDATE_IMAGE_UNAVAILABLE');
  const fields = imageRaw.trim().split('\t');
  if (fields.length !== 2 || !IMAGE_ID.test(fields[0]) || !FULL_SHA.test(fields[1])) {
    return fail('CANDIDATE_IMAGE_READBACK_INVALID');
  }
  return {
    status: 'PASS', issues: [], headSha: headSha.toLowerCase(),
    sourceCommit: sourceCommit.toLowerCase(), pinnedImageRef: imageRef,
    imageId: fields[0].toLowerCase(), revisionLabel: fields[1].toLowerCase(),
  };
};
