# LUC-2197 Classify Current Actionable Missing-Test Rows From Architecture Awareness

## Header
- ID: LUC-2197
- Title: [Soar][Architecture QA] Classify current actionable missing-test rows from architecture awareness
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Test Automation
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; release-audit-tooling; ops-release-proof; web-shared; api-engine; api-positions; api-profile; api-bots; api-auth
- Mission ID: LUC-2197-CURRENT-ACTIONABLE-MISSING-TEST-ROWS-2026-06-05
- Mission Status: VERIFIED_CLASSIFICATION
- Operation Mode: TESTER

## Context
The scoped Paperclip wake assigned [LUC-2197](/LUC/issues/LUC-2197) directly to
Test Automation. The wake payload had no new comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and was
not repeated.

Prior related work:
- [LUC-2175](/LUC/issues/LUC-2175) classified the previous `896` actionable
  missing-test rows from the `2026-06-05T10:58:31.707Z` graph refresh.
- [LUC-2187](/LUC/issues/LUC-2187) inspected the three high-signal helper
  families from that classification and added focused order fill math coverage.
- A later graph refresh completed while this heartbeat was validating, and the
  current synchronized architecture-health files now report generated
  `2026-06-05T12:33:42.151Z`, docs closed at `0` actionable rows, and tests at
  `859` actionable rows.

## Goal
Classify the current `859` actionable missing-test rows from the
`2026-06-05T12:33:42.151Z` architecture-awareness export so the board can
separate true missing test work from aggregate proof, protected proof gates, and
scanner relation granularity backlog.

## Scope
- Read `docs/graphs/architecture-awareness.json`.
- Read `docs/graphs/architecture-health.json`.
- Read `docs/graphs/architecture-graph.json` to mirror curated-coverage noise
  classification.
- Reconstruct the scanner actionable missing-test filter from the Softwarehouse
  exporter rules.
- Classify current rows by family, owner, proof status, and next action.
- Exclude code/runtime changes, browser proof, dev servers, production smoke,
  deploy, restart, rollback, env/database mutation, account mutation, secret
  readback, exchange mutation, and live-trading action.

## Classification

| Family | Count | Sample paths | Owner | Proof status | Next action | Follow-up implementation needed |
| --- | ---: | --- | --- | --- | --- | --- |
| Local/release/Ops aggregate scripts | 220 | `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runRcRefreshSummaryStrict.mjs`, `scripts/runRestoreDrillEvidence.mjs`, `scripts/runRollbackProofEvidence.mjs` | Test Automation + Ops | Existing command contracts and release/ops proof artifacts cover these as aggregate runners. | Keep aggregate proof; add direct relations only for high-value commands that already have stable tests. | No broad test implementation. |
| Protected production proof collectors | 208 | `scripts/runProdUxA11yMobileProof.mjs`, `scripts/runV1StaticIssueScan.mjs`, `scripts/checkPostDeployRuntimeFreshness.mjs#fetchWithTimeout` | Ops + Security + QA smoke owners | Success requires protected auth/session, production context, or exchange readback; local QA must not synthesize success. | Keep under protected release gate / [LUC-241](/LUC/issues/LUC-241) style unblock path. | No local implementation from this issue. |
| Script/tooling aggregate proof | 186 | `scripts/triageJourneyEvidence.mjs`, `scripts/auditApiEndpointDocsParity.mjs#docPathForModule`, `scripts/auditRouteReachableI18n.mjs` | Test Automation + Architecture Graph / Docs Memory | Existing focused or aggregate command proof from prior lanes covers representative behavior. | Improve graph relation inference if count reduction is needed; avoid low-value one-test-per-wrapper churn. | No, unless a concrete parser/schema failure appears. |
| Web UI/app residual support | 101 | `apps/web/src/app/layout.tsx#RootLayout`, `apps/web/src/features/auth/pages/LoginPage.tsx#LoginPage`, `runtimeOpenPositionDerivations.ts`, `trailingStopDisplay.ts` | Frontend + Test Automation | Covered partly by Web regression packs and prior shared UI relation work; remaining signal is mostly function/component relation granularity. | Add or link focused tests only when a specific uncovered behavior is confirmed. | Selective only. |
| API engine/runtime helpers | 62 | `positionPnlSemantics.ts`, `positionSizing.ts`, `runtimeExchangeSyncedPositionPrice.ts` | Backend + Test Automation | Existing runtime/engine tests cover representative behavior; scanner still reports helper-level direct relation gaps. | Map existing module tests to helper families or inspect only high-risk math helpers. | Possible targeted follow-up, not broad. |
| API script/prisma/data tooling | 24 | `apps/api/prisma/seed.ts`, `apps/api/scripts/assistant-load-benchmark.ts`, `apps/api/scripts/bot-v2-preflight-report.ts` | Backend + Data + Test Automation | Mostly tooling/readback contracts, not end-user runtime flows. | Add tests only for stable parser/output contracts that repeatedly fail. | No immediate implementation. |
| API positions runtime helpers | 17 | `livePositionReconciliation.helpers.ts` helper functions | Backend + Test Automation | [LUC-2187](/LUC/issues/LUC-2187) verified DB-free helper behavior, but current scanner still reports function-level rows because file-level relation is not enough for every helper. | Treat as relation granularity backlog; DB-backed reconciliation proof still needs local Postgres. | No new test gap isolated. |
| API bots setup/runtime helpers | 14 | `bots.e2e.shared.ts`, `bots.repository.ts`, `botsRuntimeRead.repository.ts` | Backend + Test Automation | Existing e2e/runtime proof exists; some DB-backed proof is environment-dependent. | Rerun DB-backed packs when local infra is available; avoid duplicate e2e tests. | No broad implementation. |
| Worker/observability runtime helpers | 9 | `runtimeFreshness.ts#parseEnvDate`, `marketStream.worker.ts`, `workerBootstrap.ts` | Backend + Ops + Test Automation | Worker/readiness proof is split between local checks and release gates. | Rerun DB-backed/local worker checks when infra is available; protected readiness remains release-gate scope. | No new implementation isolated. |
| Web route handler proxies | 6 | `apps/web/src/app/api/build-info/route.ts` helpers | Frontend + Ops/Test Automation | Build-info/public smoke proof exists as release evidence; helper rows remain direct relation backlog. | Add curated relation or a focused unit only if route-helper drift recurs. | No immediate implementation. |
| API key crypto helpers | 5 | `apps/api/src/utils/crypto.ts#encrypt`, `decrypt`, `getActiveKey` | Backend + Security + Test Automation | [LUC-2187](/LUC/issues/LUC-2187) verified focused crypto tests, but current scanner still reports helper-level rows due relation granularity. | Relation granularity cleanup only; no secret readback. | No new test gap isolated. |
| API utility/support helpers | 5 | `formatZodError.ts`, `hash.ts`, `errorExposure.ts` | Backend + Test Automation | Generic helpers are aggregate-covered through API tests unless a focused regression appears. | Add focused tests only for concrete validation/error/hash regressions. | No immediate implementation. |
| API auth/session helpers | 2 | `auth.session.ts#getSessionJwtExpiresIn`, `getSessionTtlMs` | Backend + Test Automation | Existing auth helper pack was verified in prior API/runtime helper work. | Optional direct helper relation cleanup. | No. |

## Validation Evidence
- Current architecture-awareness report:
  - generated `2026-06-05T12:33:42.151Z`;
  - entities `14318`;
  - relations `22427`;
  - raw implementation entities without inferred tests: `7654`;
  - actionable implementation entities without inferred tests: `859`;
  - actionable implementation entities without inferred docs: `0`;
  - classified inferred-link noise: `7377`.
- Full readback reconstructed the scanner's missing-test filter from
  `docs/graphs/architecture-awareness.json`, the curated graph coverage rules
  from `docs/graphs/architecture-graph.json`, and the current health summary:

```powershell
@'
const fs = require('fs');
// Reconstructed tested targets, scanner noise rules, and family buckets.
// Output matched health raw=7654 and actionable=859.
'@ | node -
```

- Readback output:
  - raw missing tests `7654` matched `docs/graphs/architecture-health.json`;
  - actionable missing tests `859` matched `docs/graphs/architecture-health.json`;
  - bucket sum `859`;
  - top buckets were local/release/Ops aggregate scripts `220`, protected
    production proof collectors `208`, script/tooling aggregate proof `186`,
    Web residual support `101`, and API engine/runtime helpers `62`.
- No browser/dev server was started; no process cleanup was required.

## Architecture Evidence
- Affected architecture entities: Architecture Evidence Graph,
  release-audit-tooling, protected proof collectors, Web residual support,
  API engine/runtime helpers, API positions helper relations, API-key crypto
  helper relations.
- Architecture fit: yes. This task classifies current graph signals without
  changing runtime architecture.
- Mismatch discovered: no implementation mismatch. The only remaining issue is
  scanner relation granularity for some helper rows that already have proof.

## Security / Privacy Evidence
- Data classification: local source metadata and generated graph summaries only.
- Secret handling: no secret values, cookies, API keys, session tokens, account
  data, screenshots, production data, or exchange credentials were read or
  stored.
- Fail-closed behavior: protected production proof collectors remain gated and
  were not executed locally.

## Deployment / Ops Evidence
- Deploy impact: none.
- Runtime impact: none.
- Env/database/account/exchange mutation: none.
- Production smoke: not run and not claimed.

## Result Report
- Task summary: classified the current `859` actionable missing-test rows from
  the `2026-06-05T12:33:42.151Z` architecture-awareness export.
- Files changed:
  - `history/tasks/luc-2197-classify-current-actionable-missing-test-rows-architecture-awareness-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Read-only Node reconstruction matched current graph health counts exactly
    for raw and actionable missing-test rows.
- What is incomplete:
  - The report-wide count remains `859`; this issue intentionally classifies
    rather than rewriting scanner inference or adding broad low-value tests.
  - DB-backed proof remains dependent on local Postgres/Redis where noted by
    prior issues.
  - Protected production proof remains gated by Ops/Security/QA release rules.
- Deployment impact: none.
- Runtime impact: none.
