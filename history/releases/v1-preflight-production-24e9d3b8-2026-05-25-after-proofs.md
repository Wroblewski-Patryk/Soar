# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-25T01:24:57.774Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec
- Evidence date: 2026-05-25
- Build-info: pass
- Public smoke: pass
- Raw JSON: history\artifacts\v1-preflight-production-24e9d3b8-2026-05-25-after-proofs.json

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
| liveimport auth | pass | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | pass | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production UI dashboard auth | pass | PROD_UI_AUDIT_AUTH_TOKEN; or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD |
| production UI admin auth | pass | PROD_UI_AUDIT_ADMIN_TOKEN; or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD |
| production DB restore context | pass | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-24 | expected 2026-05-25, found 2026-05-24 |
| activation execution plan | stale | yes | 2026-05-24 | expected 2026-05-25, found 2026-05-24 |
| RC external gates status | missing | yes | - | no matching artifact found |
| RC sign-off record | missing | yes | - | no matching artifact found |
| RC checklist verification block | missing | yes | - | no matching artifact found |
| LIVEIMPORT-03 runtime readback | stale | yes | 2026-05-24 | expected 2026-05-25, found 2026-05-24 |
| production UI clickthrough | fresh | yes | 2026-05-25 | fresh for 2026-05-25 |
| backup/restore drill evidence | fresh | yes | 2026-05-25 | fresh for 2026-05-25 |
| rollback proof pack | fresh | yes | 2026-05-25 | fresh for 2026-05-25 |

## Blockers
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcExternalGateStatus:missing
- evidence:rcSignoffRecord:missing
- evidence:rcChecklist:missing
- evidence:liveImportReadback:stale

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| evidence:activationAudit:stale | release_evidence | blocking | yes | yes | no |
| evidence:activationPlan:stale | release_evidence | blocking | yes | yes | no |
| evidence:rcExternalGateStatus:missing | release_evidence | blocking | yes | yes | no |
| evidence:rcSignoffRecord:missing | release_evidence | blocking | yes | yes | no |
| evidence:rcChecklist:missing | release_evidence | blocking | yes | yes | no |
| evidence:liveImportReadback:stale | release_evidence | blocking | yes | yes | yes |

## Next Actions
- evidence:liveImportReadback:stale: Rerun the read-only collector for the current candidate and evidence date after read-only auth is available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
