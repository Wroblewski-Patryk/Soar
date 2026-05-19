# Task

## Header
- ID: API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19
- Title: Add and run endpoint-level API docs parity audit
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Review
- Depends on: AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19
- Priority: P1
- Module Confidence Rows: no status changes
- Requirement Rows: REQ-AUDIT-031
- Quality Scenario Rows: not changed
- Risk Rows: RISK-031
- Iteration: 2026-05-19 endpoint docs parity audit
- Operation Mode: TESTER
- Mission ID: API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19
- Mission Status: VERIFIED_PASS_AFTER_FOLLOW_UP

## Process Self-Audit
- [x] The reusable audit registry controlled scope selection.
- [x] The task targeted `AUD-03` and `AUD-23`, the next largest safe audit gap.
- [x] No runtime behavior was changed.
- [x] A reusable audit command was added instead of a one-off manual report.
- [x] Partial result is recorded as partial, not hidden.

## Mission Block
- Mission objective: make endpoint-level API documentation parity measurable.
- Release objective advanced: future broad audits can compare endpoint docs
  coverage numerically.
- Included slices: Express route inventory extraction, module-doc route mention
  matching, JSON/Markdown audit artifact, source-of-truth updates.
- Explicit exclusions: fixing the documentation gaps, validating DTO/response
  semantics, production proof, LIVE/exchange mutation.
- Checkpoint cadence: add script, run audit, classify result, update baseline
  and state.
- Stop conditions: route extraction produces invalid mount paths, audit script
  cannot run, or result cannot be persisted.
- Handoff expectation: stable command and dated artifact with exact gap list.

## Context
The existing `docs:parity:check` verifies module/feature/route-level coverage
but does not prove that individual API endpoints are mentioned in module
deep-dives. The 2026-05-18 baseline left endpoint-level API docs parity as an
open audit gap.

## Goal
Add a reusable endpoint-level API docs parity audit and run it against the
current repository.

## Constraints
- Reuse existing docs and route structures.
- Do not change API behavior.
- Do not claim semantic DTO/response parity from route mention matching alone.
- Preserve explicit `PARTIAL` status when documentation gaps exist.

## Definition of Done
- [x] Reusable command exists.
- [x] Audit artifact exists in Markdown and JSON.
- [x] Gaps are counted by endpoint and module.
- [x] Baseline and source-of-truth state reference the result.
- [x] Guardrails pass after the script/docs update.

## Forbidden
- Runtime API behavior changes.
- Production or live trading validation.
- Treating route mention parity as full contract correctness.
- Hiding documentation gaps behind a PASS.

## Validation Evidence
- Added `scripts/auditApiEndpointDocsParity.mjs`.
- Added package script `docs:parity:endpoints:api`.
- Initial parser produced an incorrect market mount due a missing semicolon in
  `dashboard.routes.ts`; parser was corrected to line-based `router.use`
  scanning before accepting the result.
- `pnpm run docs:parity:endpoints:api -- --date 2026-05-19` completed and
  intentionally exited non-zero because status is `PARTIAL`.
- Artifact:
  - `docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md`
  - `docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.json`
- Result:
  - endpoints: `109`
  - documented: `77`
  - gaps: `32`
  - modules: `16`
- Existing module/route docs parity remains green:
  - `pnpm run docs:parity:check` PASS; API `22/22`, Web `16/16`, Routes `38/38`.

## Finding Summary

| ID | Severity | Layer | Finding | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| AUD-ENDPOINT-DOCS-001 | P2 | API docs | Endpoint-level docs parity was `PARTIAL`: `32` of `109` endpoints were not explicitly mentioned in module docs. | closed | Follow-up added the missing route mentions and reran endpoint parity: `109` documented, `0` gaps. |
| AUD-ENDPOINT-DOCS-002 | P3 | API docs tooling | Root/ops endpoints were included as `root` but did not map to a module deep-dive doc. | closed | Follow-up added `docs/modules/api-root.md` and mapped `root` endpoint parity to it. |

## Architecture Evidence
- Architecture source reviewed: dashboard/admin/root router mounts and module
  docs.
- Fits approved architecture: yes; audit tooling only.
- Mismatch discovered: documentation coverage gaps, not runtime architecture
  mismatch.
- Decision required from user: no for this docs gap closure.

## UX/UI Evidence
- Not applicable; backend documentation audit.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Rollback note: no rollback needed.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Existing docs parity is module-level and route-map-level only.

### 2. Select One Priority Mission Objective
- Selected task: endpoint-level API docs parity automation.

### 3. Plan Implementation
- Extract Express endpoint inventory, compare route mentions against
  `docs/modules/api-*.md`, persist Markdown/JSON artifacts.

### 4. Execute Implementation
- Added and ran the reusable audit script.

### 5. Verify and Test
- Script generated a stable initial `PARTIAL` result, then follow-up docs gap
  closure reran it as `PASS`. Existing docs parity still passes.

### 6. Self-Review
- Fixed a parser false positive before accepting the artifact.
- Kept the result as `PARTIAL` because gaps remain.

### 7. Update Documentation and Knowledge
- Updated audit baseline, registry, task board, project state, system health,
  next steps, requirements, risks, and documentation drift.

## Result Report
- Result: reusable endpoint docs parity audit exists and current run is `PASS`
  after follow-up docs gap closure.
- Files changed: script, package script, endpoint docs, module docs, docs/state
  artifacts.
- Tests/proofs run: `docs:parity:endpoints:api`, `docs:parity:check`.
- Deployment impact: none.
- Residual risk: semantic DTO/response parity remains outside route mention
  matching; rerun endpoint parity after API route changes.
