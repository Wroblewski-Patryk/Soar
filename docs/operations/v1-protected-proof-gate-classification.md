# V1 Protected Proof Gate Classification

Date: 2026-07-12
Issue: [LUC-634](/LUC/issues/LUC-634)
Scope: Soar V1 readiness proof routing for protected, secret-bearing,
production, exchange, subscription, deploy, rollback, and smoke gates.

## Purpose

This matrix separates proof gaps that agents can run locally from gates that
require Security/Ops review, protected production bindings, or explicit board
approval. It prevents local app-completion progress from being mistaken for
production readiness, and prevents protected readback from being mistaken for
approval to mutate production or exchange state.

## Source Inputs

- `DEPLOYMENT_GATE.md`
- `INTEGRATION_CHECKLIST.md`
- `AI_TESTING_PROTOCOL.md`
- `docs/status/app-completion-index.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/vps-production-readiness-smoke-checklist.md`
- `history/evidence/luc-172-protected-authenticated-browser-proof-packet-2026-07-10.md`
- `history/evidence/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10.md`
- `history/evidence/luc-243-protected-production-input-inventory-2026-07-10.md`
- `history/evidence/luc-500-protected-browser-runtime-trading-readonly-proof-2026-07-11.md`
- `history/evidence/luc-503-protected-ops-diagnostics-readonly-proof-2026-07-11.md`
- `package.json` scripts under `ops:*`, `test:go-live:*`, `ops:prod-*`,
  and `ops:rc:*`

## Classification Legend

| Class | Meaning | Execution rule |
| --- | --- | --- |
| Safe local | Uses local files, local tests, local Docker/test DB, generated indexes, or public no-secret route checks. | Any appropriate agent may run after normal repo hygiene. |
| Requires secret read | Needs presence or value-shape checks for protected bindings, but evidence must record names/counts only. | Security/Ops owner runs or reviews; no raw values in files, comments, screenshots, or logs. |
| Requires production read-only | Hits production with public endpoints or approved protected app/session refs, but performs no mutation. | QA/Ops/Security runner only after current protected refs and expected SHA are bound. |
| Requires production mutation | Creates, updates, deletes, restarts, rolls back, mutates account/app state, or creates/cleans production fixtures. | Separate issue and explicit approval required for exact action and cleanup. |
| Forbidden until approval | LIVE order/cancel/close, exchange account mutation, payment/subscription mutation, secret disclosure, deploy, restart, rollback, DB mutation, or broad account-data capture. | Do not run from classification, proof-prep, or read-only issues. |

## Gate Matrix

| Gate family | Representative scripts / surfaces | Classification | Owner / action | Acceptance evidence | Stop condition |
| --- | --- | --- | --- | --- | --- |
| Local build, typecheck, lint, graph, docs, and app-completion checks | `pnpm run lint`, `pnpm run typecheck`, `pnpm run quality:guardrails`, `pnpm run architecture:*`, app-completion generation | Safe local | Engineering Delivery / Test Automation runs focused checks for touched scope. | Command, exit status, generated index counts, changed files. | Local infra unavailable for DB-backed checks; record as blocked or partial, not production proof. |
| Local go-live API/Web/backtest smoke | `test:go-live:api`, `test:go-live:web`, `test:go-live:smoke`, `qa:smoke-e2e:repeatable` | Safe local when target is local; may require local Docker DB/Redis | Test Automation owns local smoke; Ops owns local infra readiness. | PASS artifact with local target, DB/Redis availability, test counts. | Missing local Postgres/Redis or Docker engine. |
| Public production API/Web availability | `ops:deploy:smoke -- --no-workers`, `/health`, `/ready`, Web `/`, Web `/api/build-info` | Requires production read-only when pointed at production; no secret read if only public endpoints | Ops Release Lead records target URLs, expected SHA, status codes, timings. | Redacted command output, expected SHA match, public status codes. | SHA mismatch, non-200, degraded readiness, severe timeout. |
| Build provenance | `ops:deploy:wait-web-build-info`, Web `/api/build-info`, `RELEASE_GATE_EXPECTED_SHA` | Safe local for candidate SHA read; production read-only for deployed build-info | Ops Release Lead confirms source commit and deployed Web build-info source. | Candidate SHA, observed SHA, `metadataSource=env|git|git-files`. | `unknown`, `env-runtime`, branch fallback, or mismatch. |
| Protected input readiness | `ops:protected-inputs:check`, `ops:release:v1:preflight` | Requires secret read for names/value-shape only | Security Review Lead and Ops bind/read protected families by name only. | Present/missing by family, no values, account-access gate status. | Any command would print raw token, cookie, password, API key, DB URL, payment, or exchange secret. |
| Auth/session production browser proof | `ops:prod-auth:proof`, `runProdAuthSessionBrowserProof.mjs`, `PROD_UI_AUDIT_*`, `SOAR_PROD_TEST_*` | Requires production read-only plus protected session refs | QA/Ops protected-session runner executes with current expected SHA and approved test/admin principal. | Redirects, login/protected route/logout/stale session fail-closed, redacted artifact. | Missing approved session, 401/403 where auth is expected, secret capture, raw screenshot risk. |
| Auth/session local API proof | Auth/JWT/session tests, auth route e2e with local DB | Safe local, except local DB/Redis dependency | Test Automation owns focused auth proof and graph/test-link closure. | Test files and counts, app-completion/project-truth update. | Local DB unavailable for DB-backed e2e; do no production substitution. |
| Exchange API-key encryption and profile API-key stewardship | API-key encryption tests, profile API-key list, unsupported exchange probe | Safe local for encryption/tests; production read-only for profile list/probe | Security + Backend for local cryptographic proof; Security/Ops for protected production readback. | Local test PASS; production proof reports counts/status only and redaction checks. | Raw API key/secret value is needed or appears; probe would persist or print real credentials. |
| Exchange catalogs and market stream readback | `ops:prod-security-exchange:proof`, `ops:exchange:gateio-market-stream-smoke`, catalog routes | Safe local for adapter tests; production read-only for catalog/readback | Integration Trading + Security/Ops run read-only catalog/runtime proof with approved bindings. | Catalog counts, canonical symbol checks, fail-closed unsupported capability details. | Any submit/cancel/close, leverage/margin/account setting mutation, or raw account payload capture. |
| LIVE trading mutation | Manual order submit/cancel/close, bot LIVE activation, controlled live session proof | Forbidden until approval; then requires production mutation | Integration Trading drafts exact proposal; Security, QA, and Ops review; board/operator approves exact exchange/symbol/side/size/action. | Separate approval packet, min-notional/contract-size proof, consent/riskAck, cleanup/rollback readback. | No exact approval, ambiguous account/principal, stale build, missing no-order guard classification, unexpected exposure. |
| Bot/runtime dashboard and positions readback | `ops:liveimport:readback`, `ops:prod-positions:proof`, authenticated dashboard routes | Requires production read-only with protected auth | QA/Ops + Integration Trading run route/runtime readback with masked counts/status only. | Runtime rows/counts, ownership/user match, no mutation, redacted artifact. | Requires enabling bot, changing strategy, changing LIVE opt-in, closing/canceling, or raw exchange data capture. |
| Production fixture action proof | `ops:prod-fixture:action-proof` | Requires production mutation even if PAPER/disposable | QA/Ops may run only with explicit production fixture approval, declared cleanup, and rollback/cleanup evidence. | Created fixture identifiers redacted, cleanup PASS, no LIVE exchange action. | Approval absent, cleanup uncertain, fixture crosses LIVE/exchange/payment boundary. |
| Subscription/entitlement and payment/provider proof | Subscription/admin routes, checkout/callback/provider paths, entitlement mutation | Safe local for tests; production mutation for subscription/payment/admin changes | Product + Security + QA define account class; Ops/Security approve any production entitlement/provider mutation. | Local test/browser proof or explicit production approval with provider/test-mode evidence. | Payment/provider mutation, production entitlement changes, or real account subscription changes without exact approval. |
| Deploy, restart, env edit, migration, and Coolify mutation | Coolify deploy, app restart, env edit, migration, service topology changes | Requires production mutation | Ops Release Lead only after commit/source, migration, rollback, smoke, and secret gates are current. | Deployment record, target env, migration status, health/smoke, rollback path. | Dirty worktree exception absent, required tests fail, rollback unknown, secrets missing, migration ambiguity. |
| Rollback guard and rollback proof | `ops:deploy:rollback-guard`, `ops:deploy:rollback-proof:prod`, `ROLLBACK_GUARD_*` | Read-only guard requires protected refs; actual rollback requires production mutation approval | Ops Release Lead runs read-only guard; board/operator approves rollback execution. | Guard PASS, target SHA named, rollback mode documented. | Guard fails/stale, target unknown, schema incompatibility, destructive DB ambiguity. |
| DB backup/restore production drill | `ops:db:backup-verify:prod`, `ops:db:restore-drill:prod`, `PROD_DB_CHECK_*` | Requires secret read and Ops approval; may require production-sensitive operation | Ops Release Lead owns profile, redacted evidence, and restore-safety boundary. | Current PASS artifact with container/user/db names only and no secret values. | Missing DB check family, destructive restore ambiguity, raw DB URL/password capture. |
| RC and V1 release gate | `ops:rc:gates:*`, `ops:release:v1:preflight`, `ops:release:v1:gate`, `RC_*`, `GATE*` | Local refresh can be safe; final prod gate requires protected refs and release approval | Delivery/Ops integrates proof packets and sign-off; Security/QA/Ops own protected gate rows. | RC status, sign-off record, protected evidence freshness, release gate output. | Any required protected evidence is stale/missing or sign-off mismatches the candidate SHA. |
| AI runtime safety | `test:adversarial:api-assistant`, `AI_TESTING_PROTOCOL.md` scenarios | Safe local unless tool/model/prod account access is introduced | AI Runtime + Security run reproducible multi-turn and adversarial scenarios. | Scenario list, model/runtime config, pass/fail per scenario, redacted transcripts. | Prompt injection/data leakage failure, unauthorized tool/credential access, production account dependency without approval. |
| Logs and secret hygiene | Redacted Coolify/app log window, artifact redaction checks | Requires production read-only when reading production logs | Ops/Security collect minimal redacted log window. | Crash-loop status, high-severity errors, no secret leakage statement. | Raw log capture exposes secret/account/token/payment/exchange material. |

## Owner Routing For Named V1 Gates

| Gate | Primary owner | Next action |
| --- | --- | --- |
| Auth | QA/Ops protected-session runner, with Security review for protected refs | Use the existing LUC-172/LUC-500 auth proof packet path; rerun only with current approved session and expected SHA. |
| Exchange API key | Security Review Lead + Backend Builder | Keep local encryption/API-key stewardship proof separate from production profile readback. Production readback uses LUC-174/LUC-500/LUC-503-style redacted proof; no raw key values. |
| Subscription/entitlement | Product + Security + QA/Test Automation | Local tests/browser proof are safe; production entitlement/payment/provider mutation needs exact approval and account class before execution. |
| Deploy/rollback | Ops Release Lead | Deploy/restart/env/migration/rollback are release operations. Run local/source gates first, then protected rollback guard/proof only through approved Ops issue. |
| Production smoke | QA/Ops protected runner | Public smoke may run read-only; protected worker/auth/browser/runtime smoke requires current protected refs and expected SHA. Public smoke never closes protected proof by itself. |

## Child-Issue Routing Decision

No new child issue is required from this classification pass. Concrete proof
paths already exist in the current Soar board/history for the highest-risk
families:

- auth/browser production readback: [LUC-172](/LUC/issues/LUC-172) packet and
  [LUC-500](/LUC/issues/LUC-500) executed proof;
- protected trading readback and LIVE mutation boundary:
  [LUC-174](/LUC/issues/LUC-174), [LUC-500](/LUC/issues/LUC-500), and
  [LUC-503](/LUC/issues/LUC-503);
- protected input inventory: [LUC-243](/LUC/issues/LUC-243);
- VPS readiness checklist: [LUC-502](/LUC/issues/LUC-502).

Create a new child only when a future issue names a specific missing proof run
with target environment, expected SHA, allowed account/principal class, evidence
fields, stop conditions, and owner lane.

## Release Rule

Soar V1 readiness may use local checks to reduce implementation risk, but it
may not claim production readiness until every required protected production
row is either `PASS` with fresh redacted evidence, explicitly deferred with
release owner approval, or blocked with a named owner/action. Protected
read-only evidence never authorizes LIVE mutation, deploy, restart, rollback,
DB/Redis mutation, payment/subscription mutation, or secret disclosure.
