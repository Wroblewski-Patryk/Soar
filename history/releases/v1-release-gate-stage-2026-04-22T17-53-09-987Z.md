# V1 Release Gate Report (stage)

## Context
- Generated (UTC): 2026-04-22T17:53:10.058Z
- Scope: stage
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://stage-api.soar.luckysparrow.ch
- Base Web URL: https://stage-soar.luckysparrow.ch
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-stage-2026-04-22T17-53-09-987Z.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-04-22 | history\audits\v1-production-activation-evidence-audit-2026-04-22.md | fresh for 2026-04-22 |
| activation execution plan | fresh | yes | 2026-04-22 | history\plans\v1-production-activation-and-evidence-plan-2026-04-22.md | fresh for 2026-04-22 |
| RC external gates status | skipped | no | - | - | not required for stage |
| RC sign-off record | skipped | no | - | - | not required for stage |
| RC checklist verification block | skipped | no | - | - | not required for stage |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage-soar.luckysparrow.ch` | skipped | 0 | 0 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://stage-api.soar.luckysparrow.ch` | skipped | 0 | 0 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://stage-api.soar.luckysparrow.ch` | skipped | 0 | 0 |

## Blockers
- mode:stage_dry_run_requires_remote_execution
