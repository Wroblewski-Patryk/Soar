# Task

## Header
- ID: V1LIVE-04-05-08-09
- Title: Unify imported LIVE ownership truth across reconciliation, takeover, runtime visibility, and runtime close
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1LIVE-01, V1LIVE-02-03, V1LIVE-06-07
- Priority: P1

## Context
The live-execution audit proved that imported `EXCHANGE_SYNC` ownership still
split across multiple partial models:

- reconciliation classified takeover mainly by `apiKeyId`,
- takeover-status reads collapsed truth by `apiKeyId` counts,
- runtime visibility and runtime close authority relied on symbol-scoped
  heuristics without exact `apiKeyId + symbol` parity.

That drift was dangerous for live management because the same imported position
could be owned in one surface, ambiguous in another, and invisible or
non-closeable in the runtime view.

## Goal
Freeze and implement one canonical imported-position ownership classifier based
on exact `apiKeyId + symbol` scope plus `wallet.manageExternalPositions`, then
reuse that classifier across reconciliation, takeover, runtime visibility, and
runtime close authority.

## Deliverable For This Stage
- red/green regression coverage for exact imported ownership parity
- implementation of one shared ownership classifier reused by all affected live
  surfaces
- synced queue/context truth for the closed `V1LIVE-04/05/08/09` slice

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Imported LIVE ownership is classified from one exact `apiKeyId + symbol`
  contract.
- [x] Reconciliation, takeover-status, runtime visibility, and runtime close
  reuse the same ownership truth.
- [x] Runtime imported-position visibility no longer leaks across shared API key
  or shared symbol scenarios.
- [x] Focused unit/e2e tests, typecheck, and guardrails pass.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: n/a
- Screenshots/logs: n/a
- High-risk checks: shared API-key imported rows now stay isolated by exact
  symbol scope; manual-only versus unowned stays explicit; runtime close can
  claim only canonically owned imported rows

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/live-paper-runtime-safety-contract.md`
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: context/planning sync only

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice if imported LIVE visibility or close
  authority regresses for canonically owned positions

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice intentionally stopped before event-driven Binance lifecycle work.
The next active packet remains `V1LIVE-10..14`: signal-driven live-order
lifecycle truth, adapter-family event wiring, cleanup of residual fallback
surfaces, and final closure evidence.
