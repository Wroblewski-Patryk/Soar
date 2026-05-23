# Task

## Header
- ID: LIVEIMPORT-AUDIT-2026-05-07
- Title: Audit exchange-position import and bot runtime visibility against architecture
- Task Type: research
- Current Stage: analysis
- Status: REVIEW
- Owner: Backend Builder
- Depends on: LIVEIMPORT-03
- Priority: P0
- Iteration: 2026-05-07
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active iteration context.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that exchange-position import into a live bot imports or
shows only one position out of six. The architecture requires imported live
positions to be reconciled from exchange truth, assigned to a bot only with
deterministic ownership proof, and kept visible but non-actionable when
continuity or ownership is not actionable.

## Goal
Determine where current application behavior can diverge from the architecture
before implementing another runtime-import fix.

## Scope
- Architecture sources:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/live-position-restart-continuity-contract.md`
- Implementation surfaces:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
  - `apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.ts`
  - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSymbolCatalogResolver.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolUniverse.service.ts`
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/prisma/schema.prisma`
- Test surfaces:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`

## Success Signal
- User or operator problem: live bot import must explain why one of six
  exchange positions becomes bot-visible.
- Expected product or reliability outcome: fixes can be planned as a single
  vertical slice instead of repeated local patches.
- How success will be observed: a prioritized remediation plan exists with
  exact failing contracts and validation gates.
- Post-launch learning needed: yes

## Deliverable For This Stage
An architecture-to-implementation audit with ranked failure modes and the next
smallest implementation slice.

## Constraints
- use existing reconciliation, ownership, symbol-scope, and runtime read-model
  systems
- do not introduce workaround import paths
- do not guess bot ownership from the first bot, first strategy, or first symbol
- do not downgrade unowned imported positions into hidden or fake bot-managed
  truth

## Definition of Done
- [x] Architecture contracts for import, ownership, and visibility reviewed.
- [x] Implementation traced from exchange snapshot to bot runtime read model.
- [x] Focused regression tests run or inspected.
- [x] Ranked root-cause candidates recorded.
- [x] Next vertical slice and validation gates defined.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel import paths
- temporary bypasses that make bot ownership look successful without proof
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true`
  - Result: 44 passed, 1 failed.
- Manual checks:
  - Source inspection of reconciliation, ownership, symbol resolution, runtime
    read model, and snapshot normalization.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - No production credentials were used.
  - No live-money or exchange-mutating actions were performed.

## Architecture Evidence
- Architecture source reviewed: yes
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no for the first repair slice; yes before any
  architecture change or ownership semantics change.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: likely not needed if implementation is
  brought back to the documented contract.

## Key Findings

### 1. Runtime read model hides recovered imported positions
`runtimeSessionPositionsRead.service.ts` requires open positions to have
`syncState: IN_SYNC`. The existing e2e contract creates a recovered imported
position with `continuityState: RECOVERED_UNACTIONABLE` and `syncState: DRIFT`
and expects it to remain visible but non-actionable. That test now fails:
expected one visible position, received zero.

Architectural impact: this violates the restart-continuity rule that recovered
imported positions must stay visible while automation remains disabled unless
the position is confirmed actionable.

### 2. One-of-six import is most likely an ownership/scope classification issue
The importer loops through every exchange snapshot position, but bot ownership
is exact by `apiKeyId + marketType + symbol`. A position becomes bot-managed
only when `runtimeExternalPositionOwner.service.ts` finds exactly one active
LIVE, opted-in, wallet-backed bot with `manageExternalPositions: true` and a
canonical symbol scope containing that symbol.

If the bot's active `BotMarketGroup` or effective symbol universe resolves only
one symbol, then only that one position can be owned by the bot. The remaining
positions may import as `MANUAL_MANAGED`, `DRIFT`, or remain invisible from
the bot runtime surface. This behavior is fail-closed, but the operator
experience lacks clear diagnostics explaining which symbols were imported,
manual-only, ambiguous, skipped, or outside scope.

### 3. Importer can silently skip positions with missing entry truth
`livePositionReconciliation.service.ts` increments `openPositionsSeen` before
entry-price validation, then skips persistence when canonical entry price is
missing or non-positive. The service logs `missing_entry_truth` but does not
return a per-symbol outcome summary to the operator surface. If five exchange
positions have incomplete entry truth, the status count can look misleading.

### 4. Snapshot normalization has insufficient side/contract coverage
`positions.exchangeSnapshotNormalization.ts` prefers top-level `contracts`
before signed `info.positionAmt` and keeps `side` from CCXT or
`info.positionSide`. Binance one-way futures can expose signed quantity through
`positionAmt` while side may be absent or `BOTH`. Current unit coverage focuses
on margin normalization and does not prove multi-position side derivation for
one-way and hedge-mode snapshots.

### 5. Existing tests prove pieces, not the full live import journey
Focused reconciliation tests prove that the loop can import multiple positions
when ownership is stubbed. Ownership tests prove exact symbol ownership for
selected synthetic cases. Runtime takeover tests cover selected visibility
cases, and one now fails. Missing coverage is the DB-backed vertical slice:
one live wallet, one active bot, one canonical market group containing six
symbols, one mocked exchange snapshot with six open positions, then import,
runtime readback, and diagnostics.

## Ranked Root Causes For The Reported Symptom
1. Bot canonical symbol scope resolves one symbol, so only one exchange
   position is bot-owned and bot-visible.
2. Bot `manageExternalPositions` is false or one or more positions resolve to
   `MANUAL_ONLY`.
3. Exchange snapshot positions are seen but skipped due to missing entry truth.
4. Runtime read-model hides recovered/imported positions with `DRIFT` even when
   continuity architecture says they must be visible and non-actionable.
5. Snapshot side/contract normalization misclassifies one-way or hedge-mode
   positions, causing external-id or side mismatches.
6. API key, wallet, market type, active/liveOptIn, or symbol-universe filters
   differ between the exchange account and the bot's canonical runtime scope.

## Implementation Plan
1. Fix runtime visibility for `RECOVERED_UNACTIONABLE` imported positions
   without making them actionable.
2. Add a DB-backed six-position import/readback regression test that uses the
   real ownership resolver and runtime positions endpoint.
3. Add structured reconciliation diagnostics per symbol:
   `owned`, `manual_only`, `ambiguous`, `unowned`, `missing_entry_truth`,
   `outside_scope`, `created`, `updated`, and `visible_to_bot`.
4. Add snapshot-normalization tests for Binance futures one-way and hedge-mode
   payloads.
5. Only after local vertical evidence passes, run authenticated read-only
   production readback for `LIVEIMPORT-03`.

## Acceptance Criteria
- Six exchange positions under one wallet-backed active LIVE bot and canonical
  six-symbol scope result in six bot-visible imported positions.
- Recovered unactionable imported positions are visible and have
  `actionable: false`.
- Positions outside canonical bot scope remain visible in an operator-safe
  diagnostic path but are not falsely bot-managed.
- Missing entry truth is reported per symbol and cannot masquerade as a
  successful import.
- No first-bot, first-strategy, or first-symbol fallback is introduced.

## Result Report
- Task summary: analysis found one confirmed runtime read-model regression and
  several likely causes for one-of-six import behavior.
- Files changed: this planning/audit report only.
- How tested: focused API test pack; 44 passed, 1 failed.
- What is incomplete: production readback still needs authenticated read-only
  access; code fixes are intentionally deferred to the next implementation
  slice.
- Next steps: implement the visibility fix and six-position vertical regression
  test first, then add diagnostics and normalization coverage.
- Decisions made: no architecture change is required for the first repair
  slice; implementation should be brought back to the documented contract.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for analysis stage.
- Real API/service path used: local API tests.
- Endpoint and client contract match: not fully; failing e2e shows runtime
  readback mismatch.
- DB schema and migrations verified: schema inspected only.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: local restart-continuity e2e currently
  fails.
- Regression check performed: focused API tests.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  analysis stage.
- Data classification: no production data accessed.
- Trust boundaries: exchange snapshots and bot ownership boundaries inspected.
- Permission or ownership checks: exact API-key, wallet, bot, market-type, and
  symbol ownership rules inspected.
- Abuse cases: no ownership fallback or guess should be introduced.
- Secret handling: no secrets used.
- Security tests or scans: not applicable.
- Fail-closed behavior: ownership remains fail-closed, but visibility
  diagnostics are insufficient.
- Residual risk: production symptom cannot be fully confirmed until
  authenticated read-only readback is available.
