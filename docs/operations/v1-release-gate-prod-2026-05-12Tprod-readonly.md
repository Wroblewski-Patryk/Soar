# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-12T15:00:46.320Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: -
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-2026-05-12Tprod-readonly.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-10 | docs\operations\v1-production-activation-evidence-audit-2026-05-10.md | expected 2026-05-12, found 2026-05-10 |
| activation execution plan | stale | yes | 2026-05-10 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-10.md | expected 2026-05-12, found 2026-05-10 |
| RC external gates status | failed | yes | 2026-05-12 | docs\operations\v1-rc-external-gates-status.md | artifact is fresh but does not show all RC gates PASS |
| RC sign-off record | stale | yes | 2026-05-10 | docs\operations\v1-rc-signoff-record.md | expected 2026-05-12, found 2026-05-10 |
| RC checklist verification block | failed | yes | 2026-05-12 | docs\operations\v1-release-candidate-checklist.md | artifact is fresh but does not show all RC gates PASS |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| backup/restore drill evidence | stale | yes | 2026-05-10 | docs\operations\v1-restore-drill-prod-2026-05-10T03-39-56Z.md | expected 2026-05-12, found 2026-05-10 |
| rollback proof pack | stale | yes | 2026-05-10 | docs\operations\v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md | expected 2026-05-12, found 2026-05-10 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | failed | 1 | 1378 |

## Blockers
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcExternalGateStatus:failed
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:failed
- evidence:liveImportReadback:missing
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale
- step:post-deploy smoke gate
