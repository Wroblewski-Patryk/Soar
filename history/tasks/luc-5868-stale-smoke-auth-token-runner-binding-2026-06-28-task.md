# Task

## Header
- ID: LUC-5868
- Title: Rotate or remove stale SMOKE_AUTH_TOKEN runner binding
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: [LUC-5866](/LUC/issues/LUC-5866)
- Priority: P1
- Module Confidence Rows: production protected smoke, runner auth binding
- Requirement Rows: protected smoke uses valid auth path, stale token does not
  create false-negative release evidence
- Quality Scenario Rows: fail-closed security, release verification reliability
- Risk Rows: stale smoke token
- Iteration: 2026-06-28 SPA heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5868-STALE-SMOKE-AUTH-TOKEN-BINDING-2026-06-28
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is skipped.
- [x] Exactly one priority task is selected from the scoped wake.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence, requirement, quality, and risk rows were
      identified.
- [x] This task improves release confidence by preventing false-negative
      protected smoke evidence.

## Mission Block
- Mission objective: verify whether stale `SMOKE_AUTH_TOKEN` remains injected
  and either remove/rotate it or document the first-class blocker.
- Release objective advanced: protected smoke reliability.
- Included slices: runner env presence check, no-secret secret-management
  access check, current-binding smoke, fresh-login smoke, source-of-truth
  update, issue disposition.
- Explicit exclusions: token disclosure, secret value readback, production
  account mutation, deploy, restart, rollback execution, DB/Redis mutation,
  exchange mutation, order, position, or live-trading action.
- Checkpoint cadence: single Security heartbeat.
- Stop conditions: secret-management path denied or production smoke indicates
  broader app outage.
- Handoff expectation: issue blocked only if the approved secret path is not
  available to this role.

## Context

Repeated DRE checks, including [LUC-5866](/LUC/issues/LUC-5866), showed that
the pre-bound `SMOKE_AUTH_TOKEN` fails protected `/workers/ready` with `401`,
while fresh-login auth passes. This is fail-closed, but it causes repeated
false-negative first-pass smoke evidence.

## Goal

Confirm whether the stale token binding remains injected and close the issue
only if it can be removed/rotated or intentionally replaced by fresh-login
runner behavior.

## Success Signal
- User or operator problem: DRE/Ops smoke no longer fails first pass because of
  stale token binding.
- Expected product or reliability outcome: protected smoke uses a valid,
  least-privilege auth path.
- How success will be observed: current-binding smoke no longer fails due to
  stale `SMOKE_AUTH_TOKEN`, or the binding is intentionally absent.
- Post-launch learning needed: no.

## Deliverable For This Stage

Redacted verification packet plus blocked disposition naming the owner/action
required to mutate the secret binding.

## Constraints
- Use existing smoke helpers.
- Do not print, store, commit, or infer secret values.
- Do not mutate production or live accounts.
- Do not bypass the approved secret-management path.

## Definition of Done
- [x] Confirmed current runner still has a pre-bound `SMOKE_AUTH_TOKEN`.
- [x] Verified current-binding smoke still fails closed with `401`.
- [x] Verified fresh-login smoke passes after process-local token clear.
- [x] Confirmed this role lacks secret-management access to rotate/remove the
      binding.
- [x] Recorded blocker owner/action and evidence.

## Stage Exit Criteria
- [x] Verification output is redacted.
- [x] No secret values are exposed.
- [x] Issue disposition is explicit.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    -> `FAIL` only on protected `API /workers/ready -> status 401`.
  - `$env:SMOKE_AUTH_TOKEN=''; pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    -> `PASS`, including protected `API /workers/ready -> 200`.
- Manual checks:
  - runner env name presence showed `SMOKE_AUTH_TOKEN=PRESENT(len=36)` without
    printing value.
  - Paperclip secret metadata commands returned `403`, so this role cannot
    rotate/remove the central binding.
- Screenshots/logs: not applicable.
- High-risk checks: secret value was not disclosed; no production mutation.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: post-deploy smoke checklist and existing smoke
  helper contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none. Only process-local `SMOKE_AUTH_TOKEN` was
  cleared for one verification command.
- Health-check impact: public API/Web passed; protected workers readiness
  passes through fresh-login auth.
- Smoke steps updated: no.
- Rollback note: no rollback action; scope did not require rollback guard.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Scoped wake assigned [LUC-5868](/LUC/issues/LUC-5868).
- Parent [LUC-5866](/LUC/issues/LUC-5866) showed stale-token `401` and
  fresh-login `200`.

### 2. Select One Priority Mission Objective
- Selected task: stale `SMOKE_AUTH_TOKEN` runner binding cleanup.
- Other work deferred because the wake is issue-scoped.

### 3. Plan Implementation
- Verify binding presence without values.
- Run current-binding smoke.
- Run fresh-login smoke after process-local token clear.
- Check whether this role can access approved secret-management metadata.

### 4. Execute Implementation
- No code, deploy, restart, account, exchange, or secret mutation was
  performed.

### 5. Verify and Test
- Current-binding smoke reproduces the stale-token `401`.
- Fresh-login smoke passes protected workers readiness.
- Secret-management commands are denied to this role with `403`.

### 6. Self-Review
- Existing smoke helper was reused.
- No workaround or duplicate logic was introduced.
- The issue is blocked because the requested mutation is outside this role's
  permissions.

### 7. Update Documentation and Knowledge
- Evidence and task packet created.
- State/context/risk summaries updated.

## Review Checklist
- [x] Process self-audit completed before closure.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context were updated.

## Result Report

- Task summary: stale `SMOKE_AUTH_TOKEN` binding remains injected and still
  causes first-pass protected smoke failure; fresh-login auth passes.
- Files changed:
  - `history/evidence/luc-5868-stale-smoke-auth-token-runner-binding-2026-06-28.md`
  - `history/tasks/luc-5868-stale-smoke-auth-token-runner-binding-2026-06-28-task.md`
  - source-of-truth state/context summaries
- How tested: current-binding production deploy smoke, fresh-login production
  deploy smoke, no-secret secret-management access check.
- What is incomplete: central runner secret binding rotation/removal.
- Next steps: [LUC-5869](/LUC/issues/LUC-5869), assigned to
  [10 CLO](/LUC/agents/10-clo-chief-legal-officer), removes or rotates the
  binding through the approved encrypted secret path, then reruns
  current-binding smoke.
- Decisions made: keep [LUC-5868](/LUC/issues/LUC-5868) blocked rather than
  claiming cleanup without secret-management authority.
