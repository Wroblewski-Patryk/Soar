# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-12T16:11:20.591Z
- Scope: prod
- Dry run: no
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 00169d7fdc3aff8317759137b05594b20e773c8e
- Raw JSON: `docs\operations\_artifacts-v1-release-gate-prod-2026-05-12Tnon-dry-run-blocked.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-12 | docs\operations\v1-production-activation-evidence-audit-2026-05-12.md | fresh for 2026-05-12 |
| activation execution plan | fresh | yes | 2026-05-12 | docs\planning\v1-production-activation-and-evidence-plan-2026-05-12.md | fresh for 2026-05-12 |
| RC external gates status | failed | yes | 2026-05-12 | docs\operations\v1-rc-external-gates-status.md | artifact is fresh but does not show all RC gates PASS |
| RC sign-off record | failed | yes | 2026-05-12 | docs\operations\v1-rc-signoff-record.md | artifact is fresh but does not report RC status APPROVED |
| RC checklist verification block | failed | yes | 2026-05-12 | docs\operations\v1-release-candidate-checklist.md | artifact is fresh but does not show all RC gates PASS |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| backup/restore drill evidence | fresh | yes | 2026-05-12 | docs\operations\v1-restore-drill-prod-2026-05-12T15-21-38Z.md | fresh for 2026-05-12 |
| rollback proof pack | failed | yes | 2026-05-12 | docs\operations\v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.md | artifact is fresh but does not report PASS |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e --timeout-seconds 900 --interval-seconds 30` | passed | 0 | 717 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | failed | 1 | 1477 |

## Blockers
- evidence:rcExternalGateStatus:failed
- evidence:rcSignoffRecord:failed
- evidence:rcChecklist:failed
- evidence:liveImportReadback:missing
- evidence:rollbackProof:failed
- step:post-deploy smoke gate
