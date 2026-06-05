# LUC-2198 Repair Script/Tooling Missing-Test Relation Backlog

## Header
- ID: LUC-2198
- Title: [Soar][Architecture QA] Repair script/tooling missing-test relation backlog
- Task Type: test-relation repair
- Current Stage: verification
- Status: DONE
- Owner: Test Automation
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; release-audit-tooling; ops-config-pipeline
- Mission ID: LUC-2198-SCRIPT-TOOLING-MISSING-TEST-RELATION-REPAIR-2026-06-05
- Operation Mode: TESTER

## Context
The scoped Paperclip wake targeted [LUC-2198](/LUC/issues/LUC-2198) with no
pending comments and `fallbackFetchNeeded=false`; checkout was already claimed
by the harness and was not repeated. [LUC-2197](/LUC/issues/LUC-2197)
classified the current actionable missing-test rows and left script/tooling
aggregate proof as the largest locally actionable relation backlog. The
current relation file already contained `40` [LUC-2198](/LUC/issues/LUC-2198)
priority rows when this heartbeat began, but the architecture-awareness report
had not yet been refreshed after those rows.

## Goal
Convert the top script/tooling missing-test rows from report noise into
scanner-readable direct test relations backed by existing focused or aggregate
script proof, then refresh the generated architecture-awareness evidence.

## Scope
- Validate `docs/architecture/relations/priority-test-links.csv` rows for the
  assigned script/tooling surfaces.
- Run the smallest meaningful focused script/tooling test pack for the linked
  proof files.
- Regenerate local architecture graph and Softwarehouse architecture-awareness
  exports.
- Read back that [LUC-2198](/LUC/issues/LUC-2198) target rows are absent from
  top actionable missing-test samples.
- Exclude runtime behavior changes, browser sessions, dev servers, production
  smoke, deploy, restart, rollback, env/database/account mutation, secret
  readback, exchange mutation, and live-trading action.

## Constraints
- Reuse existing aggregate test files instead of creating one low-value unit
  test per wrapper script.
- Do not claim protected production collector success from local tests.
- Do not add scanner overrides or parallel relation systems.
- Keep release and protected proof boundaries fail-closed.

## Definition of Done
- [x] `40` [LUC-2198](/LUC/issues/LUC-2198) relation rows reference existing
  entity and test files.
- [x] Focused script/tooling proof passes.
- [x] Architecture graph generation and strict drift pass.
- [x] Architecture-awareness refresh proves assigned rows dropped from top
  actionable missing-test samples.
- [x] Source-of-truth state and issue disposition are updated.

## Forbidden
- Runtime/product behavior edits.
- Fake protected proof, secret readback, production auth/session use, exchange
  mutation, or live order/cancel/close.
- Temporary bypasses, scanner suppressions, or duplicate test systems.
- Broad full-workspace validation unrelated to this relation repair.

## Relation Repair
The repair maps current top script/tooling rows to existing aggregate proof:

| Surface family | Relation target examples | Proof file |
| --- | --- | --- |
| Docs parity and reusable audit tooling | `auditApiEndpointDocsParity.mjs`, `auditRouteReachableI18n.mjs`, `checkDocsParity.mjs`, `buildProjectIndex.mjs`, V1 ledger/scorecard scripts | `scripts/checkReusableAuditToolingIndex.test.mjs` |
| Release gate, RC, SLO, backup, rollback, and protected collector orchestration | `buildRcExternalGateStatus.mjs`, `collectSloEvidence.mjs`, `goLiveSmoke.mjs`, `runProdFixtureActionProof.mjs`, `runProdSecurityExchangeProof.mjs` | `scripts/runV1ReleaseGate.test.mjs` |
| Final preflight wrappers | `checkPostDeployRuntimeFreshness.mjs`, `deploySmokeCheck.mjs`, `runProdAuthSessionBrowserProof.mjs` | `scripts/runV1FinalPreflight.test.mjs` |
| Repository and graph guardrails | `auditArchitectureGraphDrift.mjs`, dev server wrappers, journey index generators, local protected route proof runner | `scripts/repoGuardrails.test.mjs` |

Targeted relation readback:
- [LUC-2198](/LUC/issues/LUC-2198) rows in
  `docs/architecture/relations/priority-test-links.csv`: `40`.
- Missing referenced entity files: `0`.
- Missing referenced test files: `0`.
- Duplicate exact entity/test pairs inside [LUC-2198](/LUC/issues/LUC-2198)
  rows: `0`.

## Validation Evidence
- `pnpm exec node --test scripts/checkReusableAuditToolingIndex.test.mjs scripts/repoGuardrails.test.mjs scripts/runV1FinalPreflight.test.mjs scripts/runV1ReleaseGate.test.mjs scripts/checkRouteApiMatrixParity.test.mjs`
  -> PASS (`54` tests).
- `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842`
  relations / `27` chains).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS; final graph readback generated `2026-06-05T12:40:45.169Z`.
- Targeted readback after refresh:
  - raw implementation entities without inferred tests: `7654`;
  - actionable implementation entities without inferred tests: `859`;
  - actionable implementation entities without inferred docs: `0`;
  - [LUC-2198](/LUC/issues/LUC-2198) priority rows still in top actionable
    missing-test samples: `0`.
- `pnpm run architecture:graph:drift:strict` -> PASS (`824/824`, `0`
  missing).
- `git diff --check -- docs/architecture/relations/priority-test-links.csv docs/graphs/architecture-awareness.json docs/graphs/architecture-awareness.csv docs/graphs/architecture-proof-register.csv docs/status/architecture-awareness-report.md docs/status/architecture-dependency-report.md docs/status/architecture-ownership-report.md docs/status/task-synchronization-report.md docs/graphs/architecture-health.json docs/graphs/architecture-graph.md docs/graphs/architecture-graph.mmd`
  -> PASS with CRLF warnings only.

## Security / Privacy Evidence
- Data touched: local source metadata, graph exports, and test relation CSV.
- No secret values, cookies, API keys, account data, production data,
  screenshots, or exchange credentials were read or stored.
- Protected proof collectors remain fail-closed and release-gated; this issue
  only links their existing local orchestration tests.

## Deployment / Ops Evidence
- Deploy impact: none.
- Runtime impact: none.
- Env/database/account/exchange mutation: none.
- Production smoke: not run and not claimed.

## Result Report
- Task summary: repaired the script/tooling missing-test relation backlog by
  validating `40` scanner-readable priority test links and refreshing the
  generated architecture-awareness evidence.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/graphs/architecture-awareness.json`
  - `docs/graphs/architecture-awareness.csv`
  - `docs/graphs/architecture-proof-register.csv`
  - `docs/graphs/architecture-graph.md`
  - `docs/graphs/architecture-graph.mmd`
  - `docs/graphs/architecture-health.json`
  - `docs/status/architecture-awareness-report.md`
  - `docs/status/architecture-dependency-report.md`
  - `docs/status/architecture-ownership-report.md`
  - `docs/status/task-synchronization-report.md`
  - `history/tasks/luc-2198-repair-script-tooling-missing-test-relation-backlog-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- What is incomplete:
  - Remaining actionable missing-test rows (`859`) now start with a new script
    tail and API helper families outside this assigned repair set.
  - Protected production proof remains gated by Ops/Security/QA release rules.
  - DB-backed proof remains dependent on local infra where noted by prior
    issues.
