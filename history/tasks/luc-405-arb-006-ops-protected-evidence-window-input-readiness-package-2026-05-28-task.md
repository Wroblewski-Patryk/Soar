# Task

## Header
- ID: LUC-405
- Title: [Soar][ARB-006][Ops] Coordinate protected evidence window and input readiness package
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Priority: critical
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: IN_PROGRESS_PROD_STACK_DEPLOY

## Context
Wake payload assigned `LUC-405` with no pending comments and required actionable progress. This lane must publish a protected-evidence readiness package for the current production candidate and leave a clear disposition.

## Goal
Produce a current, no-secret readiness package for protected evidence execution, tied to the current expected SHA and explicit blocker ownership.

## Scope
- Read-only production checks on canonical Soar domains.
- Protected input readiness sweep with dated artifacts.
- Operator packet consistency check.
- Durable ops package + issue task artifact.

## Constraints
- No deploy/restart/rollback/runtime mutation.
- No secret value printing.
- No fake protected proof claims.

## Implementation Plan
1. Run canonical deploy smoke for expected SHA and capture fail-closed status.
2. Run protected-input readiness sweep to dated JSON/Markdown outputs.
3. Validate current operator unblock packet consistency.
4. Publish LUC-405 ops package with blockers and exact owner/actions.

## Acceptance Criteria
- [x] Canonical production smoke executed for expected SHA.
- [x] Protected-input readiness artifact generated for 2026-05-28.
- [x] Operator unblock packet check executed.
- [x] Durable LUC-405 package saved in `history/artifacts/`.
- [x] Final issue disposition and unblock contract documented.

## Definition of Done
- [x] Evidence package exists and is no-secret.
- [x] Status is explicit (`done` or `blocked`) with named unblock owners.
- [x] Residual risk is tied to concrete verification gaps, not generic notes.

## Forbidden
- No production mutation.
- No credential exposure.
- No status inflation from public-only checks.

## Validation Evidence
- `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
  - PASS: `API /health`, `API /ready`, `WEB /`, `WEB /api/build-info`
  - FAIL: `API /workers/ready -> 401`
- `corepack pnpm run -s ops:protected-inputs:check -- --today 2026-05-28 --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8 --git-ref main --json-output history/artifacts/v1-protected-input-readiness-71b8d503-2026-05-28.json --markdown-output history/evidence/v1-protected-input-readiness-71b8d503-2026-05-28.md`
  - Result: `PARTIAL`
  - Matching protected names: `9`
  - Missing families remain for `LIVEIMPORT_READBACK`, `ROLLBACK_GUARD`, `SOAR_PROD`, `PROD_DB_CHECK` / `PRODUCTION_DB_CHECK`, `RC`, `GATE`.
- `corepack pnpm run -s ops:operator-unblock:check`
  - Result: `PASS`
  - `Status NO-GO: yes`
  - `Protected input evidence matches packet: yes`

## Result Report
- Published package:
  - `history/artifacts/luc-405-protected-evidence-window-input-readiness-2026-05-28.json`
- Final disposition for this heartbeat: `blocked`.
- First-class blockers:
  1. Protected worker readiness auth boundary (`/workers/ready -> 401`) still requires approved read-only principal/session from auth credential + security owners.
  2. Protected evidence families are incomplete despite packet structure validity; release-controller/Ops/QA/Security inputs remain required.
- Deploy impact: none.
- Residual risk: release-proof chain can be overclaimed if public smoke is treated as protected readiness.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - published executable window packet for parent unblock routing:
    - `history/releases/luc-405-arb-006-protected-evidence-window-packet-2026-05-28.md`
  - packet includes exact proposed window (`2026-05-30 09:00-11:00 Europe/Berlin`), owner matrix, pre-window required inputs, fail-closed execution sequence, no-mutation safety gate, and parent unblock checklist.
- Final disposition for this continuation heartbeat: `blocked`.
- Unblock owner/action unchanged:
  1. Soar auth credential owner + Security/Test owner provide approved read-only principal/session for `GET /workers/ready`.
  2. Ops + QA + Security + release controller complete missing protected evidence families and approve window execution.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-28, CTO lane)
- Wake payload acknowledged first: no pending comments (`0/0`), `fallbackFetchNeeded=false`, issue remains dependency-blocked.
- Concrete action in this heartbeat:
  - revalidated executable window packet contract in `history/releases/luc-405-arb-006-protected-evidence-window-packet-2026-05-28.md` against current blocker chain,
  - confirmed no production-mutation steps are present and fail-closed sequencing remains explicit,
  - synchronized durable issue-task evidence with named unblock owner/action/date.
- Final disposition for this heartbeat: `blocked`.
- First-class unblock owner/action:
  1. Soar auth credential owner + Security/Test owner: deliver approved read-only principal/session for `GET /workers/ready` before `2026-05-30 08:30 Europe/Berlin`.
  2. Ops Release Lead + QA + Security + release controller: approve and execute window `ARB6-WIN-2026-05-30-A` (`2026-05-30 09:00-11:00 Europe/Berlin`) in read-only mode and publish parent unblock note on `LUC-402`.
- Paperclip control-plane note:
  - This runtime does not expose Paperclip issue-update API tools; status/comment sync must be applied by the board-integrated runner or PM lane using the same evidence packet paths.
