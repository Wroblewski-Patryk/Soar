# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-23T04:38:46.983Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 72b547e12351e078c49807fb25d56c27f64c6567
- Evidence date: 2026-05-23
- Build-info: pass
- Public smoke: pass
- Raw JSON: history\artifacts\_artifacts-v1-final-preflight-72b547e1-2026-05-23.json

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
| liveimport auth | missing | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | missing | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production UI dashboard auth | missing | PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD |
| production UI admin auth | missing | PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD |
| production DB restore context | satisfied_by_evidence | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-14 | expected 2026-05-23, found 2026-05-14 |
| activation execution plan | stale | yes | 2026-05-14 | expected 2026-05-23, found 2026-05-14 |
| RC external gates status | fresh | yes | 2026-05-23 | fresh for 2026-05-23 |
| RC sign-off record | stale | yes | 2026-05-21 | expected 2026-05-23, found 2026-05-21 |
| RC checklist verification block | fresh | yes | 2026-05-23 | fresh for 2026-05-23 |
| LIVEIMPORT-03 runtime readback | failed | yes | 2026-05-23 | artifact is fresh but does not satisfy required runtime readback checks |
| production UI clickthrough | fresh | yes | 2026-05-23 | fresh for 2026-05-23 |
| backup/restore drill evidence | fresh | yes | 2026-05-23 | fresh for 2026-05-23 |
| rollback proof pack | fresh | yes | 2026-05-23 | fresh for 2026-05-23 |

## Blockers
- env:liveimport auth
- env:rollback guard auth
- env:production UI dashboard auth
- env:production UI admin auth
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcSignoffRecord:stale
- evidence:liveImportReadback:failed

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| env:liveimport auth | protected_prerequisite | blocking | yes | no | yes |
| env:rollback guard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI dashboard auth | protected_prerequisite | blocking | yes | no | yes |
| env:production UI admin auth | protected_prerequisite | blocking | yes | no | yes |
| evidence:activationAudit:stale | release_evidence | blocking | yes | yes | no |
| evidence:activationPlan:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcSignoffRecord:stale | release_evidence | blocking | yes | yes | no |
| evidence:liveImportReadback:failed | release_evidence | blocking | yes | yes | no |

## Next Actions
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- env:production UI dashboard auth: Provide approved production app auth for non-destructive dashboard module clickthrough. Required inputs: PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD.
- env:production UI admin auth: Provide approved production admin app auth for non-destructive admin module clickthrough. Required inputs: PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
