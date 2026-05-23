# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-23T04:38:49.818Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 72b547e12351e078c49807fb25d56c27f64c6567
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-72b547e1-2026-05-23-final.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | stale | yes | 2026-05-14 | docs\operations\v1-production-activation-evidence-audit-2026-05-14.md | expected 2026-05-23, found 2026-05-14 |
| activation execution plan | stale | yes | 2026-05-14 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-14.md | expected 2026-05-23, found 2026-05-14 |
| RC external gates status | fresh | yes | 2026-05-23 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-23 |
| RC sign-off record | stale | yes | 2026-05-21 | docs\operations\v1-rc-signoff-record.md | expected 2026-05-23, found 2026-05-21 |
| RC checklist verification block | fresh | yes | 2026-05-23 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-23 |
| LIVEIMPORT-03 runtime readback | failed | yes | 2026-05-23 | docs\operations\liveimport-03-prod-readback-2026-05-23.json | artifact is fresh but does not satisfy required runtime readback checks |
| production UI clickthrough | fresh | yes | 2026-05-23 | docs\operations\prod-ui-module-clickthrough-2026-05-23.md | fresh for 2026-05-23 |
| backup/restore drill evidence | fresh | yes | 2026-05-23 | docs\operations\v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |
| rollback proof pack | fresh | yes | 2026-05-23 | docs\operations\v1-rollback-proof-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 72b547e12351e078c49807fb25d56c27f64c6567 --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 557 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | passed | 0 | 875 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 942 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 972 |

## Blockers
- evidence:activationAudit:stale
- evidence:activationPlan:stale
- evidence:rcSignoffRecord:stale
- evidence:liveImportReadback:failed
