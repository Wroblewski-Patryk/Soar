# Task

## Header
- ID: DOC-HUB-FILENAME-SEMANTICS-2026-05-23
- Title: Rename documentation graph hubs to semantic area names
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: DOC-LOCAL-INDEX-COHESION-2026-05-23
- Priority: P2
- Module Confidence Rows: Documentation / Agent Knowledge
- Requirement Rows: REQ-DOC-004
- Quality Scenario Rows: QAS-DOC-004
- Risk Rows: RISK-DOC-004
- Iteration: 2026-05-23 documentation graph refinement
- Operation Mode: BUILDER
- Mission ID: DOC-HUB-FILENAME-SEMANTICS-2026-05-23
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was represented by `.agents/state/active-mission.md`.
- [x] Missing or template-like state tables were not present for this docs slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by making docs navigation clearer for humans and agents.

## Mission Block
- Mission objective: replace generic docs/history hub filenames with semantic area filenames so Obsidian graph hover labels identify the area.
- Release objective advanced: improve current-source-of-truth navigation without changing runtime behavior.
- Included slices: docs/history hub renames, reference updates, active state updates, link checks, graph checks, docs guardrails.
- Explicit exclusions: no app/runtime behavior changes, no production deployment, no live exchange mutation, no staging or commit.
- Checkpoint cadence: one bounded docs verification slice.
- Stop conditions: unresolved broken links, user-owned edits blocking a required rename, or script parity failure requiring broader architecture decision.
- Handoff expectation: future agents should add new docs to the nearest semantic area hub rather than creating generic `README.md` or `index.md` graph hubs.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, active mission, task board | Integration, task closure, source-of-truth updates | Mission packet and final acceptance | Parent validation gate | DONE |
| Documentation/Structure | Coordinator | docs map, history overview, docs governance | `docs/`, `history/` hub filenames and references | Semantic hub filenames | No generic hub files remain | DONE |
| QA/Test | Coordinator | docs parity and graph checks | Markdown links and graph connectivity | Link/graph evidence | Link checker, graph scan, guardrails, docs parity, diff check | DONE |
| Documentation/Memory | Coordinator | `.agents/state/*`, `.codex/context/*` | Durable state updates | Verified task/state records | Source-of-truth files updated | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] `.agents/workflows/responsibility-lanes.md` was represented by the lane table.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not found.
- [x] Process eval was updated through AEV-019.

## Context
The documentation graph was already more coherent after splitting `history/` and connecting current docs through local hubs. The operator then observed that the largest graph nodes still appeared as `README` or `index`, which did not reveal the area or perspective on hover.

## Goal
Rename current docs/history hub files to semantic filenames and update active references so large Obsidian nodes describe their area.

## Success Signal
- User or operator problem: graph hover labels on large nodes are generic and not useful.
- Expected product or reliability outcome: docs navigation is easier for humans and less ambiguous for agents.
- How success will be observed: no `README.md` or `index.md` files remain under `docs/` or `history/`, all links resolve, and graph connectivity remains intact.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified semantic hub filenames with updated docs/state references and validation evidence.

## Constraints
- use existing documentation structure and approved history split
- do not introduce a new documentation framework
- do not rewrite historical task truth except active navigation references
- keep repository artifacts in English
- do not touch `apps/`

## Definition of Done
- [x] Generic `README.md` and `index.md` hub files under `docs/` and `history/` are renamed to semantic area filenames.
- [x] Active docs and state references point to semantic area hubs.
- [x] Markdown links, graph connectivity, guardrails, docs parity, and diff check pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated documentation frameworks
- temporary redirect-only hub files
- architecture changes without explicit approval
- runtime or production changes

## Validation Evidence
- Tests:
  - `Get-ChildItem docs,history -Recurse -File -Include README.md,index.md` returned no files.
  - Docs graph scan: `260` docs markdown files, `0` no-incoming files excluding `docs/soar-documentation-map.md` and `docs/documentation-overview.md`, `0` fully isolated docs files.
  - Markdown link check: `1812` markdown files, `476` relative markdown/file links, `0` missing targets.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `git diff --check` found no whitespace errors, only Windows CRLF warnings.
- Manual checks: searched active docs/state for stale hub terminology and updated current navigation wording.
- Screenshots/logs: not applicable.
- High-risk checks: runtime, production, secrets, and live trading surfaces were not touched.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Documentation / Agent Knowledge
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-DOC-004
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QAS-DOC-004
- Risk register updated: yes
- Risk rows closed or changed: RISK-DOC-004
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/12_documentation-governance.md`, `docs/soar-documentation-map.md`, `.agents/core/project-memory-index.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: documentation governance related labels updated.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: operator-provided Obsidian graph screenshot, 2026-05-23.
- Canonical visual target: graph hub labels should describe documentation areas.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: semantic docs maps and area hubs.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes

## Result Report
Renamed all current docs/history graph hub files away from generic `README.md` and `index.md` names, updated active navigation language, and preserved graph cohesion. The docs graph remains connected, all checked relative links resolve, and project docs guardrails pass. No app/runtime behavior changed.
