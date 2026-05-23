# Task

## Header
- ID: V1UI-41
- Title: Fail closed unknown open-order status labels
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-40
- Priority: P1
- Iteration: 41
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home renders open-order rows from backend runtime payloads. Approved
operator-surface architecture requires backend runtime truth to be reflected
strictly and fail closed in Web surfaces. The current Dashboard Home open-order
status presenter uses shared known-status mapping, but falls back to the raw API
status string for unknown values.

## Goal
Prevent unknown backend open-order status values from leaking as technical raw
strings in Dashboard Home while preserving the existing compact UI and route
copy contract.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- this task contract

## Success Signal
- User or operator problem: unknown runtime order statuses no longer appear as raw backend strings on the money-impacting dashboard.
- Expected product or reliability outcome: Dashboard Home remains compact while failing closed on unsupported status values.
- How success will be observed: focused presenter regression and rendered `/dashboard` smoke.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready implementation, validation evidence, and source-of-truth sync for
the Dashboard Home open-order status fail-closed hardening slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within Dashboard Home open-order status presentation
- do not add decorative or non-essential dashboard labels, statuses, or badges

## Implementation Plan
1. Keep the existing shared `runtimeOpenOrderStatusLabelSuffix` contract for known statuses.
2. Return the existing Dashboard Home unknown/empty display for unsupported non-empty status values instead of raw backend text.
3. Add a focused presenter test proving raw unknown status text is not rendered.
4. Run focused tests, static gates, build, and rendered dashboard smoke.

## Acceptance Criteria
- Unknown open-order status values do not render raw backend strings.
- Known open-order status values still render route-owned labels.
- No new visible dashboard label, badge, or status text is introduced.
- Relevant validation passes with evidence.

## Definition of Done
- [x] Dashboard Home open-order status presenter fails closed for unsupported statuses.
- [x] Focused regression test proves no raw unknown backend string leaks into the table.
- [x] Relevant automated validation and rendered dashboard smoke pass.
- [x] Task board, project state, and MVP next-commit planning are synchronized.

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
- unnecessary dashboard copy, labels, badges, or decorative status markers

## Validation Evidence
- Tests:
  - `pnpm.cmd exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx` from `apps/web` => PASS (`17/17`)
  - `pnpm.cmd --filter web run typecheck` => PASS
  - `pnpm.cmd --filter web run lint` => PASS
  - `pnpm.cmd run quality:guardrails` => PASS
  - `pnpm.cmd i18n:audit:route-reachable:web` => PASS (`findings=0`)
  - `pnpm.cmd run build` => PASS
  - `pnpm.cmd run typecheck` => PASS (API + Web)
  - `git diff --check` => PASS
- Manual checks:
  - Authenticated rendered `/dashboard` smoke on `http://localhost:3002/dashboard`
  - Quick-start "Open wallets" link clicked and navigated to `/dashboard/wallets/list`
- Screenshots/logs:
  - Playwright screenshot captured at `%TEMP%/soar-v1ui41-dashboard-smoke.png`
  - Local dev logs: `.codex/tmp-v1ui41-api*.log`, `.codex/tmp-v1ui41-web*.log` (ignored locally)
- High-risk checks:
  - Unsupported `FUTURE_STATUS` test row renders `dashboard.home.runtime.reasonUnknown` (`-`) and does not render the raw backend string.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime table
- Canonical visual target: current Dashboard Home layout
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing route-owned unknown display
- New shared pattern introduced: no
- Design-memory entry reused: existing compact runtime-table presentation
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none for this compact hardening slice
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: no new focusable UI
- Parity evidence: rendered dashboard smoke confirms the current compact table/page presentation remains stable; focused regression confirms backend unknown status does not leak raw text.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert presenter/test commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home open-order status presenter falls back to raw backend status strings for unsupported values.
- Gaps: focused regression did not cover unknown open-order status values.
- Inconsistencies: signal/status label helpers already fail closed in recent slices; open-order status did not.
- Architecture constraints: operator surfaces must reflect runtime truth strictly and fail closed.

### 2. Select One Priority Task
- Selected task: fail closed Dashboard Home unknown open-order status labels.
- Priority rationale: money-impacting runtime table must not expose unsupported backend values as user-facing state.
- Why other candidates were deferred: broader dashboard label pruning and signal-count semantics need separate contracts.

### 3. Plan Implementation
- Files or surfaces to modify: Dashboard Home runtime table presenter and focused presenter test.
- Logic: keep known shared mapping; return existing route unknown/empty display when mapping is unsupported.
- Edge cases: null/empty status remains compact; unknown non-empty status does not leak raw text.

### 4. Execute Implementation
- Implementation notes: `resolveOpenOrderStatusLabel` now keeps known shared suffix mapping and falls back to the existing Dashboard Home unknown display instead of `status ?? "-"`.

### 5. Verify and Test
- Validation performed: focused presenter test, Web/root typecheck, Web lint, guardrails, i18n audit, full build, diff check, and rendered smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: returning raw backend text was rejected because it is not fail-closed.
- Technical debt introduced: no
- Scalability assessment: reuses existing shared mapping and route-owned display.
- Refinements made: smoke script cleared pre-auth console noise before the dashboard assertion; test render formatting was split for lint readability.

### 7. Update Documentation and Knowledge
- Docs updated: task contract, MVP next commits, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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

## Notes
This slice intentionally does not add new visible dashboard labels. It removes
one raw-string leak by reusing the existing compact unknown display.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing runtime open orders
- Existing workaround or pain: raw unsupported backend status could appear in the table
- Smallest useful slice: fail closed in the Dashboard Home presenter
- Success metric or signal: focused regression and rendered smoke pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: dashboard runtime order review
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: dashboard rendered smoke
- Smoke command or manual smoke: authenticated `/dashboard` Playwright smoke on local API/Web dev servers
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: page reload through authenticated dashboard smoke
- Regression check performed: focused presenter regression and full workspace build/typecheck

## AI Testing Evidence (required for AI features)
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime trading/order metadata
- Trust boundaries: backend API to authenticated Web dashboard
- Permission or ownership checks: unchanged
- Abuse cases: unsupported backend status should not become misleading user copy
- Secret handling: unchanged
- Security tests or scans: static gates passed
- Fail-closed behavior: unsupported open-order status is mapped to existing unknown display
- Residual risk: low

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Result Report
Dashboard Home no longer renders unsupported backend open-order status strings
directly in the open-orders table. Known statuses still use the shared runtime
status suffix mapper and Dashboard Home route-owned labels. Unsupported
non-empty statuses now fail closed to the existing compact unknown display,
which preserves the current dashboard look and avoids adding extra visual
labels or markers. Validation passed with focused regression, static gates,
full build, and authenticated rendered dashboard smoke.
