# Task

## Header
- ID: LUC-6066
- Title: Mutate central SMOKE_AUTH_TOKEN secret binding
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: 00 AIA
- Depends on: [LUC-6065](/LUC/issues/LUC-6065)
- Priority: P0
- Module Confidence Rows: deployment/protected smoke
- Requirement Rows: protected readiness smoke
- Quality Scenario Rows: security, operations
- Risk Rows: stale protected smoke credential binding
- Iteration: 2026-06-28
- Operation Mode: BUILDER
- Mission ID: LUC-6066-MUTATE-CENTRAL-SMOKE-AUTH-TOKEN-BINDING-2026-06-28
- Mission Status: VERIFIED

## Context
[LUC-6037](/LUC/issues/LUC-6037) proved the pre-bound `SMOKE_AUTH_TOKEN`
caused protected `/workers/ready` smoke to fail closed with `401`, while
fresh-login smoke passed after process-local token clearing. [LUC-6065](/LUC/issues/LUC-6065)
routed the actual central mutation to a board-capable owner path.

## Goal
Remove or rotate the central `SMOKE_AUTH_TOKEN` binding without exposing
secret values, then unblock DRE/QA to rerun current-binding protected smoke.

## Scope
- Paperclip agent adapter environment bindings only.
- Metadata/name-only secret and agent config readback.
- No secret value readback, no deploy, no restart, no production account
  mutation, no exchange/live-trading mutation, no app code changes.

## Implementation Plan
1. Read [LUC-6066](/LUC/issues/LUC-6066) heartbeat context.
2. Confirm the current AIA runner does not receive `SMOKE_AUTH_TOKEN`.
3. Identify remaining central agent env bindings by env-key name only.
4. Remove only `SMOKE_AUTH_TOKEN` from affected agent `adapterConfig.env`.
5. Preserve `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` so smoke can use the
   approved fresh-login path.
6. Verify readback and update issue/source-of-truth state.

## Acceptance Criteria
- No affected agent config still contains `SMOKE_AUTH_TOKEN`.
- Login fallback bindings remain present where they existed.
- No secret values are printed or written.
- [LUC-6065](/LUC/issues/LUC-6065) is unblocked for DRE/QA current-binding
  protected smoke recheck.

## Definition of Done
- [x] Binding source handled by metadata/name only.
- [x] Central `SMOKE_AUTH_TOKEN` agent bindings removed.
- [x] Readback proves absence from affected agent configs.
- [x] No deploy/restart/account/exchange/live-trading mutation occurred.

## Forbidden
- Print or persist secret values.
- Delete the underlying audit-token secret.
- Remove `SMOKE_AUTH_EMAIL` or `SMOKE_AUTH_PASSWORD` fallback bindings.
- Deploy, restart, roll back, or mutate production accounts.
- Treat process-local env clearing as central rotation.

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks:
  - `GET /api/issues/{LUC-6066}/heartbeat-context` returned current blocker
    context and [LUC-6065](/LUC/issues/LUC-6065) dependency.
  - `GET /api/companies/{companyId}/secrets/metadata` returned metadata only;
    no standalone `SMOKE_AUTH_TOKEN` secret was present by name.
  - Current AIA process env readback showed `SMOKE_AUTH_TOKEN`,
    `SMOKE_AUTH_EMAIL`, and `SMOKE_AUTH_PASSWORD` absent.
  - Company agent config readback found five agents with
    `SMOKE_AUTH_TOKEN`: CTO, DRE, SPM, SPA, and IPM.
  - First full-config replacement attempt failed closed with `403` because it
    included protected instruction-bundle keys.
  - Narrow `adapterConfig.env` patch removed `SMOKE_AUTH_TOKEN` from those
    five agents.
  - Final agent config readback showed no `SMOKE_AUTH_TOKEN` binding remains
    on those agents; `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` remain.
  - [LUC-6066](/LUC/issues/LUC-6066) completion auto-woke
    [LUC-6065](/LUC/issues/LUC-6065) into a CTO `in_progress` run. Direct
    parent issue patch by AIA was rejected with authorization boundary `403`,
    so the first-class child-completion wake is the valid unblock path.
- High-risk checks: no secret value readback, no production deploy/restart,
  no account/API-key/subscription/exchange/live-trading mutation.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable; requirement now needs smoke
  recheck evidence before full verification.
- Risk register updated: yes.
- Reality status: implemented, not verified by downstream smoke.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: Paperclip agent env binding mutation only; underlying
  secret records were not deleted, rotated, or value-read.
- Health-check impact: future assigned DRE/QA runs should no longer receive
  stale `SMOKE_AUTH_TOKEN` and should fall back to fresh login.
- Smoke steps updated: no.
- Rollback note: restore the prior agent env binding from Paperclip agent
  config revision history if the fallback smoke path unexpectedly regresses.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: stale token caused false-negative protected smoke; central binding
  survived on specialist agent configs, not on the current AIA process.
- Gaps: no replacement token was available, so rotation was not appropriate.
- Inconsistencies: AIA had no token while CTO/DRE/SPM/SPA/IPM still did.
- Architecture constraints: use Paperclip secret/agent config management only.

### 2. Select One Priority Mission Objective
- Selected task: remove stale `SMOKE_AUTH_TOKEN` central agent binding.
- Priority rationale: release-critical protected smoke gate.
- Why other candidates were deferred: deploy, restart, and app-code changes do
  not address the stale Paperclip runtime binding.

### 3. Plan Implementation
- Files or surfaces to modify: Paperclip agent `adapterConfig.env`; local
  task/state evidence.
- Logic: remove token key only, preserve email/password login fallback.
- Edge cases: avoid deleting underlying token secret or instruction config.

### 4. Execute Implementation
- Implementation notes: first full replacement was rejected by Paperclip
  instruction-config guard; the accepted patch was limited to env bindings.

### 5. Verify and Test
- Validation performed: metadata-only secret readback, agent config readback,
  env-key absence readback.
- Result: no remaining `SMOKE_AUTH_TOKEN` agent env binding was found.

### 6. Self-Review
- Simpler option considered: rotate underlying token secret.
- Technical debt introduced: no.
- Scalability assessment: removing the env binding avoids stale-token
  precedence while keeping approved fresh-login credentials.
- Refinements made: changed from full adapter config replacement to narrow env
  patch after the server guard rejected protected instruction-key mutation.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence file plus active state ledgers.
- Context updated: project state, task board, active mission, next steps,
  module confidence, risk register.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report
- Task summary: removed the central `SMOKE_AUTH_TOKEN` env binding from CTO,
  DRE, SPM, SPA, and IPM Paperclip agent configs while preserving
  `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD`.
- Files changed:
  `history/tasks/luc-6066-mutate-central-smoke-auth-token-secret-binding-2026-06-28-task.md`
  plus state/context ledgers.
- How tested: metadata-only Paperclip readback and final agent env-key
  readback.
- What is incomplete: DRE/QA still needs to rerun current-binding protected
  smoke in a fresh wake/process to prove `/workers/ready -> 200`.
- Next steps: [LUC-6065](/LUC/issues/LUC-6065) is live again with CTO after
  child completion; CTO should route DRE/QA current-binding smoke verification.
- Decisions made: remove stale token binding rather than rotate, because no
  replacement token value was supplied and fresh login is the proven path.
