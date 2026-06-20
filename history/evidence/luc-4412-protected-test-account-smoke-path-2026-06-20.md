# LUC-4412 Protected Test-Account Smoke Path

## Status

- Result: `PROVIDED / PATH_DOCUMENTED / PROTECTED_VALUES_NOT_DISCLOSED`
- Issue: [LUC-4412](/LUC/issues/LUC-4412)
- Date: 2026-06-20
- Owner: 11 SPM (Soar Product Manager)

## Affected Capability Chain

- Capability: protected production test-account smoke path for Soar auth and
  read-only UI verification.
- Existing scripts:
  - `scripts/runProdUiModuleClickthroughAudit.mjs`
  - `scripts/runProdAuthSessionBrowserProof.mjs`
  - `scripts/deploySmokeCheck.mjs`
  - `scripts/resolveOpsAuthToken.mjs`
- Existing protected input families:
  - `PROD_UI_AUDIT_AUTH_TOKEN` or
    `PROD_UI_AUDIT_AUTH_EMAIL` + `PROD_UI_AUDIT_AUTH_PASSWORD`
  - `PROD_UI_AUDIT_ADMIN_TOKEN` or
    `PROD_UI_AUDIT_ADMIN_EMAIL` + `PROD_UI_AUDIT_ADMIN_PASSWORD`
  - `PROD_AUTH_TOKEN` or `PROD_AUTH_EMAIL` + `PROD_AUTH_PASSWORD`
  - `SMOKE_AUTH_TOKEN` or `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`

## Approved Smoke Path

Use a Paperclip-protected Soar test account or smoke fixture through the input
families above. Values must be injected through Paperclip secrets or another
approved encrypted runtime path. Values must not be written to repository files,
issue comments, screenshots, generated artifacts, shell transcripts, or logs.

The account/path is approved only for redaction-safe verification:

- login/session acquisition;
- `/auth/me` and `/auth/logout` session boundary proof;
- protected route fail-closed redirects;
- dashboard and admin route reachability;
- module clickthrough that does not create, update, delete, trade, subscribe,
  connect exchange credentials, or change account settings;
- public smoke and protected `/workers/ready` read-only checks when separately
  authorized by the relevant release/security lane.

The path is not approval for:

- push, deploy, restart, rollback, or production config mutation;
- live exchange/API-key actions;
- trading, order, position, wallet, subscription, payment, plan, account, or
  profile mutation;
- reading or publishing raw protected values;
- using Patryk's owner exchange-linked account unless a separate supervised
  owner-session approval explicitly requires it.

## Owner-Supervised Or Separate-Approval Flows

These flows must stay fail-closed unless a separate protected lane approves the
exact action and evidence boundary:

- exchange connection, API-key, or live venue proof;
- live orders, positions, trading toggles, bot execution, or wallet mutation;
- subscription/payment/entitlement mutation;
- profile/security/account-setting mutation;
- production DB, Coolify, VPS, rollback, or worker mutation;
- any flow that requires Patryk's real exchange-linked account.

## Names-Only Runtime Check

The current runner exposed these protected input names without printing values:

| Input family | Current name presence |
| --- | --- |
| `PROD_UI_AUDIT_AUTH_TOKEN` | absent |
| `PROD_UI_AUDIT_AUTH_EMAIL` | present |
| `PROD_UI_AUDIT_AUTH_PASSWORD` | present |
| `PROD_UI_AUDIT_ADMIN_TOKEN` | present |
| `PROD_UI_AUDIT_ADMIN_EMAIL` | present |
| `PROD_UI_AUDIT_ADMIN_PASSWORD` | present |
| `SMOKE_AUTH_TOKEN` | present |
| `SMOKE_AUTH_EMAIL` | present |
| `SMOKE_AUTH_PASSWORD` | present |
| `PROD_AUTH_TOKEN` | absent |
| `PROD_AUTH_EMAIL` | absent |
| `PROD_AUTH_PASSWORD` | absent |

This check confirms a protected smoke path can be selected by the downstream
QA/Security/Ops lane without exposing credentials here. It does not prove that
the credentials are fresh or that the account has the required runtime
permissions; those are verified only inside the authorized protected smoke lane.

## Validation

- `node --test scripts/resolveOpsAuthToken.test.mjs scripts/runProdUiModuleClickthroughAudit.test.mjs scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runV1FinalPreflight.test.mjs`
  - Result: PASS, `27/27` tests.
- Names-only protected input presence check:
  - Result: PASS, no values printed.

## Regression Risk

- Low for source/runtime behavior: no production code was changed.
- Medium operational risk if downstream agents treat name presence as a live
  account proof. Mitigation: this packet explicitly requires the downstream
  protected lane to verify credential freshness and permission using redacted
  evidence before accepting production smoke.

## Commit Decision

- Commit is allowed only for this documentation/evidence packet and the matching
  task packet.
- Push, deploy, restart, protected smoke execution, and live account mutation
  remain forbidden by this issue.
