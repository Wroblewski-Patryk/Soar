# LUC-1419 Restore Local DB-Backed API E2E Runtime For Close-Authority Route Proof

## Header
- ID: LUC-1419
- Title: Restore local DB-backed API e2e runtime for close-authority route proof
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-1196
- Priority: P0
- Module Confidence Rows: runtime close authority route proof, local API e2e runtime
- Requirement Rows: local DB-backed route proof for DCA-first close authority
- Quality Scenario Rows: local reproducible backend route verification
- Risk Rows: local environment false blocker
- Iteration: 2026-06-02 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-1419-LOCAL-DB-E2E-RUNTIME-RESTORE-2026-06-02
- Mission Status: VERIFIED

## Context
Parent [LUC-1196](/LUC/issues/LUC-1196) was blocked before endpoint assertions
because Prisma could not reach PostgreSQL at `localhost:5432` and Docker server
availability was previously unavailable.

## Goal
Restore or prove a deterministic local DB-backed API e2e runtime so the
close-authority route pack can run past infrastructure setup and classify any
remaining failure as application behavior.

## Scope
- Local Postgres/Redis compose runtime.
- Focused API route-pack command:
  `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose`.
- Issue/evidence update for [LUC-1419](/LUC/issues/LUC-1419) and parent
  [LUC-1196](/LUC/issues/LUC-1196).

## Implementation Plan
1. Confirm `localhost:5432` reachability.
2. Confirm Docker server and compose service state.
3. Rerun the focused route pack.
4. Classify the result as infrastructure, backend behavior, or pass.
5. Update evidence and source-of-truth context without exposing secrets.

## Acceptance Criteria
- Local PostgreSQL is reachable at `127.0.0.1:5432`.
- Docker server responds without printing secrets.
- Focused route pack passes or reaches endpoint assertions with a non-infrastructure failure classified.
- Parent issue receives redacted evidence.

## Definition of Done
- DB-backed runtime dependency is available locally.
- Focused route proof no longer fails in Prisma setup.
- No production mutation or secret exposure.
- Cleanup/process check performed.

## Validation Evidence
- `Test-NetConnection 127.0.0.1 -Port 5432` -> `TcpTestSucceeded: True`.
- `docker version --format '{{.Server.Version}}'` -> `28.3.2`.
- `docker compose ps` -> `soar-postgres-1` and `soar-redis-1` running on
  `127.0.0.1:5432` and `127.0.0.1:6379`.
- Focused route pack -> FAIL after endpoint assertions: `2/3` passed, pending
  DCA close-authority assertion failed with response status `closed` where the
  test expects `submitted`.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` -> no rows.

## Architecture Evidence
- Architecture source reviewed: `docs/engineering/local-development.md`,
  `DEPLOYMENT_GATE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; runtime proof only.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no production or local destructive mutation.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report
- Task summary: local DB-backed API e2e runtime is restored for this route pack.
- Files changed: this task packet, evidence/context ledgers only.
- How tested: focused network, Docker, compose, and Vitest route-pack checks.
- What is incomplete: backend route behavior remains red in [LUC-1196](/LUC/issues/LUC-1196).
- Next steps: Backend/QA owner reruns or fixes the pending DCA close-authority route assertion.
- Decisions made: classify [LUC-1419](/LUC/issues/LUC-1419) as Ops `done`; classify remaining work as Backend/QA behavior drift.
