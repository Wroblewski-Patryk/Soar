# V1 Final Preflight Report

## Context
- Generated (UTC): 2026-05-08T15:58:14.314Z
- Status: blocked
- API base URL: https://api.soar.luckysparrow.ch
- Web base URL: https://soar.luckysparrow.ch
- Expected SHA: 052df82244ea0f81e8611ff8bb2b677db115bd19
- Evidence date: 2026-05-08
- Build-info: pass
- Public smoke: pass
- Raw JSON: docs\operations\_artifacts-v1-final-preflight-current.json

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
| liveimport auth | missing | LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD |
| rollback guard auth | missing | ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD |
| production DB restore context | satisfied_by_evidence | PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME; or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME |
| liveimport private OPS layer | missing | LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD; or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE |
| rollback private OPS layer | missing | ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD; or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE |

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-08 | fresh for 2026-05-08 |
| activation execution plan | fresh | yes | 2026-05-08 | fresh for 2026-05-08 |
| RC external gates status | failed | yes | 2026-05-08 | artifact is fresh but does not show all RC gates PASS |
| RC sign-off record | failed | yes | 2026-05-08 | artifact is fresh but does not report RC status APPROVED |
| RC checklist verification block | failed | yes | 2026-05-08 | artifact is fresh but does not show all RC gates PASS |
| LIVEIMPORT-03 runtime readback | missing | yes | - | no matching artifact found |
| backup/restore drill evidence | fresh | yes | 2026-05-08 | fresh for 2026-05-08 |
| rollback proof pack | failed | yes | 2026-05-08 | artifact is fresh but does not report PASS |

## Blockers
- env:liveimport auth
- env:rollback guard auth
- evidence:rcExternalGateStatus:failed
- evidence:rcSignoffRecord:failed
- evidence:rcChecklist:failed
- evidence:liveImportReadback:missing
- evidence:rollbackProof:failed

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| env:liveimport auth | protected_prerequisite | blocking | yes | no | yes |
| env:rollback guard auth | protected_prerequisite | blocking | yes | no | yes |
| evidence:rcExternalGateStatus:failed | release_evidence | blocking | yes | yes | yes |
| evidence:rcSignoffRecord:failed | release_evidence | blocking | no | yes | yes |
| evidence:rcChecklist:failed | release_evidence | blocking | no | yes | yes |
| evidence:liveImportReadback:missing | release_evidence | blocking | yes | yes | yes |
| evidence:rollbackProof:failed | release_evidence | blocking | yes | yes | yes |

## Next Actions
- env:liveimport auth: Provide read-only production application auth for protected runtime readback. Required inputs: LIVEIMPORT_READBACK_AUTH_TOKEN; or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD.
- env:rollback guard auth: Provide production auth for protected runtime freshness and alerts checks. Required inputs: ROLLBACK_GUARD_AUTH_TOKEN; or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD.
- evidence:rcExternalGateStatus:failed: Run the RC gate refresh/status commands after required protected evidence and sign-off are complete.
- evidence:rcSignoffRecord:failed: Provide real Engineering, Product, Operations, and RC owner names. Owner contact is recommended for rollback authority handoff. Required inputs: --engineering-name "<name>"; --product-name "<name>"; --operations-name "<name>"; --owner-name "<name>"; --owner-contact "<email-or-contact>".
- evidence:rcChecklist:failed: After the sign-off record is APPROVED and external gates are refreshed, sync the RC checklist.
- evidence:liveImportReadback:missing: Run the read-only collector after build-info confirms current HEAD and read-only auth is available.
- evidence:rollbackProof:failed: Run rollback proof after protected rollback guard auth is available.

## Note
Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.
