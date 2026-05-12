# Task

## Header
- ID: V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12
- Title: release(ops): refresh production backup/restore drill evidence
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12`
- Priority: P0
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`
- Quality Scenario Rows: `QA-021`
- Risk Rows: `RISK-021`
- Iteration: 23
- Operation Mode: BUILDER
- Mission ID: `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the previous Operations continuation.
- [x] `.agents/core/mission-control.md` was reviewed for the current Operations mission.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: refresh the production backup/restore drill evidence for 2026-05-12 using the existing isolated restore-proof contract.
- Release objective advanced: remove the stale backup/restore artifact from the current V1 Operations blocker list if the drill passes.
- Included slices:
  - preflight leftover restore DB/backup check
  - production Postgres compressed backup
  - restore into isolated temporary database
  - aggregate key-table validation counts
  - cleanup of temporary restore database and backup dump
  - local documentation/evidence update
- Explicit exclusions:
  - no production app deploy, rollback execution, live bot activation, live order, user-data dump, secret output, schema change, or mutation of primary application tables
- Checkpoint cadence: update evidence after remote drill, then state files.
- Stop conditions: remote command would expose secrets, mutate primary app data, skip cleanup, or fail to clean temporary artifacts.
- Handoff expectation: PASS/FAIL artifact plus exact remaining V1 Operations blockers.

## Context
`V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12` showed production public health but the release gate stayed `not_ready`. One blocker is stale backup/restore drill evidence: the latest production restore drill is from 2026-05-10, while the current release gate expects 2026-05-12 evidence.

## Goal
Produce fresh 2026-05-12 production backup/restore drill evidence without exposing secrets or mutating primary production data.

## Scope
- Production Postgres container: `x11cfnz1dd9x0yzccftqzcoe`
- DB user/name: `postgres` / `postgres`
- Evidence files under `docs/operations/`
- V1 Operations state/context rows after proof

## Implementation Plan
1. Run a remote preflight on the production Postgres container to verify no leftover `postgres_restore_check_%` databases or `/tmp/postgres_backup_*.dump` files.
2. Create a compressed dump in `/tmp`.
3. Create an isolated restore database named `postgres_restore_check_<timestamp>`.
4. Restore the dump into the isolated database.
5. Read only aggregate counts from key tables.
6. Drop the isolated restore database and remove the dump.
7. Verify cleanup returns zero leftovers.
8. Write local JSON/Markdown evidence and refresh V1 Operations ledgers.

## Acceptance Criteria
- Restore drill completes with `RESULT: PASS`.
- Cleanup verification reports zero matching restore DBs and zero backup dumps.
- Evidence contains no password, token, connection string, API key, or row payload.
- V1 release gate no longer classifies backup/restore drill as stale when rerun for 2026-05-12.

## Definition of Done
- [x] Production restore drill evidence generated for 2026-05-12.
- [x] Cleanup proof recorded.
- [x] V1 release gate rerun or evidence classification checked.
- [x] State/context docs updated.
- [x] Guardrails pass.

## Deliverable For This Stage
Fresh backup/restore drill evidence and updated Operations blocker classification.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- production app deploy, rollback execution, live-money mutation, user-data dump, secrets in artifacts, primary DB table mutation

## Validation Evidence
- Tests:
  - Production restore drill over SSH/VPS Docker exec -> PASS (`RESULT: PASS`)
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality --skip-deploy-smoke --skip-runtime-freshness --skip-rollback-guard --dry-run --today 2026-05-12 --artifact-stamp 2026-05-12Trestore-refresh-dry-run` -> `not_ready`, backup/restore evidence `fresh`
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - Preflight restore DB count `0`
  - Preflight backup dump count `0`
  - Validation counts: `Bot=6`, `Log=52740`, `Order=3981`, `Position=4787`, `User=4`
  - Cleanup restore DB count `0`
  - Cleanup backup dump count `0`
- High-risk checks: no production app deploy, rollback execution, live bot activation, live order, user-data dump, secret output, schema change, or primary application table mutation performed.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Quality scenarios updated: yes
- Risk register updated: yes
- Reality status: verified for backup/restore drill; V1 remains blocked overall

## Architecture Evidence
- Architecture source reviewed: `docs/operations/deployment-rollback-playbook.md`, `docs/operations/post-deploy-smoke-checklist.md`, `DEPLOYMENT_GATE.md`, `.agents/state/module-confidence-ledger.md`, previous restore drill artifacts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no for isolated restore drill; yes before any destructive restore or app mutation
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no rollback executed
- Observability or alerting impact: evidence-only
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: backup/restore drill evidence is stale for 2026-05-12.
- Gaps: current-date restore artifact missing.
- Inconsistencies: production public health exists but release gate correctly remains blocked.
- Architecture constraints: isolated restore DB only, cleanup required, no secrets or row payloads.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: package scripts, restore drill scripts, previous 2026-05-10 restore evidence, Operations ledger rows.
- Assumptions recorded: safe to run the same isolated restore contract used by previous production evidence.
- Blocking unknowns: none for this isolated drill; app-auth blockers remain outside this task.
- Why it was safe to continue: the drill creates and drops temporary artifacts and reads aggregate counts only.

### 2. Select One Priority Mission Objective
- Selected task: refresh production restore drill evidence.
- Priority rationale: it is one concrete Operations blocker that can be advanced without app auth.
- Why other candidates were deferred: protected worker/rollback/LIVEIMPORT and Gate 4 require approved operator credentials or sign-off.

### 3. Plan Implementation
- Files or surfaces to modify: docs/operations restore evidence, Operations state docs.
- Logic: run isolated restore contract and classify exact blocker delta.
- Edge cases: restore failure, cleanup failure, stale artifact selection, secrets in output.

### 4. Execute Implementation
- Implementation notes:
  - First SSH wrapper attempt completed backup/restore/count/cleanup with zero leftovers but exited `1` because of a shell-wrapper footer syntax error after cleanup; it was not accepted as proof.
  - Corrected SSH wrapper rerun produced `RESULT: PASS` and `SOAR_RESTORE_20260512152138_PASS`.
  - Local evidence was written to `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md` and `docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-12T15-21-38Z.json`.
  - Production release gate dry-run reclassified backup/restore drill evidence as `fresh` for 2026-05-12.

### 5. Verify and Test
- Validation performed:
  - Remote restore drill PASS with cleanup.
  - Release gate dry-run evidence classification check.
- Result: backup/restore blocker is refreshed; Operations remains blocked by activation audit/plan staleness, RC Gate 4/sign-off, missing LIVEIMPORT-03, and stale rollback proof.

### 6. Self-Review
- Simpler option considered: reuse 2026-05-10 artifact; rejected because release gate requires 2026-05-12 freshness.
- Technical debt introduced: no
- Scalability assessment: same repeatable evidence contract as previous restore drills.
- Refinements made: rejected the first run because process status was not PASS even though cleanup succeeded.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`
  - `docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-12T15-21-38Z.json`
  - `docs/operations/v1-release-gate-prod-2026-05-12Trestore-refresh-dry-run.md`
  - `docs/operations/_artifacts-v1-release-gate-prod-2026-05-12Trestore-refresh-dry-run.json`
  - Operations state/context files
- Context updated: yes
- Learning journal updated: not applicable; one-off shell wrapper footer mistake, corrected in the same task.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12` refreshed the production backup/restore drill evidence to `PASS`.

Evidence:
- `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`
- `docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-12T15-21-38Z.json`
- `docs/operations/v1-release-gate-prod-2026-05-12Trestore-refresh-dry-run.md`

The release gate now classifies backup/restore drill evidence as `fresh` for 2026-05-12. V1 remains `NO-GO` because activation audit/plan and RC sign-off are stale, RC Gate 4/checklist are failed, LIVEIMPORT-03 is missing, and rollback proof is stale.
