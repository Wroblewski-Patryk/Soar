# Task

## Header
- ID: V1UX-BOTS-03
- Title: Lock canonical bot preview and assistant route shells
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UX-ROUTES-02
- Priority: P1
- Iteration: V1 route parity pass 3
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The canonical dashboard route map still lists `/dashboard/bots/:id/preview`
and `/dashboard/bots/:id/assistant` as first-class V1 surfaces. Local bot route
coverage already existed for list/create/edit plus the legacy redirects, but
the two canonical bot-specific shells still relied mainly on feature tests and
route-locale smoke instead of page-level App Router locks. This task closes
that narrow gap without changing runtime or assistant behavior.

## Goal
Add focused route-shell smoke coverage for the canonical bot preview and
assistant pages.

## Success Signal
- User or operator problem: bot-specific dashboard routes can drift even when
  component tests remain green.
- Expected product or reliability outcome: the shipped App Router shells for
  bot monitoring and assistant configuration stay aligned with the documented
  canonical route map.
- How success will be observed: dedicated page tests exist, the bot module docs
  reference them, and local web typecheck passes.
- Post-launch learning needed: no

## Deliverable For This Stage
Focused automated verification coverage plus synchronized docs/context for the
remaining canonical bot-specific route shells.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/web/src/app/dashboard/bots/[id]/preview/page.test.tsx`
- `apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx`
- `docs/modules/web-bots.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Add a page-shell test for `/dashboard/bots/:id/preview` that proves the
   breadcrumb shell and `BotsManagement` monitoring tab binding stay canonical.
2. Add a page-shell test for `/dashboard/bots/:id/assistant` that proves the
   breadcrumb shell and assistant-tab lock stay canonical.
3. Sync `web-bots` evidence and canonical planning/context notes.
4. Run the strongest local validation available in this sandbox and record the
   exact limitation honestly.

## Acceptance Criteria
- [x] `/dashboard/bots/:id/preview` has a dedicated page-shell smoke test.
- [x] `/dashboard/bots/:id/assistant` has a dedicated page-shell smoke test.
- [x] Tests assert the intended `BotsManagement` tab lock and preferred bot id.
- [x] `web-bots` deep-dive references the new route-shell evidence.
- [x] Canonical planning/context docs record the completed local slice.

## Definition of Done
- [x] Route-shell smoke tests are added for the declared routes.
- [x] Existing bot route behavior is unchanged.
- [x] Canonical docs/context are updated.

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
  - PASS: `pnpm --filter web exec vitest run ...` refreshed focused
    route-smoke pack including bot preview and assistant route shells
    (`18/18` files, `19/19` tests)
  - PASS: `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`
  - PASS: `pnpm --filter web run build`
  - PASS: `pnpm run quality:guardrails`
- Manual checks: not applicable
- Screenshots/logs: not applicable
- High-risk checks: canonical bot tab lock, preferred bot routing context, and
  breadcrumb shell stability

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: canonical dashboard route map + existing bot route shells
- Canonical visual target: existing bot route shells
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `PageTitle`, `BotsManagement`, canonical breadcrumb shell
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in scope
- Required states: success
- Responsive checks: not applicable
- Input-mode checks: keyboard
- Accessibility checks: heading and breadcrumb shell remain present
- Parity evidence: route-shell page tests

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert page tests/docs only
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: canonical bot-specific routes existed without dedicated page-shell tests.
- Gaps: preview and assistant routes depended on feature-level tests only.
- Inconsistencies: canonical route map declared first-class surfaces with weaker direct verification than neighboring modules.
- Architecture constraints: reuse existing `PageTitle` and `BotsManagement` contracts only.

### 2. Select One Priority Task
- Selected task: `V1UX-BOTS-03` route-shell smoke for bot preview and assistant pages.
- Priority rationale: highest-value remaining local parity gap under canonical bot views without touching runtime logic.
- Why other candidates were deferred: stage/prod evidence tasks remain externally blocked; broader bot/runtime confidence needs protected environments.

### 3. Plan Implementation
- Files or surfaces to modify: two page tests, bot module doc, planning/context docs.
- Logic: mock the route shell seam and assert canonical tab + preferred bot bindings.
- Edge cases: param-driven preferred bot id must be forwarded exactly for both tabs.

### 4. Execute Implementation
- Implementation notes: added focused page tests that keep the route contract explicit while avoiding feature-behavior duplication.

### 5. Verify and Test
- Validation performed: focused route-smoke pack, `web` typecheck, `web` build,
  repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely on existing `BotsManagement` and route-locale tests only.
- Technical debt introduced: no
- Scalability assessment: route-shell tests are small and isolate App Router drift from feature-container changes.
- Refinements made: assertions cover both breadcrumbs and `BotsManagement` tab locks.

### 7. Update Documentation and Knowledge
- Docs updated: `web-bots`, canonical planning/context files.
- Context updated: `mvp-*` planning files and `.codex/context` docs.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
- [x] Docs were updated and `.codex/context` sync was attempted.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This slice strengthens local route parity only; it does not replace
  production browser evidence for bot monitoring/assistant flows.

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
- User or operator affected: operators using bot monitoring and assistant routes
- Existing workaround or pain: route drift could hide behind feature-level tests
- Smallest useful slice: dedicated page-shell locks for the two missing canonical bot routes
- Success metric or signal: tests exist and docs/context reference them
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: open bot-specific monitoring and assistant surfaces from canonical routes
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused route-smoke pack plus `web` typecheck
- Rollback or disable path: revert test/docs only

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: no user data touched
- Trust boundaries: protected dashboard routes unchanged
- Permission or ownership checks: unchanged; route tests only
- Abuse cases: not applicable
- Secret handling: none
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: no production/browser proof added in this task

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: added canonical page-shell smoke tests for bot preview and
  assistant routes and synced bot-module evidence plus planning/context docs.
- Files changed: two page tests, `web-bots` doc, planning/context files, task packet.
- How tested: focused route-smoke pack PASS, `web` typecheck PASS, `web` build
  PASS, repository guardrails PASS.
- What is incomplete: no protected production/browser evidence for these routes,
  because the active production/stage evidence wave remains externally gated.
- Next steps: continue local route-parity only if another canonical dashboard
  route still lacks a page-shell lock; otherwise return to blocked V1
  stage/prod/manual evidence work.
- Decisions made: kept scope to regression locks only; no runtime/UI behavior changes.
