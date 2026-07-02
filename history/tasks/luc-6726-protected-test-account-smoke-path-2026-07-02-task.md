# Task

## Header
- ID: LUC-6726
- Title: Provide protected test-account smoke path
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P0
- Module Confidence Rows: production auth/session, protected smoke, runtime freshness
- Requirement Rows: protected test-account smoke path, production authenticated acceptance
- Quality Scenario Rows: release smoke safety, credential handling
- Risk Rows: production Web/worker readiness unavailable
- Iteration: 2026-07-02 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6726-PROTECTED-TEST-ACCOUNT-SMOKE-PATH-2026-07-02
- Mission Status: DONE

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority issue was selected from the scoped wake payload.
- [x] Operation mode matches QVE verification ownership.
- [x] The task is aligned with Soar and Paperclip safety contracts.
- [x] Missing information did not require user input because project env
  secret refs already expose the protected audit-login path.

## Mission Block
- Mission objective: verify and record a protected, non-dangerous Soar
  test-account smoke path.
- Release objective advanced: protected QA smoke can use the project-level
  audit-login secret-ref family instead of Patryk's live account.
- Included slices: issue context readback, names-only credential presence,
  protected-input checker regression, deploy-smoke attempt, runtime freshness.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit,
  secret/account value readback, DB/Redis mutation, production account
  mutation, exchange/payment mutation, order, position, subscription mutation,
  live-trading action.
- Stop conditions: any need to reveal secrets, mutate account data, or execute
  production recovery.
- Handoff expectation: close the path-provisioning issue and leave production
  service restoration on [LUC-6331](/LUC/issues/LUC-6331).

## Context
[LUC-6726](/LUC/issues/LUC-6726) asked for a safe Soar test account or smoke
fixture so Paperclip can verify login and core flows without touching Patryk's
exchange-linked live account.

## Goal
Prove whether the protected test-account path exists and can be used through
approved, redacted, read-only QA smoke tooling.

## Constraints
- Use existing approved smoke systems.
- Do not print or store secret values.
- Do not mutate production, accounts, exchanges, subscriptions, API keys, or
  trading state.
- Do not treat current production `503` as a missing account path.

## Definition of Done
- [x] Paperclip/Soar issue context read.
- [x] Test-account secret-ref family verified by name/presence/length only.
- [x] Legacy stale-token smoke path confirmed absent in this runner.
- [x] Existing protected-input checker regression run.
- [x] Read-only production smoke attempted with fresh-login mapping.
- [x] Runtime freshness verified with protected credential family.
- [x] Evidence packet written.
- [x] Issue disposition names residual production blocker owner/action.

## Forbidden
- Secret value readback, screenshots containing credentials, token capture,
  account mutation, exchange mutation, payment/subscription mutation, live
  trading, deploy, restart, rollback, env edit, DB/Redis mutation, or
  workaround/bypass behavior.

## Validation Evidence
- `GET /api/issues/LUC-6726/heartbeat-context` -> `200`.
- `GET /api/issues/LUC-6726` -> `200`; project env includes
  `PROD_UI_AUDIT_AUTH_EMAIL` and `PROD_UI_AUDIT_AUTH_PASSWORD` as secret refs.
- Names-only env presence:
  - `PROD_UI_AUDIT_AUTH_EMAIL`: present, length `26`.
  - `PROD_UI_AUDIT_AUTH_PASSWORD`: present, length `9`.
  - `SMOKE_AUTH_TOKEN`: absent.
- `pnpm run -s ops:protected-inputs:check:test` -> PASS, `7/7`.
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  with fresh-login mapping -> FAIL due Web `/` `503`, Web `/api/build-info`
  `503`, protected `/workers/ready` `503`; API `/health` and `/ready` passed.
- `pnpm run -s ops:deploy:runtime-freshness` with protected credential family
  -> PASS; worker/market heartbeat age `5260 ms`, runtime signal lag `0 ms`,
  `5` running sessions.

## Result Report
- Task summary: protected test-account smoke path is present through
  project-level audit-login secret refs and is safe for redacted read-only QA
  smoke. Full production smoke remains blocked by current production 503s.
- Files changed:
  - `history/evidence/luc-6726-protected-test-account-smoke-path-2026-07-02.md`
  - `history/tasks/luc-6726-protected-test-account-smoke-path-2026-07-02-task.md`
  - minimal state/context ledger updates.
- How tested: commands listed above.
- What is incomplete: accepted production deploy smoke/browser acceptance must
  rerun after [LUC-6331](/LUC/issues/LUC-6331) restores Web and worker
  readiness.
- Next owner: Ops Release Lead / board-approved Coolify mutation owner on
  [LUC-6331](/LUC/issues/LUC-6331); then QVE reruns production acceptance.
- Deployment impact: none.
- Commit/push: not committed or pushed because the shared checkout was already
  dirty/divergent and this heartbeat is evidence-only.

