# Task

## Header
- ID: V1UI-39
- Title: refactor(web-runtime): share runtime signal label suffixes
- Task Type: refactor
- Current Stage: post-release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-38
- Priority: P1
- Iteration: 39
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home and Bots Monitoring both render backend runtime signal context
source and runtime market state values. Recent V1 slices brought Dashboard Home
closer to backend parity, but the two Web surfaces now duplicate enum-to-label
branching. Architecture requires runtime semantics to remain consistent while
each route owns its translation namespace.

## Goal
Remove duplicate runtime signal label semantics by sharing suffix resolvers for
context source and market state values, while preserving Dashboard Home and Bots
Monitoring route-owned translation prefixes.

## Scope
- `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.ts`
- `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.test.ts`
- `apps/web/src/features/bots/components/bots-management/monitoringRuntimeLabels.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: backend runtime signal states should not drift
  between Dashboard Home and Bots Monitoring presentation.
- Expected product or reliability outcome: one shared mapping for backend
  runtime signal suffix semantics, route-owned labels still independent.
- How success will be observed: focused unit tests, typecheck, lint, build, and
  rendered `/dashboard` smoke pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the shared suffix utility, wire both Web runtime surfaces to it,
validate behavior, and update repository planning/context evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- preserve route-owned translation keys for Dashboard Home and Bots Monitoring
- do not change backend contracts or displayed copy

## Implementation Plan
1. Add a small shared Web utility that maps backend runtime market state and
   context source values to stable label-key suffixes.
2. Refactor Bots Monitoring label helpers to compose their existing
   `dashboard.bots.monitoring.*` keys from those suffixes.
3. Refactor Dashboard Home signal cards to select route-owned prop labels using
   the same suffix helpers.
4. Add focused unit tests for the shared suffix utility and rerun existing
   Dashboard/Bots component tests.
5. Run Web quality gates, rendered `/dashboard` smoke, self-review, and update
   task/context docs.

## Acceptance Criteria
- Dashboard Home keeps `dashboard.home.runtime.*` labels.
- Bots Monitoring keeps `dashboard.bots.monitoring.*` labels.
- `POSITION_OPEN`, `SIGNAL_ACTIVE`, `EVALUATED_NO_TRADE`, `CONFIGURED_ONLY`,
  unknown/null market states resolve deterministically through one shared
  helper.
- `latest_signal`, `latest_decision`, `configured_fallback`, unknown/null
  context sources resolve deterministically through one shared helper.
- No displayed copy changes are introduced.

## Definition of Done
- [x] Shared suffix helper is covered by focused unit tests.
- [x] Existing Dashboard Home and Bots Monitoring tests pass.
- [x] Web typecheck, Web lint, repository guardrails, `git diff --check`, full
  build, and rendered `/dashboard` smoke pass or any blocker is documented.
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
- cross-route translation key borrowing

## Validation Evidence
- Tests: `pnpm.cmd --dir apps/web exec vitest run src/features/bots/utils/runtimeSignalLabelKeys.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx` (`3` files, `8/8` tests), `pnpm.cmd --filter web run typecheck`, `pnpm.cmd --filter web run lint`, `pnpm.cmd run quality:guardrails`, `pnpm.cmd i18n:audit:route-reachable:web`, `git diff --check`, `pnpm.cmd run build`.
- Manual checks: authenticated rendered `/dashboard` smoke through bundled
  Codex Node + Playwright after Browser plugin invocation failed on local Node
  version.
- Screenshots/logs: `/dashboard` smoke screenshot saved outside the repo at
  `C:\Users\wrobl\AppData\Local\Temp\v1ui39-dashboard-smoke.png`; temporary
  dev-server logs stayed ignored under `.codex/tmp-v1ui39-*.log`.
- High-risk checks: no auth, money movement, or exchange execution behavior is
  changed; UI-only mapping refactor still gets rendered route smoke.

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
- Existing shared pattern reused: route-owned translation labels with shared
  backend semantic suffixes, matching V1UI-33 mark-price suffix precedent
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
- Parity evidence: focused component tests plus rendered `/dashboard` smoke.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single Web refactor commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home and Bots Monitoring duplicate backend runtime market
  state and context source mapping.
- Gaps: no shared focused unit coverage for those label suffix semantics.
- Inconsistencies: route-owned labels are correct, but enum branching can drift.
- Architecture constraints: backend runtime semantics are shared; UI
  translation ownership remains route-local.

### 2. Select One Priority Task
- Selected task: share runtime signal label suffix resolvers.
- Priority rationale: ARCHITECT iteration should reduce structural drift after
  recent backend-to-Web parity slices.
- Why other candidates were deferred: new UI behavior would be less appropriate
  than removing duplicate mapping in this mode.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: map backend values to suffixes once, compose/select route-owned labels
  at each presentation surface.
- Edge cases: null, undefined, and unknown values must resolve to `Unresolved`.

### 4. Execute Implementation
- Implementation notes: added `runtimeSignalLabelKeys.ts` suffix resolvers for
  runtime market states and context sources, refactored Bots Monitoring to
  compose existing `dashboard.bots.monitoring.*` keys from those suffixes, and
  refactored Dashboard Home to select its existing route-owned prop labels from
  the same suffixes.

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
- Simpler option considered: leave duplicate local branches; rejected because
  V1 runtime parity now depends on two surfaces staying synchronized.
- Technical debt introduced: no
- Scalability assessment: small shared utility is sufficient for current
  backend enum surfaces without creating a new UI system.
- Refinements made: kept the helper at suffix level only so each route still
  owns its translation prefix and no cross-route copy coupling was introduced.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, MVP next commits queue, route-reachable i18n
  audit artifact.
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
This task intentionally does not change copy, styling, backend APIs, database
schema, runtime behavior, or exchange execution behavior.

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
- User or operator affected: operator comparing Dashboard Home and Bots runtime
  state diagnostics
- Existing workaround or pain: duplicate mapping branches across Web surfaces
- Smallest useful slice: shared suffix resolvers only
- Success metric or signal: no duplicate runtime signal label semantics remain
  between these two surfaces
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
- Fail-closed behavior: unknown/null backend values resolve to unresolved
  labels
- Residual risk: low; display-only refactor

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Result Report
`V1UI-39` is closed. Runtime signal market-state and context-source label
semantics now resolve through shared suffix helpers, while Dashboard Home keeps
`dashboard.home.runtime.*` labels and Bots Monitoring keeps
`dashboard.bots.monitoring.*` labels. No backend, database, exchange execution,
displayed copy, or styling behavior changed. Validation passed across focused
tests, Web quality gates, full build, i18n reachability audit, and rendered
`/dashboard` smoke.
