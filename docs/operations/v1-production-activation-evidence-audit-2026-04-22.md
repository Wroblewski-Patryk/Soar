# V1 Production Activation Evidence Audit (2026-04-22)

Status: Active follow-up audit  
Wave: `V1FACT-A`

## Purpose

Provide one canonical freshness map for the current V1 release/activation
inputs so future execution can move directly into stage rehearsal and
production-proof closure instead of re-reading many historical artifacts.

## Freshness Policy Used In This Audit

- `fresh`: produced on `2026-04-22` and aligned to current post-`REVIEW-D`
  runtime/readiness truth,
- `stale`: older than the current hardening baseline or created before the
  latest runtime/readiness closure,
- `missing`: evidence family required by the activation contract does not yet
  exist in current form,
- `environment-specific`: evidence exists, but only for one environment or one
  narrow rehearsal mode and cannot be generalized.

## Current Evidence Map

| Evidence family | Current source | State | Notes |
| --- | --- | --- | --- |
| Activation contract | `docs/architecture/reference/v1-production-activation-contract.md` | fresh | Created in `V1FACT-A`. |
| Activation execution plan | `docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md` | fresh | Canonical grouped queue exists. |
| Canonical release gate runbook | `docs/operations/v1-release-gate-runbook.md` | fresh | Current command entrypoint is clear. |
| Post-deploy smoke checklist | `docs/operations/post-deploy-smoke-checklist.md` | fresh | Current operator checklist exists, but not yet paired with fresh stage/prod evidence. |
| Rollback playbook | `docs/operations/deployment-rollback-playbook.md` | fresh | Current rollback path exists, but proof freshness is still open. |
| Coolify VPS topology guide | `docs/operations/coolify-linux-vps-setup-guide.md` | fresh-enough | Topology is current, but not itself activation evidence. |
| RC checklist | `docs/operations/v1-release-candidate-checklist.md` | stale | Latest verification block is still anchored to `2026-03-21` / mixed historical references. Needs current activation refresh. |
| RC external gates status | `docs/operations/v1-rc-external-gates-status.md` | stale | Last generated `2026-04-19T15:13:58.943Z`, before `REVIEW-D` and before current activation contract. |
| RC sign-off record | `docs/operations/v1-rc-signoff-record.md` | stale | Approved on `2026-04-19`; must not be treated as current post-hardening sign-off. |
| Stage rehearsal evidence | `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` | stale, environment-specific | Useful baseline, but older than current runtime/readiness hardening. Needs fresh stage rehearsal. |
| Production gate/evidence refresh | `docs/operations/opv-03-rc-gates-refresh-2026-04-19.md` | stale | Historical closure snapshot only. |
| Production closure sync | `docs/operations/opv-04-closure-sync-2026-04-19.md` | stale | Historical closure sync only. |
| Release gate execution artifact | none current | missing | No fresh `2026-04-22` activation artifact from `ops:release:v1:gate`. |
| Fresh stage smoke artifact | none current | missing | Current checklist exists, but no fresh `2026-04-22` stage smoke evidence pack. |
| Fresh production smoke artifact | none current | missing | No fresh post-hardening prod smoke pack. |
| Backup/restore proof | `docs/operations/v1-db-restore-check-2026-04-09T19-32-32-768Z.md`, `docs/operations/v1-restore-drill-local-2026-04-09T19-32-34-979Z.md` | stale, environment-specific | Exists, but old and primarily local/profile-based. Needs current activation-quality proof. |
| SLO / queue-lag evidence | `docs/operations/v1-slo-window-report-7d-2026-04-19T01-36-24-775Z.md`, `docs/operations/v1-slo-window-report-30d-2026-04-19T01-36-25-355Z.md` | stale | Pre-`REVIEW-D` and not yet refreshed under current activation wave. |
| Worker/runtime freshness evidence | indirect via historical gate packs | stale | No fresh explicit activation artifact after latest runtime closures. |

## What Is Fresh Enough To Reuse

- the operator contracts and runbooks,
- the canonical release-gate command shape,
- the environment topology docs,
- the rollback procedure itself.

These can be reused as instructions, but not as final activation proof.

## What Cannot Be Reused As Final V1 Proof

- `v1-rc-external-gates-status.md`,
- `v1-rc-signoff-record.md`,
- `opv-*` rehearsal/closure artifacts from `2026-04-19`,
- restore drill evidence from `2026-04-09`,
- mixed historical verification block in `v1-release-candidate-checklist.md`.

These are useful baselines only.

## Immediate Follow-Up Commands Required

### For `V1FACT-A2`

1. Build release-gate freshness semantics in code/tests.
2. Normalize one stage rehearsal entrypoint over:
   - release gate,
   - smoke,
   - worker/runtime checks.
3. Execute a fresh stage evidence pass and publish artifacts.

Recommended command family:

```bash
pnpm run ops:release:v1:gate -- --dry-run --base-url http://localhost:3001
```

Target stage command shape:

```bash
pnpm run ops:release:v1:gate -- --base-url https://stage-api.soar.luckysparrow.ch --auth-token <ADMIN_JWT> --skip-local-quality
```

### For `V1FACT-A3`

1. Refresh backup/restore proof.
2. Make rollback and backup evidence first-class gate inputs.

Likely command family:

```bash
pnpm run ops:db:backup-verify:stage
pnpm run ops:db:restore-drill:stage
```

### For `V1FACT-A4`

1. Rebuild external-gates status from fresh evidence.
2. Rebuild sign-off only after current evidence is fresh.
3. Publish one final V1 activation packet.

## Conclusion

V1 is no longer blocked mainly by product/runtime code debt.

The current gap is operational freshness:
- current contracts are in place,
- historical evidence exists,
- but the final activation packet is not yet fresh enough to claim current V1
  release readiness after the latest hardening waves.
