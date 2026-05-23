# Task

## Header
- ID: V1UI-35
- Title: feat(web-runtime): show dashboard signal runtime detail
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: V1UI-34
- Priority: P1
- Iteration: 35
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The API runtime symbol stats read model exposes `lastSignalMessage` and `lastSignalReason`, and Bots Monitoring already renders those values as runtime detail. Dashboard Home signal cards currently render context source, score summary, and condition lines, but they hide the backend runtime detail. That leaves the primary operator dashboard less aligned with the backend signal decision diagnostics.

## Goal
Render backend-provided signal runtime detail on Dashboard Home signal cards without inventing fallback text when the backend does not provide message or reason.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- Rendered smoke for `/dashboard`
- Planning/context queue documentation for this slice

## Success Signal
- User or operator problem: the primary dashboard should show why the runtime made or skipped the latest signal decision when the backend provides that reason.
- Expected product or reliability outcome: Dashboard Home signal cards match the backend diagnostics already exposed by the runtime read model.
- How success will be observed: focused component test proves message/reason rendering and absence when backend detail is absent; rendered smoke confirms Dashboard Home remains healthy.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the smallest safe UI parity slice and record verification evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Reuse the Bots Monitoring runtime-detail precedence: `lastSignalMessage` first, then `lastSignalReason`.
2. Render the backend detail compactly on each signal card only when present.
3. Extend focused signal-card tests for message/reason parity and absence behavior.
4. Run focused, quality, build, and rendered validation.
5. Update task board, project state, and MVP queue with evidence.

## Acceptance Criteria
- Dashboard Home signal cards render `lastSignalMessage` when provided by the backend.
- Dashboard Home signal cards render `lastSignalReason` when message is absent.
- Dashboard Home does not render invented detail when both backend fields are absent.
- No API, DB, auth, order, or trading behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items satisfied with evidence.
- [x] Focused `RuntimeSignalsSection` tests pass.
- [x] Relevant web validation and workspace gates pass.
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
- Tests: PASS `pnpm.cmd --dir apps/web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx` (`4/4`); PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`); PASS `pnpm.cmd --filter web run typecheck`; PASS `pnpm.cmd --filter web run lint`; PASS `pnpm.cmd run quality:guardrails`; PASS `git diff --check`; PASS `pnpm.cmd run build`.
- Manual checks: PASS authenticated rendered `/dashboard` smoke after restarting dev servers; page reached `/dashboard`, title `Soar`, heading `Dashboard`, no framework overlay, no console warnings/errors, no page errors, and no 5xx responses.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\v1ui35-dashboard-smoke.png`; route-reachable i18n audit artifact refreshed at `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`.
- High-risk checks: no money movement, secrets, permissions, live trading, AI, or DB changes in scope

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home signal cards and Bots Monitoring runtime detail
- Canonical visual target: current implementation
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing signal-card typography and Bots Monitoring detail precedence
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
- Accessibility checks: semantic text only, no new interactive control
- Parity evidence: Dashboard Home now uses the same backend message/reason precedence as Bots Monitoring.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert `RuntimeSignalsSection` detail rendering change
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home signal cards hide backend `lastSignalMessage` and `lastSignalReason`.
- Gaps: Bots Monitoring already uses those fields, but Dashboard Home only shows context source, score, and conditions.
- Inconsistencies: API/Web types expose runtime detail; the primary dashboard does not render it.
- Architecture constraints: runtime signal diagnostics must stay source-of-truth driven by backend read models.

### 2. Select One Priority Task
- Selected task: render signal runtime detail on Dashboard Home.
- Priority rationale: this is a small TESTER-mode backend-to-web parity gap in the operator's primary runtime surface.
- Why other candidates were deferred: the investigated client-navigation console warning reproduced as a Next dev client-navigation issue and was not fixed by changing app route progress timing.

### 3. Plan Implementation
- Files or surfaces to modify: `RuntimeSignalsSection.tsx`, `RuntimeSignalsSection.test.tsx`.
- Logic: derive detail from backend message or reason and render only when non-empty.
- Edge cases: message takes precedence; reason renders when message is empty; absent detail renders nothing.

### 4. Execute Implementation
- Implementation notes: `RuntimeSignalsSection` now derives runtime detail from `lastSignalMessage?.trim() || lastSignalReason?.trim() || null` and renders it as compact non-interactive card text only when present.

### 5. Verify and Test
- Validation performed: focused component test, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, whitespace diff check, full workspace build, Browser plugin attempt, and Playwright rendered dashboard smoke.
- Result: PASS. Browser plugin remained blocked by local Node `v22.13.0` requiring `>=22.22.0`, so rendered validation used bundled Codex Node plus Playwright.

### 6. Self-Review
- Simpler option considered: add a translated generic fallback, rejected because absent backend detail should not be invented.
- Technical debt introduced: no
- Scalability assessment: local component parity with existing Bots behavior; no new system.
- Refinements made: route-progress timing was investigated and manually reverted because it did not address the reproduced Next dev client-navigation warning.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, MVP queue, task board, project state, and route-reachable i18n audit artifact.
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
- Endpoint and client contract match: yes; Web type uses API runtime symbol stat fields
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, dev servers were restarted after build before final rendered smoke
- Regression check performed: focused RuntimeSignalsSection regression plus rendered dashboard smoke

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator diagnosing runtime signal decisions
- Existing workaround or pain: open Bots Monitoring for detail instead of seeing it on the primary dashboard
- Smallest useful slice: render existing backend message/reason on signal cards
- Success metric or signal: focused tests and smoke evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: Dashboard Home runtime signal diagnosis
- SLI: dashboard renders backend signal detail without client errors in smoke
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: existing app build and rendered smoke
- Logs, dashboard, or alert route: browser console evidence
- Smoke command or manual smoke: authenticated `/dashboard` Playwright smoke with bundled Codex Node
- Rollback or disable path: revert the signal-card detail rendering change

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime diagnostic text already returned to the authenticated dashboard client
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low; this renders existing authenticated runtime read-model fields

## Result Report
Dashboard Home signal cards now render backend-provided runtime detail using existing runtime read-model fields. When `lastSignalMessage` is present it is shown; when it is absent but `lastSignalReason` is present, the reason is shown; when both are absent, no invented fallback text is rendered. This closes a backend-to-web parity gap with Bots Monitoring without changing API, DB, auth, order, or trading behavior.
