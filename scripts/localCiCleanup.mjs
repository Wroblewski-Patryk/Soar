import { existsSync, lstatSync, mkdirSync, readdirSync, realpathSync, renameSync, rmSync } from 'node:fs';
import path from 'node:path';

const inside = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};

export const cleanupLocalCiStaging = ({
  workspaceRoot,
  stageRoot,
  stageDir,
  quarantineRoot,
  operations = {},
}) => {
  const workspace = path.resolve(workspaceRoot);
  const root = path.resolve(stageRoot);
  const target = path.resolve(stageDir);
  const quarantine = path.resolve(quarantineRoot);
  const exists = operations.exists ?? existsSync;
  const remove = operations.remove ?? rmSync;
  const move = operations.move ?? renameSync;
  const makeDir = operations.makeDir ?? mkdirSync;
  const stat = operations.stat ?? lstatSync;
  const realpath = operations.realpath ?? realpathSync;
  const readDir = operations.readDir ?? readdirSync;
  const result = {
    attempted: true,
    status: 'FAIL',
    target: path.relative(workspace, target),
    existsAfter: true,
    quarantinedAt: null,
    rootEntriesAfter: [],
    errors: [],
  };
  const finish = () => {
    result.rootEntriesAfter = exists(root) ? readDir(root) : [];
    if (result.rootEntriesAfter.length > 0) {
      result.errors.push(`Staging root still contains ${result.rootEntriesAfter.length} entries`);
      result.status = 'FAIL';
    }
    return result;
  };

  if (!inside(workspace, root) || path.dirname(target) !== root || inside(workspace, quarantine) || quarantine === workspace) {
    result.errors.push('Unsafe staging or quarantine path');
    return result;
  }
  if (!exists(target)) {
    result.status = 'PASS';
    result.existsAfter = false;
    return finish();
  }
  try {
    const canonicalWorkspace = realpath(workspace);
    const canonicalRoot = realpath(root);
    if (!inside(canonicalWorkspace, canonicalRoot) ||
        (exists(target) && path.dirname(realpath(target)) !== canonicalRoot)) {
      throw new Error('Staging path resolves outside its workspace');
    }
  } catch (error) {
    result.errors.push(`Unsafe staging path: ${error.message}`);
    return result;
  }
  try {
    if (stat(target).isSymbolicLink()) throw new Error('Staging target is a symbolic link');
    remove(target, { recursive: true, force: true });
    if (exists(target)) throw new Error('Staging target still exists after removal');
  } catch (error) {
    result.errors.push(`Removal failed: ${error.message}`);
  }

  if (result.errors.length > 0 && exists(target)) {
    const destination = path.join(quarantine, path.basename(target));
    try {
      makeDir(quarantine, { recursive: true });
      if (inside(realpath(workspace), realpath(quarantine)) || realpath(workspace) === realpath(quarantine)) {
        throw new Error('Quarantine resolves inside the workspace');
      }
      if (exists(destination)) throw new Error('Quarantine destination already exists');
      move(target, destination);
      result.quarantinedAt = destination;
    } catch (error) {
      result.errors.push(`Quarantine failed: ${error.message}`);
    }
  }
  result.existsAfter = exists(target);
  if (result.errors.length === 0 && !result.existsAfter) result.status = 'PASS';
  return finish();
};
