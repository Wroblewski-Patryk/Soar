# Task

## Header
- ID: DASHSIGNALS-01
- Title: Do not render unavailable runtime indicator values as normal signal conditions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: DASHDISPLAY-01
- Priority: P1
- Iteration: 2026-05-02 production dashboard signal display follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Authenticated production readback for `Dashboard -> Strategy signals` showed
runtime condition cards rendering `RSI(14) n/a < 20` and `RSI(14) n/a > 80`
for several LIVE symbols. Production API confirmed these values came from
`lastSignalConditionLines.value = "n/a"` in the runtime read model.

## Goal
Make unavailable runtime indicator values explicit and non-misleading across
dashboard signal surfaces, while preserving fail-closed runtime behavior.

## Scope
- Backend runtime signal analysis/read-model presentation metadata.
- Dashboard Home `Strategy signals` condition rendering.
- Bot Monitoring future-signals condition rendering.
- EN/PL/PT/de-CH i18n for unavailable indicator values.
- Focused API and web regression tests.

## Implementation Plan
1. Mark unavailable indicator condition evaluations as `matched: null` instead
   of false when the displayed condition value is unavailable.
2. Prefer fresh snapshot analysis over stored signal analysis when the stored
   condition lines only contain unavailable values and snapshot analysis has
   concrete values.
3. Render unavailable condition values with an explicit localized pending label
   instead of the raw `n/a` placeholder.
4. Validate with focused API and web tests, typecheck, guardrails, and build.

## Acceptance Criteria
- Dashboard Home no longer shows strings like `n/a < 20` or `n/a > 80`.
- Bot Monitoring condition rows no longer show raw `n/a`.
- Runtime read model does not classify unavailable indicator values as a normal
  false condition match.
- Existing computed values such as `RSI(14)=51.2882` still render normally.
- No trading execution semantics or order behavior changes are introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this scoped
  runtime presentation/truth fix.
- [x] Focused backend read-model tests pass.
- [x] Focused web signal display tests pass.
- [x] Typecheck, guardrails, and build pass before commit.
- [x] Canonical queue and context docs are synchronized.

## Forbidden
- changing order execution or position automation behavior
- pretending unavailable indicator values are valid computed values
- hiding thresholds without explaining unavailable data
- temporary placeholder-only fixes

## Validation Evidence
- Tests: PASS
  - `pnpm --filter api exec vitest run src/modules/engine/strategySignalAnalysis.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run lint`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm --filter api run build`
  - `pnpm --filter web run build`
- Manual checks: production API confirmed `ETHUSDT` carried `RSI(14)=n/a`
- Screenshots/logs: not committed
- High-risk checks: no trading mutation performed

## Architecture Evidence
- Architecture source reviewed: runtime signal/read-model contracts and
  dashboard runtime UI contracts
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: authenticated production dashboard signal card
- Canonical visual target: existing dashboard runtime signal cards and bot
  monitoring table
- Fidelity target: structurally_faithful
- Existing shared pattern reused: current condition-line surfaces
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: unavailable indicator data, computed indicator data
- Accessibility checks: unavailable values render as text, not ambiguous raw
  placeholder math
- Parity evidence: Dashboard Home and Bot Monitoring use the same pending
  wording.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert scoped commit if signal condition presentation regresses
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: raw `n/a` indicator values render as if they were normal runtime
  condition operands.
- Gaps: unavailable values were carried with `matched=false`, which looks like
  a real failed condition instead of missing input data.
- Inconsistencies: some symbols show numeric RSI values while others show `n/a`
  in the same surface.
- Architecture constraints: fail closed, preserve runtime decisions, avoid UI
  pretending data exists.

### 2. Select One Priority Task
- Selected task: DASHSIGNALS-01
- Priority rationale: user explicitly identified this production dashboard
  display as the real inconsistency.
- Why other candidates were deferred: unrelated CORS/runtime logs remain
  separate unless they are proven to cause the unavailable values.

### 3. Plan Implementation
- Files or surfaces to modify: runtime signal analysis/read model, dashboard
  signal components, i18n, focused tests, canonical context.
- Logic: distinguish unavailable indicator data from false condition matches
  and render it explicitly.
- Edge cases: stored signal analysis unavailable while fresh snapshot analysis
  is concrete; both analyses unavailable.

### 4. Execute Implementation
- Implementation notes: unavailable indicator condition values now remain
  fail-closed but are represented as unknown display truth (`matched: null`),
  the runtime read model prefers concrete snapshot condition values over stale
  latest-decision `n/a` payloads when available, and dashboard/bot monitoring
  render localized pending text instead of raw `n/a` math.

### 5. Verify and Test
- Validation performed: focused API and web regression tests, API/web
  typecheck, repository guardrails, lint, route-reachable i18n audit, API
  build, and web build.
- Result: PASS

### 6. Self-Review
- Simpler option considered: hiding `n/a` in frontend only. Rejected because
  the backend read-model truth also classified unavailable values as
  `matched=false`, which made missing input data look like a real failed
  condition.
- Technical debt introduced: no
- Scalability assessment: no new abstraction expected
- Refinements made: direct component tests cover both unavailable and concrete
  condition values, and the existing dashboard widget test now waits for the
  asynchronous coin-icon lookup effect.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `docs/planning/mvp-next-commits.md`
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

## Result Report
- Task summary: dashboard signal cards and bot monitoring no longer render
  unavailable RSI values as misleading condition expressions such as
  `n/a < 20`; unavailable values now use an explicit pending-data label.
- Files changed: runtime signal analysis/read-model, dashboard signal
  components, bot monitoring condition formatting, i18n namespaces, focused
  regression tests, and canonical context/planning docs.
- How tested: focused API/web tests, API/web typecheck, repository guardrails,
  lint, route-reachable i18n audit, API build, and web build all PASS.
- What is incomplete: production post-deploy visual readback remains to be
  collected after the commit is deployed.
- Next steps: push the fix, wait for production build-info, then verify the
  authenticated dashboard no longer exposes raw `n/a` condition expressions.
- Decisions made: keep thresholds visible while labeling unavailable indicator
  input data, and preserve runtime execution semantics.
