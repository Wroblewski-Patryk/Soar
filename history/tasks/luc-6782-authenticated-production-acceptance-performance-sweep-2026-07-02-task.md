# Task

## Header
- ID: LUC-6782
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: Production Auth, Dashboard, Admin, Runtime Worker Readiness
- Requirement Rows: production acceptance, protected auth proof, deploy smoke, rollback guard
- Quality Scenario Rows: production availability, runtime freshness, authenticated route reachability
- Risk Rows: production Web 503, workers readiness 503, rollback guard action required
- Iteration: 2026-07-02 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-6782-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-07-02`
- Mission Status: BLOCKED

## Context
Recurring QVE production acceptance gate for Soar. Prior same-day DRE/QVE
evidence showed production Web/build-info and protected workers readiness at
`503`; this task refreshed that signal for the current issue before any
acceptance claim.

## Goal
Run the smallest read-only production acceptance and performance sweep that can
prove whether authenticated production acceptance is currently executable.

## Scope
- Production API: `https://api.soar.luckysparrow.ch`
- Production Web: `https://soar.luckysparrow.ch`
- Scripts:
  - `scripts/deploySmokeCheck.mjs`
  - `scripts/checkPostDeployRuntimeFreshness.mjs`
  - `scripts/evaluateRollbackGuard.mjs`
  - `scripts/runProdUiModuleClickthroughAudit.mjs`
  - `scripts/runProdAuthSessionBrowserProof.mjs`
- Evidence:
  - `history/evidence/luc-6782-authenticated-production-acceptance-performance-sweep-2026-07-02.md`
  - `history/evidence/luc-6782-prod-ui-module-clickthrough-2026-07-02.md`
  - `history/artifacts/luc-6782-prod-ui-module-clickthrough-2026-07-02.json`

## Implementation Plan
1. Read the issue heartbeat context and confirm no new comments or blockers.
2. Confirm audit-login refs are available by name/length only.
3. Run deploy smoke against production Web/API.
4. Run runtime freshness and rollback guard.
5. Run production UI clickthrough with redacted audit-login mapping.
6. Attempt auth-session proof only after build-info check; record the blocker if
   build-info is unavailable.
7. Block the issue on the existing Ops restoration lane instead of duplicating a
   broad QA backlog.

## Acceptance Criteria
- Current production Web/API availability is measured.
- Protected workers readiness and rollback guard are measured.
- Authenticated clickthrough/auth proof is either run or blocked with exact
  precondition evidence.
- No secrets or production mutable state are exposed or changed.
- The issue receives a clear Paperclip disposition.

## Definition of Done
- [x] Current production smoke evidence recorded.
- [x] Runtime freshness and rollback guard evidence recorded.
- [x] UI/auth proof status recorded.
- [x] Existing unblock owner identified.
- [x] No product code, commit, push, deploy, or production mutation performed.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke` -> FAIL, Web/build-info/workers ready `503`
  - `pnpm run -s ops:deploy:runtime-freshness` -> PASS
  - `pnpm run -s ops:deploy:rollback-guard` -> FAIL with `shouldRollback=true`
  - `pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-02` -> FAIL, all audited Web route groups `503`
  - `pnpm run -s ops:prod-auth:proof -- --today 2026-07-02 --i-understand-production-auth-proof` -> FAIL before browser proof because build-info returned `503`
- Manual checks: Paperclip heartbeat-context readback for [LUC-6782](/LUC/issues/LUC-6782) returned `200`.
- Screenshots/logs: no screenshots captured; generated UI clickthrough Markdown and JSON artifacts are linked above.
- High-risk checks: no production writes, live-trading actions, account mutation, env mutation, or secret value readback.
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: API health/ready pass; Web/build-info and workers ready fail with `503`
- Smoke steps updated: no
- Rollback note: rollback guard returned `shouldRollback=true` for `workers_ready_endpoint_http_503`
- Observability or alerting impact: alerts endpoint returned no critical alerts during rollback guard

## Security / Privacy Evidence
- Data classification: production auth route metadata only; no response bodies with private data preserved.
- Trust boundaries: production Web/API, protected workers readiness, audit-login secret refs.
- Permission or ownership checks: QVE read-only verification lane only; Ops owns restoration/mutation.
- Secret handling: values never printed; only name/length and script-level `login:present` status recorded.
- Fail-closed behavior: acceptance blocked when Web/build-info and worker readiness are unavailable.
- Residual risk: full authenticated journey proof is still pending after production restoration.

## Result Report
- Task summary: current production acceptance remains blocked. API health,
  readiness, and runtime freshness pass, but production Web/build-info and
  protected workers readiness still return `503`; rollback guard requires
  action.
- Files changed:
  - `history/evidence/luc-6782-authenticated-production-acceptance-performance-sweep-2026-07-02.md`
  - `history/evidence/luc-6782-prod-ui-module-clickthrough-2026-07-02.md`
  - `history/artifacts/luc-6782-prod-ui-module-clickthrough-2026-07-02.json`
  - `history/tasks/luc-6782-authenticated-production-acceptance-performance-sweep-2026-07-02-task.md`
- How tested: commands listed under Validation Evidence.
- What is incomplete: full authenticated production acceptance and performance
  pass cannot run while Web/build-info and workers readiness return `503`.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves
  [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns the acceptance matrix.
- Decisions made: no duplicate broad QA issue was created because the blocker
  is already routed through [LUC-6331](/LUC/issues/LUC-6331).
