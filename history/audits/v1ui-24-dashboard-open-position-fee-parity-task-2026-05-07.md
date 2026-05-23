# Task

## Header
- ID: V1UI-24
- Title: Show dashboard open-position fees
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-23
- Priority: P1
- Iteration: 24
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`docs/modules/web-dashboard-home.md` requires `/dashboard` and bot monitoring/preview surfaces to stay parity-aligned for selected-bot positions. Bot monitoring already renders backend `feesPaid` for open positions, but Dashboard Home Open Positions did not expose the same money-impacting payload field.

## Goal
Render backend `feesPaid` in Dashboard Home Open Positions using the existing runtime table presenter, labels, and amount formatter.

## Success Signal
- User or operator problem: open-position fees are visible on the primary dashboard, not only in detailed monitoring.
- Expected product or reliability outcome: selected-bot open-position money truth is more complete on `/dashboard`.
- How success will be observed: focused presenter test requires the Open Positions fee column to render from `feesPaid`.
- Post-launch learning needed: no

## Deliverable For This Stage
A verified Web UI parity slice plus task/context documentation.

## Constraints
- Reuse existing runtime position payload.
- Reuse existing dashboard labels and amount formatting.
- Do not change API, DB, fee calculation, or position lifecycle behavior.
- Do not add a new table system.

## Definition of Done
- [x] Dashboard Home Open Positions renders `feesPaid`.
- [x] Focused presenter coverage verifies the fee column.
- [x] Architecture/module docs and canonical context are updated.
- [x] Relevant validation passes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated fee calculations
- temporary UI-only fake data
- API contract changes outside this slice
- unrelated dashboard polish

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` (`14/14`), `pnpm --filter web run typecheck`, `pnpm --filter web run lint`, `pnpm i18n:audit:route-reachable:web` (`findings=0`), `pnpm run quality:guardrails`, `pnpm run build`.
- Manual checks: authenticated rendered `/dashboard` smoke on desktop and mobile.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui24-smoke\dashboard-desktop.png`, `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui24-smoke\dashboard-mobile.png`; no console warnings, console errors, or page errors.
- High-risk checks: display-only reuse of authenticated backend payload; no execution or fee-calculation logic changed.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-dashboard-home.md`, `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/README.md`.
- Fits approved architecture: yes
- Mismatch discovered: yes, primary `/dashboard` position table did not show open-position fee truth already visible in bot monitoring.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime table system.
- Canonical visual target: existing Open Positions table.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing `DataTable` column, `dashboard.home.runtime.fee` label, and runtime amount formatter.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop and mobile rendered `/dashboard` smoke passed.
- Input-mode checks: not applicable
- Accessibility checks: existing table semantics unchanged.
- Parity evidence: bot monitoring already renders `position.feesPaid`; Dashboard Home now does too.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web-only commit.
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home Open Positions omitted backend `feesPaid`.
- Gaps: bot monitoring displayed open-position fees, primary dashboard did not.
- Inconsistencies: selected-bot position money truth differed across Web surfaces.
- Architecture constraints: reuse existing runtime payload and table presenter.

### 2. Select One Priority Task
- Selected task: `V1UI-24`.
- Priority rationale: fees are money-impacting and already available from backend truth.
- Why other candidates were deferred: this is the smallest ARCHITECT-mode parity fix found.

### 3. Plan Implementation
- Files or surfaces to modify: Dashboard Home runtime table presenter/test plus docs/context.
- Logic: add a sortable `feesPaid` Open Positions column using existing `formatRuntimeAmount`.
- Edge cases: zero fee renders through the same formatter; no missing-field fallback needed because the API type requires `feesPaid`.

### 4. Execute Implementation
- Implementation notes: no API or calculation behavior changed.

### 5. Verify and Test
- Validation performed: focused presenter test.
- Result: PASS, including focused presenter test (`14/14`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and authenticated rendered `/dashboard` desktop/mobile smoke with no console warnings, console errors, or page errors.

### 6. Self-Review
- Simpler option considered: adding fees to a tooltip only; rejected because table parity requires scannable money truth.
- Technical debt introduced: no
- Scalability assessment: column follows existing DataTable pattern and can be hidden by existing column-visibility controls.
- Refinements made: scoped the change to one payload field.

### 7. Update Documentation and Knowledge
- Docs updated: this task report plus module/context docs.
- Context updated: yes
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
- [x] Docs or context were updated.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: display column derives from refreshed selected-bot runtime payload
- Regression check performed: focused presenter test

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated runtime position fee metadata
- Trust boundaries: Web displays API-owned data for the authenticated selected bot.
- Permission or ownership checks: unchanged API authorization path.
- Abuse cases: none introduced; no user-controlled formatting path added.
- Secret handling: none
- Security tests or scans: focused test only
- Fail-closed behavior: missing runtime payload still follows existing table empty/loading paths.
- Residual risk: browser smoke covers dashboard load and console/page health, but the local seed user has no funded open-position fee row to visually inspect.

## Result Report
- Task summary: Dashboard Home Open Positions now renders backend `feesPaid`.
- Files changed: see implementation diff and docs/context updates.
- How tested: focused presenter test (`14/14`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and rendered `/dashboard` desktop/mobile smoke.
- What is incomplete: nothing known for this slice.
- Next steps: continue the next smallest backend-to-Web parity review.
- Decisions made: add a real table column rather than a transient tooltip.
