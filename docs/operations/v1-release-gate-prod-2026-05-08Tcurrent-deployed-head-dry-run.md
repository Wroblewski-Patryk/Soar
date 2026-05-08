# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-08T07:21:06.483Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-2026-05-08Tcurrent-deployed-head-dry-run.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-08 | docs\operations\v1-production-activation-evidence-audit-2026-05-08.md | fresh for 2026-05-08 |
| activation execution plan | fresh | yes | 2026-05-08 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-08.md | fresh for 2026-05-08 |
| RC external gates status | fresh | yes | 2026-05-08 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-08 |
| RC sign-off record | fresh | yes | 2026-05-08 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-08 |
| RC checklist verification block | fresh | yes | 2026-05-08 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-08 |
| backup/restore drill evidence | failed | yes | 2026-05-08 | docs\operations\v1-restore-drill-prod-2026-05-08T05-36-30-577Z.md | artifact is fresh but does not report PASS |
| rollback proof pack | failed | yes | 2026-05-08 | docs\operations\v1-rollback-proof-prod-2026-05-08T05-36-37-368Z.md | artifact is fresh but does not report PASS |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | skipped | 0 | 0 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |

## Blockers
- evidence:backupRestoreDrill:failed
- evidence:rollbackProof:failed
- mode:prod_dry_run_requires_remote_execution
