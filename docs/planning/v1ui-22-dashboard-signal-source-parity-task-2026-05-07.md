# Task

## Header
- ID: V1UI-22
- Title: Dashboard signal context source parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-21
- Priority: P1
- Iteration: 22
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SOPR` requires Dashboard Home signal cards to expose deterministic source tagging from the API read model (`latest_signal`, `configured_fallback`, `unresolved`). Bot monitoring already rendered the source label, but Dashboard Home signal cards did not. The shared Web market-state helper also still classified only the legacy `latest_decision` context as evaluated, so current `latest_signal` rows without an active LONG/SHORT direction could be treated as unresolved.

## Goal
Show selected-bot signal context source labels on Dashboard Home signal cards and classify `latest_signal` as evaluated runtime signal context.

## Scope
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.test.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- Dashboard Home module docs and canonical execution context.

## Success Signal
- User or operator problem: Dashboard signal cards no longer hide whether a card comes from a latest runtime signal or configured closed-candle fallback.
- Expected product or reliability outcome: `/dashboard` signal cards match the `SOPR` source-tagging contract.
- How success will be observed: focused tests assert `latest_signal` classification and visible source labels on signal cards.
- Post-launch learning needed: no

## Deliverable For This Stage
One verified BUILDER-mode Dashboard Home signal source parity slice.

## Constraints
- use existing Dashboard Home signal card component
- use existing i18n source-label keys
- do not change backend/API contracts
- do not introduce a new signal read model
- no temporary bypasses or mock-only behavior

## Implementation Plan
1. Update the shared runtime market-state helper to classify `latest_signal` as evaluated signal context.
2. Add context-source label props to `RuntimeSignalsSection`.
3. Render a compact source badge on each Dashboard Home signal card.
4. Wire existing Dashboard Home i18n keys through `HomeLiveWidgets`.
5. Add focused regressions and run Dashboard Home checks, quality gates, build, and rendered smoke.

## Acceptance Criteria
- Dashboard Home signal cards show source labels for latest signal, legacy latest decision, configured fallback, and unresolved cases.
- `latest_signal` without an active LONG/SHORT direction resolves to `EVALUATED_NO_TRADE`, not `UNRESOLVED`.
- Configured fallback rows still resolve to `CONFIGURED_ONLY`.
- Relevant tests and quality gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this slice.
- [x] Architecture source reviewed and no approved contract change required.
- [x] Existing systems reused.
- [x] No workaround or duplicate runtime read model introduced.
- [x] Validation evidence attached.
- [x] Docs/context updated.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter web exec vitest run src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx --run` (`8/8`)
  - PASS `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx --run` (`22/22`)
  - PASS `pnpm --filter web run typecheck`
  - PASS `pnpm --filter web run lint`
  - PASS `pnpm i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run build`
- Manual checks:
  - PASS authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright. API register returned `201`, desktop and mobile Dashboard rendered onboarding content, framework overlay was empty, `messages=[]`, and `pageErrors=[]`.
- Screenshots/logs:
  - Desktop screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui22-smoke/dashboard-desktop-clean.png`
  - Mobile screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui22-smoke/dashboard-mobile-clean.png`
- High-risk checks:
  - Money-impacting signal display is read-only in this slice; no command or order mutation path changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Dashboard signal cards did not expose `SOPR` source tagging and `latest_signal` was not recognized by the helper fallback.
- Decision required from user: no, implementation realigned code to approved `SOPR` contract.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home signal card and bot monitoring context-source labels.
- Canonical visual target: compact source badge in each signal card header.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: existing badge styling and dashboard-home i18n source labels.
- New shared pattern introduced: no
- Design-memory entry reused: existing runtime card/table semantics.
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known in this slice.
- Required states: loading, empty, error, success remain inherited.
- Responsive checks: desktop and mobile rendered smoke; card rail layout is unchanged.
- Input-mode checks: not applicable, read-only badge display.
- Accessibility checks: badge includes a title with the source label.
- Parity evidence: focused signal-card test covers visible latest-signal and configured-fallback labels.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this frontend slice to remove the badge and helper classification change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home signal cards did not show source labels while `SOPR` requires deterministic source tagging.
- Gaps: `resolveRuntimeMarketState` recognized legacy `latest_decision` but not current `latest_signal`.
- Inconsistencies: bot monitoring had source labels; Dashboard Home did not expose them on cards.
- Architecture constraints: selected-bot signal context must stay scoped and read-only.

### 2. Select One Priority Task
- Selected task: `V1UI-22 dashboard signal context source parity`.
- Priority rationale: after wallet/history/order/position parity, `SOPR` source tagging is the next backend-to-Web visibility gap on the primary dashboard.
- Why other candidates were deferred: manual order lifecycle refinements are broader and riskier than this small read-only signal parity slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime truth helper, Dashboard Home signal component, HomeLiveWidgets prop wiring, tests, docs/context.
- Logic: map backend context source to existing localized labels and display them on each signal card.
- Edge cases: legacy `latest_decision` remains supported; missing/unknown source falls back to unresolved.

### 4. Execute Implementation
- Implementation notes: reused existing dashboard-home source-label keys and added no backend/API changes.

### 5. Verify and Test
- Validation performed: focused helper/signal-card tests, broader Dashboard Home and preview parity tests, Web typecheck, Web lint, i18n audit, guardrails, build, and rendered smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only fixing the helper classification.
- Technical debt introduced: no
- Scalability assessment: prop-level labels keep route-owned i18n and avoid importing bot-monitoring namespaces into Dashboard Home.
- Refinements made: the badge title includes the source-label prefix for clarity without adding large visible text.

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
- [x] Full validation gates and rendered smoke complete.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Dashboard Home signal cards now show deterministic context source labels, and the shared runtime market-state helper treats `latest_signal` as evaluated runtime signal context while preserving configured fallback behavior.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime aggregate/session symbol stats read model.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: inherited from Dashboard Home runtime loading state.
- Error state verified: inherited from Dashboard Home runtime error state.
- Refresh/restart behavior verified: rendered `/dashboard` smoke after dev server restart.
- Regression check performed: focused signal source and Dashboard Home preview parity tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Dashboard operator reviewing why a signal card exists.
- Existing workaround or pain: operator had to infer source from conditions or visit detailed bot monitoring.
- Smallest useful slice: show source badge and align helper classification.
- Success metric or signal: signal cards expose latest-signal vs configured-fallback source directly.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: review selected-bot runtime signal cards.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: no impact
- Logs, dashboard, or alert route: no impact
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright.
- Rollback or disable path: revert frontend signal badge and helper classification change.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime signal read model.
- Trust boundaries: existing authenticated Dashboard API boundary unchanged.
- Permission or ownership checks: unchanged.
- Abuse cases: no mutation path changed.
- Secret handling: none.
- Security tests or scans: not applicable.
- Fail-closed behavior: missing/unknown context source renders as unresolved.
- Residual risk: local rendered smoke used an empty-dashboard account, so signal-source badge rendering is covered by automated component tests rather than live runtime signal data.
