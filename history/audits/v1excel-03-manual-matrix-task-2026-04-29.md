# Task

## Header
- ID: V1EXCEL-03
- Title: Execute the full critical manual UI/API/operator matrix
- Task Type: qa
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: Codex Execution Agent
- Depends on: `V1EXCEL-02`
- Priority: P0

## Context
The repository rules require more than automated coverage before declaring
real-money `V1` excellent. The newest `LIVE` hardening candidate still needs a
manual operator pass across the affected `PAPER` and `LIVE` flows.

## Goal
Run and record the full critical operator matrix for manual order, manual
close, pending external order truth, DCA/protection behavior, and
restart/recovery truth, using real authenticated operator surfaces where they
are now available.

## Deliverable For This Stage
A canonical matrix that records:
- what was executed today,
- what remains manual-only,
- and the exact blocker preventing full operator execution from this session.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The required manual matrix is frozen explicitly
- [x] Executed automated and public-smoke evidence is linked
- [ ] The full authenticated operator matrix is executed end to end
- [x] Partial authenticated operator execution is recorded precisely
- [x] The remaining blockers are classified precisely instead of hand-waved

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run test:go-live:smoke`
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - public stage smoke PASS
  - public prod smoke PASS
- Manual checks:
  - authenticated production Soar login through the protected API
  - inspected real production bots and runtime sessions
  - executed one production `PAPER` manual same-side add against the active managed position
  - attempted one production `PAPER` manual close against the same managed position
- Screenshots/logs: not applicable
- High-risk checks:
  - refused to execute real `LIVE` exchange orders from this session
  - kept operator execution to `PAPER` while `LIVE` exchange authority remains unavailable

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

## Review Checklist (mandatory)
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

## Notes
This task is now partially unblocked. Authenticated `PAPER` operator execution
is available and has already surfaced one real repository drift
(`POSITION_CLOSE_PRICE_UNAVAILABLE` on manual close), while `LIVE` exchange
authority and real-UI confirmation remain incomplete.

## Production-Grade Required Contract

### Goal
Produce a manual operator evidence pack that can honestly support a real-money
trust claim.

### Scope
- operator matrix doc
- current public evidence references
- queue/context sync

### Implementation Plan
1. Enumerate the mandatory manual scenarios.
2. Record what can be executed from this session.
3. Classify the exact blocker for the remaining scenarios.
4. Leave the matrix ready for operator execution.

### Acceptance Criteria
- all required manual scenarios are listed explicitly
- already executed evidence is separated from still-missing manual proof
- the blocker is exact and actionable

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: partial, through automated go-live and public smoke
- Endpoint and client contract match: partial, through automated packs
- DB schema and migrations verified: yes, via local go-live smoke
- Loading state verified: not in a live operator browser session
- Error state verified: partial, through automated coverage
- Refresh/restart behavior verified: not manually in target operator flow
- Regression check performed: umbrella go-live smoke plus latest `LIVE` closure packs

## Result Report

- Task summary: advanced the manual matrix from a pure auth blocker to a
  partial authenticated production operator pass, recorded the first `PAPER`
  execution evidence, and captured the newly exposed manual-close drift
- Files changed: matrix doc, operator evidence doc, and canonical queue/context sync
- How tested:
  - `pnpm run test:go-live:smoke`
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - stage public smoke PASS
  - prod public smoke PASS
- What is incomplete:
  - real UI walkthrough for `PAPER`
  - fresh post-deploy confirmation for the pushed `PAPER` manual-close fix
  - all `LIVE` exchange-authority scenarios
- Next steps:
  - verify the fresh deploy closes the exposed `PAPER` manual-close drift
  - continue with the remaining `LIVE` and restart/recovery matrix items
