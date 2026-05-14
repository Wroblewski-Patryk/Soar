# V1 Release Gate Report (stage)

## Context
- Generated (UTC): 2026-04-22T19:16:02.125Z
- Scope: stage
- Dry run: no
- Readiness: ready
- Base API URL: https://stage-api.soar.luckysparrow.ch
- Base Web URL: https://stage.soar.luckysparrow.ch
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-stage-2026-04-22T19-15-59-493Z.json`

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
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password <redacted> --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162 --web-base-url https://stage.soar.luckysparrow.ch` | passed | 0 | 949 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password <redacted> --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162` | passed | 0 | 706 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password <redacted> --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162` | passed | 0 | 882 |

## Blockers
- none
