# Task

## Header
- ID: LUC-88
- Title: Provide protected test-account smoke path
- Task Type: verification
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test Automation
- Priority: P0
- Module Confidence Rows: production auth/session, protected smoke, account access
- Requirement Rows: protected test-account smoke path, production authenticated acceptance
- Quality Scenario Rows: release smoke safety, credential handling
- Risk Rows: protected credential binding unavailable in this runner
- Iteration: 2026-07-04 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-88-PROTECTED-TEST-ACCOUNT-SMOKE-PATH-2026-07-04
- Mission Status: BLOCKED

## Process Self-Audit
- [x] Scoped wake payload selected the issue.
- [x] Paperclip heartbeat context read.
- [x] Soar protected-smoke docs and prior evidence inspected.
- [x] No secret values were printed, copied, stored, or committed.
- [x] Work stayed inside QA/Test Automation evidence ownership.

## Mission Block
- Mission objective: verify whether a non-dangerous protected Soar
  test-account smoke path is available in this heartbeat.
- Included slices: issue readback, prior protected-smoke evidence inspection,
  names-only environment check, protected-input checker regression, current
  protected-input readiness report.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit,
  secret/account value readback, DB/Redis mutation, production account
  mutation, exchange/payment mutation, order, position, subscription mutation,
  live-trading action.
- Stop conditions: missing approved credential binding, any need to expose
  secret values, any need for production mutation.

## Context
[LUC-88](/LUC/issues/LUC-88) asks for a safe Soar test account or smoke fixture
so Paperclip can verify login and core flows without touching Patryk's
exchange-linked live account.

## Goal
Confirm whether the protected test-account path is present and usable by this
TAE runner through approved, redacted, read-only QA smoke tooling.

## Constraints
- Use existing approved smoke systems.
- Do not print or store secret values.
- Do not mutate production, accounts, exchanges, subscriptions, API keys, or
  trading state.
- Do not substitute public smoke for protected authenticated smoke.

## Definition of Done
- [x] Paperclip issue context read.
- [x] Prior Soar protected-smoke evidence inspected.
- [x] Current runner secret-ref presence checked by name/count/length only.
- [x] Protected-input checker regression run.
- [x] No-secret readiness artifact written.
- [x] Issue disposition names blocker owner/action.

## Forbidden
- Secret value readback, screenshots containing credentials, token capture,
  account mutation, exchange mutation, payment/subscription mutation, live
  trading, deploy, restart, rollback, env edit, DB/Redis mutation, or bypass
  behavior.

## Validation Evidence
- `GET /api/issues/LUC-88/heartbeat-context` -> `200`.
- Prior accepted path: `history/evidence/luc-6726-protected-test-account-smoke-path-2026-07-02.md`
  records `PROD_UI_AUDIT_AUTH_EMAIL` plus `PROD_UI_AUDIT_AUTH_PASSWORD` as the
  accepted fresh-login read-only smoke family.
- Current names-only check:
  - `PROD_UI_AUDIT_AUTH_EMAIL`: absent.
  - `PROD_UI_AUDIT_AUTH_PASSWORD`: absent.
  - `SMOKE_AUTH_TOKEN`: absent.
  - `SMOKE_AUTH_EMAIL`: absent.
  - `SMOKE_AUTH_PASSWORD`: absent.
- `pnpm run -s ops:protected-inputs:check:test` -> PASS, `7/7`.
- `pnpm run -s ops:protected-inputs:check -- --today 2026-07-04 --json-output history/artifacts/luc-88-protected-input-readiness-2026-07-04.json --markdown-output history/evidence/luc-88-protected-test-account-smoke-path-2026-07-04.md`
  -> `PARTIAL`; only `SOAR_PROD_*` family present by name, account-access gate
  `FAIL`, `PROD_UI_AUDIT_*` missing.

## Result Report
- Task summary: prior project evidence shows the protected test-account smoke
  path exists, but this TAE heartbeat cannot use it because the accepted
  fresh-login credential family is not bound in the current runner.
- Files changed:
  - `history/evidence/luc-88-protected-test-account-smoke-path-2026-07-04.md`
  - `history/artifacts/luc-88-protected-input-readiness-2026-07-04.json`
  - `history/tasks/luc-88-protected-test-account-smoke-path-2026-07-04-task.md`
- How tested: commands listed above.
- What is incomplete: Security/Ops or approved credential-binding owner must
  bind the non-dangerous Soar smoke principal to the current TAE/QVE runner via
  approved secret storage, or record that protected flows are
  owner-supervised-only.
- Next owner: Security/Ops credential-binding owner.
- Deployment impact: none.
- Commit/push: not committed or pushed; shared checkout was already dirty and
  this heartbeat is evidence/blocker-only.
