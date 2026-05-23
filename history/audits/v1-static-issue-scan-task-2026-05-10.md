# Task

## Header
- ID: V1-STATIC-ISSUE-SCAN-2026-05-10
- Title: Scan V1 inconsistencies and unfinished surfaces
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: PROJECT-INDEX-V1-CROSSWALK-2026-05-10
- Priority: P1
- Iteration: 3
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The project needs a fuller picture of inconsistencies, unfinished surfaces,
and proof gaps before more feature fixes are attempted. The prior project
index gives the map; this task adds a static issue scan on top of it.

## Goal
Create and run a local static scan that identifies V1 proof gaps, route/feature
surface gaps, test gaps, documented placeholders, source markers, and queue
hygiene issues.

## Scope
- `scripts/runV1StaticIssueScan.mjs`
- `package.json`
- `history/audits/v1-static-issue-scan-2026-05-10.md`
- `history/artifacts/v1-static-issue-scan-2026-05-10.json`
- state/planning files

## Implementation Plan
1. Add a no-network static scan script that consumes the generated project
   index.
2. Detect V1 rows without accepted proof, empty Web features, missing expected
   dashboard routes, API/Web test gaps, placeholder docs, queue drift, and
   high-signal source markers.
3. Classify ExchangeNotImplemented and placeholder adapter copy as capability
   gates for triage, not automatic P0 code bugs.
4. Generate Markdown and JSON reports.
5. Validate syntax, help output, generation, guardrails, and diff hygiene.

## Acceptance Criteria
- The scan reports V1 proof gaps and concrete surface gaps separately.
- False positives from ordinary form `placeholder` attributes are excluded.
- Capability-gate markers are not misreported as confirmed P0 bugs.
- The output gives a next-work interpretation.

## Definition of Done
- [x] Static scan script exists and is runnable.
- [x] Current scan report is generated.
- [x] Report is linked from source-of-truth state.
- [x] Validation evidence is recorded.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Product behavior fixes.
- Production mutation.
- Live-money action.
- Treating static findings as runtime proof.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1StaticIssueScan.mjs`
  - `node scripts/runV1StaticIssueScan.mjs --help`
  - `node scripts/runV1StaticIssueScan.mjs --today 2026-05-10`
  - `node scripts/repoGuardrails.mjs`
  - `git diff --check`
- Manual checks:
  - Scan produced 60 findings: `P0: 11`, `P1: 16`, `P2: 33`.
  - Categories include V1 proof gaps, Web surface/route gaps, API/Web test
    gaps, documented placeholders, queue drift, and capability gates.
  - Ordinary form placeholder attributes are not reported as issues.
- Screenshots/logs: not applicable.
- High-risk checks: no production or live-trading actions were performed.

## Architecture Evidence
- Architecture source reviewed:
  - `.agents/core/anti-regression.md`
  - `.agents/core/quality-gates.md`
  - `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
  - `history/plans/project-index-2026-05-10.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: remove the scan script/report if the approach becomes
  misleading.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: V1 has 21 matrix rows, most without action-level proof.
- Gaps: missing route/page surfaces for `/dashboard/orders` and
  `/dashboard/positions`; empty Web orders feature; positions Web feature has
  no tests; subscriptions API module has no tests.
- Inconsistencies: queue contains real unchecked work and unchecked `(none)`
  markers.
- Architecture constraints: static scan cannot replace vertical action proof.

### 2. Select One Priority Task
- Selected task: create full static issue scan.
- Priority rationale: the operator asked for a complete state picture before
  continuing implementation.
- Why other candidates were deferred: fixing Dashboard/Bot Runtime before this
  scan would continue the earlier cycle of targeted repairs without a full map.

### 3. Plan Implementation
- Files or surfaces to modify: scan script, package script, generated reports,
  state/planning files.
- Logic: consume project index, classify findings, render Markdown and JSON.
- Edge cases: distinguish fail-closed capability gates from confirmed product
  bugs.

### 4. Execute Implementation
- Implementation notes: added `ops:project:scan` and generated current scan.

### 5. Verify and Test
- Validation performed: syntax, help, generation, guardrails, diff check.
- Result: pass.

### 6. Self-Review
- Simpler option considered: ad hoc `rg` report.
- Technical debt introduced: no
- Scalability assessment: JSON output can feed future dashboards or triage.
- Refinements made: reduced false positives from generated docs, ordinary
  form placeholders, and capability-gate markers.

### 7. Update Documentation and Knowledge
- Docs updated: scan report and this task.
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
- Task summary: added a static V1 issue scan and generated the current report.
- Files changed:
  - `scripts/runV1StaticIssueScan.mjs`
  - `package.json`
  - `history/audits/v1-static-issue-scan-2026-05-10.md`
  - `history/artifacts/v1-static-issue-scan-2026-05-10.json`
  - state/planning files
- How tested:
  - `node --check scripts/runV1StaticIssueScan.mjs`
  - `node scripts/runV1StaticIssueScan.mjs --help`
  - `node scripts/runV1StaticIssueScan.mjs --today 2026-05-10`
  - `node scripts/repoGuardrails.mjs`
  - `git diff --check`
- What is incomplete: no browser/API/DB action proof was executed in this
  scan-only task.
- Next steps: start with Dashboard Home/Bot Runtime action audit, while also
  deciding whether Orders/Positions need dedicated routes or explicit
  Dashboard Home ownership.
- Decisions made: classify capability-gate markers as P2 triage unless the V1
  row requires support for that exact operation.
