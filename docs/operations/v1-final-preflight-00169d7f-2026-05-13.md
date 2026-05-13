# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-13T17:16:01.063Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 00169d7fdc3aff8317759137b05594b20e773c8e
- Evidence date: 2026-05-13
- Build-info: pass
- Public smoke: pass
- Raw JSON: docs\operations\_artifacts-v1-final-preflight-00169d7f-2026-05-13.json

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
| activation evidence audit | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| activation execution plan | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| RC external gates status | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |
| RC sign-off record | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |
| RC checklist verification block | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |
| LIVEIMPORT-03 runtime readback | missing | yes | - | no matching artifact found |
| production UI clickthrough | failed | yes | 2026-05-13 | artifact is fresh but does not satisfy authenticated production UI clickthrough checks |
| backup/restore drill evidence | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |
| rollback proof pack | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |

## Blockers
- env:liveimport auth
- env:rollback guard auth
- env:production UI dashboard auth
- env:production UI admin auth
- env:production DB restore context
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:liveImportReadback:missing
- evidence:prodUiClickthrough:failed
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| env:liveimport auth | protected_prerequisite | blocking | yes | no | yes |
| env:rollback guard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI dashboard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI admin auth | protected_prerequisite | blocking | yes | no | yes |
| env:production DB restore context | protected_prerequisite | blocking | yes | no | yes |
| evidence:rcExternalGateStatus:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcSignoffRecord:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcChecklist:stale | release_evidence | blocking | yes | yes | no |
| evidence:liveImportReadback:missing | release_evidence | blocking | yes | yes | yes |
| evidence:prodUiClickthrough:failed | release_evidence | blocking | yes | yes | yes |
| evidence:backupRestoreDrill:stale | release_evidence | blocking | yes | yes | no |
| evidence:rollbackProof:stale | release_evidence | blocking | yes | yes | no |

## Next Actions
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- env:production UI dashboard auth: Provide approved production app auth for non-destructive dashboard module clickthrough. Required inputs: PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD.
- env:production UI admin auth: Provide approved production admin app auth for non-destructive admin module clickthrough. Required inputs: PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD.
- env:production DB restore context: Provide production DB/Coolify context before running the restore drill. Required inputs: PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME.
- evidence:liveImportReadback:missing: Run the read-only collector after build-info confirms current HEAD and read-only auth is available.
- evidence:prodUiClickthrough:failed: Inspect the UI clickthrough artifact, fix the listed auth/build/route blocker, then rerun the audit to PASS.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
