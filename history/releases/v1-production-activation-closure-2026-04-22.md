# V1 Production Activation Closure (2026-04-22)

Status: `CLOSED_HISTORICAL`

> 2026-05-02 update: this closure remains a historical record for `V1FACT-A`,
> but it is not current V1 release approval. Current closeout truth lives in
> `history/evidence/v1-closeout-evidence-refresh-2026-05-02.md` and is `NO-GO`
> until fresh stage/prod evidence and named RC sign-offs are available.

## Scope Closed

This closes the planned `V1FACT-A` execution wave:

- `V1FACT-01..V1FACT-03` contract + audit + queue truth
- `V1FACT-04..V1FACT-07` release-gate freshness + canonical stage rehearsal
- `V1FACT-07B` inline runtime-freshness truth after authenticated stage rehearsal
- `V1FACT-08..V1FACT-09` rollback/backup proof as first-class gate inputs
- `V1FACT-10` final activation packet
- `V1FACT-11` closure sync + future-agent activation rules

## What Is Now Frozen

### Canonical Activation Sources

- activation contract:
  - [docs/architecture/reference/v1-production-activation-contract.md](../../docs/architecture/reference/v1-production-activation-contract.md)
- activation plan:
  - [history/plans/v1-production-activation-and-evidence-plan-2026-04-22.md](../plans/v1-production-activation-and-evidence-plan-2026-04-22.md)
- activation packet:
  - [history/releases/v1-production-activation-pack-2026-04-22.md](./v1-production-activation-pack-2026-04-22.md)
- canonical release-gate runbook:
  - [docs/operations/v1-release-gate-runbook.md](../../docs/operations/v1-release-gate-runbook.md)

### Canonical Commands

- stage rehearsal:
  - `pnpm run ops:release:v1:stage-rehearsal -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --auth-token <ADMIN_JWT>`
- prod gate snapshot:
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --auth-token <ADMIN_JWT>`
- prod restore-drill proof:
  - `pnpm run ops:db:restore-drill:prod`
- prod rollback proof:
  - `pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>`

## Fresh Evidence Produced In This Wave

- evidence audit:
  - [history/audits/v1-production-activation-evidence-audit-2026-04-22.md](../audits/v1-production-activation-evidence-audit-2026-04-22.md)
- passing authenticated stage release gate:
  - [history/releases/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md](./v1-release-gate-stage-2026-04-22T19-15-59-493Z.md)
- passing authenticated stage rehearsal:
  - [history/releases/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md](./v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md)
- passing stage rollback proof:
  - [history/evidence/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md](../evidence/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md)
- passing final prod release gate:
  - [history/releases/v1-release-gate-prod-2026-04-22T22-34-05-835Z.md](./v1-release-gate-prod-2026-04-22T22-34-05-835Z.md)
- passing prod rollback proof:
  - [history/evidence/v1-rollback-proof-prod-2026-04-22T21-06-24-347Z.md](../evidence/v1-rollback-proof-prod-2026-04-22T21-06-24-347Z.md)
- passing prod restore-drill proof:
  - [history/evidence/v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md](../evidence/v1-restore-drill-prod-2026-04-22T22-31-28-000Z.md)
- refreshed RC status:
  - [docs/operations/v1-rc-external-gates-status.md](../../docs/operations/v1-rc-external-gates-status.md)
- refreshed RC sign-off record:
  - [docs/operations/v1-rc-signoff-record.md](../../docs/operations/v1-rc-signoff-record.md)
- refreshed RC checklist:
  - [docs/operations/v1-release-candidate-checklist.md](../../docs/operations/v1-release-candidate-checklist.md)

## Final Truth

`V1FACT-A` is closed as an implementation and documentation wave.

`V1` was approved for final production activation sign-off from the historical
repository evidence set captured by this closure. The current `2026-05-02`
candidate must use the newer closeout evidence refresh before any approval
claim.

The final `2026-04-25` sign-off refresh resolved the only remaining drift in
the canonical activation artifacts. There is no open engineering blocker and no
remaining operator-only blocker recorded in the repository state.

## Remaining Operator-Only Blockers

- none

## Future-Agent Rules

1. Do not reopen `V1FACT-A` for more refactors unless a new code-level defect is
   discovered in the activation path itself.
2. Do not claim `READY` from stage success, fresh docs, or public prod smoke
   alone.
3. Do not bypass prod proof families:
   - `v1-restore-drill-prod-*`
   - `v1-rollback-proof-prod-*`
4. Do not treat a fresh prod proof artifact as valid unless the latest same-day
   artifact is selected and the artifact itself reports `Status: **PASS**`.
5. Do not overwrite RC status, checklist, or sign-off into green unless the
   latest sign-off artifact and gate snapshot agree on the same final truth.
6. If protected prod OPS endpoints stay externally blocked, internal prod
   runtime verification may support diagnostics, but it does not replace the
   required prod proof artifacts or named sign-offs.

## Next Honest Step

The next execution should not be another broad implementation wave.

No further activation-reconciliation slice is required unless a new prod proof,
gate artifact, or sign-off change reopens drift.
