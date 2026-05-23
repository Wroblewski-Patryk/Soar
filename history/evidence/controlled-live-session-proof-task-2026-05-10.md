# Task

## Header
- ID: CONTROLLED-LIVE-SESSION-PROOF-2026-05-10
- Title: Capture controlled LIVE runtime session proof with no-order guard
- Task Type: release
- Current Stage: planning
- Status: READY
- Owner: Ops/Release
- Depends on:
  - LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10
  - LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10
- Priority: P0
- Iteration: 2026-05-10-controlled-live-proof
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER because this is protected production proof.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Production now has a process-level no-order guard for LIVE runtime decisions.
`LIVEIMPORT-03` remains blocked because the configured LIVE bot has no running
runtime session.

This planning slice now also has a guarded runner,
`pnpm run ops:live:controlled-proof`, that checks build-info, requires the
protected no-order guard to be fully active, refuses already-active LIVE bots,
and deactivates the target bot after the evidence attempt.

## Goal
Run a short, controlled LIVE bot observation window with the no-order guard
active, collect `LIVEIMPORT-03` readback, deactivate the bot, and preserve
redacted evidence.

## Scope
- Production app account only.
- Existing LIVE Binance Futures bot only.
- Existing `LIVEIMPORT-03` collector only.
- No exchange order placement is intended or approved.
- No strategy, wallet, market, or API-key edits.

## Implementation Plan
1. Reconfirm production build-info is `b1391526` or newer intended target.
2. Reconfirm `/ready/details` reports
   `runtimeSafety.liveNoOrderGuard.active=true`.
3. Reconfirm preactivation `LIVEIMPORT-03` status is `NO_RUNNING_SESSION`.
4. Run `pnpm run ops:live:controlled-proof -- --dry-run ...` to inspect the
   redacted command plan.
5. Activate the existing LIVE bot for a bounded observation window only after
   explicit operator approval by rerunning the guarded command with
   `--i-understand-live-risk`.
6. Wait for a running runtime session.
7. Run `LIVEIMPORT-03` with the current expected SHA and output artifact.
8. Deactivate the bot regardless of readback result.
9. Verify no running sessions remain or record a fail-closed blocker.
10. Keep Coolify no-order flags active until the operator explicitly chooses to
   clear them for real trading.

## Acceptance Criteria
- No-order guard is confirmed active immediately before activation.
- LIVE bot is active only for the observation window.
- `LIVEIMPORT-03` produces a redacted artifact.
- Bot is deactivated after the attempt.
- Any failure is recorded fail-closed and does not claim V1 readiness.

## Definition of Done
- [ ] Explicit operator approval for controlled LIVE activation is present.
- [ ] Pre-activation guard and no-running-session evidence are fresh.
- [x] Guarded command path exists and defaults to no activation unless risk
  acknowledgement is supplied.
- [ ] Controlled activation/readback/deactivation evidence is captured.
- [ ] Source-of-truth files are updated.
- [ ] Residual risk and next step are documented.

## Forbidden
- Do not activate a LIVE bot without explicit operator approval for this step.
- Do not submit manual orders.
- Do not disable or clear the no-order guard before the proof completes.
- Do not leave the bot active after the observation window.
- Do not expose tokens, passwords, API keys, or raw production identifiers.

## Validation Evidence
- Tests: not applicable before activation.
- Manual checks:
  - Production no-order guard evidence:
    `history/plans/live-runtime-no-order-guard-prod-b1391526-2026-05-10.md`.
  - Preactivation readback artifact:
    `history/artifacts/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.
- Screenshots/logs: not applicable.
- High-risk checks: activation is pending explicit operator approval.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/v1-production-activation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: yes, explicit controlled LIVE activation
  approval.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not expected.

## Deployment / Ops Evidence
- Deploy impact: none for this planning slice.
- Env or secret changes: none; no-order flags are already active.
- Health-check impact: none.
- Smoke steps updated: existing operator runbook already requires
  `/ready/details` guard confirmation.
- Rollback note: deactivate bot; keep no-order guard active.
- Observability or alerting impact: `LIVEIMPORT-03` and runtime session
  telemetry are the proof surfaces.
- Staged rollout or feature flag: `RUNTIME_LIVE_GLOBAL_KILL_SWITCH=true` and
  `RUNTIME_LIVE_EMERGENCY_STOP=true` are already active in production.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LIVEIMPORT-03` remains blocked by no running LIVE session.
- Gaps: controlled activation has not been approved or executed.
- Inconsistencies: none; safety preconditions are now current.
- Architecture constraints: fail closed, redacted evidence, no hidden bypasses.

### 2. Select One Priority Task
- Selected task: controlled LIVE session proof.
- Priority rationale: it is the remaining protected runtime proof lane.
- Why other candidates were deferred: broader V1 sign-off depends on this
  runtime evidence.

### 3. Plan Implementation
- Files or surfaces to modify: guarded ops script, runbook, evidence and state
  files after execution.
- Logic: guarded activation, readiness checks, readback, guaranteed
  deactivation.
- Edge cases: if no session starts, deactivate and record `NO_RUNNING_SESSION`.

### 4. Execute Implementation
- Implementation notes: guarded command path added; actual LIVE activation is
  still pending explicit operator approval.

### 5. Verify and Test
- Validation performed: preactivation read-only `LIVEIMPORT-03` check.
- Result: expected `NO_RUNNING_SESSION`.

### 6. Self-Review
- Simpler option considered: activate immediately from UI. Deferred because the
  task needs a written bounded proof plan and explicit approval.
- Technical debt introduced: no
- Scalability assessment: reuses existing ops collector and readiness surface.
- Refinements made: guard confirmation is a hard prerequisite.

### 7. Update Documentation and Knowledge
- Docs updated: this task.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this planning slice.
- [x] Operation mode was selected according to risk.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached for planning.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Planning and preactivation evidence are ready. Production guard is active, and
the configured LIVE Binance Futures bot still has no running runtime session.
The guarded operator command is available, but the next step remains explicit
operator-approved controlled LIVE activation.
