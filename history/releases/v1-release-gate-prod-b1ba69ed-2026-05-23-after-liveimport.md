# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-23T05:25:05.212Z
- Scope: prod
- Dry run: no
- Readiness: ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: b1ba69edccc639e97943f37fb2b1e6249a62e87c
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-b1ba69ed-2026-05-23-after-liveimport.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-23 | history\audits\v1-production-activation-evidence-audit-2026-05-23.md | fresh for 2026-05-23 |
| activation execution plan | fresh | yes | 2026-05-23 | history\plans\v1-production-activation-and-evidence-plan-2026-05-23.md | fresh for 2026-05-23 |
| RC external gates status | fresh | yes | 2026-05-23 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-23 |
| RC sign-off record | fresh | yes | 2026-05-23 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-23 |
| RC checklist verification block | fresh | yes | 2026-05-23 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-23 |
| LIVEIMPORT-03 runtime readback | fresh | yes | 2026-05-23 | history\artifacts\liveimport-03-prod-readback-2026-05-23.json | fresh for 2026-05-23 |
| production UI clickthrough | fresh | yes | 2026-05-23 | history\plans\prod-ui-module-clickthrough-2026-05-23.md | fresh for 2026-05-23 |
| backup/restore drill evidence | fresh | yes | 2026-05-23 | history\evidence\v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |
| rollback proof pack | fresh | yes | 2026-05-23 | history\evidence\v1-rollback-proof-prod-2026-05-23T00-00-00-000Z.md | fresh for 2026-05-23 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| repository guardrails | `pnpm run quality:guardrails` | passed | 0 | 855 |
| repository typecheck | `pnpm run typecheck` | passed | 0 | 17129 |
| repository build | `pnpm run build` | passed | 0 | 26617 |
| go-live smoke pack | `pnpm run test:go-live:smoke` | passed | 0 | 46846 |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha b1ba69edccc639e97943f37fb2b1e6249a62e87c --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 595 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | passed | 0 | 843 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 809 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | passed | 0 | 901 |

## Blockers
- none
