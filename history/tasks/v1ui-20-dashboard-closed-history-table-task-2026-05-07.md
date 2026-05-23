# Task

## Header
- ID: V1UI-20
- Title: Dashboard closed-position history table parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: V1UI-19
- Priority: P1
- Iteration: 20
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`DAGG` says Dashboard Home history must render aggregate closed positions and trade history as two deterministic tables. The closed-position presenter existed, but the `/dashboard` history tab only rendered trades, hiding backend `positions.historyItems` on the primary runtime surface.

## Goal
Connect backend `positions.historyItems` to the Dashboard Home history tab and render closed-position duration, DCA, fee, close reason, close initiator, and realized PnL in the Web UI.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/types.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- Dashboard Home tests and i18n namespaces.
- Context, task board, planning, and module documentation.

## Success Signal
- User or operator problem: closed-position backend history no longer disappears from Dashboard Home.
- Expected product or reliability outcome: `/dashboard` history matches the documented aggregate runtime contract.
- How success will be observed: aggregate-history tests assert closed positions and trades both render and re-scope on selected-bot switch.
- Post-launch learning needed: no

## Deliverable For This Stage
One verified TESTER-mode parity slice with automated and rendered evidence.

## Constraints
- use existing aggregate runtime read model
- use existing DataTable and runtime presenter patterns
- do not change backend/API contracts
- do not add temporary fallback paths
- keep one selected-bot scope

## Implementation Plan
1. Add `historyPositions` to the selected runtime view model.
2. Create Dashboard Home closed-position columns from the existing presenter.
3. Render a closed positions DataTable above the trade history DataTable.
4. Add duration, DCA, and fee columns to closed-position presenter.
5. Add i18n labels and regression coverage.
6. Run focused tests, broader dashboard tests, typecheck, lint, i18n audit, guardrails, build, and rendered smoke.

## Acceptance Criteria
- Dashboard Home history tab renders closed positions from `positions.historyItems`.
- Dashboard Home history tab still renders trade history.
- Selected-bot switching re-scopes both closed positions and trades.
- Closed-position rows show duration, DCA, fees paid, close reason, close initiator, and realized PnL.
- Relevant tests and quality gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this slice.
- [x] Architecture source reviewed and no mismatch found.
- [x] Existing systems reused.
- [x] No workaround or duplicate runtime read model introduced.
- [x] Validation evidence attached.
- [x] Docs/context updated.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx --run` (`16/16`)
  - PASS `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` (`28/28`)
  - PASS `pnpm --filter web run typecheck`
  - PASS `pnpm --filter web run lint`
  - PASS `pnpm i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run build`
- Manual checks:
  - PASS authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright. API register returned `201`, dashboard rendered onboarding content, `messages=[]`, and `pageErrors=[]`.
- Screenshots/logs:
  - Screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui20-smoke/dashboard.png`
- High-risk checks:
  - Money-impacting history is read-only; no command path changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Dashboard Home history rendered trades only while `DAGG` required closed positions and trades.
- Decision required from user: no, implementation realigned code to approved documented contract.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime DataTable pattern and bot monitoring closed-position table.
- Canonical visual target: two deterministic history tables within the existing history tab.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: DataTable, runtime table presenters, DCA ladder cell, close reason/initiator pills.
- New shared pattern introduced: no
- Design-memory entry reused: existing runtime table conventions.
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known in this slice.
- Required states: loading, empty, error, success remain covered.
- Responsive checks: desktop rendered smoke; DataTable overflow behavior reused.
- Input-mode checks: pointer/keyboard unchanged.
- Accessibility checks: table headings and DataTable semantics remain visible.
- Parity evidence: aggregate-history test now asserts closed-position and trade history both render and re-scope.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this frontend slice to remove the closed-position table connection.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `createHistoryPositionsColumns` existed but was not used by Dashboard Home.
- Gaps: `positions.historyItems` was present in aggregate payloads but hidden from `/dashboard`.
- Inconsistencies: docs promised two history tables; implementation rendered only trade history.
- Architecture constraints: selected-bot aggregate history must stay scoped and deterministic.

### 2. Select One Priority Task
- Selected task: `V1UI-20 dashboard closed-position history table parity`.
- Priority rationale: TESTER-mode review found a direct architecture-to-code-to-UI mismatch.
- Why other candidates were deferred: smaller column-only additions are lower priority than connecting the missing table.

### 3. Plan Implementation
- Files or surfaces to modify: Dashboard Home view model, RuntimeDataSection props/rendering, history presenter, i18n, tests, docs.
- Logic: expose `selected.positions.historyItems` as selected runtime data and render it in a read-only DataTable above trade history.
- Edge cases: empty closed positions show deterministic empty state; selected-bot switch re-scopes both tables.

### 4. Execute Implementation
- Implementation notes: connected existing presenter and added duration/DCA/fee columns to surface backend lifecycle cost and duration fields.

### 5. Verify and Test
- Validation performed: focused tests, broader dashboard tests, typecheck, lint, i18n audit, guardrails, build, and rendered smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only adding more columns to the unused presenter.
- Technical debt introduced: no
- Scalability assessment: selected data now carries closed-position rows explicitly, matching existing trades/open rows shape.
- Refinements made: tests changed from expecting hidden closed positions to asserting visible closed positions and switch re-scope.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-dashboard-home.md`, `docs/planning/mvp-next-commits.md`, this task report.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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
Done. Dashboard Home history now renders aggregate closed positions and trades as separate deterministic tables. Closed-position rows expose backend duration, DCA, fees paid, close reason, close initiator, and realized PnL while keeping the flow read-only.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing aggregate runtime read model.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: inherited from history loading state.
- Error state verified: inherited from Dashboard Home runtime error state.
- Refresh/restart behavior verified: rendered `/dashboard` smoke after dev server restart.
- Regression check performed: aggregate-history selected-bot re-scope test.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Dashboard operator reviewing runtime history.
- Existing workaround or pain: operator had to leave Dashboard Home to inspect closed-position history.
- Smallest useful slice: connect closed-position table and backend lifecycle/cost fields.
- Success metric or signal: closed positions and trades are both visible under Dashboard Home history.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: review runtime history for selected bot.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: no impact
- Logs, dashboard, or alert route: no impact
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright.
- Rollback or disable path: revert frontend slice.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated runtime trading metadata already returned by the API.
- Trust boundaries: no new boundary.
- Permission or ownership checks: unchanged authenticated dashboard access.
- Abuse cases: no mutation or privilege expansion.
- Secret handling: none.
- Security tests or scans: lint/typecheck/build plus rendered auth smoke.
- Fail-closed behavior: empty history renders empty state; command paths unchanged.
- Residual risk: low.
