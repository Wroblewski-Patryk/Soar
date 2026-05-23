# Task

## Header
- ID: V1UI-33
- Title: Share runtime mark-price source label suffix semantics
- Task Type: refactor
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-32
- Priority: P1
- Iteration: 33
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home and Bots both expose runtime open-position mark price source
truth. V1UI-32 made `/dashboard` copy route-owned, but the label-source switch
was duplicated locally instead of sharing the semantic suffix contract.

## Goal
Keep route-owned labels for `/dashboard` and `/dashboard/bots` while sharing
the runtime mark-price source suffix mapping from the existing open-position
derivation module.

## Scope
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: runtime source labels stay consistent across
  backend-derived web surfaces without copy namespace leakage.
- Expected product or reliability outcome: one semantic mapping for mark-price
  source kinds; route-owned translation prefixes remain independent.
- How success will be observed: focused tests, typecheck, lint, guardrails,
  build, and rendered `/dashboard` smoke pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the shared suffix helper and update the Dashboard Home presenter to
prefix it through `dashboard.home.runtime.*`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve route-owned copy namespaces
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a shared mark-price source label suffix helper beside the existing
   open-position derivation utility.
2. Keep the existing Bots label-key resolver as a compatibility wrapper using
   the shared suffix helper.
3. Update Dashboard Home runtime table presenters to use the suffix helper with
   a Dashboard Home prefix.
4. Add focused presenter coverage for a non-default source suffix.
5. Run relevant validation and rendered `/dashboard` smoke.
6. Update task, project state, board, and next-commit queue evidence.

## Acceptance Criteria
- [ ] Dashboard Home no longer contains a duplicated mark-price source switch.
- [ ] Bots label-key behavior remains unchanged.
- [ ] Dashboard Home mark-price source labels still resolve through
  `dashboard.home.runtime.*`.
- [ ] Validation evidence is captured before completion.

## Definition of Done
- [ ] `DEFINITION_OF_DONE.md` reviewed for applicable expectations.
- [ ] Focused web tests pass.
- [ ] Web typecheck, lint, guardrails, build, and `git diff --check` pass.
- [ ] Rendered `/dashboard` smoke passes or a tool limitation is documented.
- [ ] Source-of-truth docs and context are updated.

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
- Tests:
  - PASS `pnpm.cmd --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` (`16/16`)
  - PASS `pnpm.cmd --filter web exec vitest run src/features/bots/utils/runtimeOpenPositionDerivations.test.ts --run` (`4/4`)
  - PASS `pnpm.cmd --filter web run typecheck`
  - PASS `pnpm.cmd --filter web run lint`
  - PASS `pnpm.cmd run quality:guardrails`
  - PASS `git diff --check`
  - PASS `pnpm.cmd run build`
- Manual checks: PASS authenticated `/dashboard` rendered smoke with reload
  and CTA interaction to `/dashboard/wallets/list`.
- Screenshots/logs: PASS `.codex/v1ui33-dashboard-smoke-refined.png` retained
  locally; dev logs retained under `.codex/tmp-v1ui33-*.log`.
- High-risk checks: no money-moving behavior changed; UI label derivation only

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module note updated

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime tables
- Canonical visual target: existing `/dashboard` runtime table behavior
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: runtime open-position derivation utility
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none for this behavior-preserving label refactor
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: no interactive behavior changed
- Parity evidence: Dashboard Home keeps `dashboard.home.runtime.*` while
  sharing the suffix semantic helper used by Bots.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not applicable
- Rollback note: revert the UI utility refactor commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: duplicated Dashboard Home mark-price source switch after route-owned
  copy cleanup.
- Gaps: shared semantics were not factored separately from route prefixes.
- Inconsistencies: none in rendered behavior, but the duplication risks future
  source-kind drift.
- Architecture constraints: route copy remains route-owned; runtime truth stays
  shared and strict.

### 2. Select One Priority Task
- Selected task: share mark-price source suffix semantics.
- Priority rationale: small ARCHITECT-mode convergence step after V1UI-32.
- Why other candidates were deferred: manual-order and runtime-graph slices are
  larger behavior changes and should remain separate tiny tasks.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: extract suffix mapping and prefix it per route.
- Edge cases: unknown or unavailable source must still map to unavailable.

### 4. Execute Implementation
- Implementation notes: added
  `runtimeOpenPositionMarkPriceSourceLabelSuffix`, kept the existing Bots
  resolver as a prefix wrapper, and updated Dashboard Home to prefix the shared
  suffix through `dashboard.home.runtime.*`.

### 5. Verify and Test
- Validation performed: focused tests, Web typecheck, Web lint, repository
  guardrails, `git diff --check`, full build, and rendered `/dashboard` smoke.
- Result: PASS

### 6. Self-Review
- Simpler option considered: keep local switch; rejected because it preserves
  duplicated semantic mapping.
- Technical debt introduced: no
- Scalability assessment: new runtime mark-price source kinds now need one
  suffix update plus route-owned translations.
- Refinements made: added focused coverage for the `runtime_candidate` source
  label through Dashboard Home route-owned keys.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-dashboard-home.md`,
  `docs/planning/mvp-next-commits.md`
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
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

## Notes
This task is intentionally behavior-preserving. It should not change API
payload handling, displayed labels, or trading/runtime actions.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, rendered smoke reloaded `/dashboard`
  after authentication before interaction.
- Regression check performed: yes, focused tests and full build passed.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reading backend runtime source
  truth.
- Existing workaround or pain: duplicated source-kind mapping across routes.
- Smallest useful slice: shared suffix helper with route-owned prefixes.
- Success metric or signal: no Dashboard Home `dashboard.bots.*` dependency and
  tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: inspect runtime open positions on `/dashboard`.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: rendered smoke console/page error capture
- Smoke command or manual smoke: PASS bundled Node/Playwright authenticated
  `/dashboard` smoke.
- Rollback or disable path: revert commit

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
- Data classification: non-sensitive UI runtime metadata label keys.
- Trust boundaries: no boundary change.
- Permission or ownership checks: no change.
- Abuse cases: not applicable.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: unavailable source still maps to unavailable label.
- Residual risk: low.

## Result Report

- Task summary: Shared the runtime mark-price source suffix mapping while
  preserving route-owned Dashboard Home and Bots translation prefixes.
- Files changed:
  - `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
  - `docs/modules/web-dashboard-home.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused tests, Web typecheck, Web lint, repository guardrails,
  `git diff --check`, full build, Browser plugin attempt, and bundled
  Node/Playwright rendered smoke.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next tiny backend-to-web runtime parity slice.
- Decisions made: source-kind suffix semantics are shared; copy prefixes remain
  route-owned.
