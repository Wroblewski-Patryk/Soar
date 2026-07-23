# Task

## Header
- ID: LUC-1556
- Title: Verify Redis recovery smoke and acceptance ledger after cache-only rebuild
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P0
- Iteration: 2026-07-23
- Operation Mode: BUILDER
- Mission ID: LUC-1556-REDIS-RECOVERY-VERIFICATION-2026-07-23
- Mission Status: VERIFIED

## Context
`LUC-1556` was previously blocked first by missing protected auth proof and
then by `LUC-1706` while the production `workers-execution` Coolify
application remained `exited:unhealthy`. The DRE recovery packet now shows a
single approved start action succeeded on Thursday, July 23, 2026, so QVE must
independently rerun the production smoke and refresh the acceptance-ledger
state from current evidence.

## Goal
Produce inspectable QA evidence that the post-Redis recovery state is green
again for public readiness, protected readiness details, protected worker
readiness, and worker runtime freshness, while recording the remaining Redis
proof boundary accurately in the acceptance ledger.

## Scope
- Recheck public production `GET /health`, `GET /ready`, and Web
  `/api/build-info`.
- Recheck protected production `GET /ready/details`,
  `GET /workers/ready`, and `GET /workers/runtime-freshness` using the
  approved admin-smoke login path available in this runner.
- Reuse the accepted `LUC-1569` managed readback for the Redis health/Coolify
  resource evidence boundary.
- Update the local QA/state packet for `LUC-1556`.
- Do not deploy, restart, redeploy, edit secrets, or mutate production.

## Constraints
- Read-only production verification only.
- No secret values, cookies, or bearer tokens may be printed or stored.
- No runtime code, docs architecture sources, or deployment manifests change.
- Reuse existing proof systems and accepted dependency evidence only.

## Implementation Plan
1. Confirm the dependency chain moved past the stale `LUC-1706` blocker.
2. Run bounded public production probes.
3. Run the protected probes through the available admin-smoke binding.
4. Refresh QA evidence and local acceptance-ledger state only.
5. Close the Paperclip issue with a verification-only evidence bundle.

## Acceptance Criteria
- Public `GET /health` and `GET /ready` return `200`.
- Web `/api/build-info` returns `200` and records the current deployed SHA.
- Protected `GET /ready/details` returns `200 ready`.
- Protected `GET /workers/ready` returns `200 ready` with fresh execution
  heartbeat.
- Protected `GET /workers/runtime-freshness` returns `200` with `status=PASS`.
- The QA packet records the exact Redis proof boundary: no direct remote
  `redis-cli PING` was available in this runner, so Redis health is inherited
  from the accepted managed Coolify projection.

## Definition of Done
- [x] Fresh public production readiness evidence is recorded.
- [x] Fresh protected readiness and worker-runtime evidence is recorded.
- [x] Local state/ledger files reflect that `LUC-1706` no longer blocks
      `LUC-1556`.
- [x] Paperclip can close the verification lane with evidence-backed `done`.

## Validation Evidence
- Command:
  `pnpm run -s ops:protected-inputs:check -- --json`
- Result:
  `PARTIAL / NO-GO`; the general account-access gate remains incomplete in this
  shell, but this does not block the exact `LUC-1556` proof because the runner
  still has the specific `SOAR_PROD_ADMIN_SMOKE_*` bindings required for the
  protected readiness readback.
- Command:
  PowerShell `Invoke-WebRequest` against
  `https://api.soar.luckysparrow.ch/health`,
  `https://api.soar.luckysparrow.ch/ready`, and
  `https://soar.luckysparrow.ch/api/build-info`
- Result:
  `PASS`; all three returned `200`, and build-info reported SHA
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589` with
  `metadataSource=env-runtime`.
- Command:
  inline Node login/readback using `SOAR_PROD_ADMIN_SMOKE_EMAIL` and
  `SOAR_PROD_ADMIN_SMOKE_PASSWORD` against
  `https://api.soar.luckysparrow.ch`
- Result:
  `PASS`; protected `/ready/details -> 200`, `/workers/ready -> 200`,
  `/workers/runtime-freshness -> 200 PASS`.
- Evidence:
  `history/tasks/luc-1556-redis-recovery-verification-ledger-refresh-2026-07-23-task.md`;
  `history/evidence/luc-1556-redis-recovery-verification-ledger-refresh-2026-07-23.md`;
  `history/artifacts/luc-1556-paperclip-closeout-2026-07-23.md`;
  accepted dependency evidence
  `history/evidence/luc-1569-protected-post-redis-readback-managed-bindings-2026-07-23.md`;
  accepted recovery evidence
  `history/evidence/luc-1706-workers-execution-start-recovery-2026-07-23.md`.

## Result Report
- Outcome:
  `LUC-1556` is now independently verified on Thursday, July 23, 2026. The
  prior protected-proof and execution-worker blockers are cleared.
- Exact runtime proof:
  public production `/health`, `/ready`, and Web `/api/build-info` all
  returned `200`; protected `/ready/details` returned `200 ready`; protected
  `/workers/ready` returned `200 ready` with all required worker families
  fresh, including `execution`; protected `/workers/runtime-freshness`
  returned `200` with `status=PASS`.
- Redis proof boundary:
  this runner still does not expose a direct remote `redis-cli PING` path, so
  Redis health remains verified through the accepted `LUC-1569` Coolify
  projection (`redis -> running:healthy`) rather than a new shell-level Redis
  command.
- Files changed:
  `history/tasks/luc-1556-redis-recovery-verification-ledger-refresh-2026-07-23-task.md`,
  `history/evidence/luc-1556-redis-recovery-verification-ledger-refresh-2026-07-23.md`,
  `history/artifacts/luc-1556-paperclip-closeout-2026-07-23.md`,
  `.agents/state/next-steps.md`,
  `.agents/state/system-health.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  build provenance still reports `metadataSource=env-runtime`, so the runtime is
  operationally healthy but build-info remains diagnostic rather than
  release-grade provenance. The shared workspace also remains dirty with
  adjacent active evidence packets; no commit/push was attempted in this QA
  lane.
