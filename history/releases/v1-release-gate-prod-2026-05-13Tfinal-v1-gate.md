# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-13T18:39:03.185Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 00169d7fdc3aff8317759137b05594b20e773c8e
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-2026-05-13Tfinal-v1-gate.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-13 | history\audits\v1-production-activation-evidence-audit-2026-05-13.md | fresh for 2026-05-13 |
| activation execution plan | fresh | yes | 2026-05-13 | history\plans\v1-production-activation-and-evidence-plan-2026-05-13.md | fresh for 2026-05-13 |
| RC external gates status | fresh | yes | 2026-05-13 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-13 |
| RC sign-off record | fresh | yes | 2026-05-13 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-13 |
| RC checklist verification block | fresh | yes | 2026-05-13 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-13 |
| LIVEIMPORT-03 runtime readback | fresh | yes | 2026-05-13 | history\artifacts\liveimport-03-prod-readback-2026-05-13.json | fresh for 2026-05-13 |
| production UI clickthrough | fresh | yes | 2026-05-13 | history\plans\prod-ui-module-clickthrough-00169d7f-2026-05-13.md | fresh for 2026-05-13 |
| backup/restore drill evidence | fresh | yes | 2026-05-13 | history\evidence\v1-restore-drill-prod-2026-05-13T17-41-29Z.md | fresh for 2026-05-13 |
| rollback proof pack | fresh | yes | 2026-05-13 | history\evidence\v1-rollback-proof-prod-2026-05-13T00-00-00-000Z.md | fresh for 2026-05-13 |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| repository guardrails | `pnpm run quality:guardrails` | passed | 0 | 695 |
| repository typecheck | `pnpm run typecheck` | passed | 0 | 18222 |
| repository build | `pnpm run build` | passed | 0 | 36315 |
| go-live smoke pack | `pnpm run test:go-live:smoke` | failed | 1 | 2678 |

## Blockers
- step:go-live smoke pack
