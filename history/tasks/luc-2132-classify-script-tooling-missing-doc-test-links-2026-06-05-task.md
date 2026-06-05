# Task

## Header
- ID: LUC-2132
- Title: [Soar][Architecture Repair][Docs] Classify script and tooling missing doc/test link samples
- Task Type: docs
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Priority: medium
- Module Confidence Rows: Architecture Evidence Graph; release-audit-tooling; ops-config-pipeline
- Requirement Rows: REQ-DOC-029; REQ-DOC-030
- Risk Rows: RISK-DOC-005
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2132-SCRIPT-TOOLING-DOC-TEST-LINKS-2026-06-05
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake for [LUC-2132](/LUC/issues/LUC-2132) had no pending
comments and `fallbackFetchNeeded=false`; checkout was already claimed by the
harness and was not repeated.

[LUC-2123](/LUC/issues/LUC-2123) split script/tooling samples out of the top
actionable architecture-awareness missing doc/test report because ownership
spans Docs Memory, QA, Ops, and Security.

## Goal
Classify the sampled script/tooling missing doc/test signals by tool family and
owner lane, then add direct doc relations only where canonical ownership is
clear.

## Scope
- `docs/status/architecture-awareness-report.md`
- `docs/automation/guardrail-commands.md`
- `docs/architecture/relations/documentation-links.csv`
- `history/tasks/luc-2132-classify-script-tooling-missing-doc-test-links-2026-06-05-task.md`

No runtime behavior, route behavior, API behavior, deploy, restart, rollback,
database action, secret access, protected smoke, account action, exchange
mutation, or LIVE trading action was in scope.

## Implementation Plan
1. Read the current report and parent [LUC-2123](/LUC/issues/LUC-2123) task
   artifact.
2. Match sampled tooling paths to package scripts, architecture graph records,
   operations docs, and focused tests where present.
3. Add direct documentation relations for clear documentation owners.
4. Record classification and residual recommendations for helper/test-link
   signals that should not be bulk-linked.
5. Regenerate/read back architecture awareness and run strict graph drift.

## Acceptance Criteria
- Repair table includes tool family, owner lane, aggregate proof, relation
  action, and validation command.
- Direct doc relations are added only for clear owners.
- Remaining test-link signals are classified without claiming missing runtime
  behavior.
- Architecture-awareness readback and strict graph drift are recorded.

## Repair Table

| Tool family | Sample paths | Owner lane | Current aggregate proof | Relation action | Validation command |
| --- | --- | --- | --- | --- | --- |
| Documentation and graph validators | `scripts/auditApiEndpointDocsParity.mjs`; `scripts/auditArchitectureGraphDrift.mjs`; `scripts/auditRouteReachableI18n.mjs`; `scripts/checkDocsParity.mjs`; `scripts/buildObsidianVaultLayer.mjs` | Docs Memory / QA | `docs/automation/guardrail-commands.md`; `docs/architecture/architecture-evidence-graph-system.md`; graph chain evidence. | Added direct doc links to guardrail or graph docs. Focused test relation remains aggregate unless a focused test file exists. | `pnpm run architecture:graph:drift:strict` |
| Known-state and V1 summary builders | `scripts/buildProjectIndex.mjs`; `scripts/buildV1MasterStateLedger.mjs`; `scripts/buildV1CompletionScorecard.mjs` | Docs Memory / Delivery | `ops:project:known-state` orders these commands through the project baseline. | Added direct doc links to `docs/automation/guardrail-commands.md`. | `pnpm run architecture:graph:drift:strict` |
| Release and observability evidence builders | `scripts/buildRcExternalGateStatus.mjs`; `scripts/buildRcSignoffRecord.mjs`; `scripts/buildSloWindowReport.mjs`; `scripts/checkRcExternalGateEvidence.mjs` | Ops / QA | Post-deploy smoke and reliability docs define release evidence shape. | Added direct doc links to operations docs; no production proof claimed. | `pnpm run architecture:graph:drift:strict` |
| Coolify and protected-input readiness | `scripts/checkCoolifyStackEnv.mjs`; `scripts/checkProtectedInputReadiness.mjs` | Ops / Security | Focused tests exist for both readiness scripts; docs define fail-closed/no-secret handling. | Added direct doc links to operations docs; test links already exist in scanner output for focused tests. | `pnpm run architecture:graph:drift:strict` |
| Production readback collectors | `scripts/checkPostDeployRuntimeFreshness.mjs`; `scripts/collectLiveImportReadbackEvidence.mjs`; `scripts/collectNonGateioRuntimeReadback.mjs`; `scripts/buildOpsRequestHeaders.mjs` | Ops / Security | Post-deploy smoke and historical readback artifacts define evidence shape; auth header helper is a shared protected-readback dependency. | Added direct doc links for readback collectors and the shared auth-header helper; focused test links remain aggregate until QA/Ops add helper-level tests. | `pnpm run architecture:graph:drift:strict` |
| Test/runtime support shims | `apps/web/vitest.setup.ts`; `libs/shared/index.d.ts` | QA / Docs Memory | Testing strategy and module map define support role. | Added direct doc links to testing and system module docs. | `pnpm run architecture:graph:drift:strict` |

## Validation Evidence
- Source inspection:
  - `docs/status/architecture-awareness-report.md` report generated
    `2026-06-05T08:56:49.581Z` showed actionable missing-doc samples for
    script/tooling and support shims.
  - `package.json` command mapping inspected for guardrail, ops, and known-state
    command ownership.
  - `docs/architecture/registry/tests.csv` confirmed focused test nodes for
    `checkCoolifyStackEnv.mjs` and `checkProtectedInputReadiness.mjs`.
- Files updated:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/automation/guardrail-commands.md`
  - `history/tasks/luc-2132-classify-script-tooling-missing-doc-test-links-2026-06-05-task.md`
- Commands:
  - `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842`
    relations / `27` chains).
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
    from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` -> PASS
    (`14237` entities / `22052` relations / `7097` files).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822` covered,
    `0` missing).
  - Post-change report generated `2026-06-05T09:10:34.335Z` with actionable
    missing docs `148`, actionable missing tests `919`, classified inferred-link
    noise `7377`, and disconnected entities `0`.
  - The original sampled script/tooling doc-link rows from [LUC-2132](/LUC/issues/LUC-2132)
    no longer appear in `Top Actionable Missing Doc Links`; remaining top rows
    are a broader second-wave tooling family and need separate owner review.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/registry/tests.csv`
  - `docs/automation/guardrail-commands.md`
  - `docs/architecture/chains/CHAIN-RELEASE-AUDIT-TOOLING.md`
- Fits approved architecture: yes.
- Mismatch discovered: no runtime mismatch; remaining signal is direct relation
  incompleteness for helper scripts and aggregate test families.
- Decision required from user: no.

## Result Report
- Task summary: classified script/tooling missing doc/test samples and added
  direct doc links for clear documentation owners.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/automation/guardrail-commands.md`
  - `history/tasks/luc-2132-classify-script-tooling-missing-doc-test-links-2026-06-05-task.md`
- What is incomplete:
  - `scripts/buildOpsRequestHeaders.mjs` now has a direct Ops/Security doc
    relation through `docs/operations/post-deploy-smoke-checklist.md`; focused
    test closure remains aggregate until QA/Ops add helper-level tests.
  - Missing test-link samples for broad scripts should be promoted only when a
    focused test file exists or QA creates a specific regression relation.
  - A second wave of script doc-link samples now appears at the top of
    `docs/status/architecture-awareness-report.md`; this is residual backlog,
    not a blocker for the [LUC-2132](/LUC/issues/LUC-2132) sampled scope.
- Deployment impact: none.
- Runtime impact: none.
