# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-24T16:17:06.600Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1
- Evidence date: 2026-05-24
- Build-info: pass
- Public smoke: pass
- Raw JSON: history\artifacts\v1-preflight-production-rc-sha-binding-2026-05-24.json

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
| activation evidence audit | failed | yes | 2026-05-24 | artifact is fresh but does not report activation status READY or PASS |
| activation execution plan | failed | yes | 2026-05-24 | artifact is fresh but does not report activation status READY or PASS |
| RC external gates status | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| RC sign-off record | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| RC checklist verification block | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| LIVEIMPORT-03 runtime readback | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| production UI clickthrough | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| backup/restore drill evidence | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |
| rollback proof pack | stale | yes | 2026-05-23 | expected 2026-05-24, found 2026-05-23 |

## Blockers
- env:liveimport auth
- env:rollback guard auth
- env:production UI dashboard auth
- env:production UI admin auth
- env:production DB restore context
- evidence:activationAudit:failed
- evidence:activationPlan:failed
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:liveImportReadback:stale
- evidence:prodUiClickthrough:stale
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
| evidence:activationAudit:failed | release_evidence | blocking | yes | yes | yes |
| evidence:activationPlan:failed | release_evidence | blocking | yes | yes | yes |
| evidence:rcExternalGateStatus:stale | release_evidence | blocking | yes | yes | yes |
| evidence:rcSignoffRecord:stale | release_evidence | blocking | yes | yes | yes |
| evidence:rcChecklist:stale | release_evidence | blocking | yes | yes | yes |
| evidence:liveImportReadback:stale | release_evidence | blocking | yes | yes | yes |
| evidence:prodUiClickthrough:stale | release_evidence | blocking | yes | yes | yes |
| evidence:backupRestoreDrill:stale | release_evidence | blocking | yes | yes | yes |
| evidence:rollbackProof:stale | release_evidence | blocking | yes | yes | yes |

## Next Actions
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- env:production UI dashboard auth: Provide approved production app auth for non-destructive dashboard module clickthrough. Required inputs: PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD.
- env:production UI admin auth: Provide approved production admin app auth for non-destructive admin module clickthrough. Required inputs: PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD.
- env:production DB restore context: Provide production DB/Coolify context before running the restore drill. Required inputs: PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME.
- evidence:activationAudit:failed: Refresh protected production evidence first, then update the activation audit to READY only when the release gate is actually ready.
- evidence:activationPlan:failed: Refresh protected production evidence first, then update the activation plan to READY only when the release gate is actually ready.
- evidence:rcExternalGateStatus:stale: Rerun the RC gate refresh/status commands after required protected evidence is current.
- evidence:rcSignoffRecord:stale: Build a current RC sign-off only after the protected evidence packet is current and approved. Required inputs: --engineering-name "<name>"; --product-name "<name>"; --operations-name "<name>"; --owner-name "<name>"; --owner-contact "<email-or-contact>".
- evidence:rcChecklist:stale: After current RC gates and sign-off are approved, sync the RC checklist.
- evidence:liveImportReadback:stale: Rerun the read-only collector for the current candidate and evidence date after read-only auth is available.
- evidence:prodUiClickthrough:stale: Rerun the no-secret production UI audit for the current evidence date after dashboard and admin app auth are available.
- evidence:backupRestoreDrill:stale: Rerun the production restore drill for the current evidence date after production DB/Coolify context is available.
- evidence:rollbackProof:stale: Rerun rollback proof for the current evidence date after protected rollback guard auth is available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
