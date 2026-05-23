# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-12T15:50:03.778Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: -
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-2026-05-12Trollback-refresh-dry-run.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-12 | history\audits\v1-production-activation-evidence-audit-2026-05-12.md | fresh for 2026-05-12 |
| activation execution plan | fresh | yes | 2026-05-12 | history\plans\v1-production-activation-and-evidence-plan-2026-05-12.md | fresh for 2026-05-12 |
| RC external gates status | failed | yes | 2026-05-12 | docs\operations\v1-rc-external-gates-status.md | artifact is fresh but does not show all RC gates PASS |
| RC sign-off record | failed | yes | 2026-05-12 | docs\operations\v1-rc-signoff-record.md | artifact is fresh but does not report RC status APPROVED |
| RC checklist verification block | failed | yes | 2026-05-12 | docs\operations\v1-release-candidate-checklist.md | artifact is fresh but does not show all RC gates PASS |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| backup/restore drill evidence | fresh | yes | 2026-05-12 | history\evidence\v1-restore-drill-prod-2026-05-12T15-21-38Z.md | fresh for 2026-05-12 |
| rollback proof pack | failed | yes | 2026-05-12 | history\evidence\v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.md | artifact is fresh but does not report PASS |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |


## Blockers
- evidence:rcExternalGateStatus:failed
- evidence:rcSignoffRecord:failed
- evidence:rcChecklist:failed
- evidence:liveImportReadback:missing
- evidence:rollbackProof:failed
- mode:prod_dry_run_requires_remote_execution
