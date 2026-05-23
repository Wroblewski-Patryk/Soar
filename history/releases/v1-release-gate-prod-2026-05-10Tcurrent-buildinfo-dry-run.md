# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-10T05:33:38.005Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 8f8630b0ad5abd690409d6173c9b247b95948138
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-10 | history\audits\v1-production-activation-evidence-audit-2026-05-10.md | fresh for 2026-05-10 |
| activation execution plan | fresh | yes | 2026-05-10 | history\plans\v1-production-activation-and-evidence-plan-2026-05-10.md | fresh for 2026-05-10 |
| RC external gates status | failed | yes | 2026-05-10 | docs\operations\v1-rc-external-gates-status.md | artifact is fresh but does not show all RC gates PASS |
| RC sign-off record | failed | yes | 2026-05-10 | docs\operations\v1-rc-signoff-record.md | artifact is fresh but does not report RC status APPROVED |
| RC checklist verification block | failed | yes | 2026-05-10 | docs\operations\v1-release-candidate-checklist.md | artifact is fresh but does not show all RC gates PASS |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| backup/restore drill evidence | fresh | yes | 2026-05-10 | history\evidence\v1-restore-drill-prod-2026-05-10T03-39-56Z.md | fresh for 2026-05-10 |
| rollback proof pack | failed | yes | 2026-05-10 | history\evidence\v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md | artifact is fresh but does not report PASS |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 8f8630b0ad5abd690409d6173c9b247b95948138 --timeout-seconds 900 --interval-seconds 30` | skipped | 0 | 0 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | skipped | 0 | 0 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |

## Blockers
- evidence:rcExternalGateStatus:failed
- evidence:rcSignoffRecord:failed
- evidence:rcChecklist:failed
- evidence:liveImportReadback:missing
- evidence:rollbackProof:failed
- mode:prod_dry_run_requires_remote_execution
