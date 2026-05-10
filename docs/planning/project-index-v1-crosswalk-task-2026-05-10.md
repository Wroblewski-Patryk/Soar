# Task

## Header
- ID: PROJECT-INDEX-V1-CROSSWALK-2026-05-10
- Title: Add V1 matrix-to-code crosswalk to the project index
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: PROJECT-INDEXING-BASELINE-2026-05-10
- Priority: P1
- Iteration: 2
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The baseline index listed repository surfaces, but the next implementation
work still needed a direct map from each V1 product action matrix row to the
likely code, route, worker, script, and test surfaces.

## Goal
Extend the local project index so future work can choose a V1 row and
immediately see where to inspect, test, and collect proof.

## Scope
- `scripts/buildProjectIndex.mjs`
- `docs/operations/project-index-2026-05-10.md`
- `docs/operations/project-index-2026-05-10.json`
- source-of-truth state/planning files

## Implementation Plan
1. Add an explicit V1 surface map for all module action matrix rows.
2. Generate a prioritized V1 audit work map.
3. Include per-row risk, next proof, API modules, Web features, routes,
   workers, scripts, and candidate tests.
4. Regenerate Markdown and JSON index outputs.
5. Validate the script and repository guardrails.

## Acceptance Criteria
- Every V1 module action matrix row appears in the work map.
- Dashboard Home and Bot Runtime route mapping is precise enough for immediate
  next work.
- The report still preserves the current V1 status counts.
- The generated JSON includes machine-readable `v1WorkMap`.

## Definition of Done
- [x] Crosswalk exists for all 21 V1 rows.
- [x] Generated report contains summary and detailed per-row work map.
- [x] Validation commands pass.
- [x] Context files point future agents to the crosswalk before fixes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Product bug fixes.
- Production mutation.
- Live-money action.
- Treating structural index data as behavioral proof.

## Validation Evidence
- Tests:
  - `node --check scripts/buildProjectIndex.mjs`
  - `node scripts/buildProjectIndex.mjs --help`
  - `node scripts/buildProjectIndex.mjs --today 2026-05-10`
  - `node scripts/repoGuardrails.mjs`
  - `git diff --check`
- Manual checks:
  - Generated report shows all 21 V1 rows in `V1 Audit Work Map`.
  - Dashboard Home route count is `1`; Bot Runtime route count is `2`.
  - V1 counts remain `UNVERIFIED: 16`, `BLOCKED_AUTH: 2`,
    `PASS_LOCAL: 1`, `PARTIAL_LOCAL: 2`.
- Screenshots/logs: not applicable.
- High-risk checks: no production or live-trading actions were performed.

## Architecture Evidence
- Architecture source reviewed:
  - `.agents/core/operating-system.md`
  - `.agents/core/execution-loop.md`
  - `.agents/core/anti-regression.md`
  - `.agents/core/quality-gates.md`
  - `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Required states: not applicable
- Responsive checks: not applicable
- Accessibility checks: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the script/report changes if the generated crosswalk
  becomes misleading.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: the baseline index did not yet connect each V1 row to immediate
  implementation surfaces.
- Gaps: missing per-row route/test/script/workers hints slowed next repair
  selection.
- Inconsistencies: broad `/dashboard` prefix initially overmatched all
  dashboard routes and was refined to exact routes for Dashboard Home and Bot
  Runtime.
- Architecture constraints: keep the index local and non-authoritative for V1
  approval.

### 2. Select One Priority Task
- Selected task: add V1 matrix-to-code crosswalk.
- Priority rationale: this directly addresses the operator concern about
  repeated circular work.
- Why other candidates were deferred: functional fixes should start only after
  the map is complete enough to guide them.

### 3. Plan Implementation
- Files or surfaces to modify: index script, generated reports, planning/state
  docs.
- Logic: map each V1 row to known API/Web/route/worker/script/test surfaces.
- Edge cases: avoid overmatching root dashboard routes; keep blocked rows in
  the map without claiming they are executable.

### 4. Execute Implementation
- Implementation notes: added `v1SurfaceMap`, `v1WorkMap`, Markdown summary
  table, and per-row details.

### 5. Verify and Test
- Validation performed: syntax, help, generation, guardrails, diff check.
- Result: pass.

### 6. Self-Review
- Simpler option considered: manual work-map document.
- Technical debt introduced: no
- Scalability assessment: explicit map is easy to refine as rows are audited.
- Refinements made: route matching now supports exact routes plus prefixes.

### 7. Update Documentation and Knowledge
- Docs updated: project index, this task, state/planning files.
- Context updated: yes.
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
- Task summary: the project index now includes a prioritized V1 work map across
  all module action rows.
- Files changed:
  - `scripts/buildProjectIndex.mjs`
  - `docs/operations/project-index-2026-05-10.md`
  - `docs/operations/project-index-2026-05-10.json`
  - state/planning files
- How tested:
  - `node --check scripts/buildProjectIndex.mjs`
  - `node scripts/buildProjectIndex.mjs --help`
  - `node scripts/buildProjectIndex.mjs --today 2026-05-10`
  - `node scripts/repoGuardrails.mjs`
  - `git diff --check`
- What is incomplete: the index still does not prove behavior; it only guides
  the next action audits.
- Next steps: start `V1-DASHBOARD-HOME-BOT-RUNTIME-ACTION-AUDIT` using the
  crosswalk priority order.
- Decisions made: keep Dashboard Home and Bot Runtime route mapping exact to
  avoid noisy audit targeting.
