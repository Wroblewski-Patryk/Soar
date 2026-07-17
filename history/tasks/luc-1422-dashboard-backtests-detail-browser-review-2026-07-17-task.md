# Task

## Header
- ID: LUC-1422
- Title: Capture dashboard backtests detail browser proof or exact FE repair lane
- Task Type: research
- Current Stage: verification
- Status: BLOCKED
- Owner: Frontend Builder
- Depends on:
- Priority: P1
- Module Confidence Rows: not updated
- Requirement Rows: not updated
- Quality Scenario Rows: not updated
- Risk Rows: not updated
- Iteration: 2026-07-17
- Operation Mode: BUILDER
- Mission ID: LUC-1422-DASHBOARD-BACKTESTS-DETAIL-BROWSER-REVIEW-2026-07-17
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  close the `needs_browser_review` row for
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx` with truthful browser
  proof, or leave an exact FE repair lane if the route cannot be proven.
- Release objective advanced:
  the Dashboard overview browser-review queue moves past the backtests detail
  route wrapper instead of stalling on a route shell that already works.
- Included slices:
  focused route/browser proof, focused route-shell test pass, scanner override,
  source-of-truth refresh, and Paperclip-ready evidence packet.
- Explicit exclusions:
  runtime code edits, real backtest mutation, deploy, push, production login,
  exchange action, or feature-level closure for `BacktestRunDetails.tsx`.
- Checkpoint cadence:
  single verification heartbeat.
- Stop conditions:
  route wrapper browser proof classified and generated truth refreshed, or the
  exact stale-generator contradiction is captured with the next owner.
- Handoff expectation:
  if the queue still emits the same wrapper path after refresh, hand off the
  contradiction as project-truth tooling work instead of forcing a false FE
  closure.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake payload | issue closure, integration, state updates | final evidence packet | final project-truth readback | DONE |
| Frontend/QA | Frontend Builder | `docs/status/app-completion-index.md`, `docs/status/project-truth-index.md`, `docs/modules/web-backtest.md` | browser proof, scanner override, task/evidence docs | verified route proof | local protected-route harness plus focused route-shell test | DONE |
| Documentation/Memory | Coordinator | `.codex/context/*`, `docs/architecture/scanner-overrides.json` | source-of-truth refresh | updated queue and context notes | generator readback | BLOCKED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed through scoped issue readback.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded only if needed.
- [x] Process eval note was not required for this narrow proof slice.

## Context
`docs/status/app-completion-index.json` classified
`apps/web/src/app/dashboard/backtests/[id]/page.tsx` as
`Dashboard overview / needs_browser_review`. The route is a lightweight shell
over `BacktestRunDetails`, so the requested work was to prove the route wrapper
itself or surface an exact FE blocker.

## Goal
Prove the browser-review state for the dashboard backtests detail route wrapper
truthfully and update generated source of truth so the wrapper no longer
remains a Dashboard overview `needs_browser_review` gap.

## Success Signal
- User or operator problem:
  the Dashboard overview queue should stop pointing at the backtests detail
  route wrapper when that shell already works.
- Expected product or reliability outcome:
  project truth no longer classifies the wrapper page as needing browser
  review.
- How success will be observed:
  `app-completion-index` no longer lists
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx` with
  `risk=needs_browser_review`, and any remaining `project-truth` emission is
  explicitly classified as a tooling contradiction rather than an FE gap.
- Post-launch learning needed: no

## Deliverable For This Stage
A verification packet with route/browser evidence, refreshed scanner override
and indexes, and a Paperclip closeout-ready summary.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `apps/web/src/app/dashboard/backtests/[id]/page.tsx` has evidence-backed browser-review status.
- [x] Source-of-truth indexes are refreshed and read back.
- [x] Paperclip issue closeout can cite concrete evidence and residual risk.

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
  `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/[id]/page.test.tsx --reporter verbose`
  -> PASS (`1` file / `1` test).
- Manual checks:
  `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1422 --today 2026-07-17 --clusters backtests --dynamic-fixtures-only --intercept-fixture-api`
  -> PASS; unauthenticated route fails closed, fixture-backed detail route
  resolves, and list-page create navigation reaches `/dashboard/backtests/create`.
- Generator/readback:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS (`entityOverridesApplied=76`);
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS with `needsBrowserReview=41`, and
  `docs/status/app-completion-index.md` no longer lists
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS but still emits the stale backtests detail wrapper row in
  `docs/status/project-truth-index.json`.
- Screenshots/logs:
  `history/evidence/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.md`;
  `history/artifacts/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.json`.
- High-risk checks:
  no real backtest mutation, no production login, no exchange action, no secret
  or account readback.
- Module confidence ledger updated: no
- Module confidence rows closed or changed: none
- Requirements matrix updated: no
- Requirement rows closed or changed: none
- Quality scenarios updated: no
- Quality scenario rows closed or changed: none
- Risk register updated: no
- Risk rows closed or changed: none
- Reality status: blocked

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/scanner-overrides.json`,
  `docs/status/app-completion-index.json`,
  `docs/status/project-truth-index.json`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates:
  refreshed generated truth plus explicit stale-generator contradiction capture

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  local protected-route browser packet from `LUC-1422`
- Canonical visual target:
  `/dashboard/backtests/:id` should render the canonical details page shell and
  hand the selected run id into `BacktestRunDetails`
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused:
  local protected-route browser-review pattern already used for other route
  wrapper closures
- New shared pattern introduced: no
- Design-memory entry reused:
  not applicable
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy:
  not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches:
  this proof does not claim real authenticated owner data or feature-level
  `BacktestRunDetails` closure; `project-truth` still carries a stale wrapper
  row after the clean `app-completion` refresh
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks:
  route shell renders one level-one heading and breadcrumb in focused test
- Parity evidence:
  local protected-route matrix plus focused route-shell test

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  first Dashboard overview browser-review gap targeted the backtests detail
  wrapper path.
- Gaps:
  no existing override marked the wrapper page as browser-reviewed.
- Inconsistencies:
  route-shell test coverage existed, but generated truth still required browser
  proof on the wrapper path.
- Architecture constraints:
  use the existing local protected-route proof and scanner-override pattern,
  not a new proof system.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned:
  `AGENTS.md`, `.agents/core/project-memory-index.md`,
  `.agents/core/mission-control.md`, `docs/status/app-completion-index.*`,
  `docs/status/project-truth-index.*`, `docs/modules/web-backtest.md`,
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx`,
  `apps/web/src/app/dashboard/backtests/[id]/page.test.tsx`,
  `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`,
  `scripts/runLocalProtectedRouteActionProof.mjs`
- Rows created or corrected:
  scanner override for `apps/web/src/app/dashboard/backtests/[id]/page.tsx`
- Assumptions recorded:
  local fixture-backed route proof is sufficient for the wrapper browser-review
  row because the row targets the page shell, not feature-level data truth
- Blocking unknowns:
  none for the wrapper closure
- Why it was safe to continue:
  the requested issue explicitly allowed either proof capture or an exact FE
  repair lane, and the route-shell proof path already existed in-repo

### 2. Select One Priority Mission Objective
- Selected task:
  `[LUC-1422](/LUC/issues/LUC-1422)` dashboard backtests detail browser review
- Priority rationale:
  scoped wake payload assigned this exact issue and requested immediate action
- Why other candidates were deferred:
  deeper backtests feature or production-auth proof would exceed the wrapper
  scope and belong to separate rows

### 3. Plan Implementation
- Files or surfaces to modify:
  `docs/architecture/scanner-overrides.json`,
  `history/evidence/luc-1422-dashboard-backtests-detail-browser-review-2026-07-17.md`,
  `history/tasks/luc-1422-dashboard-backtests-detail-browser-review-2026-07-17-task.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Logic:
  run the smallest browser-proof harness and focused page test, attach the
  resulting evidence to the wrapper path, regenerate truth, and record the
  queue outcome
- Edge cases:
  local harness could fail to resolve fixture-backed navigation, or generated
  truth could continue emitting the same row despite the override

### 4. Execute Implementation
- Implementation notes:
  reused the existing local protected-route browser-review script and the same
  scanner-override closure pattern already used for admin/browser-review rows

### 5. Verify and Test
- Validation performed:
  focused Vitest route-shell pass, local protected-route browser matrix pass,
  generator refresh/readback
- Result:
  browser proof verified; blocked on stale `project-truth` emission

### 6. Self-Review
- Simpler option considered:
  rely on the existing route-shell test only; rejected because the queue
  explicitly required browser review rather than rendered-test proof alone
- Technical debt introduced: no
- Scalability assessment:
  the proof uses the existing reusable local protected-route harness and stays
  consistent with current browser-review closure practice
- Refinements made:
  scoped the override to the wrapper path only and kept deeper component proof
  out of scope

### 7. Update Documentation and Knowledge
- Docs updated:
  scanner override plus task/evidence packet
- Context updated:
  `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`,
  `.agents/state/module-confidence-ledger.md`
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Notes
Frontend/browser proof is complete. Remaining work belongs to project-truth
tooling because `project-truth-index` still emits the stale wrapper row after
the refreshed `app-completion` queue is clean.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence
