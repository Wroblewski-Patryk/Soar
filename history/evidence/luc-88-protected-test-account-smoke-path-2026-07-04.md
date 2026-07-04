# LUC-88 Protected Test-Account Smoke Path

## Scope

TAE verification of whether this heartbeat has a protected Soar test-account
smoke path available without touching Patryk's exchange-linked live account.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, or live-trading action was
performed.

## Result

`BLOCKED_FOR_THIS_RUN / PRIOR_PATH_EXISTS / CURRENT_BINDING_MISSING`.

Prior Soar evidence from `history/evidence/luc-6726-protected-test-account-smoke-path-2026-07-02.md`
records the accepted read-only QA smoke path as the fresh-login
`PROD_UI_AUDIT_AUTH_EMAIL` plus `PROD_UI_AUDIT_AUTH_PASSWORD` secret-ref
family, with direct `SMOKE_AUTH_TOKEN` intentionally absent.

This TAE heartbeat does not have that credential family bound by name, so it
cannot run or provide the protected account smoke path. The correct unblock
owner is Security/Ops or the approved credential-binding owner: bind the
non-dangerous Soar smoke principal to the current TAE/QVE runner through the
approved secret manager, or explicitly mark protected flows as
owner-supervised-only.

## Credential Boundary

Secret values, cookies, tokens, passwords, private headers, and account payloads
were not printed or stored. Validation checked names, presence, and counts only.

## Direct Names-Only Check

| Name | Present | Length |
| --- | --- | ---: |
| `PROD_UI_AUDIT_AUTH_EMAIL` | no | 0 |
| `PROD_UI_AUDIT_AUTH_PASSWORD` | no | 0 |
| `SMOKE_AUTH_TOKEN` | no | 0 |
| `SMOKE_AUTH_EMAIL` | no | 0 |
| `SMOKE_AUTH_PASSWORD` | no | 0 |
| `DEPLOY_FRESHNESS_AUTH_EMAIL` | no | 0 |
| `DEPLOY_FRESHNESS_AUTH_PASSWORD` | no | 0 |
| `ROLLBACK_GUARD_AUTH_EMAIL` | no | 0 |
| `ROLLBACK_GUARD_AUTH_PASSWORD` | no | 0 |

# V1 Protected Input Readiness Sweep

## Context

- Evidence date: 2026-07-04
- Deployed build-info SHA: `unknown`
- Build-info readback time: `not provided`
- Scope: current execution shell only
- Secret handling: no secret values printed, copied, or stored

## Result

- Status: `PARTIAL`
- Matching protected input names present: `2`
- Account-access gate: `FAIL`
- Missing required account-access families: `ROLLBACK_GUARD_*, PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*, RC_*, GATE* / GATE_*`
- V1 release status: `NO-GO`

## Checked Input Families

| Family | Required for account-access gate | State | Matching names | Purpose |
| --- | --- | --- | --- | --- |
| `LIVEIMPORT_READBACK_*` | no | missing | 0 | Protected LIVEIMPORT-03 production runtime readback |
| `ROLLBACK_GUARD_*` | yes | missing | 0 | Protected production rollback/runtime freshness proof |
| `PROD_UI_AUDIT_*` | no | missing | 0 | Authenticated production dashboard/admin UI clickthrough |
| `PROD_UI_*` | no | missing | 0 | Legacy production UI audit input family |
| `SOAR_PROD_*` | yes | present | 2 | Production app/operator context |
| `PROD_DB_CHECK_*` | yes | missing | 0 | Production DB restore context |
| `PRODUCTION_DB_CHECK_*` | yes | missing | 0 | Alternate production DB restore context |
| `RC_*` | yes | missing | 0 | Release-candidate gate context |
| `GATE* / GATE_*` | yes | missing | 0 | Gate approver context |

## Observed Output

```text
MATCHING_PROTECTED_INPUT_NAMES_PRESENT_BUT_ACCOUNT_ACCESS_GATE_INCOMPLETE
```

## Release Impact

- The current shell can run no-secret checks only when required protected
  families are missing.
- Protected `AUD-19` evidence remains blocked until approved operator inputs
  are provided.
- Public build-info and smoke evidence must not be substituted for protected
  runtime, rollback, restore, UI, SLO, or sign-off proof.

## Next Action

Execute the current operator unblock packet only after approved protected inputs and real approver fields are available.
