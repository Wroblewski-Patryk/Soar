# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-23T04:42:58.395Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 72b547e12351e078c49807fb25d56c27f64c6567
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-72b547e1-2026-05-23-after-refresh.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-23 | docs\operations\v1-production-activation-evidence-audit-2026-05-23.md | fresh for 2026-05-23 |
| activation execution plan | fresh | yes | 2026-05-23 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-23.md | fresh for 2026-05-23 |
| RC external gates status | fresh | yes | 2026-05-23 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-23 |
| RC sign-off record | fresh | yes | 2026-05-23 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-23 |
| RC checklist verification block | fresh | yes | 2026-05-23 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-23 |
| LIVEIMPORT-03 runtime readback | failed | yes | 2026-05-23 | docs\operations\liveimport-03-prod-readback-2026-05-23.json | artifact is fresh but does not satisfy required runtime readback checks |
| production UI clickthrough | fresh | yes | 2026-05-23 | docs\operations\prod-ui-module-clickthrough-2026-05-23.md | fresh for 2026-05-23 |
| backup/restore drill evidence | fresh | yes | 2026-05-23 | docs\operations\v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |
| rollback proof pack | fresh | yes | 2026-05-23 | docs\operations\v1-rollback-proof-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 72b547e12351e078c49807fb25d56c27f64c6567 --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 710 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | passed | 0 | 959 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 941 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 988 |

## Blockers
- evidence:liveImportReadback:failed
