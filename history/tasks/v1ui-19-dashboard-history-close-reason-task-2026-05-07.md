# Task

## Header
- ID: V1UI-19
- Title: Dashboard history close reason parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-18
- Priority: P1
- Iteration: 19
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home is the primary operator runtime surface. Closed-position history already receives backend `closeReason`, but the Dashboard Home closed positions table exposed close initiator without the backend close-reason truth that bot monitoring already renders.

## Goal
Render backend `closeReason` in Dashboard Home closed-position history using shared runtime close-reason semantics so `/dashboard` and bot monitoring do not drift.

## Scope
- `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringAttributionPills.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- Context, task board, planning, and module documentation.

## Success Signal
- User or operator problem: closed-position history on Dashboard Home no longer hides why a backend position closed.
- Expected product or reliability outcome: runtime close reason is visible with the same pill semantics as bot monitoring.
- How success will be observed: presenter tests assert `closeReason` column label and TTP rendering; shared formatter tests assert guard and label suffix mapping.
- Post-launch learning needed: no

## Deliverable For This Stage
One verified frontend parity slice with documentation and rendered smoke evidence before release.

## Constraints
- use existing runtime table and i18n systems
- reuse shared runtime formatter semantics
- do not introduce a parallel close-reason contract
- do not change backend/API contracts in this slice

## Implementation Plan
1. Add shared close-reason value guard and label suffix helper.
2. Reuse that helper in bot monitoring attribution pills.
3. Add Dashboard Home closed-position close-reason column and route-owned labels.
4. Add focused shared formatter and presenter regressions.
5. Run relevant Web and repository validation gates plus rendered `/dashboard` smoke.
6. Update context, planning, and module documentation.

## Acceptance Criteria
- Dashboard Home closed positions include a `Close reason` column.
- `closeReason` pills use shared runtime close-reason color semantics.
- Bot monitoring and Dashboard Home derive close-reason label suffixes from the same helper.
- Missing close reasons still render `-`.
- Relevant tests, lint, typecheck, i18n audit, guardrails, build, and rendered smoke pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this slice.
- [x] Architecture source reviewed and no mismatch found.
- [x] Existing systems reused.
- [x] No workaround or duplicate close-reason logic introduced.
- [x] Validation evidence attached.
- [x] Docs/context updated.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter web exec vitest run src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` (`22/22`)
  - PASS `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` (`33/33`)
  - PASS `pnpm --filter web run typecheck`
  - PASS `pnpm --filter web run lint`
  - PASS `pnpm i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run build`
- Manual checks:
  - PASS authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright. API register returned `201`, dashboard rendered onboarding content, `messages=[]`, and `pageErrors=[]`.
- Screenshots/logs:
  - Screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui19-smoke/dashboard.png`
- High-risk checks:
  - Money-impacting runtime table now exposes backend close reason without mutating any command path.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home and bot monitoring runtime table patterns.
- Canonical visual target: existing runtime DataTable pill language.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: DataTable columns and runtime pill classes.
- New shared pattern introduced: no
- Design-memory entry reused: existing runtime table/pill conventions.
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known
- Required states: loading, empty, error, success remain covered by existing table/widget flow.
- Responsive checks: desktop, tablet, mobile via rendered `/dashboard` smoke.
- Input-mode checks: pointer/keyboard not changed.
- Accessibility checks: table text remains visible and non-interactive.
- Parity evidence: Dashboard Home closed-position rows now show backend `closeReason`.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this frontend slice to remove the close-reason column and shared helper reuse.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home closed-position history omitted backend `closeReason`.
- Gaps: bot monitoring rendered close reason with local mapping, risking drift.
- Inconsistencies: close-reason class was shared, but label suffix and guard were not.
- Architecture constraints: keep `/dashboard` aggregate runtime history parity-aligned with bot preview/monitoring.

### 2. Select One Priority Task
- Selected task: `V1UI-19 dashboard history close reason parity`.
- Priority rationale: it exposes backend close outcome truth on the primary runtime surface.
- Why other candidates were deferred: larger history-table parity fields such as hold duration, DCA count, and fees paid are separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: shared formatter, bot attribution pills, Dashboard Home table presenter, i18n, tests, docs.
- Logic: shared close-reason suffix maps backend enum values to route-owned translation keys.
- Edge cases: unknown/missing values render `-`; route namespaces remain independent.

### 4. Execute Implementation
- Implementation notes: added `isRuntimeCloseReasonValue` and `runtimeCloseReasonLabelSuffix`; Dashboard Home closed positions now render `closeReason` pills.

### 5. Verify and Test
- Validation performed: focused tests, dashboard/bot regressions, Web typecheck, Web lint, route-reachable i18n audit, repository guardrails, full build, and authenticated rendered `/dashboard` smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding dashboard-only mapping.
- Technical debt introduced: no
- Scalability assessment: shared suffix helper supports future route-owned runtime close-reason labels without duplicating enum logic.
- Refinements made: bot monitoring now consumes the shared helper too.

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
Done. Dashboard Home closed-position history now renders backend `closeReason` with shared close-reason suffix and pill semantics also used by bot monitoring. Missing values render `-`; backend/API contracts and command paths are unchanged.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime aggregate read model.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: inherited from existing Dashboard Home widget.
- Error state verified: inherited from existing Dashboard Home widget.
- Refresh/restart behavior verified: yes, rendered `/dashboard` smoke after dev server restart.
- Regression check performed: focused presenter/shared formatter and dashboard/bot regression tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Dashboard operator reviewing closed positions.
- Existing workaround or pain: operator had to inspect bot monitoring/detail surface to see close reason.
- Smallest useful slice: one Dashboard Home closed-position column plus shared formatter reuse.
- Success metric or signal: backend close reason visible in Dashboard Home history rows.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: review closed runtime positions.
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
- Data classification: runtime trading metadata already returned to authenticated operator.
- Trust boundaries: no new boundary.
- Permission or ownership checks: unchanged authenticated dashboard access.
- Abuse cases: no command mutation or privilege expansion.
- Secret handling: none.
- Security tests or scans: lint/typecheck plus existing route auth smoke pending.
- Fail-closed behavior: missing close reason renders `-`; command paths unchanged.
- Residual risk: low.
