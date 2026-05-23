# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-14T01:08:47.083Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 457bce05338310c198c03a973395a9176f298dc1
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-457bce05-2026-05-14-final-current-blocked.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-14 | history\audits\v1-production-activation-evidence-audit-2026-05-14.md | fresh for 2026-05-14 |
| activation execution plan | fresh | yes | 2026-05-14 | history\plans\v1-production-activation-and-evidence-plan-2026-05-14.md | fresh for 2026-05-14 |
| RC external gates status | fresh | yes | 2026-05-14 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-14 |
| RC sign-off record | fresh | yes | 2026-05-14 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-14 |
| RC checklist verification block | fresh | yes | 2026-05-14 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-14 |
| LIVEIMPORT-03 runtime readback | fresh | yes | 2026-05-14 | history\artifacts\liveimport-03-prod-readback-2026-05-14.json | fresh for 2026-05-14 |
| production UI clickthrough | fresh | yes | 2026-05-14 | history\plans\prod-ui-module-clickthrough-457bce05-2026-05-14.md | fresh for 2026-05-14 |
| backup/restore drill evidence | failed | yes | 2026-05-14 | history\evidence\v1-restore-drill-prod-2026-05-14T00-00-00-000Z.md | artifact is fresh but does not report PASS |
| rollback proof pack | fresh | yes | 2026-05-14 | history\evidence\v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md | fresh for 2026-05-14 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05338310c198c03a973395a9176f298dc1 --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 9086 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | passed | 0 | 1139 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 1006 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 1010 |

## Blockers
- evidence:backupRestoreDrill:failed
