# Production Acceptance Technical Matrix

Status: canonical production acceptance gate  
Issue: LUC-6719  
Parent context: LUC-6716 authenticated production acceptance sweep  
Last updated: 2026-07-02  
Owner: Technical Solution Architect  
Process class: release/deploy gate

## Purpose

This matrix defines the technical conditions required before Soar production can
be accepted as ready for owner/user use. It converts the repository completion
contracts, architecture constraints, release gates, and latest production
evidence into a single go/no-go checklist.

Production acceptance is `NO-GO` when any P0 or P1 row is missing, failed, stale,
or blocked without an accepted deferral. A passing local check cannot override a
failed production check for the same deployed surface.

## Current Decision

Current decision: `NO-GO`.

Reason: LUC-6716 on 2026-07-02 recorded production Web `503`,
`/api/build-info` `503`, `/workers/ready` `503`, rollback guard action required,
and authenticated browser proof fail-closed before session evidence. Runtime
freshness passed, but that is not sufficient for production acceptance.

Next unblock owner: Ops Release Lead / board-approved Coolify mutation owner for
the active production restoration lane tracked by LUC-6331. After restoration,
QVE reruns the acceptance proof pack listed below.

## Source Contracts

| Source | Acceptance input |
| --- | --- |
| `DEFINITION_OF_DONE.md` | No task or release claim is done without build, real behavior, docs, reliability/security/rollback evidence, and reproducible proof. |
| `INTEGRATION_CHECKLIST.md` | Production features must use real service paths across UI, API, DB, validation, errors, restart/refresh behavior, and no mock/placeholder path. |
| `DEPLOYMENT_GATE.md` | Deployment is blocked by failing build/tests, missing env/secrets, runtime errors, failed health checks, missing rollback, or incomplete security validation. |
| `NO_TEMPORARY_SOLUTIONS.md` | Workarounds, fake data, local-only behavior presented as production-ready, and silent bypasses cannot pass acceptance. |
| `AI_TESTING_PROTOCOL.md` | AI behavior requires reproducible multi-turn safety, prompt-injection, leakage, and unauthorized-access proof before AI risk can be accepted. |
| `docs/architecture/architecture-source-of-truth.md` | Acceptance cannot rely on implementation that conflicts with approved architecture or silently changes boundaries. |
| `docs/architecture/reference/runtime-signal-merge-contract.md` | Runtime decisions must remain deterministic, fail-closed, audited, and parity-aligned across BACKTEST/PAPER/LIVE. |
| `docs/architecture/reference/assistant-runtime-contract.md` | Assistant output remains advisory in implemented scope; LIVE/executable AI remains gated and fail-closed. |
| `docs/status/app-completion-index.md` | User-facing acceptance requires backend/API, frontend, auth/subscription/configuration gates, tests, docs, and browser evidence. |
| LUC-6716 evidence | Latest read-only production evidence for deploy smoke, runtime freshness, rollback guard, UI clickthrough, auth-session proof, and timing. |

## Acceptance Matrix

| ID | Gate | Severity | Required evidence | Current state | Owner | Release impact |
| --- | --- | --- | --- | --- | --- | --- |
| PA-01 | Source/build provenance | P0 | Git branch/ref, commit SHA or explicit dirty-worktree blocker, production `/api/build-info` reachable and matching expected SHA. | `blocked`: LUC-6716 Web `/api/build-info` returned `503`, observed SHA `n/a`; worktree is dirty and `main...origin/main` was ahead 22 / behind 3 in LUC-6716 snapshot. | Ops Release Lead + Engineering Delivery Lead | Blocks production acceptance and authenticated browser proof. |
| PA-02 | Public API health/readiness | P0 | `ops:deploy:smoke` API `/health` and `/ready` pass against production target. | `partially verified`: LUC-6716 API `/health=200`, `/ready=200`. | QVE | Required but not sufficient. |
| PA-03 | Production Web availability | P0 | `ops:deploy:smoke` Web `/` and `/api/build-info` pass; public routes render without 5xx. | `failed`: LUC-6716 Web `/=503`, `/api/build-info=503`; UI clickthrough public routes failed. | Ops Release Lead | Blocks owner/user acceptance. |
| PA-04 | Worker readiness and rollback guard | P0 | `/workers/ready` passes or has accepted fail-closed reason; rollback guard reports no action required. | `failed`: LUC-6716 `/workers/ready=503`; rollback guard returned `ROLLBACK_GUARD_ACTION_REQUIRED` due to worker readiness. | Ops Release Lead | Blocks production acceptance; may require rollback/restoration decision. |
| PA-05 | Runtime freshness | P0 | `ops:deploy:runtime-freshness` passes with current worker heartbeat, market data age, runtime signal lag, and expected session visibility. | `verified`: LUC-6716 runtime freshness passed; heartbeat and market data age `3586 ms`, signal lag `0 ms`, running sessions `5`. | QVE + Ops Release Lead | Required runtime confidence, but cannot override PA-03/PA-04. |
| PA-06 | Authenticated browser session proof | P0 | `ops:prod-auth:proof` passes with protected audit account binding, no secret leakage, build-info match, and redacted session evidence. | `blocked`: LUC-6716 failed closed before artifact write because build-info returned `503` and did not match expected SHA. | QVE + Security Review Lead for account boundary | Blocks authenticated production acceptance. |
| PA-07 | Production UI clickthrough | P0 | `ops:ui:prod-clickthrough` passes public, dashboard, admin, and legacy redirect route groups with artifacts. | `failed`: LUC-6716 public `FAIL:4`, dashboard `FAIL:18`, admin `FAIL:3`, legacy redirects `FAIL:3`. | QVE + Frontend if defects remain after Ops restoration | Blocks user-facing acceptance. |
| PA-08 | Critical user-flow completion | P1 | App-completion index has no release-blocking `blocked` rows and acceptance-critical flows have fresh proof or accepted deferral. | `not verified`: 2026-07-01 index still reports 2303 items, 8 flows, 452 needs browser/screenshot review, 1042 missing test link, 560 missing doc link, and 5 blocked. | Engineering Delivery Lead + Docs Memory + QA | Blocks broad V1/sellable readiness unless explicitly scoped/accepted. |
| PA-09 | Local regression baseline | P1 | Relevant local checks for changed scope pass or are blocked with exact infra reason: guardrails, lint/typecheck/build, API/web tests, go-live smoke where applicable. | `not run by LUC-6719`: this issue is a matrix/documentation lane. Use latest lane evidence before release decision. | Engineering Delivery Lead + QA | Required before commit/push/deploy acceptance. |
| PA-10 | Security/account/secret boundary | P0 | Protected account access uses approved test/audit accounts, secrets are not printed, screenshots/logs redacted, and risky auth/account/payment/API-key paths have fail-closed proof. | `partially verified`: LUC-6716 recorded credential-boundary compliance; latest security/account gate evidence must still be current before release. | Security Review Lead | Blocks auth, secrets, payments, exchange credentials, or protected smoke if stale. |
| PA-11 | Exchange and live-trading safety | P0 | No live-trading mutation unless explicitly approved; exchange key onboarding/usage fail-closed; LIVE execution has entitlement, risk, kill switch, and audit proof. | `protected/no mutation`: LUC-6716 performed no exchange/payment/order/position/subscription/live-trading action. | Integration Trading + Security + QA | Blocks live-risk claims; read-only acceptance may proceed only if live paths remain disabled or explicitly verified. |
| PA-12 | AI runtime safety | P1 | Assistant runtime remains advisory for implemented chain; no LIVE/executable AI without AI protocol, red-team, trace, and fail-closed proof. | `accepted boundary`: architecture contract says executable AI is deferred/not implemented; dry-run LIVE is rejected at API boundary. | AI Runtime + Security | Blocks any AI-driven execution claim. |
| PA-13 | Observability, alerts, and incident path | P1 | Health/readiness checks, rollback guard, runtime freshness, alert route, and owner path are known; incident/rollback docs match current topology. | `partial`: LUC-6716 rollback guard ran and found action required; alerts returned none; owner path is LUC-6331 Ops restoration. | Ops Release Lead | Blocks final release if action route is missing or ignored. |
| PA-14 | Rollback/recovery readiness | P0 | Rollback path is known, tested for risk level, and current deployment source/resource is named before mutation. | `blocked for acceptance`: rollback guard says action required; no rollback was executed in LUC-6716. | Ops Release Lead | Blocks deploy/production mutation acceptance until decision is recorded. |
| PA-15 | Documentation and evidence durability | P1 | Acceptance evidence has readable markdown, raw artifacts where applicable, task packet, source-of-truth updates, and Paperclip disposition. | `implemented by LUC-6719`: this matrix and task packet define the gate; issue disposition must cite them. | TSA + Docs Memory | Required for auditability. |

## Rerun Pack After Ops Restoration

QVE should rerun this minimum pack after LUC-6331 or its replacement restores
production Web and worker readiness:

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch

$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness

$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_TIMEOUT_MS='10000'
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard

$env:PROD_UI_AUDIT_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:PROD_UI_AUDIT_API_BASE_URL='https://api.soar.luckysparrow.ch'
pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-02 --output-json history/artifacts/luc-6716-prod-ui-module-clickthrough-rerun-2026-07-02.json --output-md history/evidence/luc-6716-prod-ui-module-clickthrough-rerun-2026-07-02.md

$env:PROD_AUTH_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:PROD_AUTH_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:PROD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:PROD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --today 2026-07-02 --output-json history/artifacts/luc-6716-prod-auth-session-browser-proof-rerun-2026-07-02.json --output-md history/evidence/luc-6716-prod-auth-session-browser-proof-rerun-2026-07-02.md
```

Also record representative HTTP timing for API `/health`, API `/ready`, Web `/`,
and Web `/api/build-info`. Close browser/headless processes after browser proof.

## Handoff Rules

- If PA-03 or PA-04 still fails, route to Ops Release Lead. Do not create
  frontend/backend repair work until Ops distinguishes deployment/resource
  failure from application defect.
- If Web and worker readiness pass but authenticated proof fails on session,
  ownership, or secret binding, route to Security Review Lead plus QVE.
- If production UI clickthrough fails after Web availability and build-info are
  healthy, route the specific failing route group to Frontend/UX with the JSON
  artifact and screenshot/clickthrough evidence.
- If runtime freshness or trading safety fails, route to Backend/Runtime,
  Integration Trading, and Security according to affected risk surface.
- If app-completion or architecture graph drift remains release-blocking, route
  to Engineering Delivery Lead and Docs Memory before new feature work.

## Acceptance Decision Rule

Production can move from `NO-GO` to `GO` only when:

1. all P0 rows are `verified` or explicitly deferred by the accountable owner
   with release-impact approval;
2. all P1 rows are `verified`, accepted as non-blocking for the exact release
   scope, or converted into owner-ready child issues;
3. evidence is current for the deployed source/resource being accepted;
4. no protected boundary was crossed without approval; and
5. the Paperclip parent issue records the final disposition and evidence links.
