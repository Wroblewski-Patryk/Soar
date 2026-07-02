# Task

## Header

- ID: LUC-6097
- Title: [Soar][CBE][LUC-6090] Prove User configuration API/support contract and doc links
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none for this CBE slice
- Priority: P1
- Module Confidence Rows: app-completion proof backlog / User configuration
- Requirement Rows: profile/API support contract, app-completion User configuration row linkage
- Quality Scenario Rows: security/reliability for profile-sensitive routes
- Risk Rows: local DB-backed verification availability
- Iteration: 2026-06-29
- Operation Mode: BUILDER
- Mission ID: LUC-6097-USER-CONFIGURATION-API-SUPPORT-CONTRACT-2026-06-29
- Mission Status: VERIFIED_LOCAL_PARENT_CLOSURE

## Process Self-Audit

- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence through proof/classification.

## Mission Block

- Mission objective: prove the User configuration backend/API support contract
  and identify remaining row-link/doc-link ownership.
- Release objective advanced: app-completion residual burn-down from
  [LUC-6090](/LUC/issues/LUC-6090).
- Included slices: app-completion row reconstruction, config support tests,
  DB-free API-key probe proof, DB-backed profile route attempt, local DB
  availability check, evidence packet.
- Explicit exclusions: production mutation, deploy, restart, protected smoke,
  secret/account readback, exchange/payment mutation, order, position, or live
  trading.
- Stop conditions: focused proof passes, DB-backed profile proof is blocked by
  local infrastructure, or ownership leaves CBE.
- Handoff expectation: [LUC-6105](/LUC/issues/LUC-6105) restores local DB
  runtime; [LUC-6106](/LUC/issues/LUC-6106) reconciles doc links; CBE reruns
  DB-backed profile basic/security proof after DB is available.

## Context

[LUC-6074](/LUC/issues/LUC-6074) packaged a User configuration residual lane:
`152` rows, including `24` browser-review, `75` missing-test-link, `49`
missing-doc-link, `3` implemented-needs-proof, and `1` ok. [LUC-6097](/LUC/issues/LUC-6097)
owns the backend/API support contract slice only.

## Goal

Identify exact User configuration API/support rows that are verified, blocked,
or owned by another lane, and run the smallest local no-secret proof available.

## Scope

- `docs/status/app-completion-index.json`
- `docs/graphs/architecture-awareness.json`
- `docs/modules/api-profile.md`
- `apps/api/src/config/criticalSecretsReadiness.ts`
- `apps/api/src/config/proxyTrust.ts`
- `apps/api/src/config/runtimeExecution.ts`
- `apps/api/src/modules/profile/apiKey/*`
- `apps/api/src/modules/profile/basic/*`
- `apps/api/src/modules/profile/security/*`
- Evidence/task docs under `history/evidence` and `history/tasks`

## Implementation Plan

1. Read issue context and source app-completion state.
2. Reconstruct exact User configuration rows with the app-completion classifier.
3. Run DB-free API/config support proof.
4. Attempt profile route e2e proof and classify failures.
5. Record exact row ownership, proof, blocker, and next owners.

## Acceptance Criteria

- [x] Exact User configuration counts are identified.
- [x] Backend/API rows are classified by verified, blocked, or handoff state.
- [x] Smallest backend/API proof is run without protected production or secret access.
- [x] Remaining non-CBE work is handed to appropriate owners.
- [x] No forbidden production/live/security mutation occurs.

## Definition of Done

- [x] Evidence file created.
- [x] Relevant validation output recorded.
- [x] DB-backed blocker cleared and rerun evidence recorded.
- [x] Source-control/deploy impact recorded.

## Validation Evidence

- Tests:
  - PASS: `$env:DATABASE_URL='postgresql://postgres:password@localhost:5432/cryptosparrow?schema=public'; $env:REDIS_URL='redis://localhost:6379'; pnpm --filter api exec vitest run src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/config/runtimeExecution.test.ts src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts --reporter=verbose` (`6` files / `28` tests).
- Manual checks:
  - `Test-NetConnection -ComputerName localhost -Port 5432` -> `TcpTestSucceeded=True`.
  - `docker ps --format '{{.Names}} {{.Status}} {{.Ports}}'` -> `soar-postgres-1` and `soar-redis-1` running on loopback.
  - `pnpm run go-live:infra:down` -> PASS; stopped and removed the local Compose services after proof.
- Reality status: verified local CBE parent closure.

## Architecture Evidence

- Architecture source reviewed: `docs/modules/api-profile.md`, `docs/graphs/architecture-awareness.json`, `docs/status/app-completion-index.json`.
- Fits approved architecture: yes.
- Mismatch discovered: no product architecture mismatch; scanner taxonomy still treats backend support files as browser-review rows.
- Decision required from user: no.
- Follow-up architecture/doc updates: DSM doc-link reconciliation should handle already-tested support rows.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: evidence-only task; no runtime changes to roll back.

## Autonomous Loop Evidence

### 1. Analyze Current State

- User configuration flow has `152` rows in current app-completion index.
- Backend/API support rows are mixed with Web/profile browser rows and doc-link rows.
- Local DB-backed profile route tests can reach PostgreSQL after [LUC-6105](/LUC/issues/LUC-6105).

### 2. Select One Priority Mission Objective

- Selected task: prove CBE-owned User configuration API/support contract slice.
- Priority rationale: direct high-priority child of [LUC-6090](/LUC/issues/LUC-6090).

### 3. Plan Implementation

- Use existing app-completion classifier and existing Vitest packs.
- Do not add new runtime code or scanner behavior in this heartbeat.

### 4. Execute Implementation

- Reconstructed row set.
- Ran config support tests.
- Ran profile API-key probe plus DB-backed basic/security attempt.
- Checked local DB/Docker availability.

### 5. Verify and Test

- Config support proof passed.
- DB-free API-key probe proof passed.
- DB-backed profile route proof passed after local PostgreSQL restoration.

### 6. Self-Review

- Simpler option considered: only run config tests. Rejected because issue also names profile/configuration surfaces.
- Technical debt introduced: no.
- Existing systems reused: yes, app-completion classifier and existing API tests.

### 7. Update Documentation and Knowledge

- Docs updated: evidence/task packet only.
- Context updates: project state, task board, and module confidence ledger.
- Learning journal updated: not applicable; local DB unavailability is already a known recurring environment pitfall.

## Review Checklist

- [x] Process self-audit completed.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was worked.
- [x] Current stage is declared.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Validation evidence is attached.

## Result Report

- Task summary: User configuration backend/API support contract is verified for
  this CBE slice. DB-free config support, profile API-key probe, and DB-backed
  profile basic/security route proof passed locally.
- Files changed:
  - `history/evidence/luc-6097-user-configuration-api-support-contract-2026-06-29.md`
  - `history/tasks/luc-6097-user-configuration-api-support-contract-2026-06-29-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested: see Validation Evidence.
- What is incomplete: non-CBE User configuration residuals remain for browser
  review, Web profile/platform doc/test links, and the two Backend/API
  platform doc-link rows classified by [LUC-6106](/LUC/issues/LUC-6106) as
  outside this profile/configuration API/support closure.
- Next steps: no remaining CBE blocker on [LUC-6097](/LUC/issues/LUC-6097).
  DSM/Frontend/Web owners should continue residual row burn-down from the
  current app-completion index where assigned.
- Decisions made: no product or architecture changes.
