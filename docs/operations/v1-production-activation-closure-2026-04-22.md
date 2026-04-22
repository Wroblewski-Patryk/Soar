# V1 Production Activation Closure (2026-04-22)

Status: `CLOSED_WITH_OPERATOR_BLOCKERS`

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
  - [docs/architecture/reference/v1-production-activation-contract.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/reference/v1-production-activation-contract.md)
- activation plan:
  - [docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md)
- activation packet:
  - [docs/operations/v1-production-activation-pack-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-production-activation-pack-2026-04-22.md)
- canonical release-gate runbook:
  - [docs/operations/v1-release-gate-runbook.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-runbook.md)

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
  - [docs/operations/v1-production-activation-evidence-audit-2026-04-22.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-production-activation-evidence-audit-2026-04-22.md)
- passing authenticated stage release gate:
  - [docs/operations/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md)
- passing authenticated stage rehearsal:
  - [docs/operations/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md)
- passing stage rollback proof:
  - [docs/operations/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.md)
- fresh prod gate snapshot with explicit blockers:
  - [docs/operations/v1-release-gate-prod-2026-04-22T20-16-25-601Z.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-gate-prod-2026-04-22T20-16-25-601Z.md)
- refreshed RC status:
  - [docs/operations/v1-rc-external-gates-status.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rc-external-gates-status.md)
- refreshed RC sign-off record:
  - [docs/operations/v1-rc-signoff-record.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-rc-signoff-record.md)
- refreshed RC checklist:
  - [docs/operations/v1-release-candidate-checklist.md](/C:/Personal/Projekty/Aplikacje/Soar/docs/operations/v1-release-candidate-checklist.md)

## Final Truth

`V1FACT-A` is closed as an implementation and documentation wave.

`V1` itself is **not ready for final production activation sign-off yet**.

That is no longer because of missing architecture, missing scripts, or queue
drift. It is blocked only by explicit operator inputs that cannot be inferred
honestly from repository state alone.

## Remaining Operator-Only Blockers

1. missing fresh prod restore-drill artifact
2. missing fresh prod rollback-proof artifact
3. RC Gate 2 remains `OPEN`
4. engineering / product / operations approvers are unnamed
5. rollback owner is not assigned in the sign-off record

## Future-Agent Rules

1. Do not reopen `V1FACT-A` for more refactors unless a new code-level defect is
   discovered in the activation path itself.
2. Do not claim `READY` from stage success, fresh docs, or public prod smoke
   alone.
3. Do not bypass prod proof families:
   - `v1-restore-drill-prod-*`
   - `v1-rollback-proof-prod-*`
4. Do not overwrite RC status, checklist, or sign-off into green if Gate 2 or
   named approvers are still missing.
5. If protected prod OPS endpoints stay externally blocked, internal prod
   runtime verification may support diagnostics, but it does not replace the
   required prod proof artifacts or named sign-offs.

## Next Honest Step

The next execution should not be another broad implementation wave.

It should be one operator-driven completion pass that:

1. generates prod restore-drill proof,
2. generates prod rollback proof,
3. records named approvers and rollback owner,
4. reruns the prod release gate,
5. publishes final `READY` or final `BLOCKED` sign-off.
