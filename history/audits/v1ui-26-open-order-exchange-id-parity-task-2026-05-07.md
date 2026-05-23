# Task

## Header
- ID: V1UI-26
- Title: Show exchange order id in runtime open-order tables
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-16
- Priority: P1
- Iteration: 26
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime open-order reads already select backend `exchangeOrderId` for LIVE and exchange-synced orders, but Web did not type or render that value on the primary Dashboard Home Open Orders table or the detailed Bot Monitoring Open Orders table.

## Goal
Expose backend `exchangeOrderId` in Web runtime open-order tables so operators can correlate Soar rows with exchange-side order truth during LIVE reconciliation and imported order review.

## Success Signal
- User or operator problem: an open order with exchange-side identity no longer appears only as a local row.
- Expected product or reliability outcome: Dashboard Home and Bot Monitoring show the same exchange order identity when the backend provides it.
- How success will be observed: focused Web regressions assert the Exchange ID column and value.
- Post-launch learning needed: no

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- `apps/web/src/i18n/namespaces/dashboard-bots.*.ts`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add optional `exchangeOrderId` to the shared Web runtime open-order type.
2. Add localized Exchange ID columns to Dashboard Home and Bot Monitoring Open Orders tables.
3. Render `-` when the backend value is absent.
4. Add focused presenter, Dashboard Home, and Bot Monitoring regressions.
5. Update module/context planning docs and run relevant validation.

## Acceptance Criteria
- Dashboard Home Open Orders renders a localized Exchange ID column.
- Bot Monitoring Open Orders renders a localized Exchange ID column.
- Provided backend `exchangeOrderId` is visible.
- Missing `exchangeOrderId` renders `-`.
- No API, DB, or order command behavior changes.

## Definition of Done
- [x] Exchange ID is visible and tested on Dashboard Home.
- [x] Exchange ID is visible and tested on Bot Monitoring.
- [x] Docs/context are synced.
- [x] Relevant validation passes.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` (`28/28`), `pnpm --filter web run typecheck`, `pnpm --filter web run lint`, `pnpm i18n:audit:route-reachable:web` (`findings=0`), `pnpm run quality:guardrails`, `pnpm run build`.
- Manual checks: authenticated rendered `/dashboard` smoke on desktop and mobile.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui26-smoke\dashboard-desktop.png`, `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui26-smoke\dashboard-mobile.png`; no console warnings, console errors, or page errors.
- High-risk checks: display-only exchange identity; no command path changed.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-orders.md`, `docs/modules/web-dashboard-home.md`, `docs/architecture/08_operator-surfaces-and-routing.md`.
- Fits approved architecture: yes
- Mismatch discovered: yes, backend open-order exchange identity was not represented on Web runtime tables.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Open Orders table pattern.
- Canonical visual target: existing DataTable columns in Dashboard Home and table columns in Bot Monitoring.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing Open Orders table columns and i18n namespaces.
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: empty | success
- Responsive checks: desktop and mobile rendered `/dashboard` smoke passed.
- Accessibility checks: table headers use localized text.
- Parity evidence: backend `exchangeOrderId` is now typed and rendered on both runtime open-order surfaces.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web-only commit.
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime read API selected `exchangeOrderId`, but Web type and tables omitted it.
- Gaps: operators could not correlate visible open-order rows with exchange-side order identity.
- Inconsistencies: source/type/fill/stop fields were visible, but exchange identity was hidden.
- Architecture constraints: selected-bot runtime tables must expose backend truth without changing command authority.

### 2. Select One Priority Task
- Selected task: `V1UI-26`.
- Priority rationale: exchange order identity is money-impacting operational truth during LIVE reconciliation.
- Why other candidates were deferred: production authenticated readback tasks remain blocked without protected evidence access; this is the smallest local parity slice.

### 3. Plan Implementation
- Files or surfaces to modify: shared Web type, Dashboard Home presenter, Bot Monitoring table, i18n, tests, docs/context.
- Logic: render `exchangeOrderId ?? "-"` in Open Orders.
- Edge cases: missing exchange identity remains explicit and non-fatal.

### 4. Execute Implementation
- Implementation notes: display-only Web change; no API, DB, or command mutation changes.

### 5. Verify and Test
- Validation performed: focused Web regressions.
- Result: PASS, including focused Web regressions (`28/28`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and authenticated rendered `/dashboard` desktop/mobile smoke with no console warnings, console errors, or page errors.

### 6. Self-Review
- Simpler option considered: expose only on Dashboard Home; rejected because Bot Monitoring is the detailed parity surface for the same runtime payload.
- Technical debt introduced: no
- Scalability assessment: optional field supports PAPER/local-only orders and LIVE/exchange-synced rows.
- Refinements made: empty-state colspan updated for the added Bot Monitoring column.

### 7. Update Documentation and Knowledge
- Docs updated: this task report plus module/context docs.
- Context updated: yes
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime open-order payload.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: unchanged
- Error state verified: unchanged
- Refresh/restart behavior verified: rendered dashboard smoke passed after dev-server start
- Regression check performed: focused Web tests

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated runtime order metadata
- Trust boundaries: existing protected runtime API to authenticated Web.
- Permission or ownership checks: unchanged API authorization path.
- Abuse cases: missing exchange id renders `-` rather than implying local-only or exchange-confirmed truth.
- Secret handling: none
- Security tests or scans: focused tests only
- Fail-closed behavior: display-only field; command behavior unchanged.
- Residual risk: real exchange correlation still requires authenticated production evidence.

## Result Report
- Task summary: Dashboard Home and Bot Monitoring Open Orders now show backend `exchangeOrderId` when present.
- Files changed: see Scope.
- How tested: focused Web regressions (`28/28`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and rendered `/dashboard` desktop/mobile smoke.
- What is incomplete: nothing known for this slice.
- Next steps: continue the next smallest backend-to-Web parity review.
- Decisions made: `exchangeOrderId` is optional and absent values render `-`.
