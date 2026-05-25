# Task

## Header
- ID: LUC-16
- Title: Publish Soar sellable/private-use readiness map and acceptance criteria
- Task Type: research
- Current Stage: implementation
- Status: DONE
- Owner: Product Lead
- Depends on: readme, product docs, module and requirement state files
- Priority: P0
- Module Confidence Rows: n/a
- Requirement Rows: REQ-FUNC-003, REQ-FUNC-021, REQ-DOC-005..REQ-DOC-030
- Quality Scenario Rows: n/a
- Risk Rows: `REQ-FUNC-021`, aggregate runtime stability in production
- Iteration: LUC-16 product readiness pass
- Operation Mode: BUILDER
- Mission ID: LUC-16-KNOWN-STATE-MAP
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is appropriate for documentation analysis.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was treated as indexed source context.
- [x] Missing or template-like files were identified and updated where required.
- [x] Affected module confidence and requirement rows were identified.
- [x] Required product evidence mapping was updated in canonical product artifact.
- [x] The task advances release confidence by clarifying trusted private-use readiness.

## Mission Block
- Mission objective: establish top capabilities and readiness acceptance criteria for private-use / sellable Soar usage.
- Release objective advanced: provide a concrete product readiness baseline for operator decision-making.
- Included slices: capability inventory, workflow acceptance, evidence mapping.
- Explicit exclusions: no code changes to runtime services, no product behavior changes.
- Checkpoint cadence: one-file implementation + final evidence check.
- Stop conditions: missing evidence entries or unresolved blockers.

## Context
LUC-16 requested a first-pass product known-state map for Soar. The existing `docs/product/capability-map.md` was placeholder-only and needed concrete capability definitions, readiness criteria, and evidence references.

## Goal
Publish a concrete sellable/private-use readiness map with explicit workflows and acceptance criteria, tied to current proof artifacts and known production blockers.

## Deliverable For This Stage
- `docs/product/capability-map.md` updated from placeholder to concrete map.
- Capability-level acceptance criteria and evidence status for the top workflows.

## Constraints
- reuse existing evidence artifacts and canonical process/state files
- no workaround paths
- no product behavior changes
- no production mutation

## Definition of Done
- [x] Placeholder capability map replaced with a concrete map.
- [x] Top P0 workflows defined as acceptance criteria with evidence references.
- [x] Blockers and readiness gaps explicitly called out.
- [x] Issue-facing progress evidence recorded.

## Forbidden
- production mutation
- LIVE money-impacting actions
- temporary workaround-only proof claims

## Product/Discovery Evidence
- Problem validated: yes
- User or operator affected: private-use readiness claim quality for Soar as a sellable product
- Existing workaround or pain: placeholder capability map prevented consistent readiness decisions.
- Smallest useful slice: readiness map + acceptance criteria update only
- Success metric or signal: map exists with auditable capability status and blocker list.
- Feature flag, staged rollout, or disable path: not applicable

## Validation Evidence
- Tests: not applicable (documentation task)
- Manual checks:
  - `docs/product/capability-map.md` reviewed for completeness and proof references
- Screenshots/logs: none
- High-risk checks: `REQ-FUNC-021` production activation status re-checked in issue context
- Module confidence ledger updated: no
- Module confidence rows closed or changed: no
- Requirements matrix updated: no
- Requirement rows closed or changed: `REQ-FUNC-021` impact reflected in blocker section
- Quality scenario rows updated: no
- Risk register updated: no
- Reality status: verified

## Result Report
- Task summary: completed concrete product readiness map with 11 capabilities and 5 top private-use workflows.
- Files changed: `docs/product/capability-map.md`.
- How tested: repository evidence review against canonical docs and state records.
- What is incomplete: production activation and protected proof gates remain blocked by runtime aggregate stability and protected-input chain reopening.
- Next steps: close remaining readiness blockers and promote map status to verified when protected production evidence reopens.
