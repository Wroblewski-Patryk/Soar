# Task

## Header
- ID: V1UI-40
- Title: fix(web-runtime): fail closed unknown runtime signal labels
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: V1UI-39
- Priority: P1
- Iteration: 40
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1UI-39` shared runtime signal label suffix semantics across Dashboard Home
and Bots Monitoring. TESTER review now checks the fail-closed edge: Web must
handle unexpected backend runtime market state or context source values without
throwing or rendering misleading labels.

## Goal
Make unknown runtime signal context source and market state values an explicit
supported input for Web label suffix resolution, and prove both Dashboard Home
and Bots Monitoring fall back to unresolved labels.

## Scope
- `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.ts`
- `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- `apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: runtime UI must not mislead the operator if backend
  adds or emits an unexpected runtime signal enum value.
- Expected product or reliability outcome: unknown values render existing
  unresolved labels in both Web surfaces.
- How success will be observed: focused utility and component tests plus normal
  Web quality gates and rendered `/dashboard` smoke.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement explicit unknown-value tolerance in the shared suffix resolver types,
add regression coverage, verify, and update planning/context evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- do not change displayed copy, styling, API contracts, database schema, or
  exchange/runtime execution behavior

## Implementation Plan
1. Widen shared runtime label resolver input types to include unknown strings.
2. Add utility tests proving unexpected strings resolve to `Unresolved`.
3. Add Dashboard Home and Bots Monitoring component tests proving unexpected
   runtime values render existing unresolved labels.
4. Run focused tests and relevant Web quality gates.
5. Attempt Browser validation first; use Playwright fallback only if Browser
   runtime remains blocked.
6. Update task board, project state, MVP queue, and task evidence.

## Acceptance Criteria
- Unknown market state values resolve to the existing unresolved market-state
  labels.
- Unknown context source values resolve to the existing unresolved context
  source labels.
- Dashboard Home and Bots Monitoring keep route-owned labels.
- No user-visible copy or layout change is introduced for known values.

## Definition of Done
- [x] Focused utility and component tests cover unknown runtime values.
- [x] Web typecheck, Web lint, repository guardrails, route-reachable i18n
  audit, `git diff --check`, full build, and rendered `/dashboard` smoke pass
  or any blocker is documented.
- [x] Task board, project state, and MVP next commits queue are updated.

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
- Tests: `pnpm.cmd --dir apps/web exec vitest run src/features/bots/utils/runtimeSignalLabelKeys.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx` (`3` files, `10/10` tests), `pnpm.cmd --filter web run typecheck`, `pnpm.cmd --filter web run lint`, `pnpm.cmd run quality:guardrails`, `pnpm.cmd i18n:audit:route-reachable:web`, `git diff --check`, `pnpm.cmd run build`.
- Manual checks: authenticated rendered `/dashboard` smoke through bundled
  Codex Node + Playwright after Browser plugin invocation failed on local Node
  version.
- Screenshots/logs: `/dashboard` smoke screenshot saved outside the repo at
  `C:\Users\wrobl\AppData\Local\Temp\v1ui40-dashboard-smoke.png`; temporary
  dev-server logs stayed ignored under `.codex/tmp-v1ui40-*.log`.
- High-risk checks: no money movement, auth, exchange execution, or runtime
  execution behavior changes; this is a fail-closed Web presentation guard.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home and Bots Monitoring runtime
  surfaces
- Canonical visual target: unchanged existing UI
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: V1UI-39 runtime signal label suffix resolver
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes, rendered smoke showed route health without
  framework overlay.
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes, smoke-level only because visual
  output was intended to remain unchanged.
- Remaining mismatches: none observed in this slice.
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: no semantic/control changes expected
- Parity evidence: focused component tests and rendered smoke.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single Web test/hardening commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: shared resolver fallback behavior was implicit rather than encoded in
  its public input type and regression tests.
- Gaps: Dashboard Home and Bots Monitoring tests did not cover unexpected
  backend enum strings.
- Inconsistencies: known/null runtime values were covered more strongly than
  forward-compatible unknown values.
- Architecture constraints: unknown presentation truth must fail closed and
  avoid invented semantics.

### 2. Select One Priority Task
- Selected task: make unknown runtime signal labels fail closed in Web.
- Priority rationale: TESTER iteration should harden an edge case that can
  affect operator trust without requiring backend changes.
- Why other candidates were deferred: broader backend/API work would exceed
  the one-task slice and is not needed to prove this fail-closed UI behavior.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: accept unknown strings in suffix resolvers and assert they map to the
  unresolved suffix in both component surfaces.
- Edge cases: arbitrary future string values, null, and undefined.

### 4. Execute Implementation
- Implementation notes: widened shared runtime signal label resolver inputs to
  tolerate unknown strings and added focused utility, Dashboard Home, and Bots
  Monitoring tests proving unknown backend values render unresolved labels.

### 5. Verify and Test
- Validation performed: focused Vitest suite, Web typecheck, Web lint,
  repository guardrails, route-reachable i18n audit, `git diff --check`, full
  workspace build, and authenticated rendered `/dashboard` smoke.
- Result: PASS. Browser plugin validation was attempted first but local
  `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`; fallback
  smoke used bundled Codex Node and Playwright. Smoke result: URL
  `http://localhost:3002/dashboard`, title `Soar`, Dashboard heading visible,
  overlay count `0`, console warnings/errors `0`, page errors `0`, 5xx
  responses `0`.

### 6. Self-Review
- Simpler option considered: only add tests with casts against the current
  narrow type; rejected because the public resolver type should document the
  tolerated runtime input.
- Technical debt introduced: no
- Scalability assessment: this remains a small fail-closed utility contract.
- Refinements made: converted the Bots Monitoring unknown-value fixture through
  `unknown` before the component prop type so the test models runtime payload
  drift without weakening the component contract.

### 7. Update Documentation and Knowledge
- Docs updated: this task file and MVP next commits queue.
- Context updated: task board and project state.
- Learning journal updated: not applicable

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is defined.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Notes
This task intentionally keeps known-value output unchanged and only strengthens
the unknown-value fallback contract.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime dashboard and bot monitoring operators
- Existing workaround or pain: unexpected backend enum values had no explicit
  Web regression coverage
- Smallest useful slice: resolver type widening plus focused component tests
- Success metric or signal: unknown runtime values render unresolved labels
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: operator dashboard runtime diagnostics
- SLI: dashboard route renders without runtime errors
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: rendered `/dashboard` smoke
- Logs, dashboard, or alert route: browser console/page/response checks
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via
  bundled Codex Node + Playwright.
- Rollback or disable path: revert this commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes, rendered smoke uses API/Web dev servers
- Endpoint and client contract match: not applicable; no API contract change
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, API and Web dev servers were
  restarted for smoke validation.
- Regression check performed: focused component tests and full build.

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime presentation labels only
- Trust boundaries: no boundary changes
- Permission or ownership checks: no authz changes
- Abuse cases: no new input surface
- Secret handling: no secret changes
- Security tests or scans: typecheck/lint/guardrails/build
- Fail-closed behavior: unknown backend values resolve to unresolved labels
- Residual risk: low; display-only hardening

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Result Report
`V1UI-40` is closed. Shared runtime signal label resolvers now explicitly
tolerate unknown backend strings and fail closed to unresolved suffixes. Focused
Dashboard Home and Bots Monitoring tests prove unexpected market state and
context source values render existing unresolved labels instead of raw backend
strings or invented semantics. No backend, database, exchange execution,
displayed copy, or styling behavior changed.
