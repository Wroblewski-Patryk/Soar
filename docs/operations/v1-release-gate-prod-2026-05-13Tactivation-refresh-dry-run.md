# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-13T17:15:53.971Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 00169d7fdc3aff8317759137b05594b20e773c8e
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-2026-05-13Tactivation-refresh-dry-run.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-13 | docs\operations\v1-production-activation-evidence-audit-2026-05-13.md | fresh for 2026-05-13 |
| activation execution plan | fresh | yes | 2026-05-13 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-13.md | fresh for 2026-05-13 |
| RC external gates status | stale | yes | 2026-05-12 | docs\operations\v1-rc-external-gates-status.md | expected 2026-05-13, found 2026-05-12 |
| RC sign-off record | stale | yes | 2026-05-12 | docs\operations\v1-rc-signoff-record.md | expected 2026-05-13, found 2026-05-12 |
| RC checklist verification block | stale | yes | 2026-05-12 | docs\operations\v1-release-candidate-checklist.md | expected 2026-05-13, found 2026-05-12 |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| production UI clickthrough | failed | yes | 2026-05-13 | docs\operations\prod-ui-module-clickthrough-00169d7f-2026-05-13.md | artifact is fresh but does not satisfy authenticated production UI clickthrough checks |
| backup/restore drill evidence | stale | yes | 2026-05-12 | docs\operations\v1-restore-drill-prod-2026-05-12T15-21-38Z.md | expected 2026-05-13, found 2026-05-12 |
| rollback proof pack | stale | yes | 2026-05-12 | docs\operations\v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.md | expected 2026-05-13, found 2026-05-12 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e --timeout-seconds 900 --interval-seconds 30` | skipped | 0 | 0 |

## Blockers
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:liveImportReadback:missing
- evidence:prodUiClickthrough:failed
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale
- mode:prod_dry_run_requires_remote_execution
