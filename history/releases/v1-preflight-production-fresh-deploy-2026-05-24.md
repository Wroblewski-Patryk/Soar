# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-24T15:16:36.812Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1
- Evidence date: 2026-05-24
- Build-info: pass
- Public smoke: blocked
- Raw JSON: history\artifacts\v1-preflight-production-fresh-deploy-2026-05-24.json

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
| liveimport auth | missing | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | missing | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production UI dashboard auth | missing | PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD |
| production UI admin auth | missing | PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD |
| production DB restore context | missing | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | missing | yes | - | no matching artifact found |
| activation execution plan | missing | yes | - | no matching artifact found |
| RC external gates status | missing | yes | - | no matching artifact found |
| RC sign-off record | missing | yes | - | no matching artifact found |
| RC checklist verification block | missing | yes | - | no matching artifact found |
| LIVEIMPORT-03 runtime readback | missing | yes | - | no matching artifact found |
| production UI clickthrough | missing | yes | - | no matching artifact found |
| backup/restore drill evidence | missing | yes | - | no matching artifact found |
| rollback proof pack | missing | yes | - | no matching artifact found |

## Blockers
- public-smoke
- env:liveimport auth
- env:rollback guard auth
- env:production UI dashboard auth
- env:production UI admin auth
- env:production DB restore context
- evidence:activationAudit:missing
- evidence:activationPlan:missing
- evidence:rcExternalGateStatus:missing
- evidence:rcSignoffRecord:missing
- evidence:rcChecklist:missing
- evidence:liveImportReadback:missing
- evidence:prodUiClickthrough:missing
- evidence:backupRestoreDrill:missing
- evidence:rollbackProof:missing

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| public-smoke | public_reachability | blocking | no | no | yes |
| env:liveimport auth | protected_prerequisite | blocking | yes | no | yes |
| env:rollback guard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI dashboard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI admin auth | protected_prerequisite | blocking | yes | no | yes |
| env:production DB restore context | protected_prerequisite | blocking | yes | no | yes |
| evidence:activationAudit:missing | release_evidence | blocking | yes | yes | no |
| evidence:activationPlan:missing | release_evidence | blocking | yes | yes | no |
| evidence:rcExternalGateStatus:missing | release_evidence | blocking | yes | yes | no |
| evidence:rcSignoffRecord:missing | release_evidence | blocking | yes | yes | no |
| evidence:rcChecklist:missing | release_evidence | blocking | yes | yes | no |
| evidence:liveImportReadback:missing | release_evidence | blocking | yes | yes | yes |
| evidence:prodUiClickthrough:missing | release_evidence | blocking | yes | yes | yes |
| evidence:backupRestoreDrill:missing | release_evidence | blocking | yes | yes | no |
| evidence:rollbackProof:missing | release_evidence | blocking | yes | yes | no |

## Next Actions
- public-smoke: Run the existing public smoke command and fix public health/readiness/web reachability before protected evidence collection.
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- env:production UI dashboard auth: Provide approved production app auth for non-destructive dashboard module clickthrough. Required inputs: PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD.
- env:production UI admin auth: Provide approved production admin app auth for non-destructive admin module clickthrough. Required inputs: PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD.
- env:production DB restore context: Provide production DB/Coolify context before running the restore drill. Required inputs: PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME.
- evidence:liveImportReadback:missing: Run the read-only collector after build-info confirms current HEAD and read-only auth is available.
- evidence:prodUiClickthrough:missing: Run the no-secret production UI audit after dashboard and admin app auth are available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
