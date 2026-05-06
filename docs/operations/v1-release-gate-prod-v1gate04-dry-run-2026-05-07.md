# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-06T22:44:55.489Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-v1gate04-dry-run-2026-05-07.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-02 | docs\operations\v1-production-activation-evidence-audit-2026-05-02.md | expected 2026-05-06, found 2026-05-02 |
| activation execution plan | stale | yes | 2026-05-02 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-02.md | expected 2026-05-06, found 2026-05-02 |
| RC external gates status | stale | yes | 2026-05-02 | docs\operations\v1-rc-external-gates-status.md | expected 2026-05-06, found 2026-05-02 |
| RC sign-off record | stale | yes | 2026-05-02 | docs\operations\v1-rc-signoff-record.md | expected 2026-05-06, found 2026-05-02 |
| RC checklist verification block | stale | yes | 2026-05-02 | docs\operations\v1-release-candidate-checklist.md | expected 2026-05-06, found 2026-05-02 |
| backup/restore drill evidence | stale | yes | 2026-05-02 | docs\operations\v1-restore-drill-prod-2026-05-02T17-49-41-000Z.md | expected 2026-05-06, found 2026-05-02 |
| rollback proof pack | stale | yes | 2026-05-02 | docs\operations\v1-rollback-proof-prod-2026-05-02T17-54-13-498Z.md | expected 2026-05-06, found 2026-05-02 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |


## Blockers
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale
- mode:prod_dry_run_requires_remote_execution
