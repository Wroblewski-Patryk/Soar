import { existsSync } from 'node:fs';
import path from 'node:path';

export const resolveRepositoryPath = (repoRoot, relativePath) => {
  if (String(relativePath).startsWith('docs/')) {
    const docsPath = path.resolve(repoRoot, relativePath);
    if (existsSync(docsPath)) return docsPath;

    const migratedDocsPath = path.resolve(
      repoRoot,
      'docs',
      String(relativePath).slice('docs/'.length),
    );
    if (existsSync(migratedDocsPath)) return migratedDocsPath;
  }

  return path.resolve(repoRoot, relativePath);
};

export const repositoryPathExists = (repoRoot, relativePath) =>
  existsSync(resolveRepositoryPath(repoRoot, relativePath));
