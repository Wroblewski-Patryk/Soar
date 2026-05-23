# Task

## Header
- ID: DASHDISPLAY-01
- Title: Fix production dashboard display polish regressions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: AWESOME-01
- Priority: P1
- Iteration: 2026-05-02 production dashboard display audit
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Authenticated production review of `https://soar.luckysparrow.ch/dashboard`
on 2026-05-02 found display polish issues in the dashboard runtime surface.
The visible product behavior and backend contracts were otherwise left
read-only during the review.

## Goal
Repair the dashboard display inconsistencies found in production without
changing trading behavior, runtime state, API contracts, or persistence.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
- Focused web tests covering the touched presentation surfaces.
- Canonical queue and project-state documentation.

## Success Signal
- User or operator problem: Dashboard contains visible polish inconsistencies
  in the Manual Order panel and History table.
- Expected product or reliability outcome: dashboard labels, helper text, and
  history pills render coherently and remain accessible.
- How success will be observed: focused tests and typecheck pass; the DOM no
  longer exposes the hidden breadcrumb spacer label.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify one scoped web display polish fix.

## Constraints
- use existing dashboard UI patterns and table presenters
- do not introduce new systems
- do not change trading execution semantics
- do not change API payloads or runtime persistence
- avoid temporary visual hacks

## Implementation Plan
1. Separate Manual Order quantity helper text from the range label so the
   production sidebar cannot concatenate `Min qty` with `Qty slider`.
2. Add no-wrap behavior to runtime history/action pills that are intended to
   behave as compact badges in horizontally scrollable tables.
3. Keep the dashboard landing breadcrumb spacer layout behavior while removing
   the technical spacer label from rendered DOM text.
4. Run focused web tests, web typecheck, and repository guardrails.

## Acceptance Criteria
- Manual Order `Min qty` helper and `Qty slider` label render as distinct rows.
- History/action pills do not wrap multi-word labels into tall narrow badges.
- `__dashboard-spacer__` is not present in the rendered dashboard title DOM.
- No runtime, API, DB, or trading behavior changes are introduced.
- Relevant validation passes before commit.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this scoped web
  presentation fix.
- [x] Focused tests for touched surfaces pass.
- [x] Web typecheck passes.
- [x] Repository guardrails pass.
- [x] Task board, project state, and planning queue are synchronized.

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
- live trading mutations during verification

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx --run` PASS (`29/29`)
  - `pnpm --filter web run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm --filter web run build` PASS
- Manual checks: production read-only dashboard audit on 2026-05-02
- Screenshots/logs: local transient screenshots captured under `outputs/`
  during audit; not intended as permanent product assets
- High-risk checks: no order submit, close, cancel, or trading mutation was
  performed during production review

## Architecture Evidence
- Architecture source reviewed: dashboard and runtime source-of-truth docs from
  canonical context
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: authenticated production dashboard snapshot from
  2026-05-02
- Canonical visual target: existing dashboard design system
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: existing sidebar form controls and runtime
  table badge presenters
- New shared pattern introduced: no
- Design-memory entry reused: dashboard runtime/sidebar and table contracts
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: manual production snapshot comparison completed before fix; post-deploy readback remains the rollout smoke
- Remaining mismatches: production console CORS noise is deferred as a separate runtime/config follow-up candidate
- Required states: success
- Responsive checks: desktop; no breakpoint-specific CSS contract changed
- Input-mode checks: pointer | keyboard
- Accessibility checks: hidden breadcrumb spacer must not leak technical text
- Parity evidence: same data/controls, presentation-only adjustment

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the scoped web commit if unexpected presentation
  regression appears
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Manual Order helper/slider label overlap, history reason badge wraps,
  hidden breadcrumb spacer text leaks into DOM text.
- Gaps: focused tests need to lock the presentation contract.
- Inconsistencies: production dashboard text extraction exposes a technical
  placeholder.
- Architecture constraints: presentation-only change; no runtime behavior drift.

### 2. Select One Priority Task
- Selected task: DASHDISPLAY-01
- Priority rationale: user explicitly reported two visible dashboard
  inconsistencies on production.
- Why other candidates were deferred: observed runtime CORS noise is a separate
  config/runtime investigation, while the confirmed visual issues are smaller
  and independently fixable.

### 3. Plan Implementation
- Files or surfaces to modify: scoped web presentation files and canonical
  planning/context docs.
- Logic: layout class adjustment and DOM text cleanup only.
- Edge cases: long localized labels in badges and dashboard landing breadcrumbs.

### 4. Execute Implementation
- Implementation notes: separated quantity helper text from the quantity input
  label, added an accessible range label, made runtime history/trade pills
  nowrap, and removed spacer placeholder text from the hidden breadcrumb
  element.

### 5. Verify and Test
- Validation performed: focused web test pack, web typecheck, repository
  guardrails, and web build.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only adding spacing classes was rejected because
  it would leave label/helper semantics coupled; the final change separates
  helper text structurally.
- Technical debt introduced: no
- Scalability assessment: no new abstraction required
- Refinements made: preserved existing presenter tests while adding the new
  nowrap regression lock.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/planning/mvp-next-commits.md`
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
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

## Notes
Production review also observed CORS console errors for runtime-session and
icon lookup calls. They are recorded as a separate follow-up candidate because
this task is scoped to confirmed dashboard display regressions only.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: production operator
- Existing workaround or pain: visual scanning of dashboard is degraded
- Smallest useful slice: presentation-only fix in dashboard runtime sidebar and
  history table
- Success metric or signal: no visible overlap/wrapping regression in touched
  areas; tests pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production dashboard readback after
  deploy

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: dashboard runtime review
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused web checks and production readback
- Rollback or disable path: revert scoped web commit

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, read-only production dashboard review
- Endpoint and client contract match: not changed
- DB schema and migrations verified: not applicable
- Loading state verified: not changed
- Error state verified: not changed
- Refresh/restart behavior verified: not changed
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated dashboard presentation data
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: production credentials were not written to repository
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: production CORS console noise remains separate follow-up

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: fixed the confirmed production dashboard presentation
  inconsistencies in Manual Order, runtime History pills, and hidden breadcrumb
  spacer text.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
  - `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
  - focused web tests for the touched surfaces
  - canonical planning/context docs
- How tested: focused web tests (`29/29`), web typecheck, repository
  guardrails, and web build all PASS.
- What is incomplete: production post-deploy readback after push/deploy.
- Next steps: push the scoped commit and verify production dashboard after
  deploy.
- Decisions made: presentation-only scope; runtime CORS console noise deferred
