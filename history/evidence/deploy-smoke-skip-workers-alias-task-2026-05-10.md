# Task

## Header
- ID: DEPLOY-SMOKE-SKIP-WORKERS-ALIAS-2026-05-10
- Title: Accept skip-workers alias in deploy smoke runner
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on:
- Priority: P1
- Iteration: 2026-05-10-deploy-smoke-alias
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this small tooling iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The production smoke runner supports public deploy checks with workers skipped
via `--no-workers`. During the latest deploy verification, `--skip-workers`
was used and the runner still checked protected `/workers/health`, producing a
false failure on the expected `401`.

## Goal
Make `--skip-workers` a supported alias for `--no-workers` so deploy smoke
verification is less brittle and future operators avoid the same false alarm.

## Scope
- `scripts/deploySmokeCheck.mjs`
- deployment/task state docs
- no API, Web, DB, runtime, or trading behavior changes

## Implementation Plan
1. Add `--skip-workers` as an alias in `deploySmokeCheck.mjs`.
2. Update help output to document both flags.
3. Validate syntax, help, and production public smoke with the alias.
4. Update source-of-truth state files.

## Acceptance Criteria
- `--no-workers` behavior remains unchanged.
- `--skip-workers` skips protected worker checks.
- Public production smoke with `--skip-workers` passes API `/health`, API
  `/ready`, and Web `/`.
- Repository guardrails and docs parity pass.

## Definition of Done
- [x] Code change is scoped and reversible.
- [x] Validation evidence is captured.
- [x] Source-of-truth files are updated.
- [x] No secrets or protected identifiers are exposed.

## Forbidden
- Do not change default smoke behavior.
- Do not make protected worker checks optional by default.
- Do not downgrade authenticated worker health requirements.

## Validation Evidence
- Tests:
  - `node --check scripts\deploySmokeCheck.mjs` PASS.
  - `node scripts\deploySmokeCheck.mjs --help` PASS.
  - `node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers` PASS after approved network escalation; the sandboxed first attempt returned `fetch failed` for all public targets.
  - `node scripts\repoGuardrails.mjs` PASS.
  - `node scripts\checkDocsParity.mjs` PASS.
  - `git diff --check` PASS with line-ending warnings only.
- Manual checks: help output documents `--no-workers|--skip-workers`.
- Screenshots/logs: command output captured in terminal.
- High-risk checks: no live-money, auth, or trading action performed.

## Architecture Evidence
- Architecture source reviewed: deployment and ops runbooks.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low, operator tooling only.
- Env or secret changes: none.
- Health-check impact: public smoke alias only; default worker health remains
  checked unless skipped explicitly.
- Smoke steps updated: alias documented in help and state docs.
- Rollback note: remove the alias check if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: unsupported alias caused a false protected worker smoke failure.
- Gaps: tool did not accept a commonly used skip wording.
- Inconsistencies: learning journal recorded the pitfall, but tool still
  allowed repeat mistakes.
- Architecture constraints: keep public and protected smoke paths distinct.

### 2. Select One Priority Task
- Selected task: deploy smoke alias fix.
- Priority rationale: improves deploy verification confidence without touching
  runtime behavior.
- Why other candidates were deferred: controlled LIVE activation still needs
  explicit operator approval.

### 3. Plan Implementation
- Files or surfaces to modify: smoke runner and state docs.
- Logic: treat `--skip-workers` exactly like `--no-workers`.
- Edge cases: default behavior must continue checking workers.

### 4. Execute Implementation
- Implementation notes: added alias and help text.

### 5. Verify and Test
- Validation performed: syntax, help, production public smoke, guardrails, docs
  parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only remember to use `--no-workers`; rejected
  because the recurring pitfall already happened again.
- Technical debt introduced: no
- Scalability assessment: keeps one smoke tool and one skip contract.
- Refinements made: help now exposes both accepted flags.

### 7. Update Documentation and Knowledge
- Docs updated: task, state, project queue.
- Context updated: yes.
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration risk.
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
- Task summary: `deploySmokeCheck.mjs` now accepts `--skip-workers` as an alias
  for `--no-workers`.
- Files changed: smoke runner, task/state/context docs.
- How tested: syntax/help/public production smoke/guardrails/docs parity/diff.
- What is incomplete: protected worker smoke still requires auth, by design.
- Next steps: continue controlled LIVE proof only after explicit operator
  approval.
- Decisions made: default worker health check remains enabled.
