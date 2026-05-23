# Task

## Header
- ID: V1UI-38
- Title: feat(web-runtime): show dashboard session failure detail
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-37
- Priority: P1
- Iteration: 38
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home already warns when the selected runtime session is not `RUNNING`, but it hides backend session failure detail. Runtime session read models include `errorMessage` and `stopReason`, and Bots Monitoring already treats session errors as operator-review signals. The primary dashboard should reflect that backend truth when a session failed or stopped.

## Goal
Render backend-provided `errorMessage` or `stopReason` in the existing Dashboard Home no-active-session warning without inventing fallback detail.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- Rendered `/dashboard` smoke
- Planning/context docs for this slice

## Success Signal
- User or operator problem: when runtime is inactive, the dashboard should show the backend reason if one exists.
- Expected product or reliability outcome: Dashboard Home mirrors backend runtime session diagnostics for stopped or failed selected sessions.
- How success will be observed: focused sidebar tests prove `errorMessage`/`stopReason` precedence and rendered smoke remains healthy.
- Post-launch learning needed: no

## Deliverable For This Stage
Add backend session failure detail to the existing non-running session warning and verify it.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Derive session detail from `selectedData.session.errorMessage?.trim() || selectedData.session.stopReason?.trim() || null`.
2. Render it inside the existing no-active-session warning only when the selected session is not running and detail is present.
3. Extend focused sidebar tests for error-message precedence, stop-reason fallback, and absence behavior.
4. Run focused, quality, build, and rendered validation.
5. Update task board, project state, and MVP queue evidence.

## Acceptance Criteria
- Dashboard Home warning renders backend `errorMessage` when present.
- Dashboard Home warning renders backend `stopReason` when `errorMessage` is absent.
- Dashboard Home does not invent a reason when both fields are absent.
- No API, DB, auth, order, execution, or trading behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items satisfied with evidence.
- [x] Focused `RuntimeSidebarSection` tests pass.
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
- Tests: PASS `pnpm.cmd --dir apps/web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx` (`13/13`); PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`); PASS `pnpm.cmd --filter web run typecheck`; PASS `pnpm.cmd --filter web run lint`; PASS `pnpm.cmd run quality:guardrails`; PASS `git diff --check`; PASS `pnpm.cmd run build`.
- Manual checks: PASS authenticated rendered `/dashboard` smoke with dev servers restarted after build; page reached `/dashboard`, title `Soar`, heading `Dashboard`, no framework overlay, no console warnings/errors, no page errors, and no 5xx responses. The fresh smoke account had no inactive-session warning, so failure-detail rendering is covered by focused component tests.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\v1ui38-dashboard-smoke.png`; route-reachable i18n audit output `findings=0`.
- High-risk checks: no money movement, secrets, permissions, live trading, AI, or DB changes in scope

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Dashboard Home hid backend session failure detail in a canonical warning state.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime sidebar warning
- Canonical visual target: current implementation
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing warning panel
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes, smoke-level current implementation check
- Remaining mismatches: none in this slice
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: semantic warning text, no new interactive control
- Parity evidence: Dashboard Home non-running session warning now reflects backend `errorMessage`/`stopReason` when present.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert sidebar session-detail rendering
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home shows only a generic non-running warning.
- Gaps: backend session `errorMessage` and `stopReason` are typed and available but hidden in the primary dashboard.
- Inconsistencies: Bots Monitoring checklist treats session errors as review signals, while Dashboard Home does not show the detail.
- Architecture constraints: operator surfaces must use explicit warning/error states and selected-bot runtime snapshots must stay source-of-truth driven.

### 2. Select One Priority Task
- Selected task: show Dashboard Home session failure detail.
- Priority rationale: small backend-to-web parity slice that improves runtime failure diagnosis.
- Why other candidates were deferred: broader session metadata like duration/events is less critical than failure detail.

### 3. Plan Implementation
- Files or surfaces to modify: `RuntimeSidebarSection.tsx`, focused sidebar test.
- Logic: message-first, stop-reason-second rendering inside existing warning.
- Edge cases: running session renders no warning; absent detail renders only existing generic warning.

### 4. Execute Implementation
- Implementation notes: derived `nonRunningSessionDetail` from `errorMessage` first, `stopReason` second, and rendered it inside the existing no-active-session warning only when present.

### 5. Verify and Test
- Validation performed: focused sidebar regression, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, whitespace diff check, full workspace build, Browser plugin attempt, and Playwright rendered dashboard smoke.
- Result: PASS. Browser plugin remained blocked by local Node `v22.13.0` requiring `>=22.22.0`, so rendered validation used bundled Codex Node plus Playwright.

### 6. Self-Review
- Simpler option considered: adding a generic translated reason, rejected because backend absence should not be invented.
- Technical debt introduced: no
- Scalability assessment: local UI parity addition; no new system.
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
- Endpoint and client contract match: yes, the UI uses existing Web runtime session fields from the API read model.
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, dev servers were restarted after build before rendered smoke
- Regression check performed: focused RuntimeSidebarSection regression plus rendered dashboard smoke

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator diagnosing selected-bot runtime failure or stop state
- Existing workaround or pain: switch to Bots Monitoring or infer from logs instead of seeing backend detail on Dashboard Home
- Smallest useful slice: render existing backend detail in existing warning
- Success metric or signal: focused tests and rendered smoke evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: Dashboard Home runtime failure diagnosis
- SLI: dashboard renders backend session failure detail without client errors in smoke
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: build/test gates
- Logs, dashboard, or alert route: browser console evidence
- Smoke command or manual smoke: authenticated `/dashboard` Playwright smoke with bundled Codex Node
- Rollback or disable path: revert sidebar session-detail rendering

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated runtime session diagnostic already returned by the runtime read model
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
Dashboard Home now renders backend session failure detail in the existing inactive-session warning. The UI shows `errorMessage` first, falls back to `stopReason`, and keeps the warning generic when the backend provides neither field. This closes a selected-bot runtime diagnostics gap without changing API, DB, auth, order execution, or trading behavior.
