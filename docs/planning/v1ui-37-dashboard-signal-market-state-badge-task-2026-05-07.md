# Task

## Header
- ID: V1UI-37
- Title: feat(web-runtime): show dashboard signal market state
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-36
- Priority: P1
- Iteration: 37
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator-surface architecture requires runtime market surfaces to distinguish configured-only scope, evaluated/no-trade outcomes, accepted runtime signals, and open-position state. Bots Monitoring already renders runtime state badges for signal rows. Dashboard Home signal cards sort and style by runtime state, but the state itself is not rendered as explicit operator text.

## Goal
Render the backend-provided `runtimeMarketState` on Dashboard Home signal cards using the existing Dashboard Home route-owned translation keys.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Rendered `/dashboard` smoke
- Planning/context docs for this slice

## Success Signal
- User or operator problem: Dashboard Home signal cards should explicitly say whether a row is an open position, accepted signal, evaluated/no-trade, market snapshot, or unresolved.
- Expected product or reliability outcome: Dashboard Home better reflects backend runtime market state and matches the documented operator surface semantics.
- How success will be observed: focused component tests prove the state badge renders; rendered dashboard smoke remains healthy.
- Post-launch learning needed: no

## Deliverable For This Stage
Add a compact non-interactive runtime state badge to Dashboard Home signal cards and verify it.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add state-label props to `RuntimeSignalsSection` using existing `dashboard.home.runtime.marketState*` keys.
2. Resolve `runtimeMarketState` to a compact badge label with unresolved fallback.
3. Render the state badge next to the existing context source badge.
4. Extend focused tests for explicit state rendering.
5. Run focused, quality, build, and rendered validation.
6. Update task board, project state, and MVP queue evidence.

## Acceptance Criteria
- Signal cards render explicit state labels for `POSITION_OPEN`, `SIGNAL_ACTIVE`, `EVALUATED_NO_TRADE`, `CONFIGURED_ONLY`, and unresolved/null state.
- Existing context source, score summary, runtime detail, and condition rendering remain intact.
- No API, DB, auth, order, execution, or trading behavior changes.
- Dashboard route-owned copy is used; no Bots namespace borrowing is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items satisfied with evidence.
- [x] Focused `RuntimeSignalsSection` tests pass.
- [x] Relevant workspace gates pass.
- [x] Rendered authenticated Dashboard Home smoke passes.
- [x] Planning/context docs are updated.

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
- Tests: PASS `pnpm.cmd --dir apps/web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx` (`5/5`); PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`); PASS `pnpm.cmd --filter web run typecheck`; PASS `pnpm.cmd --filter web run lint`; PASS `pnpm.cmd run quality:guardrails`; PASS `git diff --check`; PASS `pnpm.cmd run build`.
- Manual checks: PASS authenticated rendered `/dashboard` smoke with dev servers restarted after build; page reached `/dashboard`, title `Soar`, heading `Dashboard`, onboarding wallet CTA visible, no framework overlay, no console warnings/errors, no page errors, and no 5xx responses.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\v1ui37-dashboard-smoke.png`; route-reachable i18n audit output `findings=0`.
- High-risk checks: no money movement, secrets, permissions, live trading, AI, or DB changes in scope

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Dashboard Home did not explicitly render the runtime market state required by the operator surface contract.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home signal cards and Bots Monitoring runtime state badges
- Canonical visual target: current implementation
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing badge pattern and Dashboard Home route-owned state labels
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes, smoke-level current implementation check
- Remaining mismatches: none in this slice
- Required states: empty, success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: state is visible text, not icon-only
- Parity evidence: Dashboard Home signal cards now render route-owned market state labels already used by the backend runtime market state contract.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert Dashboard Home signal state badge changes
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home signal cards do not explicitly render `runtimeMarketState`.
- Gaps: Bots Monitoring renders a state badge; Dashboard Home only uses state indirectly for sort/opacity.
- Inconsistencies: backend/Web types expose market state, and Dashboard Home has route-owned labels, but the primary dashboard card does not show them.
- Architecture constraints: runtime surfaces must distinguish configured-only, evaluated/no-trade, accepted runtime signal, and open-position state.

### 2. Select One Priority Task
- Selected task: render Dashboard Home signal market state.
- Priority rationale: small backend-to-web parity slice aligned with the operator surface contract.
- Why other candidates were deferred: indicator/condition summaries are lower priority because condition lines already render the detailed operands.

### 3. Plan Implementation
- Files or surfaces to modify: `RuntimeSignalsSection.tsx`, its focused test, and `HomeLiveWidgets.tsx` prop wiring.
- Logic: map `runtimeMarketState` to existing route-owned labels and render as a badge.
- Edge cases: null/unknown state renders unresolved; existing context source tooltip remains intact.

### 4. Execute Implementation
- Implementation notes: added market-state label props to `RuntimeSignalsSection`, wired existing `dashboard.home.runtime.marketState*` labels from `HomeLiveWidgets`, and rendered the state as a compact badge next to the existing context source badge.

### 5. Verify and Test
- Validation performed: focused component regression, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, whitespace diff check, full workspace build, Browser plugin attempt, and Playwright rendered dashboard smoke.
- Result: PASS. Browser plugin remained blocked by local Node `v22.13.0` requiring `>=22.22.0`, so rendered validation used bundled Codex Node plus Playwright.

### 6. Self-Review
- Simpler option considered: only rely on existing opacity/sort, rejected because the architecture requires explicit distinction.
- Technical debt introduced: no
- Scalability assessment: local route-owned UI addition; no new system.
- Refinements made: route-reachable audit artifact timestamp was not committed because the audit content did not change.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, MVP queue, task board, and project state.
- Context updated: task board and project state.
- Learning journal updated: not applicable

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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes, rendered smoke registered through the local API and loaded authenticated `/dashboard`
- Endpoint and client contract match: yes, the UI uses existing Web runtime symbol stat fields from the API read model.
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, dev servers were restarted after build before rendered smoke
- Regression check performed: focused RuntimeSignalsSection regression plus rendered dashboard smoke

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator diagnosing selected-bot runtime market state
- Existing workaround or pain: infer state indirectly from context source/opacity or switch to Bots Monitoring
- Smallest useful slice: add explicit state badge to existing signal cards
- Success metric or signal: focused tests and rendered smoke evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: Dashboard Home runtime signal diagnosis
- SLI: dashboard renders explicit runtime market state without client errors in smoke
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: build/test gates
- Logs, dashboard, or alert route: browser console evidence
- Smoke command or manual smoke: authenticated `/dashboard` Playwright smoke with bundled Codex Node
- Rollback or disable path: revert the signal-card state badge changes

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated runtime state label derived from existing runtime read model
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
Dashboard Home signal cards now render an explicit runtime market state badge derived from the backend `runtimeMarketState` field. The badge uses existing Dashboard Home route-owned labels for open position, accepted signal, evaluated/no-trade, market snapshot, and unresolved state. This improves backend-to-web parity and satisfies the operator-surface requirement that runtime market surfaces visibly distinguish those states without changing API, DB, auth, order execution, or trading behavior.
