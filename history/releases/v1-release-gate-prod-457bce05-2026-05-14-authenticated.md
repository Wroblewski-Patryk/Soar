# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-13T23:31:50.768Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 457bce05338310c198c03a973395a9176f298dc1
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-457bce05-2026-05-14-authenticated.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-13 | history\audits\v1-production-activation-evidence-audit-2026-05-13.md | expected 2026-05-14, found 2026-05-13 |
| activation execution plan | stale | yes | 2026-05-13 | history\plans\v1-production-activation-and-evidence-plan-2026-05-13.md | expected 2026-05-14, found 2026-05-13 |
| RC external gates status | stale | yes | 2026-05-13 | docs\operations\v1-rc-external-gates-status.md | expected 2026-05-14, found 2026-05-13 |
| RC sign-off record | stale | yes | 2026-05-13 | docs\operations\v1-rc-signoff-record.md | expected 2026-05-14, found 2026-05-13 |
| RC checklist verification block | stale | yes | 2026-05-13 | docs\operations\v1-release-candidate-checklist.md | expected 2026-05-14, found 2026-05-13 |
| LIVEIMPORT-03 runtime readback | stale | yes | 2026-05-13 | history\artifacts\liveimport-03-prod-readback-2026-05-13.json | expected 2026-05-14, found 2026-05-13 |
| production UI clickthrough | stale | yes | 2026-05-13 | history\plans\prod-ui-module-clickthrough-00169d7f-2026-05-13.md | expected 2026-05-14, found 2026-05-13 |
| backup/restore drill evidence | stale | yes | 2026-05-13 | history\evidence\v1-restore-drill-prod-2026-05-13T17-41-29Z.md | expected 2026-05-14, found 2026-05-13 |
| rollback proof pack | stale | yes | 2026-05-13 | history\evidence\v1-rollback-proof-prod-2026-05-14T00-00-00-000Z.md | expected 2026-05-14, found 2026-05-13 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05338310c198c03a973395a9176f298dc1 --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 942 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | passed | 0 | 1360 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 1046 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 1815 |

## Blockers
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcExternalGateStatus:stale
- evidence:rcSignoffRecord:stale
- evidence:rcChecklist:stale
- evidence:liveImportReadback:stale
- evidence:prodUiClickthrough:stale
- evidence:backupRestoreDrill:stale
- evidence:rollbackProof:stale
