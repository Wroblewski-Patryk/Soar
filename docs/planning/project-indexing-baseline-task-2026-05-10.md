# Task

## Header
- ID: PROJECT-INDEXING-BASELINE-2026-05-10
- Title: Build a local project index for V1 continuation
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: V1 product action matrix
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator challenged previous V1 readiness claims after finding basic UI
action regressions. The repository now needs a repeatable local index that
future work can use before selecting and fixing the next V1 matrix row.

## Goal
Create a no-network repository indexing mechanism that maps the current V1
audit status to API modules, Web features, routes, workers, package scripts,
tests, architecture sources, and open queue markers.

## Scope
- `scripts/buildProjectIndex.mjs`
- `package.json`
- `docs/operations/project-index-2026-05-10.md`
- `docs/operations/project-index-2026-05-10.json`
- this planning task

## Implementation Plan
1. Add a local Node.js script that reads repository files only.
2. Parse the V1 module action matrix status counts.
3. Index API modules, Web features, routes, worker files, tests, package
   scripts, architecture docs, and unchecked queue markers.
4. Write Markdown and JSON reports for later audits.
5. Add an npm script entry for repeatable execution.

## Acceptance Criteria
- The index command writes Markdown and JSON outputs.
- The V1 matrix counts include only the module action matrix.
- The report clearly states it is not final V1 approval evidence.
- The generated output identifies the next audit starting surfaces.

## Definition of Done
- [x] Existing architecture and workflow docs were reviewed.
- [x] The indexing mechanism was implemented without production access.
- [x] The generated report was created for the current evidence date.
- [x] Validation evidence is recorded.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Production mutation.
- Live-money or destructive action.
- Treating this index as proof that V1 is complete.
- Fixing module bugs before the index baseline is captured.

## Validation Evidence
- Tests:
  - `node scripts/buildProjectIndex.mjs --help` passed.
  - `node scripts/buildProjectIndex.mjs --today 2026-05-10` passed and wrote
    `docs/operations/project-index-2026-05-10.md` plus JSON.
- Manual checks:
  - Confirmed V1 status counts are `UNVERIFIED: 16`, `BLOCKED_AUTH: 2`,
    `PASS_LOCAL: 1`, `PARTIAL_LOCAL: 2`.
  - Confirmed package script `ops:project:index` exists.
- Screenshots/logs: not applicable.
- High-risk checks: no production or live-trading actions were performed.

## Architecture Evidence
- Architecture source reviewed:
  - `.agents/core/operating-system.md`
  - `.agents/core/execution-loop.md`
  - `.agents/core/anti-regression.md`
  - `.agents/core/quality-gates.md`
  - `docs/governance/autonomous-engineering-loop.md`
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
- Rollback note: remove the script and generated docs if this index becomes
  obsolete.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: V1 remains `NO-GO`; most matrix rows are not action-proven.
- Gaps: no single generated index tied V1 matrix rows to API/Web/test surfaces.
- Inconsistencies: queue files contain blocked-by-input work in active areas.
- Architecture constraints: reuse existing docs/planning systems and avoid new
  runtime systems.

### 2. Select One Priority Task
- Selected task: create a local project indexing mechanism.
- Priority rationale: future repairs need a reliable map before implementation.
- Why other candidates were deferred: module fixes would be premature before
  establishing the baseline requested by the operator.

### 3. Plan Implementation
- Files or surfaces to modify: script, package script, generated operations
  report, planning evidence.
- Logic: scan local files, parse known docs, summarize surfaces.
- Edge cases: avoid counting the confirmed findings table as module status;
  exclude worker test files from worker runtime inventory.

### 4. Execute Implementation
- Implementation notes: added `scripts/buildProjectIndex.mjs` and
  `ops:project:index`.

### 5. Verify and Test
- Validation performed: help command and report generation.
- Result: pass.

### 6. Self-Review
- Simpler option considered: a manual Markdown index only.
- Technical debt introduced: no
- Scalability assessment: JSON output allows later automation without changing
  the planning format.
- Refinements made: matrix parser was tightened to the module matrix section
  after a first run counted the findings table.

### 7. Update Documentation and Knowledge
- Docs updated: generated project index and this task artifact.
- Context updated: no durable product truth changed.
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
The first `corepack pnpm` invocation failed on this workstation with a Corepack
signature error before the script ran. The script was validated directly with
Node because it has no package dependency and performs only local file reads and
writes.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operator and future implementation agents
- Existing workaround or pain: repeated manual audits with unclear readiness
  claims.
- Smallest useful slice: local index generator and current report.
- Success metric or signal: future work can select one V1 row and immediately
  find likely API/Web/test surfaces.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: yes

## Reliability / Observability Evidence
- Critical user journey: V1 audit continuation.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: `node scripts/buildProjectIndex.mjs --today 2026-05-10`
- Rollback or disable path: remove generated report and script entry.

## Security / Privacy Evidence
- Data classification: local repository metadata only.
- Trust boundaries: no production access, no credentials, no network.
- Permission or ownership checks: not applicable.
- Abuse cases: script must not execute product actions or production calls.
- Secret handling: no secrets read intentionally.
- Security tests or scans: not applicable.
- Fail-closed behavior: script exits non-zero on filesystem/read errors.
- Residual risk: generated counts are structural and do not prove behavior.

## Result Report
- Task summary: added repeatable local project indexing and generated the
  current index.
- Files changed:
  - `scripts/buildProjectIndex.mjs`
  - `package.json`
  - `docs/operations/project-index-2026-05-10.md`
  - `docs/operations/project-index-2026-05-10.json`
  - `docs/planning/project-indexing-baseline-task-2026-05-10.md`
- How tested:
  - `node scripts/buildProjectIndex.mjs --help`
  - `node scripts/buildProjectIndex.mjs --today 2026-05-10`
- What is incomplete: this does not run module action audits or fix any V1 row.
- Next steps: use the index to execute the next Dashboard Home/Bot Runtime
  action audit slice.
- Decisions made: keep the index local and no-network so it can be run before
  every future repair.
