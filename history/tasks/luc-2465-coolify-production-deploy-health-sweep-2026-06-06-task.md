# Task

## Header
- ID: LUC-2465
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: production deploy health, Coolify production topology
- Requirement Rows: production public API/Web readiness
- Quality Scenario Rows: deployment health, fail-closed unauthenticated worker readiness
- Risk Rows: Coolify metadata status ambiguity, protected worker proof gap
- Iteration: 2026-06-06 Ops heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-2465-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification-heavy issue scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current mission/state indexes.
- [x] `.agents/core/mission-control.md` was reviewed through current mission state.
- [x] Missing or template-like state tables were not encountered for this narrow sweep.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: capture fresh read-only production deploy health truth for Soar Coolify production.
- Release objective advanced: production API/Web health and deploy freshness confidence.
- Included slices: source ref snapshot, public API/Web smoke, unauthenticated worker fail-closed check, Coolify read-only topology projection, evidence/state update, Paperclip closure.
- Explicit exclusions: deploy, restart, rollback, env edit, database/Redis mutation, account smoke, protected worker/auth/dashboard proof, exchange or live-trading mutation.
- Checkpoint cadence: single heartbeat verification checkpoint.
- Stop conditions: public health/build-info failure, Coolify read-only projection failure, missing protected mutation approval.
- Handoff expectation: close issue with verified read-only evidence and residual protected-proof risks.

## Context
[LUC-2465](/LUC/issues/LUC-2465) woke DRE for a critical Soar Coolify production
deploy health sweep. Prior [LUC-2417](/LUC/issues/LUC-2417) evidence already
proved the same topology and current SHA earlier on 2026-06-06; this heartbeat
refreshed the read-only proof for the active issue.

## Goal
Capture fresh production deploy-health truth for Soar canonical API/Web hosts
and Coolify production topology without performing any production mutation.

## Constraints
- use existing smoke and Coolify read-only mechanisms
- do not introduce new deploy structures or scripts
- do not mutate production, secrets, accounts, exchange state, data, Redis, or workers
- do not treat public smoke as protected worker/dashboard/account proof

## Definition of Done
- [x] Source-ref snapshot recorded.
- [x] Public health/build-info checks recorded.
- [x] Coolify read-only projection recorded without sensitive identifiers.
- [x] Focused validation passed.
- [x] Evidence artifact and state files updated.

## Forbidden
- deploy, restart, rollback, force-start, env edit, database/Redis mutation,
  team/account change, protected account smoke, exchange mutation, or live
  trading.
- secret, token, cookie, account data, exchange credential, raw resource id,
  generated name, internal network, host path, or env value disclosure.

## Validation Evidence
- `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
- Node status probes: API `/health` `200`, API `/ready` `200`, Web `/` `200`, Web `/api/build-info` `200`, unauthenticated `/workers/ready` `401`.
- Read-only Coolify projection: project `Soar`, environment `production`, six applications, PostgreSQL, Redis, zero generic services, `17` visible global resource rows.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-linux-vps-setup-guide.md`, `docs/operations/post-deploy-smoke-checklist.md`, current Ops state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; topology unchanged.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API/Web public checks are green; unauthenticated worker readiness fails closed with `401`.
- Smoke steps updated: no.
- Rollback note: no rollback path exercised; rollback remains a separate release permit if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report

- Task summary: verified Soar production public API/Web deploy health and Coolify production topology for [LUC-2465](/LUC/issues/LUC-2465).
- Files changed:
  - `history/evidence/luc-2465-coolify-production-deploy-health-sweep-2026-06-06.md`
  - `history/tasks/luc-2465-coolify-production-deploy-health-sweep-2026-06-06-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: public no-workers deploy smoke, Node public status probes, Coolify env-check tests, read-only Coolify projection.
- What is incomplete: protected account/dashboard/worker readiness, SLO, rollback, and live runtime proof remain outside this read-only health sweep.
- Next steps: use a separate protected release proof lane for authenticated worker/dashboard/account evidence; use a separate release mutation permit for deploy/restart/rollback.
- Decisions made: treated current `origin/main`/production build-info SHA as deployed source because it matches local `HEAD`.
