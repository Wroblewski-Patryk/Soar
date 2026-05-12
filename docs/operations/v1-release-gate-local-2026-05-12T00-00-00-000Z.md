# V1 Release Gate Report (local)

## Context
- Generated (UTC): 2026-05-12T06:56:29.207Z
- Scope: local
- Dry run: no
- Readiness: ready
- Base API URL: http://localhost:3001
- Base Web URL: http://localhost:3002
- Expected SHA: -
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-local-2026-05-12T00-00-00-000Z.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | skipped | no | - | - | not required for local |
| activation execution plan | skipped | no | - | - | not required for local |
| RC external gates status | skipped | no | - | - | not required for local |
| RC sign-off record | skipped | no | - | - | not required for local |
| RC checklist verification block | skipped | no | - | - | not required for local |
| LIVEIMPORT-03 runtime readback | skipped | no | - | - | not required for local |
| backup/restore drill evidence | skipped | no | - | - | not required for local |
| rollback proof pack | skipped | no | - | - | not required for local |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url http://localhost:3001 --web-base-url http://localhost:3002` | passed | 0 | 774 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url http://localhost:3001` | passed | 0 | 683 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url http://localhost:3001` | passed | 0 | 629 |

## Blockers
- none
