# V1UI-05 Bot Monitoring Close Attribution Web Parity

## Header
- ID: V1UI-05
- Title: fix(web-runtime): surface close attribution in bot monitoring history
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1CLOSE-A
- Priority: P1
- Iteration: 5
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime positions and trades expose close attribution (`closeReason`,
`closeInitiator`) from the backend. Dashboard home history surfaces already
render this truth, but `/dashboard/bots` monitoring history currently drops it
from the detailed bot runtime tables.

## Goal
Make bot monitoring history reflect backend close-attribution truth without
changing API behavior or runtime lifecycle rules.

## Scope
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`
- dashboard-bots i18n namespace files
- planning/context docs

## Success Signal
- User or operator problem: a closed position or close trade can be visible in
  bot monitoring without showing who or what closed it.
- Expected reliability outcome: bot monitoring can distinguish bot closes, app
  user closes, exchange/user closes, liquidation/exchange closes, and system
  repair outcomes.
- How success will be observed: focused bot monitoring component test proves
  close reason and initiator labels render from backend payload fields.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify close-attribution rendering in bot monitoring history
tables.

## Constraints
- Reuse existing backend fields; do not add API behavior.
- Do not create a parallel lifecycle attribution model.
- Keep table density aligned with current monitoring UI.
- Keep live-money mutation paths untouched.

## Implementation Plan
1. Add shared runtime attribution label/class helpers where reuse is safe.
2. Extend bot monitoring history row typing for `closeReason` and
   `closeInitiator`.
3. Render close reason and close initiator in closed-position and trade history
   tables.
4. Add localized dashboard-bots labels.
5. Add focused regression coverage and run relevant Web validations.
6. Sync task, context, and planning docs.

## Acceptance Criteria
- Closed-position history rows show close reason and close initiator when API
  provides them.
- Close trade rows show close reason and close initiator when API provides
  them.
- Missing attribution stays explicit as `-`.
- Dashboard home behavior remains unchanged.

## Definition of Done
- [x] Focused bot monitoring test passes.
- [x] Web typecheck passes.
- [x] Route-reachable i18n audit passes.
- [x] Guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Backend contract changes.
- New close-attribution semantics.
- Temporary display fallbacks.
- Live-money mutations.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/bots/components/BotsManagement.test.tsx --run`
    PASS (`13/13`).
  - `pnpm --filter web run typecheck` PASS.
  - `pnpm --filter web run lint` PASS.
  - `pnpm --filter web run build` PASS.
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`).
  - `pnpm run quality:guardrails` PASS after extracting attribution pills out
    of `BotsMonitoringTab.tsx`.
  - `git diff --check` PASS.
- Manual checks: code review confirmed no backend/API mutation path changed.
- Screenshots/logs: authenticated rendered smoke remains blocked by the
  workstation local API secret-readiness issue recorded in `V1UI-04`.
- High-risk checks: no money mutation path is changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - V1 close-attribution planning/context evidence from `V1CLOSE-A`
- Fits approved architecture: yes
- Mismatch discovered: yes, backend close attribution is exposed but detailed
  bot monitoring tables do not render it.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: docs will record parity closure.

## UX/UI Evidence
- Design source type: existing implementation
- Design source reference: current bot monitoring dense table style and
  dashboard-home runtime history attribution pills.
- Canonical visual target: compact runtime history table labels.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Existing shared pattern reused: runtime table badge/pill tone helpers.
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success rows with attribution, missing attribution fallback.
- Responsive checks: table stays horizontally scrollable as before.
- Accessibility checks: labels are text, not color-only.
- Parity evidence: focused bot monitoring test now renders close reason and
  close initiator labels from runtime payload fields.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert Web display changes.
- Observability impact: improves operator readback of close attribution.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: bot monitoring history omits backend close attribution.
- Gaps: dashboard-home history tables render attribution, detailed bot
  monitoring history does not.
- Inconsistencies: same runtime payload truth is surfaced in one Web route but
  lost in another.
- Architecture constraints: keep attribution source from backend fields.

### 2. Select One Priority Task
- Selected task: V1UI-05 bot monitoring close attribution parity.
- Priority rationale: close attribution is money-critical operator evidence.
- Why other candidates were deferred: broader runtime UI parity sweeps would
  mix multiple contracts.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: render existing `closeReason` and `closeInitiator` fields using
  localized compact labels.
- Edge cases: missing fields render `-`.

### 4. Execute Implementation
- Implementation notes: bot monitoring closed-position and trade history tables
  now render localized close reason and close initiator pills. Shared runtime
  formatter helpers own attribution tone classes, and bot-route labels remain
  under `dashboard.bots.*` per route i18n ownership.

### 5. Verify and Test
- Validation performed: focused bot monitoring test, Web typecheck, Web lint,
  Web build, route-reachable i18n audit, repository guardrails, and diff check.
- Result: pass.

### 6. Self-Review
- Simpler option considered: leave attribution to Dashboard home only. Rejected
  because `/dashboard/bots` is the detailed monitoring route and must not hide
  backend lifecycle truth.
- Technical debt introduced: no.
- Scalability assessment: attribution pill rendering was extracted from the
  large monitoring tab to keep the file under production monolith guardrails.
- Refinements made: shared close attribution tone helpers are reused by
  dashboard-home runtime helpers.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, `docs/modules/web-bots.md`, planning queue
  files.
- Context updated: `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for display-only Web
  parity; existing runtime payload fields are reused.
- Real API/service path used: yes, existing runtime positions/trades payload.
- Endpoint and client contract match: yes, existing runtime position/trade
  fields are reused.
- Regression check performed: yes, `BotsManagement.test.tsx`.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot runtime operator inspecting closed positions
  and close trades.
- Existing workaround or pain: operator must infer attribution from dashboard
  home, raw payload, or logs.
- Smallest useful slice: render attribution in bot monitoring history.
- Success metric or signal: close attribution labels visible in monitoring
  history rows.

## Reliability / Observability Evidence
- Critical user journey: inspect why a position closed.
- Health/readiness check: not applicable.
- Rollback or disable path: revert display commit.

## Security / Privacy Evidence
- Data classification: runtime trading telemetry already visible to owner.
- Trust boundaries: no auth, permission, or ownership checks changed.
- Abuse cases: no mutation path introduced.
- Secret handling: none.
- Fail-closed behavior: missing attribution remains explicit as `-`.
- Residual risk: low.

## AI Testing Evidence
- Not applicable.

## Result Report
- Task summary: bot monitoring history tables now expose backend close
  attribution for closed positions and close trades.
- Files changed: bot monitoring component/test, shared runtime formatter,
  dashboard-home runtime helper reuse, dashboard-bots i18n, docs/context.
- How tested: focused Web test (`13/13`), Web typecheck, lint, build,
  route-reachable i18n audit (`findings=0`), guardrails, diff check.
- What is incomplete: authenticated rendered runtime smoke remains blocked by
  local API secret readiness, not by this display change.
- Next steps: continue the backend-to-Web runtime parity sweep.
- Decisions made: attribution labels stay route-owned under `dashboard.bots.*`
  while tone classes are shared.
