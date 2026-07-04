# Task

## Header
- ID: LUC-88
- Title: Provide protected test-account smoke path
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test Automation
- Priority: P0
- Module Confidence Rows: production auth/session, protected smoke, runtime freshness, account access
- Requirement Rows: protected test-account smoke path, production authenticated acceptance
- Quality Scenario Rows: release smoke safety, credential handling
- Risk Rows: live trading/API-key mutation remains separately gated
- Iteration: 2026-07-04 resume heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-88-PROTECTED-TEST-ACCOUNT-SMOKE-PATH-RERUN-2026-07-04
- Mission Status: DONE

## Process Self-Audit
- [x] Scoped resume delta handled without switching issues.
- [x] New wake fact acknowledged: protected smoke access refs were bound.
- [x] No secret values were printed, copied, stored, or committed.
- [x] Work stayed inside QA/Test Automation verification ownership.

## Mission Block
- Mission objective: rerun redaction-safe protected smoke proof now that refs
  are bound.
- Included slices: names-only env check, protected-input checker regression,
  deploy smoke, runtime freshness.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit,
  secret/account value readback, DB/Redis mutation, production account
  mutation, exchange/payment mutation, order, position, subscription mutation,
  live-trading action.
- Stop conditions: any need to reveal secrets, mutate account data, or execute
  production recovery.

## Context
[LUC-88](/LUC/issues/LUC-88) asked for a safe Soar test account or smoke
fixture so Paperclip can verify login and core flows without touching Patryk's
exchange-linked live account. A resume wake stated protected smoke access refs
were bound and requested redaction-safe proof.

## Goal
Prove whether the bound protected test-account path can execute read-only
production smoke through approved tooling.

## Constraints
- Use existing approved smoke systems.
- Do not print or store secret values.
- Do not mutate production, accounts, exchanges, subscriptions, API keys, or
  trading state.
- Keep live trading/API-key actions blocked unless separately approved.

## Definition of Done
- [x] Current runner secret-ref presence checked by name/count/length only.
- [x] Protected-input checker regression run.
- [x] Read-only production deploy smoke passed.
- [x] Runtime freshness passed with process-local fresh-login mapping.
- [x] Evidence packet written.
- [x] Issue disposition updated to `done`.

## Forbidden
- Secret value readback, screenshots containing credentials, token capture,
  account mutation, exchange mutation, payment/subscription mutation, live
  trading, deploy, restart, rollback, env edit, DB/Redis mutation, or bypass
  behavior.

## Validation Evidence
- Current names-only check:
  - `SMOKE_AUTH_EMAIL`: present, length `50`.
  - `SMOKE_AUTH_PASSWORD`: present, length `35`.
  - `SMOKE_AUTH_TOKEN`: absent.
  - `PROD_UI_AUDIT_AUTH_EMAIL`: absent.
  - `PROD_UI_AUDIT_AUTH_PASSWORD`: absent.
- `pnpm run -s ops:protected-inputs:check:test` -> PASS, `7/7`.
- `pnpm run -s ops:protected-inputs:check -- --today 2026-07-04 --json-output history/artifacts/luc-88-protected-input-readiness-rerun-2026-07-04.json --markdown-output history/evidence/luc-88-protected-test-account-smoke-path-rerun-2026-07-04.md`
  -> `PARTIAL`; generic release checker does not count `SMOKE_AUTH_*`, but
  no values were printed.
- `$env:SMOKE_TIMEOUT_MS='15000'; pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  -> PASS: API `/health` `200`, API `/ready` `200`, Web `/` `200`, Web
  `/api/build-info` `200`, API `/workers/ready` `200`.
- `pnpm run -s ops:deploy:runtime-freshness` with process-local
  `DEPLOY_FRESHNESS_AUTH_EMAIL/PASSWORD` mapped from `SMOKE_AUTH_*` -> PASS;
  worker/market heartbeat age `13933 ms`, runtime signal lag `0 ms`, `5`
  running sessions, no stale session ids.

## Result Report
- Task summary: protected test-account smoke path is verified through bound
  `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` fresh-login refs.
- Files changed:
  - `history/evidence/luc-88-protected-test-account-smoke-path-rerun-2026-07-04.md`
  - `history/artifacts/luc-88-protected-input-readiness-rerun-2026-07-04.json`
  - `history/tasks/luc-88-protected-test-account-smoke-path-rerun-2026-07-04-task.md`
- How tested: commands listed above.
- What is incomplete: nothing remains for this path-provisioning issue.
  Release-grade acceptance, account mutation, exchange mutation, API-key
  mutation, payment/subscription mutation, order/position mutation, and
  live-trading proof remain separate gated lanes.
- Deployment impact: none.
- Commit/push: not committed or pushed; shared checkout was already dirty and
  this heartbeat is evidence-only.
