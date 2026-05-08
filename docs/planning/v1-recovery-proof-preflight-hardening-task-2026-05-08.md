# V1 Recovery Proof Preflight Hardening Task (2026-05-08)

## Header
- ID: V1-RECOVERY-PROOF-PREFLIGHT-HARDENING-2026-05-08
- Title: Clarify production restore and rollback proof prerequisites
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-LIVEIMPORT-AUTH-PREFLIGHT-HARDENING-2026-05-08
- Priority: P0
- Iteration: 34
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
V1 still requires production restore drill and rollback proof evidence. This
shell lacks production DB/Coolify access and protected OPS auth, so the actual
proof runs cannot be completed here. The existing scripts fail safely, but the
operator handoff can be clearer about the exact environment-variable choices.

## Goal
Clarify production restore and rollback proof preflight messages and operator
docs without adding bypasses, changing runtime behavior, or writing fake PASS
evidence.

## Success Signal
- User or operator problem: operator can see the exact variables required for
  production restore and rollback proof.
- Expected product or reliability outcome: faster final V1 evidence capture
  once secrets/access are available.
- How success will be observed: missing-prerequisite runs fail closed with
  explicit env names and no secret values.
- Post-launch learning needed: no

## Scope
- `scripts/runBackupVerificationProfile.mjs`
- `scripts/runRollbackProofEvidence.mjs`
- `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- `.agents/state/next-steps.md`
- source-of-truth state/context docs
- this task artifact

## Implementation Plan
1. Add production DB env guidance to the existing backup verification profile.
2. Add rollback proof auth/env guidance to the rollback proof help and missing
   base-url failure path.
3. Update final blocker pack and continuation state with the clarified
   prerequisites.
4. Validate script syntax, help/fail-closed paths, guardrails, docs parity,
   and diff check.

## Acceptance Criteria
- Production restore missing-container error names `PROD_DB_CHECK_CONTAINER`
  and `PRODUCTION_DB_CHECK_CONTAINER`.
- Restore help names container, DB user, and DB name env choices.
- Rollback proof help names auth token/email/password and optional OPS envs.
- Missing-prerequisite output contains env names only, not values.

## Definition of Done
- [x] Existing scripts remain fail-closed.
- [x] Operator docs are updated.
- [x] Validation passes.
- [x] No protected or destructive production action is performed.

## Forbidden
- Printing secret values.
- Marking restore/rollback proof as PASS without real protected evidence.
- Adding new auth or DB access paths.
- Running destructive production actions.

## Validation Evidence
- Tests:
  - `node --check scripts/runBackupVerificationProfile.mjs` => PASS
  - `node --check scripts/runRollbackProofEvidence.mjs` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS with LF/CRLF warnings only
- Manual checks:
  - `node scripts/runBackupVerificationProfile.mjs --help` => PASS
  - `node scripts/runRollbackProofEvidence.mjs --help` => PASS
  - `node scripts/runBackupVerificationProfile.mjs --profile prod` with empty
    production container envs exits non-zero and names the accepted prod DB env
    choices
- Screenshots/logs: terminal output captured in this execution
- High-risk checks:
  - no secret values printed
  - no live-money, exchange write, DB write, migration, deploy action, or
    destructive production action was used

## Architecture Evidence
- Architecture source reviewed: final blocker pack, active state files,
  `.agents/core/execution-loop.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this docs/tooling commit if needed; no runtime change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recovery proof blockers require external production access.
- Gaps: operator-facing failure/help text can be more explicit.
- Inconsistencies: none in architecture.
- Architecture constraints: no bypass, no fake evidence, fail closed.

### 2. Select One Priority Task
- Selected task: recovery proof preflight hardening.
- Priority rationale: next open V1 blockers after `LIVEIMPORT-03` need exact
  production access prerequisites.
- Why other candidates were deferred: actual restore drill, rollback proof,
  and final non-dry-run release gate require unavailable access.

### 3. Plan Implementation
- Files or surfaces to modify: ops scripts and release docs/state.
- Logic: operator-facing messages only.
- Edge cases: preserve no-secret output.

### 4. Execute Implementation
- Implementation notes: updated existing help/error text only and reused
  existing restore/rollback proof command flows.

### 5. Verify and Test
- Validation performed: syntax checks, help paths, missing prod DB container
  fail-closed path, guardrails, docs parity, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: final answer only; rejected because future
  operator handoff must be recoverable from repository state.
- Technical debt introduced: no
- Scalability assessment: reuses existing scripts and env contracts.
- Refinements made: kept messages to variable names only and avoided values.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, planning queue, task artifact.
- Context updated: next steps, system health, known issues, project state,
  task board.
- Learning journal updated: not applicable.

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
- Task summary: clarified restore drill and rollback proof production
  prerequisite handoff.
- Files changed: `scripts/runBackupVerificationProfile.mjs`,
  `scripts/runRollbackProofEvidence.mjs`,
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`,
  `.agents/state/next-steps.md`, `.agents/state/system-health.md`,
  `.agents/state/known-issues.md`, `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`, `docs/planning/mvp-next-commits.md`, and
  this task artifact.
- How tested: syntax checks, help paths, missing prod DB container fail-closed
  path, guardrails, docs parity, and diff check.
- What is incomplete: actual restore drill and rollback proof still require
  approved production DB/Coolify and protected OPS auth access.
- Next steps: run the final blocker pack with real production access.
- Decisions made: keep existing proof tooling and improve only operator-facing
  prerequisite clarity.
