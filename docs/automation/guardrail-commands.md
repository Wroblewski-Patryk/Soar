# Guardrail Commands

Last updated: 2026-06-05

## Purpose

List commands that validate project health and should be run before important
handoffs, releases, or broad autonomous work.

## Commands

| Command | Purpose | When to run | Expected evidence |
| --- | --- | --- | --- |
| `pnpm run ops:project:known-state` | Refresh the operational knowledge baseline in the required dependency order: architecture graph, graph drift, journey indexes, docs parity, repository guardrails, project index, static issue scan, V1 master ledger, and V1 scorecard. | Before broad autonomous work, after major audit updates, and before handing Soar back to Paperclip for next-lane routing. | Updated `docs/status/*`, `docs/graphs/*`, `docs/architecture/indices/*`, `history/audits/project-index-<date>.*`, `history/audits/v1-static-issue-scan-<date>.*`, `history/audits/v1-master-state-ledger-<date>.*`, and `history/releases/v1-completion-scorecard-<date>.*`. |
| `pnpm run architecture:graph:drift:strict` | Verify representative architecture graph coverage has no missing paths. | After architecture graph changes or code surface changes. | Passing output with `0 missing`. |
| `pnpm run architecture:journey:index:strict` | Refresh function journey and user action indexes and fail on critical gaps. | After route, API, component, or workflow changes. | Passing output plus high-gap counts for follow-up triage. |
| `pnpm run docs:parity:check` | Verify API/Web/routes documentation parity. | After docs, route, module, or generated-map changes. | Passing output with no missing/stale modules or routes. |
| `pnpm run docs:parity:endpoints:api` | Verify endpoint-level API route mention parity in `docs/modules/api-*.md`. | Mandatory before handoff when API routes or module docs changed; required closure check for reusable audit checklists. | Passing output with `Status: PASS` and `Gaps: 0`. |
| `pnpm run docs:parity:route-api-matrix` | Verify generated Web route and API endpoint inventory has coverage in `docs/architecture/traceability-matrix.md` and `docs/architecture/reference/dashboard-route-map.md`. | After Web route, API route, route-map, or traceability-matrix changes. | Passing output with `Route/API matrix parity status: PASS` and `gaps: 0`. |
| `pnpm run i18n:audit:route-reachable:web` | Verify route-reachable Web copy coverage and block locale/local-copy regressions. | Mandatory before handoff when Web routes/copy changed; required closure check for reusable audit checklists. | Passing output with `0` findings and no fallback/local-copy drift. |
| `pnpm run quality:guardrails` | Run repository guardrails for graph drift, lockfile policy, file budgets, source policies, env policy, and secret argv policy. | Before commits and broad handoffs. | Passing output. |
| `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` | Run repeatable QA smoke packs and persist evidence. | When QA lane is unblocked and local/prod-safe inputs exist. | `history/artifacts/qa-repeatable-smoke-e2e-<date>.json` and `history/evidence/qa-repeatable-smoke-e2e-<date>.md`. |

## Rule

If a guardrail command is flaky or environment-dependent, document the required
environment and the fallback proof.

Do not run `ops:project:index`, `ops:project:scan`, `ops:project:ledger`, and
`ops:project:scorecard` in parallel. They are ordered dependencies; use
`pnpm run ops:project:known-state` instead.

## Architecture-Awareness Tooling Link Classification

Last classified: 2026-06-05 under [LUC-2132](/LUC/issues/LUC-2132).

| Tool family | Sample paths | Owner lane | Current aggregate proof | Relation action |
| --- | --- | --- | --- | --- |
| Documentation and graph validators | `scripts/auditApiEndpointDocsParity.mjs`; `scripts/auditArchitectureGraphDrift.mjs`; `scripts/auditRouteReachableI18n.mjs`; `scripts/checkDocsParity.mjs`; `scripts/buildObsidianVaultLayer.mjs` | Docs Memory / QA | Guardrail command table, architecture graph chain, and docs parity checks. | Direct doc links added to `docs/architecture/relations/documentation-links.csv`; test links remain aggregate unless a focused test exists. |
| Known-state and V1 summary builders | `scripts/buildProjectIndex.mjs`; `scripts/buildV1MasterStateLedger.mjs`; `scripts/buildV1CompletionScorecard.mjs` | Docs Memory / Delivery | `ops:project:known-state` orders these commands through the project baseline. | Direct doc links added to this command table. |
| Release and observability evidence builders | `scripts/buildRcExternalGateStatus.mjs`; `scripts/buildRcSignoffRecord.mjs`; `scripts/buildSloWindowReport.mjs`; `scripts/checkRcExternalGateEvidence.mjs` | Ops / QA | Release smoke and service reliability docs define the output contracts; release evidence remains approval-gated. | Direct doc links added to operations docs; no runtime or production proof claimed. |
| Coolify and protected input readiness | `scripts/checkCoolifyStackEnv.mjs`; `scripts/checkProtectedInputReadiness.mjs` | Ops / Security | Coolify stack env check has a focused test; protected input readiness has a focused test and fail-closed no-secret history. | Direct doc links added to operations docs; focused test links already exist for readiness scripts. |
| Production readback collectors | `scripts/checkPostDeployRuntimeFreshness.mjs`; `scripts/collectLiveImportReadbackEvidence.mjs`; `scripts/collectNonGateioRuntimeReadback.mjs`; `scripts/buildOpsRequestHeaders.mjs` | Ops / Security | Post-deploy smoke and historical readback artifacts define the evidence shape; auth header helper is shared by protected readback tools. | Direct doc links added for readback collectors and the shared auth-header helper; focused test links stay aggregate until QA/Ops add helper-level tests. |
| Test/runtime support shims | `apps/web/vitest.setup.ts`; `libs/shared/index.d.ts` | QA / Docs Memory | Web testing strategy and module map define the support role. | Direct doc links added to testing and system module docs. |

## Residual Tooling Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2137](/LUC/issues/LUC-2137).

Scope source: `docs/status/architecture-awareness-report.md` generated
2026-06-05T09:10:34.335Z, top actionable missing doc-link family after
[LUC-2123](/LUC/issues/LUC-2123), [LUC-2131](/LUC/issues/LUC-2131), and
[LUC-2132](/LUC/issues/LUC-2132).

| Classification | Sample paths | Canonical owner doc | Residual action |
| --- | --- | --- | --- |
| Clear canonical doc owner | `scripts/dev-backend.mjs`; `scripts/dev-frontend.mjs`; `scripts/dev-workers.mjs`; `scripts/start-local-prod-like.mjs`; `scripts/start-workers-prod.mjs` | `docs/engineering/local-development.md` | Direct documentation links added; no code/runtime change required. |
| Clear canonical doc owner | `scripts/deploySmokeCheck.mjs`; `scripts/waitForWebBuildInfo.mjs`; `scripts/writeWebBuildMetadata.mjs`; `scripts/runControlledLiveSessionProof.mjs`; `scripts/runProdAuthSessionBrowserProof.mjs`; `scripts/runProdFixtureActionProof.mjs`; `scripts/runProdPositionsProof.mjs`; `scripts/runProdUiModuleClickthroughAudit.mjs` | `docs/operations/post-deploy-smoke-checklist.md` | Direct links added as operational proof contracts; protected production execution remains approval-gated and was not run for this docs lane. |
| Protected-gate artifact | `scripts/runProdSecurityExchangeProof.mjs`; `scripts/runProdUxA11yMobileProof.mjs`; `scripts/runLocalProtectedRouteActionProof.mjs` | `docs/security/secure-development-lifecycle.md`, `docs/ux/evidence-driven-ux-review.md`, `docs/engineering/testing.md` | Linked to the governing security, UX, or local QA proof docs; no protected smoke claimed. |
| Backup/restore and rollback owner | `scripts/runBackupVerificationProfile.mjs`; `scripts/verifyLocalBackupRestore.mjs`; `scripts/runRestoreDrillEvidence.mjs`; `scripts/runRollbackProofEvidence.mjs`; `scripts/evaluateRollbackGuard.mjs`; `scripts/runCutoverDryRun.mjs` | `docs/operations/mvp-ops-runbook.md`, `docs/operations/deployment-rollback-playbook.md` | Direct links added; stage/prod restore proof remains Ops-owned evidence, not a Docs Memory execution item. |
| Journey-index tooling-index gap | `scripts/generateFunctionJourneyIndexes.mjs`; `scripts/generateUserActionIndex.mjs`; `scripts/triageJourneyEvidence.mjs` | `docs/architecture/architecture-evidence-graph-system.md` | Already documented in the graph system prose; direct doc links added so the scanner can stop reporting them as missing documentation. |
| Tooling-index gap | `scripts/compareReusableAuditManifests.mjs`; `scripts/runKnownStateRefresh.mjs`; `scripts/runV1StaticIssueScan.mjs`; `scripts/runAud07IsolatedDbPacks.mjs`; `scripts/goLiveSmoke.mjs`; `scripts/runQaRepeatableSmokeE2e.mjs` | `docs/automation/guardrail-commands.md`, `docs/automation/tooling-contract.md`, `docs/engineering/testing.md` | Linked to guardrail/tooling/testing docs; individual script tests remain separate QA/Ops scope when needed. |
| RC and observability owner | `scripts/collectSloEvidence.mjs`; `scripts/runLocalExternalGatesPipeline.mjs`; `scripts/runRcRefreshSummaryStrict.mjs`; `scripts/summarizeRcGates.mjs`; `scripts/syncRcChecklistFromGateStatus.mjs`; `scripts/resolveOpsAuthToken.mjs` | `docs/operations/service-reliability-and-observability.md`, `docs/operations/post-deploy-smoke-checklist.md` | Direct links added; production RC gate proof remains approval-gated. |

Verification note: this classification only normalizes documentation ownership
for scanner traceability. It does not assert fresh runtime proof, protected
production access, deploy success, live exchange behavior, or secret-bearing
operator input readiness.

## Architecture-Awareness Tooling Missing-Test Relation Classification

Last repaired: 2026-06-05 under [LUC-2198](/LUC/issues/LUC-2198).
Prior classification: [LUC-2156](/LUC/issues/LUC-2156).

Scope source: `docs/status/architecture-awareness-report.md` generated
2026-06-05T09:10:34.335Z. This section classifies top script/tooling
missing-test relation rows after [LUC-2132](/LUC/issues/LUC-2132) normalized
documentation ownership.

| Classification | Sample paths | Current proof relationship | QA disposition |
| --- | --- | --- | --- |
| Focused test already exists | `scripts/checkCoolifyStackEnv.mjs`; `scripts/checkProtectedInputReadiness.mjs`; `scripts/waitForWebBuildInfo.mjs`; `scripts/runV1FinalPreflight.mjs`; `scripts/runV1ReleaseGate.mjs`; `scripts/runV1StageRehearsal.mjs`; `scripts/checkRouteApiMatrixParity.mjs`; reusable audit validators and repository path resolver scripts | Matching `*.test.mjs` files exist and are represented in `docs/architecture/registry/tests.csv` either as focused tool nodes or aggregate release-audit tooling proof. | Not a missing-test defect. Remaining scanner signal is direct relation incompleteness for some script entities. |
| Aggregate command proof, no focused script-level unit | `scripts/auditApiEndpointDocsParity.mjs`; `scripts/auditArchitectureGraphDrift.mjs`; `scripts/auditRouteReachableI18n.mjs`; `scripts/checkDocsParity.mjs`; `scripts/buildObsidianVaultLayer.mjs` | These are validated through package commands, guardrails, docs parity, route/i18n audits, and architecture graph drift rather than one focused unit file per script. | Keep as aggregate-validated tooling. Add focused tests only when a specific parser, failure mode, or regression is isolated. |
| Aggregate evidence builders, Ops-owned execution proof | `scripts/buildProjectIndex.mjs`; `scripts/buildV1MasterStateLedger.mjs`; `scripts/buildV1CompletionScorecard.mjs`; `scripts/buildRcExternalGateStatus.mjs`; `scripts/buildRcSignoffRecord.mjs`; `scripts/buildSloWindowReport.mjs`; `scripts/checkRcExternalGateEvidence.mjs` | Current proof is generated artifact readback, reusable audit/RC gate checks, and release evidence command execution. | Not a QA blocker for V1. Candidate for future focused tests only if output schema drift or parser regressions recur. |
| Protected/readback collectors with approval-gated runtime proof | `scripts/checkPostDeployRuntimeFreshness.mjs`; `scripts/collectLiveImportReadbackEvidence.mjs`; `scripts/collectNonGateioRuntimeReadback.mjs`; `scripts/buildOpsRequestHeaders.mjs` | These scripts depend on protected auth/header inputs or production status. Existing proof is fail-closed command behavior, no-secret handoff artifacts, and protected execution packets when approved. | Do not synthesize tests that fake protected production success. Helper-level tests are optional Ops/Security follow-up, not a current missing local QA proof blocker. |

Verification note: this classification does not reduce the report-wide
`Actionable implementation entities without inferred tests` count by itself.
It separates true focused-test work from scanner relation backlog so QA does
not create low-value one-test-per-script work where aggregate command proof is
the approved contract.

### LUC-2198 Relation Repair

[LUC-2198](/LUC/issues/LUC-2198) converted the current top tooling/support
sample rows into direct scanner-readable test relations in
`docs/architecture/relations/priority-test-links.csv`. The repair links
already-proven scripts to existing focused or aggregate proof files such as
`checkReusableAuditToolingIndex.test.mjs`, `repoGuardrails.test.mjs`,
`runV1FinalPreflight.test.mjs`, `runV1ReleaseGate.test.mjs`, and
`checkRouteApiMatrixParity.test.mjs`. This is a relation repair only; it does
not claim protected production proof, deploy readiness, secret-bearing access,
exchange behavior, or LIVE mutation safety.

Validation:

- targeted `LUC-2198` CSV readback: `40` rows, `40` linked, `0` missing;
- focused aggregate Node tests: `54/54` pass;
- architecture-awareness refresh: actionable missing-test rows `859` (down
  from `898`), actionable missing-doc rows `0`;
- strict graph drift: `824/824`, `0` missing.

## Second-Wave Script/Tooling Relation Classification

Last classified: 2026-06-05 under [LUC-2165](/LUC/issues/LUC-2165).

Scope source: `docs/status/architecture-awareness-report.md` generated
2026-06-05T10:06:31.635Z, after [LUC-2132](/LUC/issues/LUC-2132),
[LUC-2155](/LUC/issues/LUC-2155), and [LUC-2156](/LUC/issues/LUC-2156).

| Bucket | Sample paths | Current evidence | Action / residual owner |
| --- | --- | --- | --- |
| Fragment-level doc-link gap in already classified proof runners | `scripts/runLocalProtectedRouteActionProof.mjs#CdpClient`; `scripts/runProdAuthSessionBrowserProof.mjs#CdpClient`; `scripts/runProdUxA11yMobileProof.mjs#CdpClient` | Parent script paths already map to testing, post-deploy smoke, or UX/security proof docs; scanner still reports class-level entities because relation rows were path-level only. | Added fragment-level documentation links. No protected browser/prod proof executed or claimed. |
| API script/tooling doc-link gap | `apps/api/scripts/assistant-load-benchmark.ts`; `backfillBacktestVenueContext.ts`; `bot-v2-preflight-report.ts`; paper runtime snapshot import/export; `gateioMarketStreamSourceSmoke.ts`; `load-test.mjs`; `start-with-migrate.mjs`; `verifyWalletDbFoundation.ts` | Canonical owner docs already describe the module or operator contract, but direct scanner relations were absent. | Added direct documentation links to assistant runtime, API module docs, testing, migration, bot operations, and market-data docs. Backend/Ops own future behavior changes. |
| Prisma/data tooling doc-link gap | `apps/api/prisma.config.ts`; `apps/api/prisma/seed.ts`; `apps/api/prisma/snapshots/README.md` | Data ownership docs cover schema/data lifecycle; these files are tooling/config surfaces, not runtime route behavior. | Added direct documentation links to `docs/architecture/data-ownership-map.md`. DB/Migrations owns future schema behavior proof. |
| Missing-test relation backlog from current top tooling rows | `scripts/audit*`; `scripts/build*`; `scripts/check*`; `scripts/deploy*`; `scripts/*rc*`; `scripts/*slo*` | [LUC-2156](/LUC/issues/LUC-2156) classified these as a mix of focused proof, aggregate command proof, and optional helper-level tests when a concrete parser/regression is isolated. | No new test work created from this docs lane. QA/Test Automation owns any future focused regression task. |
| Protected proof collectors | prod auth/session, protected route/action, security exchange, UX/a11y mobile, live/readback collectors | Existing proof boundary is approval-gated and no-secret. Local docs can classify ownership, but cannot prove production auth, protected session, exchange behavior, or live-money readiness. | No protected collector was run. Ops/Security/QA own approved production proof under release gates. |
| No-action scanner noise | Previously linked parent script rows and aggregate guardrail surfaces that still appear only because the scanner expects direct per-entity relations | Architecture graph and guardrail docs already carry the approved aggregate contract. | Leave as classification unless a concrete missing owner doc, missing focused proof, or broken command is found. |

Verification note: this classification repaired the smallest direct
documentation-link family for the second-wave script/tooling rows. It does not
rewrite scanner inference, suppress missing-test counts, assert fresh runtime
behavior, execute protected collectors, deploy, restart services, read secrets,
or claim live exchange readiness.
