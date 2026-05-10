# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-10T00:45:55.720Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 04a4204ca9090586d49ae77b0dd8c1be048d7bdf
- Evidence date: 2026-05-10
- Build-info: pass
- Public smoke: pass
- Raw JSON: docs\operations\_artifacts-v1-final-preflight-04a4204c-2026-05-10.json

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
| liveimport auth | missing | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | missing | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production DB restore context | missing | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-09 | expected 2026-05-10, found 2026-05-09 |
| activation execution plan | stale | yes | 2026-05-09 | expected 2026-05-10, found 2026-05-09 |
| RC external gates status | stale | yes | 2026-05-09 | expected 2026-05-10, found 2026-05-09 |
| RC sign-off record | stale | yes | 2026-05-09 | expected 2026-05-10, found 2026-05-09 |
| RC checklist verification block | stale | yes | 2026-05-09 | expected 2026-05-10, found 2026-05-09 |
| LIVEIMPORT-03 runtime readback | missing | yes | - | no matching artifact found |
| backup/restore drill evidence | stale | yes | 2026-05-08 | expected 2026-05-10, found 2026-05-08 |
| rollback proof pack | stale | yes | 2026-05-08 | expected 2026-05-10, found 2026-05-08 |

## Blockers
- env:liveimport auth
- env:rollback guard auth
- env:production DB restore context
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:liveImportReadback:missing
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| env:liveimport auth | protected_prerequisite | blocking | yes | no | yes |
| env:rollback guard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production DB restore context | protected_prerequisite | blocking | yes | no | yes |
| evidence:activationAudit:stale | release_evidence | blocking | yes | yes | no |
| evidence:activationPlan:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcExternalGateStatus:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcSignoffRecord:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcChecklist:stale | release_evidence | blocking | yes | yes | no |
| evidence:liveImportReadback:missing | release_evidence | blocking | yes | yes | yes |
| evidence:backupRestoreDrill:stale | release_evidence | blocking | yes | yes | no |
| evidence:rollbackProof:stale | release_evidence | blocking | yes | yes | no |

## Next Actions
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- env:production DB restore context: Provide production DB/Coolify context before running the restore drill. Required inputs: PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME.
- evidence:liveImportReadback:missing: Run the read-only collector after build-info confirms current HEAD and read-only auth is available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
