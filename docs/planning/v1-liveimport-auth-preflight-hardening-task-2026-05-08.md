# V1 Live Import Auth Preflight Hardening Task (2026-05-08)

## Header
- ID: V1-LIVEIMPORT-AUTH-PREFLIGHT-HARDENING-2026-05-08
- Title: Clarify live-import readback auth prerequisites on fail-closed path
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-DEPLOY-FRESHNESS-STATE-SYNC-2026-05-08
- Priority: P0
- Iteration: 33
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The deployed V1 backend/runtime candidate is current, but `LIVEIMPORT-03`
cannot be completed from this shell because production read-only auth is not
available. The collector correctly fails closed, but its missing-auth message
is too generic for an operator handoff.

## Goal
Make the existing `ops:liveimport:readback` fail-closed path name the exact
safe environment-variable options needed for production readback, without
printing secret values or writing a false evidence artifact.

## Success Signal
- User or operator problem: an operator knows exactly which auth variables are
  required to rerun `LIVEIMPORT-03`.
- Expected product or reliability outcome: faster protected evidence capture
  with no downgrade to public checks.
- How success will be observed: no-auth command exits non-zero with explicit
  env names and creates no output artifact.
- Post-launch learning needed: no

## Scope
- `scripts/collectLiveImportReadbackEvidence.mjs`
- `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- `.agents/state/next-steps.md`
- this task artifact

## Implementation Plan
1. Add one constant/operator-facing missing-auth message to the existing
   collector.
2. Reuse the existing auth resolution flow; do not add new auth paths.
3. Update final blocker/operator docs with the expected fail-closed message.
4. Validate help, dry-run, no-auth fail-closed output, no artifact creation,
   guardrails, docs parity, and diff check.

## Acceptance Criteria
- Missing auth error names `LIVEIMPORT_READBACK_AUTH_TOKEN` and the
  `LIVEIMPORT_READBACK_AUTH_EMAIL` + `LIVEIMPORT_READBACK_AUTH_PASSWORD`
  alternative.
- Optional private OPS auth env names are mentioned without values.
- The no-auth run exits non-zero before protected runtime readback.
- The requested output artifact is not written on missing auth.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this ops/docs scope.
- [x] Existing collector remains fail-closed.
- [x] Operator docs reflect the clarified failure path.
- [x] Relevant validation passes.

## Forbidden
- Printing secret values.
- Writing success evidence on missing auth.
- Adding new auth mechanisms or bypass paths.
- Running live-money or destructive production actions.

## Validation Evidence
- Tests:
  - `node --check scripts/collectLiveImportReadbackEvidence.mjs` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS with LF/CRLF warnings only
- Manual checks:
  - `pnpm run ops:liveimport:readback -- --help` => PASS
  - `pnpm run ops:liveimport:readback -- --dry-run --expected-sha 15fd537b --output docs/operations/_tmp-liveimport-auth-preflight.json` => PASS
  - no-auth readback with output path exited non-zero with the explicit env
    names and created no `_tmp-liveimport-auth-preflight.json` artifact
- Screenshots/logs: command output captured in terminal
- High-risk checks:
  - no secret values printed
  - no artifact written on missing auth
  - no live-money, exchange write, DB write, or destructive production action
    was used

## Architecture Evidence
- Architecture source reviewed: `.agents/core/operating-system.md`,
  `.agents/core/execution-loop.md`, final blocker pack.
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
- Rollback note: revert the script/docs commit if needed; no runtime behavior
  changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: protected readback is blocked by missing auth.
- Gaps: fail-closed message does not name the exact operator env choices.
- Inconsistencies: none in architecture; the blocker is access.
- Architecture constraints: fail closed, no secret output, reuse existing ops
  auth helpers.

### 2. Select One Priority Task
- Selected task: clarify `LIVEIMPORT-03` missing-auth preflight.
- Priority rationale: it is the smallest useful step toward the active V1
  blocker that does not require unavailable credentials.
- Why other candidates were deferred: actual `LIVEIMPORT-03`, restore drill,
  rollback proof, and final release gate require protected access not present
  in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: collector script, final blocker pack, next
  steps, task artifact.
- Logic: change only operator-facing error text.
- Edge cases: no artifact may be written on missing auth.

### 4. Execute Implementation
- Implementation notes: added one `MISSING_AUTH_MESSAGE` constant to the
  existing collector and reused the existing `resolveOpsAuthToken` flow.
  Updated operator docs and continuation state.

### 5. Verify and Test
- Validation performed: syntax check, help, dry-run, missing-auth fail-closed
  path, no-artifact check, guardrails, docs parity, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only final-message instruction; rejected because
  future operator handoff must live in repository state and CLI output.
- Technical debt introduced: no
- Scalability assessment: preserves one collector and one auth-helper path.
- Refinements made: kept the output purely to env variable names and help
  reference so no secret material can be exposed.

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
- Task summary: clarified the live-import readback missing-auth fail-closed
  path and operator docs.
- Files changed: `scripts/collectLiveImportReadbackEvidence.mjs`,
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`,
  `.agents/state/next-steps.md`, `.agents/state/system-health.md`,
  `.agents/state/known-issues.md`, `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`, `docs/planning/mvp-next-commits.md`, and
  this task artifact.
- How tested: syntax, help, dry-run, no-auth fail-closed/no-artifact,
  guardrails, docs parity, and diff check.
- What is incomplete: actual `LIVEIMPORT-03` remains blocked until approved
  production auth is available.
- Next steps: rerun authenticated read-only `ops:liveimport:readback` after
  build-info confirms deployed `HEAD`.
- Decisions made: keep a single collector/auth-helper path and improve only
  operator-facing failure clarity.
