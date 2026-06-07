# LUC-2598 No-Stall Queue Expeditor

## Header
- ID: LUC-2598
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Parent: LUC-12
- Mission ID: LUC-2598-NO-STALL-QUEUE-EXPEDITOR-2026-06-07
- Mission Status: VERIFIED_COORDINATION

## Context
Paperclip woke the Soar Product Manager for [LUC-2598](/LUC/issues/LUC-2598)
with `issue_continuation_needed`, `fallbackFetchNeeded=false`, no pending comments, and
checkout already claimed by the harness. The issue contract required a strict
queue-expediting pass: inspect open Soar work, avoid duplicate PM churn, and
force one clear disposition or handoff without implementing code.

## Goal
Refresh the live Soar queue posture, identify any stalled active lanes, avoid
duplicate children, and close this PM heartbeat with durable evidence.

## Constraints
- Do not implement product code.
- Do not deploy, push, restart, roll back, edit env, access secrets, run
  protected smoke, mutate accounts, mutate exchange state, touch databases, or
  perform live-trading actions.
- Respect checked-out issue ownership and per-agent WIP.
- Preserve the existing dirty worktree.

## Implementation Plan
1. Read the PM role contract, Paperclip heartbeat contract, and Soar active
   mission/next-step state.
2. Fetch [LUC-2598](/LUC/issues/LUC-2598) heartbeat context.
3. Attempt the named control signal and janitor checks.
4. Read the live Soar non-terminal queue.
5. Create the next smallest safe worker lane if completed repair evidence
   exposes an unowned local-only proof gap.
6. Update source-of-truth notes and issue disposition.

## Acceptance Criteria
- Current queue count and active/review posture recorded.
- Any actionable stale lane receives a concrete disposition or named owner path.
- A new child is created only if it is not a duplicate and has a single owner,
  bounded scope, and local proof contract.
- This PM issue ends with a clear final disposition.

## Validation Evidence
- Paperclip heartbeat-context readback succeeded for
  [LUC-2598](/LUC/issues/LUC-2598).
- `corepack pnpm softwarehouse:control-tick` failed because the command is not
  exposed in this checkout (`Command "softwarehouse:control-tick" not found`).
- `scripts/run-live-run-janitor.mjs` is absent.
- `git status --short` shows a pre-existing dirty worktree dominated by prior
  Soar evidence/code artifacts; no push/deploy/destructive action was taken.
- Live Paperclip queue readback before delegation showed no open duplicate for
  `hardRedirect` or `normalizeFormBaseCurrency`.
- Current architecture-awareness report generated
  `2026-06-06T23:01:39.171Z` lists the next top actionable missing-test family:
  `apps/web/src/lib/api.ts#hardRedirect`,
  `apps/web/src/lib/api.ts#isProtectedRoute`,
  `apps/web/src/lib/forms.ts#hasFormText`,
  `apps/web/src/lib/forms.ts#normalizeFormBaseCurrency`,
  `apps/web/src/lib/forms.ts#normalizeFormSymbol`, and
  `apps/web/src/lib/forms.ts#normalizeFormText`.
- Created [LUC-2601](/LUC/issues/LUC-2601) as a child issue assigned to
  `09 FEW (Frontend Web Engineer)` for local Web utility/form test coverage
  and scanner-readable architecture relation repair.
- [LUC-2601](/LUC/issues/LUC-2601) readback immediately showed `in_progress`,
  giving the PM checkpoint a real live continuation path outside this issue.

## Result Report
- Queue disposition: delegated the next safe local evidence lane to
  [LUC-2601](/LUC/issues/LUC-2601), owned by Frontend Web.
- Active lane disposition: [LUC-2601](/LUC/issues/LUC-2601) is the live
  continuation path for Web API/form utility missing-test links. This PM issue
  is complete after delegation and source-of-truth sync.
- Review lanes: [LUC-2558](/LUC/issues/LUC-2558) and
  [LUC-1397](/LUC/issues/LUC-1397) remain local-board review paths.
- Protected blocker posture: protected release, workers-ready, auth/browser,
  exchange, account, and live-trading proof remain fail-closed through existing
  owner lanes such as [LUC-2372](/LUC/issues/LUC-2372),
  [LUC-2505](/LUC/issues/LUC-2505), [LUC-241](/LUC/issues/LUC-241),
  [LUC-2366](/LUC/issues/LUC-2366), [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2378](/LUC/issues/LUC-2378).
- Deployment impact: none.
- Push status: not pushed.
- Residual risk: protected release, auth/browser, account, exchange, and
  live-trading proof remain separate fail-closed gates. [LUC-2601](/LUC/issues/LUC-2601)
  is local Web proof/traceability only.
