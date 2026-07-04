# LUC-21 Soar Local Architecture And Repo Preflight

## Header
- ID: LUC-21
- Title: 11 Innowacje - Soar local architecture and repo preflight
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: 11 SPM
- Priority: P1
- Iteration: 2026-07-04 Stage 1 controlled activation dry run
- Operation Mode: BUILDER
- Mission ID: LUC-21-SOAR-LOCAL-ARCHITECTURE-REPO-PREFLIGHT-2026-07-04
- Mission Status: VERIFIED

## Context
Parent [LUC-19](/LUC/issues/LUC-19) is the Stage 1 Local Autonomy Expansion
controller. This issue asked for a read-only Soar local preflight before any
implementation: read architecture source of truth, inspect branch/dirty state
and divergence, classify safe local continuation, and recommend the smallest
next slice.

## Goal
Give AIA/QVE an inspectable readiness finding for local Soar work without
modifying product code, pushing, deploying, restarting, exposing secrets, or
running destructive cleanup.

## Scope
- Read `docs/architecture/README.md`.
- Read `docs/architecture/architecture-source-of-truth.md`.
- Inspect git branch, `HEAD`, upstream, ahead/behind state, dirty/untracked
  state, and diff summary.
- Record next safe local slice and gates.

## Implementation Plan
1. Read the Paperclip heartbeat context for [LUC-21](/LUC/issues/LUC-21).
2. Read the canonical architecture entrypoints named in the issue.
3. Inspect source control state with read-only git commands.
4. Record the finding in task/state artifacts.
5. Close the Paperclip issue with clear gates and next owner path.

## Acceptance Criteria
- Architecture source read and fit/conflict status recorded.
- Git branch, dirty state, and divergence summary recorded.
- Safe local continuation classification recorded.
- Next local slice and verification commands named.
- Docker/Linux runtime, push/deploy, secrets, and production gates explicit.

## Definition of Done
- `DEFINITION_OF_DONE.md` release-grade gates are not invoked because this is a
  read-only preflight with no product/runtime change.
- Evidence is recorded in this task file and issue closure.
- No product code, deploy, restart, rollback, secret/account readback,
  DB/Redis mutation, exchange/payment mutation, order, position, subscription
  mutation, or live-trading action occurred.

## Validation Evidence
- Paperclip heartbeat context:
  `GET /api/issues/{issueId}/heartbeat-context` returned [LUC-21](/LUC/issues/LUC-21)
  as `in_progress`, priority `high`, parent [LUC-19](/LUC/issues/LUC-19), with
  no first-class blockers.
- Architecture source reviewed:
  `docs/architecture/README.md` and
  `docs/architecture/architecture-source-of-truth.md`.
- Architecture fit:
  yes. The preflight does not alter architecture and reinforces the documented
  rule that implementation must match approved architecture; mismatches require
  explicit decision rather than workarounds.
- Git branch:
  `main`.
- Local head:
  `fc0f6d9f`.
- Upstream:
  `origin/main`.
- Divergence:
  `HEAD...origin/main` is `23` ahead and `5` behind.
- Dirty state:
  pre-existing dirty workspace includes modified state/status/graph files and
  untracked evidence/task artifacts, including `.agents/state/*`,
  `.codex/context/*`, `docs/graphs/*`, `docs/status/*`, and
  `history/*` evidence/task files.
- Diff scale:
  read-only `git diff --stat` reported `26` tracked files changed with about
  `129413` insertions and `113605` deletions before this LUC-21 evidence was
  added.
- Tests:
  none run; issue scope was repo/architecture preflight, not product code
  verification. The smallest meaningful verification was read-only architecture
  and git-state inspection.
- Reality status:
  verified.

## Readiness Finding
Local analysis and narrowly scoped DB-free/API-test work can continue if it
does not depend on a clean source tree and writes only scoped evidence/state.
Code changes, commits, push, deploy, migration, restart, rollback, env edits,
or production/runtime mutation should not proceed from this checkout until a
source-control owner reconciles the dirty/divergent state or explicitly grants
a recorded exception.

## Recommended Next Local Slice
Continue the existing runtime worker/app-completion proof path rather than
creating a duplicate lane:

- Primary candidate:
  [LUC-6468](/LUC/issues/LUC-6468) row-level no-live API/worker contract proof.
- Suggested verification shape:
  a focused DB-free `vitest` pack for the next unproved worker/runtime/API
  contract row, using `corepack pnpm --filter api exec vitest run ... --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`.
- Do not wait for DB-backed freshness proof to make all progress:
  local Docker/Postgres restoration remains a separate infra/QA path from
  [LUC-6930](/LUC/issues/LUC-6930).

## Explicit Gates
- Docker/Linux runtime:
  DB-backed tests and local infra restoration require a Docker/Linux runtime
  owner; do not treat PostgreSQL `localhost:5432` failures as backend code
  defects without infra proof.
- Push/deploy:
  blocked from this checkout unless source-control/release owner reconciles
  `main` being `23` ahead and `5` behind plus the large dirty set, or an
  explicit emergency exception is recorded.
- Secrets:
  no secret values were read. Missing protected input families remain
  Security/Ops/board-owned configuration work, not SPM local preflight work.
- Production:
  no production mutation, restart, rollback, DB/Redis action, account action,
  exchange/payment action, subscription action, order/position action, or
  live-trading action is authorized by this issue.

## Result Report
- Task summary:
  completed Soar architecture/repo preflight and named the safest next local
  implementation/verification slice.
- Files changed:
  `history/tasks/luc-21-soar-local-architecture-repo-preflight-2026-07-04-task.md`,
  `.codex/context/TASK_BOARD.md`, `.agents/state/next-steps.md`.
- How tested:
  read-only architecture and git-state inspection.
- What is incomplete:
  source-control reconciliation is not done; dirty/divergent state remains.
- Next steps:
  CBE or packet owner continues [LUC-6468](/LUC/issues/LUC-6468) with a scoped
  DB-free proof slice; source-control/release owner separately reconciles the
  checkout before any commit/push/deploy.
- Decisions made:
  local proof can continue only in narrow, no-live, no-release slices; release
  operations remain gated.
