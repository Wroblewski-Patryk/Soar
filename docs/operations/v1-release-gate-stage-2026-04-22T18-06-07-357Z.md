# V1 Release Gate Report (stage)

## Context
- Generated (UTC): 2026-04-22T18:06:09.088Z
- Scope: stage
- Dry run: no
- Readiness: not_ready
- Base API URL: https://stage-api.soar.luckysparrow.ch
- Base Web URL: https://stage.soar.luckysparrow.ch
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-stage-2026-04-22T18-06-07-357Z.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-04-22 | docs\operations\v1-production-activation-evidence-audit-2026-04-22.md | fresh for 2026-04-22 |
| activation execution plan | fresh | yes | 2026-04-22 | docs\planning\v1-production-activation-and-evidence-plan-2026-04-22.md | fresh for 2026-04-22 |
| RC external gates status | skipped | no | - | - | not required for stage |
| RC sign-off record | skipped | no | - | - | not required for stage |
| RC checklist verification block | skipped | no | - | - | not required for stage |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch` | failed | 1 | 1640 |

## Blockers
- step:post-deploy smoke gate
