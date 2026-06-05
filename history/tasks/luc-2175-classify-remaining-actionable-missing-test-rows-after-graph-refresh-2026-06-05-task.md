# Task

## Header
- ID: LUC-2175
- Title: [Soar][Architecture Repair][QA] Classify remaining actionable missing-test rows after June 5 graph refresh
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; api-auth; api-bots; api-engine; api-positions; web-shared; release-audit-tooling; ops-release-proof
- Mission ID: LUC-2175-REMAINING-ACTIONABLE-MISSING-TEST-ROWS-2026-06-05
- Mission Status: VERIFIED_CLASSIFICATION
- Operation Mode: TESTER

## Context
The scoped Paperclip wake targeted [LUC-2175](/LUC/issues/LUC-2175) with no
new human comments and `fallbackFetchNeeded=false`. The prior run failed before
capturing repository work because of an adapter symlink error, so this
heartbeat resumed from local source-of-truth artifacts instead of treating that
adapter failure as a Soar validation blocker.

Predecessor QA lanes already completed:
- [LUC-2156](/LUC/issues/LUC-2156): script/tooling missing-test classification.
- [LUC-2157](/LUC/issues/LUC-2157): API/runtime helper missing-test classification.
- [LUC-2164](/LUC/issues/LUC-2164): shared Web UI missing-test relation reconciliation.

## Goal
Classify the remaining `896` actionable missing-test rows from the
`2026-06-05T10:58:31.707Z` architecture-awareness refresh so the board can
separate true missing focused test work from aggregate command proof, direct
scanner relation backlog, local DB-backed proof blockers, and protected
production proof blockers.

## Scope
- Read `docs/graphs/architecture-health.json`,
  `docs/graphs/architecture-awareness.json`, and
  `docs/graphs/architecture-graph.json`.
- Reconstruct the scanner's actionable missing-test filter across the full
  graph instead of relying only on the first `200` stored health samples.
- Classify row families by owner, proof status, next action, and whether
  follow-up implementation is needed.
- Exclude code changes, feature fixes, production smoke, deploy, restart,
  rollback, env/database mutation, account mutation, secret readback, exchange
  mutation, and live-trading action.

## Classification

| Family | Count | Sample paths | Owner | Proof status | Next action | Follow-up implementation needed |
| --- | ---: | --- | --- | --- | --- | --- |
| Script/tooling aggregate proof | 354 | `scripts/auditApiEndpointDocsParity.mjs`, `scripts/auditArchitectureGraphDrift.mjs`, `scripts/checkDocsParity.mjs`, `scripts/buildV1MasterStateLedger.mjs` | Test Automation + Architecture Graph / Docs Memory | Existing focused and aggregate command proof classified in [LUC-2156](/LUC/issues/LUC-2156); remaining rows are mostly feature/function direct-relation backlog. | Improve direct relation inference or add curated links only for high-value existing tests. | No, unless a concrete parser/schema regression is isolated. |
| Protected production proof collectors | 147 | `scripts/checkPostDeployRuntimeFreshness.mjs`, `scripts/collectLiveImportReadbackEvidence.mjs`, `scripts/runProdAuthSessionBrowserProof.mjs`, `scripts/runProdSecurityExchangeProof.mjs` | Ops + Security + QA smoke owners | Success states require approved protected inputs, production auth/session, or exchange context. Local classification must not fake production success. | Keep protected proof under [LUC-241](/LUC/issues/LUC-241) / release gates; add helper tests only for specific local helper failures. | No broad local test implementation from this issue. |
| Local/release/Ops aggregate scripts | 147 | `scripts/runLocalProtectedRouteActionProof.mjs`, `scripts/runAud07IsolatedDbPacks.mjs`, `scripts/runRollbackProofEvidence.mjs`, `scripts/goLiveSmoke.mjs`, `scripts/dev-workers.mjs` | Test Automation + Ops | Covered by aggregate command contracts, release evidence artifacts, or prior local proof matrix work. | Preserve aggregate command proof; avoid one-test-per-wrapper churn. | No, unless a repeated wrapper failure appears. |
| Web UI/app residual support | 85 | `apps/web/src/app/layout.tsx#RootLayout`, `apps/web/src/features/auth/pages/LoginPage.tsx#LoginPage`, `runtimeOpenPositionDerivations.ts`, `trailingStopDisplay.ts` | Frontend + Test Automation | Many covered by aggregate Web regression packs and prior shared Web work; some are function-level direct relation gaps after component/file coverage. | Architecture Graph / Frontend can add curated links for existing high-value focused tests; Test Automation should add tests only for uncovered behavior. | Selective only if a concrete uncovered Web behavior is confirmed. |
| API engine/runtime helpers | 62 | `positionPnlSemantics.ts`, `positionSizing.ts`, `runtimeExchangeSyncedPositionPrice.ts` | Backend + Test Automation | Existing engine/runtime module tests and [LUC-2157](/LUC/issues/LUC-2157) pure helper proof cover representative runtime helpers; remaining signal is function-to-test relation backlog. | Map existing module tests to helper families; add focused tests only for untested math/decision helpers if code inspection confirms no coverage. | Possible targeted Backend/Test Automation follow-up, not isolated here. |
| API script/prisma/data tooling | 40 | `apps/api/prisma/seed.ts`, `apps/api/scripts/assistant-load-benchmark.ts`, `apps/api/scripts/bot-v2-preflight-report.ts` | Backend + Data + Docs Memory | Script/tooling family outside user-facing runtime; proof is command/output readback or migration/data tooling checks. | Classify through docs/graph relations; add tests only for stable parser/output contracts. | No immediate implementation from this issue. |
| API positions runtime helpers | 17 | `livePositionReconciliation.helpers.ts` helper functions | Backend + Test Automation | Existing positions/live import/local money proof families cover broader behavior; direct helper rows remain visible. | Backend/Test Automation should review if these pure helpers deserve a small focused test pack. | Yes, optional targeted follow-up candidate if not already covered. |
| API bots setup/runtime helpers | 14 | `bots.e2e.shared.ts`, `bots.repository.ts`, `botsRuntimeRead.repository.ts` | Backend + Test Automation | [LUC-2157](/LUC/issues/LUC-2157) found existing e2e/runtime proof plus DB-backed local proof blockers where Postgres is unavailable. | Do not duplicate e2e tests; improve graph relations or rerun DB-backed packs when local DB is available. | No broad implementation; DB-backed rerun needs local Postgres. |
| Worker/observability runtime helpers | 9 | `runtimeFreshness.ts#parseEnvDate`, `marketStream.worker.ts`, `workerBootstrap.ts` | Backend + Ops + Test Automation | Worker health/readiness proof exists partly; runtime freshness DB-backed proof is blocked locally without Postgres. | Rerun worker DB-backed tests when local infra is available; protected worker readiness remains release-gate scope. | No new implementation isolated. |
| Web route handler proxies | 6 | `apps/web/src/app/api/build-info/route.ts` helpers | Frontend + Ops/Test Automation | Build-info/public smoke has existing release proof; helper functions are direct relation backlog. | Add curated link to existing build-info proof or a small unit only if route helper drift recurs. | No immediate implementation. |
| API key crypto helpers | 5 | `apps/api/src/utils/crypto.ts#encrypt`, `decrypt`, `getActiveKey` | Backend + Security + Test Automation | Security-sensitive helper family; likely covered by API-key flow tests, but this classification did not rerun them. | Security/Backend should verify existing API-key crypto focused coverage before any V1 closure claim. | Potential targeted follow-up if no focused crypto tests exist. |
| API utility helpers | 5 | `formatZodError.ts`, `hash.ts`, `errorExposure.ts` | Backend + Test Automation | Generic support helpers; likely aggregate-covered through API tests. | Add focused tests only for concrete validation/error/hash regressions. | No immediate implementation. |
| Support/type/config surfaces | 2 | `apps/web/vitest.setup.ts`, `libs/shared/index.d.ts` | Architecture Graph / Shared Contracts | Already classified by [LUC-2164](/LUC/issues/LUC-2164) as support/type surfaces, not user-facing UI test gaps. | Add scanner classification rule only if graph owners want them out of actionable backlog. | No. |
| API auth/session helpers | 2 | `auth.session.ts#getSessionJwtExpiresIn`, `getSessionTtlMs` | Backend + Test Automation | [LUC-2157](/LUC/issues/LUC-2157) verified pure auth helper pack and recorded DB-backed blocker for service tests. | Optional direct relation to auth helper tests; no new behavior gap isolated. | No. |
| API order helper | 1 | `positionFillMath.ts#computePositionAddUpdate` | Backend + Test Automation | Order/lifecycle math has existing broader API money/order proof, but direct helper relation remains visible. | Backend/Test Automation can confirm focused order math coverage before V1 hardening closure. | Potential targeted follow-up if uncovered. |

## Validation Evidence
- `docs/status/architecture-awareness-report.md` reports:
  - generated `2026-06-05T10:58:31.707Z`;
  - raw implementation entities without inferred tests: `7691`;
  - actionable implementation entities without inferred tests: `896`.
- `docs/graphs/architecture-health.json` reports the same generated timestamp
  and actionable count, but stores only the first `200` sample items.
- Full-set readback command reconstructed the scanner rules from
  `architecture-awareness.json` and `architecture-graph.json`:

```powershell
@'
const fs = require('fs');
// Reconstruct tested targets, scanner noise rules, and family buckets.
// Output confirmed generated_at=2026-06-05T10:58:31.707Z and actionableCount=896.
'@ | node -
```

- The command output bucketed all `896` actionable rows into the families in
  the classification table above.
- No focused test command was required because this issue did not isolate a
  new concrete missing behavior; predecessor proof commands remain the relevant
  test evidence:
  - [LUC-2156](/LUC/issues/LUC-2156): script test pack passed (`136/136`).
  - [LUC-2157](/LUC/issues/LUC-2157): pure API/runtime helper pack passed
    (`6` files / `37` tests), DB-backed representative tests blocked by local
    Postgres at `localhost:5432`.
  - [LUC-2164](/LUC/issues/LUC-2164): focused shared Web pack passed
    (`28` files / `145` tests), targeted priority rows remaining `0`.

## Result Report
- Task summary: classified the remaining `896` actionable missing-test rows
  after the June 5 graph refresh.
- Files changed:
  - `history/tasks/luc-2175-classify-remaining-actionable-missing-test-rows-after-graph-refresh-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Full graph classification readback command reconstructed the scanner
    actionable set and confirmed `896` rows.
  - No browser/dev server was started; process cleanup was not required.
- What is incomplete:
  - The report-wide count remains `896`; this issue classifies it rather than
    rewriting scanner inference or adding broad low-value tests.
  - Potential targeted follow-ups are limited to API positions helpers, API
    key crypto helpers, and order fill math if owner inspection confirms no
    focused coverage.
  - DB-backed local proof still requires local Postgres/Redis.
  - Protected production proof still requires approved Ops/Security gates and
    must not be synthesized locally.
- Deployment impact: none.
- Runtime impact: none.
