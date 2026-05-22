# Repo Source-Of-Truth Cleanup Task

## Header
- ID: `REPO-SOT-CLEANUP-2026-05-23`
- Title: Remove obsolete root template source-of-truth folders
- Task Type: refactor
- Current Stage: release
- Status: DONE
- Owner: Active coordinator
- Depends on: AGENTS source-of-truth rules
- Priority: P1
- Module Confidence Rows: repository governance / documentation integrity
- Requirement Rows: source-of-truth clarity, architecture governance
- Quality Scenario Rows: maintainability, operator clarity, agent handoff reliability
- Risk Rows: duplicated source-of-truth paths causing wrong implementation decisions
- Iteration: 2026-05-23
- Operation Mode: ARCHITECT
- Mission ID: `REPO-SOT-FUNCTION-PARITY-2026-05-23`
- Mission Status: IN_PROGRESS

## Context

The operator noticed duplicate architecture-looking folders at the repository
root and under `docs/architecture`. `AGENTS.md`,
`docs/architecture/architecture-source-of-truth.md`, and `docs/README.md`
define `docs/architecture/` as the canonical architecture authority.

Root folders created on 2026-05-03 (`architecture/`, `agents/`,
`pipelines/`, `tasks/`, `tests/`, `deploy/`, and `src/README.md`) contained
generic template guidance and contradicted the current repository governance.

## Goal

Remove obsolete tracked root template folders that can mislead agents or
operators into using the wrong architecture, task, pipeline, test, deploy, or
agent source of truth.

## Scope

Remove only obsolete tracked template files with no active runtime ownership:

- `architecture/*`
- `agents/*`
- `pipelines/*`
- `tasks/*`
- `tests/*`
- `deploy/*`
- `src/README.md`

Explicitly keep referenced evidence under `outputs/`, because existing
planning and operations docs cite the spreadsheet artifact. During execution,
that artifact was moved into `docs/operations/` and references were updated,
so the evidence is preserved under the canonical operations documentation
area.

## Implementation Plan

1. Confirm canonical source-of-truth locations from `AGENTS.md`,
   `docs/architecture/architecture-source-of-truth.md`, and `docs/README.md`.
2. Check references to root template folders.
3. Remove tracked obsolete template files only.
4. Correct nearby stale documentation links that still point to template-era
   paths.
5. Run repository guardrails and diff checks.
6. Record cleanup and residual audit work in state/context docs.

## Acceptance Criteria

- Root `architecture/` no longer exists as a competing architecture authority.
- Root template `agents/`, `pipelines/`, `tasks/`, `tests/`, `deploy/`, and
  `src/README.md` no longer appear as tracked source-of-truth files.
- Canonical `docs/architecture/`, `docs/pipelines/`, `.agents/`, and
  `.codex/context/` remain untouched except for state updates.
- Referenced historical evidence under `outputs/` is preserved.
- Guardrails and diff checks pass.

## Definition of Done

- [x] Obsolete tracked template files removed.
- [x] Stale template-era doc links corrected.
- [x] State/context docs updated.
- [x] Repository guardrails pass.
- [x] `git diff --check` passes.
- [x] Subagent findings integrated or tracked as follow-up.

## Forbidden

- Do not remove canonical `docs/architecture/`, `.agents/`, `.codex`, or
  `docs/pipelines/` files.
- Do not delete referenced evidence artifacts.
- Do not change architecture behavior or product semantics in this cleanup.
- Do not claim backend/frontend functional completion from this cleanup alone.

## Validation Evidence

- Tests:
  - `pnpm --filter web exec vitest run src/app/dashboard/bots/runtime/page.test.tsx src/middleware.test.ts --run` => `2` files / `7` tests PASS.
  - `pnpm --filter web run typecheck` => PASS after `next build` regenerated `.next/types`.
  - `pnpm --filter web run build` => PASS.
  - `docker build -f apps/web/Dockerfile -t soar-web-buildmeta-check .` => PASS; build log wrote `.build-meta/BUILD_META.json` with `gitSha=b68d3464b373db361153e1885be83e035f55f197`.
  - `docker run --rm -p 3102:3002 soar-web-buildmeta-check` plus `GET http://127.0.0.1:3102/api/build-info` => PASS with `gitSha=b68d3464b373db361153e1885be83e035f55f197`.
  - `pnpm run docs:parity:check` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `git diff --check` => PASS with line-ending warnings only.
- Manual checks: root tracked template scan, reference scan, ignored local artifact cleanup, production availability probe after VPS restart, Coolify project/team lookup, manual `soar-web` redeploy readback.
- Reality status: verified for cleanup, local frontend route behavior, and local Docker build-info packaging. First production redeploy reached commit `b68d3464` in Coolify deployment history, but public `/api/build-info` reported `gitSha: null`; follow-up Docker metadata fix is ready for commit/push/redeploy.

## Architecture Evidence

- Architecture source reviewed:
  - `AGENTS.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/12_documentation-governance.md`
  - `docs/README.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, obsolete root `architecture/` claimed authority
  while current governance assigns architecture authority to
  `docs/architecture/`.
- Decision required from user: no for removal of obsolete template files;
  yes for any future change to canonical architecture ownership.

## Result Report

- Task summary: removed obsolete root source-of-truth scaffolding, moved root
  security and spreadsheet evidence into canonical docs areas, corrected stale
  template-era links, and fixed the small frontend legacy route drift found by
  the integration lane. During production proof, fixed the Web Docker
  build-info packaging path so the static `/api/build-info` endpoint can expose
  the deployed Git SHA from Docker builds.
- Files changed: root scaffold deletions, docs/state updates, web legacy route
  redirect, route docs/module docs, moved evidence artifacts, web Dockerfile,
  build metadata writer, and build-info route metadata lookup.
- How tested: focused web route/middleware tests, web typecheck, web build,
  local Docker image build-info proof, docs parity, repository guardrails, and
  diff check passed.
- What is incomplete: full backtest multi-strategy merge parity remains a P1
  product/schema implementation slice; production readback still needs a
  second deploy after the build-info metadata fix is pushed.
- Next steps: commit/push the build-info metadata fix, redeploy `soar-web`,
  wait for production build-info to expose the new pushed SHA, then run smoke
  checks.
