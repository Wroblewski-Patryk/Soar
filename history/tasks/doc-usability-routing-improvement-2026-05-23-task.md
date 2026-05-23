# Task

## Header
- ID: DOC-USABILITY-ROUTING-IMPROVEMENT-2026-05-23
- Title: Improve documentation usefulness after graph cleanup
- Task Type: refactor
- Current Stage: implementation
- Status: DONE
- Owner: Active chat as Coordinator
- Depends on: DOC-FINAL-CONTENT-CLARITY-SCAN-2026-05-23
- Priority: P2
- Module Confidence Rows: not applicable; documentation-only task
- Requirement Rows: not applicable
- Quality Scenario Rows: maintainability/documentation usability
- Risk Rows: documentation drift and stale source-of-truth routing
- Iteration: 2026-05-23 documentation iteration
- Operation Mode: BUILDER
- Mission ID: DOC-USABILITY-ROUTING-IMPROVEMENT-2026-05-23
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the current documentation-maintenance iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was considered through active mission rules.
- [x] Missing or template-like state tables were not needed for this docs-only task.
- [x] Affected module confidence rows were identified as not applicable.
- [x] Affected requirement, quality scenario, and risk rows were identified at documentation-usability level.
- [x] The task improves release confidence by reducing agent routing mistakes.

## Mission Block
- Mission objective: make the cleaned documentation structure more useful as a practical routing system for humans and coding agents.
- Release objective advanced: reduce documentation drift and wrong-source usage before future implementation or verification tasks.
- Included slices:
  - improve main documentation entrypoint with decision-oriented work routes
  - improve agent work map with verification and update routing
  - align repository structure policy with the `docs/` versus `history/` split
  - refresh documentation inventory/drift language that still described old history placement
  - update active state after validation
- Explicit exclusions:
  - no app/runtime behavior changes
  - no production access, deployment, secrets, or LIVE exchange mutation
  - no new documentation framework
- Checkpoint cadence: one local docs-only checkpoint.
- Stop conditions: broken links, docs parity failure, or a docs/source-of-truth conflict requiring user decision.
- Handoff expectation: future agents can use the maps to decide source, evidence, and next action faster.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, `.agents/state/active-mission.md`, docs maps | Integration, state updates, final acceptance | Mission packet and result report | Parent validation gate | DONE |
| Docs usability | Coordinator serial lane | `docs/soar-documentation-map.md`, `docs/maps/agent-work-map.md` | Work-route guidance | Clearer human/agent routing | Link and graph checks | DONE |
| Docs governance | Coordinator serial lane | `docs/governance/repository-structure-policy.md`, `docs/CONTRIBUTING-DOCS.md` | Placement and usefulness rules | Updated docs/history policy | Guardrails and link checks | DONE |
| Docs analysis | Coordinator serial lane | `docs/analysis/*` | Inventory and drift records | Current classification after history split | Stale-reference scan | DONE |
| Documentation/Memory | Coordinator | `.codex/context/*`, `.agents/state/*` | Project state and task board | Updated status/evidence | Validation evidence | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for broad docs work.
- [x] `.agents/workflows/responsibility-lanes.md` was considered through AGENTS lane rules.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership does not require a learning entry.
- [x] Process eval is not required; this is a local docs-only improvement.

## Context
The repository documentation graph was already cleaned and connected, but the
operator asked to continue making the information more useful rather than only
well organized.

## Goal
Make key documentation entrypoints answer practical routing questions:
where to start, which source owns truth, where evidence lives, and what to
update before closing work.

## Success Signal
- User or operator problem: docs are connected but may still require too much interpretation.
- Expected product or reliability outcome: future agents choose the right current source and evidence path faster.
- How success will be observed: updated maps/policies plus green link and guardrail validation.
- Post-launch learning needed: no.

## Deliverable For This Stage
Documentation-only edits to existing docs maps, governance, and analysis files,
plus updated active state.

## Constraints
- use existing docs/maps/history structure
- do not add a parallel process or framework
- do not move runtime or app files
- keep docs in English

## Definition of Done
- [x] Main docs map has decision-oriented work routes.
- [x] Agent work map explains current-source, evidence, and verification routing.
- [x] Repository structure policy matches `history/` placement for evidence and artifacts.
- [x] Inventory/drift docs no longer describe historical evidence as current `docs/` contents.
- [x] Link, graph, guardrail, and docs parity checks pass.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - markdown link check: `1814` markdown files, `482` relative/file links, `0` missing targets
  - docs graph scan: `258` docs markdown files, `0` no-incoming files excluding root semantic hubs, `0` fully isolated docs files
  - stale routing scan found no old generated-output policy or old docs hub paths in active docs; remaining `V1EXCEL`/`V1FINAL` hits are historical task IDs in state/planning records
- Screenshots/logs: not applicable
- High-risk checks: not applicable; no runtime behavior
- Module confidence ledger updated: not applicable
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/12_documentation-governance.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: docs are graph-connected but some policy/inventory wording still routed evidence to old docs locations.
- Gaps: main maps were good entrypoints but lacked enough "work route" guidance for practical agent tasks.
- Inconsistencies: repository structure policy still described generated outputs under docs.
- Architecture constraints: current documentation truth belongs in `docs/`; historical proof belongs in `history/`.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: AGENTS, active mission, project memory index, docs maps, governance, documentation analysis files.
- Why it was safe to continue: the request is docs-only and follows the accepted docs/history split.

### 2. Select One Priority Mission Objective
- Selected task: improve documentation usefulness and routing clarity.
- Priority rationale: it builds directly on the user's docs/Obsidian feedback.
- Why other candidates were deferred: runtime and release tasks are unrelated to this docs-only request.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `docs/soar-documentation-map.md`
  - `docs/maps/agent-work-map.md`
  - `docs/governance/repository-structure-policy.md`
  - `docs/CONTRIBUTING-DOCS.md`
  - `docs/analysis/documentation-inventory.md`
  - `docs/analysis/documentation-drift.md`
  - active state files
- Logic: clarify source-of-truth routing, evidence placement, and closeout checks.
- Edge cases: preserve sparse graph model and avoid turning maps into noisy superhubs.

### 4. Execute Implementation
- Implementation notes:
  - Added decision-oriented work routes to `docs/soar-documentation-map.md`.
  - Added source/evidence/verification routing to `docs/maps/agent-work-map.md`.
  - Updated repository placement policy so generated evidence and raw output route to `history/*`.
  - Added usefulness requirements to `docs/CONTRIBUTING-DOCS.md`.
  - Refreshed documentation inventory and drift report after the docs/history split.

### 5. Verify and Test
- Validation performed: markdown link check, docs graph scan, stale routing scan, guardrails, docs parity, and diff check.
- Result: PASS. `git diff --check` reported no whitespace errors, only Windows LF/CRLF warnings.

### 6. Self-Review
- Simpler option considered: only add more links to maps.
- Technical debt introduced: no.
- Scalability assessment: updates reuse current maps and policies.
- Refinements made: kept changes in existing hub/policy files instead of adding a new docs framework.

### 7. Update Documentation and Knowledge
- Docs updated: yes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: improved documentation usefulness by adding decision routes, evidence/status routing, and current-vs-history placement rules.
- Files changed:
  - `docs/soar-documentation-map.md`
  - `docs/documentation-overview.md`
  - `docs/maps/agent-work-map.md`
  - `docs/governance/repository-structure-policy.md`
  - `docs/CONTRIBUTING-DOCS.md`
  - `docs/analysis/documentation-inventory.md`
  - `docs/analysis/documentation-drift.md`
  - `.agents/state/active-mission.md`
  - source-of-truth state files
- How tested: link check, docs graph scan, stale routing scan, guardrails, docs parity, diff check.
- What is incomplete: no runtime or production validation was needed or run.
- Next steps: apply the same `Pipelines`, `Tests`, and `Evidence` normalization to module deep dives as modules are next touched.
- Decisions made: no new framework; existing maps and policies are the canonical routing surface.
