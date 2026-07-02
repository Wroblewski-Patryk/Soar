# Task

## Header
- ID: LUC-6894
- Title: Restore Production Runtime For Public Probe
- Task Type: release
- Current Stage: verification
- Status: REVIEW
- Owner: Ops/Release
- Depends on: board/Ops production mutation permit
- Priority: P0
- Module Confidence Rows: production runtime / deployment readiness
- Requirement Rows: production public route availability
- Quality Scenario Rows: reliability / availability
- Risk Rows: production Web unavailable; worker readiness degraded
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6894-PUBLIC-PROBE-RUNTIME-RESTORE-2026-07-02
- Mission Status: PARTIALLY_VERIFIED / IN_REVIEW

## Context

The scoped Paperclip wake assigned [LUC-6894](/LUC/issues/LUC-6894) to DRE for
a critical runtime gap: public probe `https://soar.luckysparrow.ch` returns
`503`.

## Goal

Diagnose the current runtime state, avoid unsafe production mutation, and leave
a concrete continuation path that can restore production only with an explicit
release/prod permit.

## Constraints

- Use existing smoke, runtime, rollback, and Coolify read-only mechanisms.
- Do not print, store, or attach secret values, cookies, tokens, raw resource
  ids, raw Coolify objects, or raw logs.
- Do not push, deploy, restart, roll back, edit DNS/proxy/env, mutate DB/Redis,
  mutate accounts, or change live-trading/exchange/payment state without an
  explicit production permit.
- Do not create duplicate runtime recovery issues while
  [LUC-6331](/LUC/issues/LUC-6331) remains the existing restoration lane.

## Definition of Done

- [x] Current public runtime probe status captured.
- [x] Coolify read-only projection captured without sensitive values.
- [x] Existing owner path checked.
- [x] A real continuation path exists for required production mutation.

## Forbidden

- Secret disclosure.
- Live account, subscription, payment, exchange, order, position, or trading
  mutation.
- Production restart/redeploy/rollback without explicit permit.
- Push or deploy from the dirty/divergent checkout.

## Validation Evidence

- Tests:
  - `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    -> `FAIL`, API `/health` and `/ready` pass, Web `/` and
    `/api/build-info` return `503`.
  - `corepack pnpm run -s ops:deploy:runtime-freshness` with production API
    base URL only -> `FAIL-CLOSED`, protected request returned `401`.
  - `corepack pnpm run -s ops:deploy:rollback-guard` with production API base
    URL only -> `shouldRollback=true`, protected checks returned `401`; no
    rollback executed.
- Manual checks:
  - Paperclip heartbeat context for [LUC-6894](/LUC/issues/LUC-6894) returned
    `200`.
  - Read-only Coolify projection returned `soar-web` and `workers-backtest` as
    `exited:unhealthy`.
  - [LUC-6331](/LUC/issues/LUC-6331) readback returned `blocked`; [LUC-6816](/LUC/issues/LUC-6816)
    remains blocked by [LUC-6331](/LUC/issues/LUC-6331).
- Screenshots/logs: none; no browser or raw log capture was needed.
- High-risk checks: no production mutation executed.
- Module confidence ledger updated: no; no module implementation changed.
- Requirements matrix updated: no; no requirement implementation changed.
- Quality scenarios updated: no; reliability state updated in project health.
- Risk register updated: no new risk class; existing production-runtime risk
  remains active.
- Reality status: blocked pending production mutation approval, represented as
  Paperclip `in_review` with a request-confirmation interaction.

## Deployment / Ops Evidence

- Deploy impact: none in this heartbeat.
- Env or secret changes: none.
- Health-check impact: public Web remains failing.
- Smoke steps updated: no.
- Rollback note: rollback guard indicates action is required, but no rollback
  was executed without approval.
- Observability or alerting impact: Coolify reports unhealthy application
  state for `soar-web` and `workers-backtest`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: public Web `503`, Web build-info `503`, Coolify `soar-web`
  unhealthy, `workers-backtest` unhealthy.
- Gaps: production mutation is required to restore or roll back affected
  resources.
- Inconsistencies: API health/readiness are healthy while Web is down.
- Architecture constraints: production mutation must follow Coolify release
  safety contract.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6894](/LUC/issues/LUC-6894) public-probe runtime restore
  diagnosis and permit handoff.
- Priority rationale: critical runtime finding blocks public availability.

### 3. Plan Implementation
- Files or surfaces to modify: scoped evidence/task/state only.
- Logic: run read-only smoke and Coolify projection; request mutation permit.
- Edge cases: avoid protected-secret readback and unauthorised mutation.

### 4. Execute Implementation
- Implementation notes: no product code changed.

### 5. Verify and Test
- Validation performed: public smoke, protected fail-closed boundary, Coolify
  read-only projection, Paperclip owner-path readback.
- Result: production not restored; permit requested.

### 6. Self-Review
- Simpler option considered: mark blocked on [LUC-6331](/LUC/issues/LUC-6331)
  only. Rejected because [LUC-6894](/LUC/issues/LUC-6894) explicitly requires
  a live continuation path for runtime restore.
- Technical debt introduced: no.
- Refinements made: used issue-thread confirmation as the live permit path.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task packet plus project state/task board/system
  health/active mission.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Current stage is declared and respected.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context were updated for the runtime truth change.

## Result Report

- Task summary: production remains unavailable for public Web; DRE diagnosed
  `soar-web` and `workers-backtest` as unhealthy and requested a narrow
  production mutation permit.
- Files changed:
  - `history/evidence/luc-6894-public-probe-runtime-restore-diagnosis-2026-07-02.md`
  - `history/tasks/luc-6894-public-probe-runtime-restore-diagnosis-2026-07-02-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: public deploy smoke, protected runtime fail-closed check,
  rollback guard fail-closed check, Coolify read-only projection, Paperclip
  readbacks.
- What is incomplete: production restore itself; restart/redeploy/rollback
  requires explicit permit.
- Next steps: board/Ops accepts or rejects the mutation confirmation on
  [LUC-6894](/LUC/issues/LUC-6894); on acceptance, DRE/Ops resumes with exact
  target resource/SHA/rollback/smoke plan.
- Decisions made: no duplicate recovery issue; [LUC-6331](/LUC/issues/LUC-6331)
  remains the historical recovery lane, while [LUC-6894](/LUC/issues/LUC-6894)
  now carries the live permit interaction for this wake.
