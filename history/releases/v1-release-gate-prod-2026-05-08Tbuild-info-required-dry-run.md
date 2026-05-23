# V1 Release Gate Report (prod)

## Context
- Generated (UTC): 2026-05-08T07:47:04.299Z
- Scope: prod
- Dry run: yes
- Readiness: not_ready
- Base API URL: https://api.soar.luckysparrow.ch
- Base Web URL: https://soar.luckysparrow.ch
- Expected SHA: 1baa13da02029d75c77aba7026936c41c1ee9963
- Raw JSON: `history\artifacts\_artifacts-v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.json`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
| activation evidence audit | fresh | yes | 2026-05-08 | history\audits\v1-production-activation-evidence-audit-2026-05-08.md | fresh for 2026-05-08 |
| activation execution plan | fresh | yes | 2026-05-08 | history\plans\v1-production-activation-and-evidence-plan-2026-05-08.md | fresh for 2026-05-08 |
| RC external gates status | fresh | yes | 2026-05-08 | docs\operations\v1-rc-external-gates-status.md | fresh for 2026-05-08 |
| RC sign-off record | fresh | yes | 2026-05-08 | docs\operations\v1-rc-signoff-record.md | fresh for 2026-05-08 |
| RC checklist verification block | fresh | yes | 2026-05-08 | docs\operations\v1-release-candidate-checklist.md | fresh for 2026-05-08 |
| LIVEIMPORT-03 runtime readback | missing | yes | - | - | no matching artifact found |
| backup/restore drill evidence | failed | yes | 2026-05-08 | history\evidence\v1-restore-drill-prod-2026-05-08T05-36-30-577Z.md | artifact is fresh but does not report PASS |
| rollback proof pack | failed | yes | 2026-05-08 | history\evidence\v1-rollback-proof-prod-2026-05-08T05-36-37-368Z.md | artifact is fresh but does not report PASS |

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
| web build-info freshness gate | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 1baa13da02029d75c77aba7026936c41c1ee9963 --timeout-seconds 900 --interval-seconds 30` | skipped | 0 | 0 |
| post-deploy smoke gate | `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` | skipped | 0 | 0 |
| runtime freshness gate | `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |
| rollback guard gate | `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` | skipped | 0 | 0 |

## Blockers
- evidence:liveImportReadback:missing
- evidence:backupRestoreDrill:failed
- evidence:rollbackProof:failed
- mode:prod_dry_run_requires_remote_execution
