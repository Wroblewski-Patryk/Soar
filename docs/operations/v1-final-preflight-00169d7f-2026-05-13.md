# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-13T17:31:57.056Z
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
| liveimport auth | pass | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | pass | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production UI dashboard auth | pass | PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD |
| production UI admin auth | pass | PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD |
| production DB restore context | missing | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| activation execution plan | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| RC external gates status | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| RC sign-off record | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| RC checklist verification block | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| LIVEIMPORT-03 runtime readback | missing | yes | - | no matching artifact found |
| production UI clickthrough | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |
| backup/restore drill evidence | stale | yes | 2026-05-12 | expected 2026-05-13, found 2026-05-12 |
| rollback proof pack | fresh | yes | 2026-05-13 | fresh for 2026-05-13 |

## Blockers
- env:production DB restore context
- evidence:liveImportReadback:missing
- evidence:backupRestoreDrill:stale

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| env:production DB restore context | protected_prerequisite | blocking | yes | no | yes |
| evidence:liveImportReadback:missing | release_evidence | blocking | yes | yes | yes |
| evidence:backupRestoreDrill:stale | release_evidence | blocking | yes | yes | no |

## Next Actions
- env:production DB restore context: Provide production DB/Coolify context before running the restore drill. Required inputs: PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME.
- evidence:liveImportReadback:missing: Run the read-only collector after build-info confirms current HEAD and read-only auth is available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
