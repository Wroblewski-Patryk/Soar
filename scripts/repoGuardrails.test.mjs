import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  validateApiStartScript,
  validateArchitectureGraphDriftCoverage,
  validateOpsScriptsDoNotAcceptSecretCliArgs,
  validateRuntimeDockerfilesRunAsNonRoot,
  validateTrackedEnvFilePolicy,
  validateWebDockerfileBuildMetadataArgs,
  validateWebRuntimeImageIncludesStartWrapper,
} from "./repoGuardrails.mjs";

const writeApiPackage = (rootDir, startScript) => {
  const apiDir = path.join(rootDir, "apps", "api");
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(
    path.join(apiDir, "package.json"),
    JSON.stringify(
      {
        scripts: {
          start: startScript,
        },
      },
      null,
      2,
    ),
  );
};

test("validateApiStartScript accepts the production-safe launcher", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-safe-"));
  writeApiPackage(rootDir, "node scripts/start-with-migrate.mjs");

  assert.deepEqual(validateApiStartScript({ rootDir }), []);
});

test("validateApiStartScript rejects destructive reset and seed start scripts", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-destructive-"));
  writeApiPackage(
    rootDir,
    "pnpm exec prisma migrate reset --force --skip-seed && pnpm exec prisma db seed && pnpm run run",
  );

  const errors = validateApiStartScript({ rootDir });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /production-safe migration launcher/);
  assert.match(errors[0], /migrate reset/);
});

const writeDockerfile = (rootDir, relativePath, runtimeBody) => {
  const dockerfilePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
  fs.writeFileSync(
    dockerfilePath,
    [
      "FROM node:20-bookworm-slim AS build",
      "RUN echo build",
      "FROM node:20-bookworm-slim AS runtime",
      "WORKDIR /app",
      runtimeBody,
    ].join("\n"),
  );
};

test("validateRuntimeDockerfilesRunAsNonRoot accepts USER node in runtime stage", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-docker-safe-"));
  writeDockerfile(rootDir, "apps/api/Dockerfile", "USER node\nCMD [\"node\", \"server.js\"]");

  assert.deepEqual(
    validateRuntimeDockerfilesRunAsNonRoot({
      rootDir,
      dockerfiles: ["apps/api/Dockerfile"],
    }),
    [],
  );
});

test("validateRuntimeDockerfilesRunAsNonRoot rejects root runtime stage", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-docker-root-"));
  writeDockerfile(rootDir, "apps/api/Dockerfile", "CMD [\"node\", \"server.js\"]");

  const errors = validateRuntimeDockerfilesRunAsNonRoot({
    rootDir,
    dockerfiles: ["apps/api/Dockerfile"],
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /USER node/);
});

const writeWebPackage = (rootDir, startScript = "node ../../scripts/runWebNextProductionCommand.mjs start") => {
  const webDir = path.join(rootDir, "apps", "web");
  fs.mkdirSync(webDir, { recursive: true });
  fs.writeFileSync(
    path.join(webDir, "package.json"),
    JSON.stringify(
      {
        scripts: {
          build: "node ../../scripts/runWebNextProductionCommand.mjs build",
          start: startScript,
        },
      },
      null,
      2,
    ),
  );
};

test("validateWebRuntimeImageIncludesStartWrapper accepts runtime wrapper copy", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-wrapper-safe-"));
  writeWebPackage(rootDir);
  writeDockerfile(
    rootDir,
    "apps/web/Dockerfile",
    [
      "COPY --from=build --chown=node:node /app/scripts/runWebNextProductionCommand.mjs /app/scripts/runWebNextProductionCommand.mjs",
      "USER node",
      "CMD [\"pnpm\", \"--filter\", \"web\", \"start\"]",
    ].join("\n"),
  );

  assert.deepEqual(validateWebRuntimeImageIncludesStartWrapper({ rootDir }), []);
});

test("validateWebRuntimeImageIncludesStartWrapper rejects missing runtime wrapper copy", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-wrapper-missing-"));
  writeWebPackage(rootDir);
  writeDockerfile(
    rootDir,
    "apps/web/Dockerfile",
    [
      "COPY --from=build --chown=node:node /app/apps/web /app/apps/web",
      "USER node",
      "CMD [\"pnpm\", \"--filter\", \"web\", \"start\"]",
    ].join("\n"),
  );

  const errors = validateWebRuntimeImageIncludesStartWrapper({ rootDir });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /production start wrapper/);
  assert.match(errors[0], /runWebNextProductionCommand\.mjs/);
});

test("validateWebDockerfileBuildMetadataArgs accepts declared and forwarded deploy metadata args", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-build-meta-safe-"));
  const dockerfilePath = path.join(rootDir, "apps/web/Dockerfile");
  fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
  fs.writeFileSync(
    dockerfilePath,
    [
      "FROM node:20-bookworm-slim AS base",
      "FROM base AS deps",
      "FROM deps AS build",
      "ARG SOURCE_COMMIT",
      "ARG SOURCE_BRANCH",
      "ARG COOLIFY_BRANCH",
      "ARG COOLIFY_GIT_COMMIT_SHA",
      "ARG COOLIFY_COMMIT_SHA",
      "ARG GITHUB_SHA",
      'RUN SOURCE_COMMIT="$SOURCE_COMMIT" SOURCE_BRANCH="$SOURCE_BRANCH" COOLIFY_BRANCH="$COOLIFY_BRANCH" COOLIFY_GIT_COMMIT_SHA="$COOLIFY_GIT_COMMIT_SHA" COOLIFY_COMMIT_SHA="$COOLIFY_COMMIT_SHA" GITHUB_SHA="$GITHUB_SHA" pnpm --filter web build',
      "FROM node:20-bookworm-slim AS runtime",
      "USER node",
    ].join("\n"),
  );

  assert.deepEqual(validateWebDockerfileBuildMetadataArgs({ rootDir }), []);
});

test("validateWebDockerfileBuildMetadataArgs rejects unforwarded Coolify commit aliases", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-build-meta-missing-"));
  const dockerfilePath = path.join(rootDir, "apps/web/Dockerfile");
  fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
  fs.writeFileSync(
    dockerfilePath,
    [
      "FROM node:20-bookworm-slim AS base",
      "FROM base AS deps",
      "FROM deps AS build",
      "ARG SOURCE_COMMIT",
      "ARG SOURCE_BRANCH",
      "ARG COOLIFY_BRANCH",
      'RUN SOURCE_COMMIT="$SOURCE_COMMIT" SOURCE_BRANCH="${SOURCE_BRANCH:-$COOLIFY_BRANCH}" pnpm --filter web build',
      "FROM node:20-bookworm-slim AS runtime",
      "USER node",
    ].join("\n"),
  );

  const errors = validateWebDockerfileBuildMetadataArgs({ rootDir });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /COOLIFY_GIT_COMMIT_SHA/);
  assert.match(errors[0], /COOLIFY_COMMIT_SHA/);
  assert.match(errors[0], /GITHUB_SHA/);
});

test("validateWebDockerfileBuildMetadataArgs rejects forbidden build-stage git metadata copies", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-build-git-forbidden-"));
  const dockerfilePath = path.join(rootDir, "apps/web/Dockerfile");
  fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
  fs.writeFileSync(
    dockerfilePath,
    [
      "FROM node:20-bookworm-slim AS base",
      "FROM base AS deps",
      "FROM deps AS build",
      "ARG SOURCE_COMMIT",
      "ARG SOURCE_BRANCH",
      "ARG COOLIFY_BRANCH",
      "ARG COOLIFY_GIT_COMMIT_SHA",
      "ARG COOLIFY_COMMIT_SHA",
      "ARG GITHUB_SHA",
      "COPY .git/HEAD .git/HEAD",
      "COPY .git/refs .git/refs",
      'RUN SOURCE_COMMIT="$SOURCE_COMMIT" SOURCE_BRANCH="$SOURCE_BRANCH" COOLIFY_BRANCH="$COOLIFY_BRANCH" COOLIFY_GIT_COMMIT_SHA="$COOLIFY_GIT_COMMIT_SHA" COOLIFY_COMMIT_SHA="$COOLIFY_COMMIT_SHA" GITHUB_SHA="$GITHUB_SHA" pnpm --filter web build',
      "FROM node:20-bookworm-slim AS runtime",
      "USER node",
    ].join("\n"),
  );

  const errors = validateWebDockerfileBuildMetadataArgs({ rootDir });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /must not require \.git/);
  assert.match(errors[0], /Forbidden \.git COPY present: yes/);
});

test("validateWebDockerfileBuildMetadataArgs rejects direct Next builds that bypass metadata writer", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-web-build-wrapper-missing-"));
  const dockerfilePath = path.join(rootDir, "apps/web/Dockerfile");
  fs.mkdirSync(path.dirname(dockerfilePath), { recursive: true });
  fs.writeFileSync(
    dockerfilePath,
    [
      "FROM node:20-bookworm-slim AS base",
      "FROM base AS deps",
      "FROM deps AS build",
      "ARG SOURCE_COMMIT",
      "ARG SOURCE_BRANCH",
      "ARG COOLIFY_BRANCH",
      "ARG COOLIFY_GIT_COMMIT_SHA",
      "ARG COOLIFY_COMMIT_SHA",
      "ARG GITHUB_SHA",
      'RUN SOURCE_COMMIT="$SOURCE_COMMIT" SOURCE_BRANCH="$SOURCE_BRANCH" COOLIFY_BRANCH="$COOLIFY_BRANCH" COOLIFY_GIT_COMMIT_SHA="$COOLIFY_GIT_COMMIT_SHA" COOLIFY_COMMIT_SHA="$COOLIFY_COMMIT_SHA" GITHUB_SHA="$GITHUB_SHA" next build',
      "FROM node:20-bookworm-slim AS runtime",
      "USER node",
    ].join("\n"),
  );

  const errors = validateWebDockerfileBuildMetadataArgs({ rootDir });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /Web build wrapper used: no/);
});

test("validateTrackedEnvFilePolicy allows templates but rejects tracked runtime env files", () => {
  assert.deepEqual(
    validateTrackedEnvFilePolicy({
      trackedFiles: [".env.vps.example", "apps/api/.env.example", "apps/web/.env.example"],
    }),
    [],
  );

  const errors = validateTrackedEnvFilePolicy({
    trackedFiles: [".env", "apps/web/.env.local", "apps/api/.env.example"],
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /\.env/);
  assert.match(errors[0], /apps\/web\/\.env\.local/);
});

test("validateOpsScriptsDoNotAcceptSecretCliArgs rejects secret-bearing CLI parsers", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-secret-cli-"));
  const scriptPath = path.join(rootDir, "scripts", "unsafe.mjs");
  fs.mkdirSync(path.dirname(scriptPath), { recursive: true });
  fs.writeFileSync(
    scriptPath,
    [
      "for (const arg of process.argv.slice(2)) {",
      "  if (arg === '--auth-token') options.authToken = 'unsafe';",
      "}",
    ].join("\n"),
  );

  const errors = validateOpsScriptsDoNotAcceptSecretCliArgs({
    rootDir,
    trackedFiles: ["scripts/unsafe.mjs"],
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /secret-bearing CLI args/);
  assert.match(errors[0], /scripts\/unsafe\.mjs/);
});

test("validateOpsScriptsDoNotAcceptSecretCliArgs accepts secret-free ops scripts", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "soar-guardrails-secret-cli-safe-"));
  const scriptPath = path.join(rootDir, "scripts", "safe.mjs");
  fs.mkdirSync(path.dirname(scriptPath), { recursive: true });
  fs.writeFileSync(
    scriptPath,
    [
      "for (const arg of process.argv.slice(2)) {",
      "  if (arg === '--auth-email') options.authEmail = 'operator@example.test';",
      "}",
    ].join("\n"),
  );

  assert.deepEqual(
    validateOpsScriptsDoNotAcceptSecretCliArgs({
      rootDir,
      trackedFiles: ["scripts/safe.mjs"],
    }),
    [],
  );
});

test("validateArchitectureGraphDriftCoverage accepts zero-drift graph audit", () => {
  const calls = [];
  const errors = validateArchitectureGraphDriftCoverage({
    rootDir: "C:/repo",
    commandRunner: (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd });
      return "Architecture graph drift audit generated: 796/796 covered, 0 missing.";
    },
  });

  assert.deepEqual(errors, []);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].args, ["scripts/auditArchitectureGraphDrift.mjs", "--fail-on-drift"]);
  assert.equal(calls[0].cwd, "C:/repo");
});

test("validateArchitectureGraphDriftCoverage rejects graph drift", () => {
  const failure = new Error("drift");
  failure.stdout = "Architecture graph drift audit generated: 795/796 covered, 1 missing.";
  failure.stderr = "";

  const errors = validateArchitectureGraphDriftCoverage({
    commandRunner: () => {
      throw failure;
    },
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /Architecture graph drift guardrail failed/);
  assert.match(errors[0], /architecture:graph:drift:strict/);
  assert.match(errors[0], /1 missing/);
});
