# LIVE runtime telemetry: historical repair plan

Status: plan only. No production preflight, data repair, LIVE order, or deployment has been run for this change.

## Release boundary

Stop every older API and execution worker before starting a version that relies on atomic runtime telemetry. Older workers can commit Trade before event/stat and can race with the new transaction lock. Keep the release at NO-GO until the operator has inventoried and resolved historical gaps and separately accepted the real LIVE flow.

## Read-only preflight

Run against a consistent database snapshot. Join runtime-generated `LiveOrderIntent` (`clientOrderId` beginning `soar_`) to its `Order` by ID, then inventory BOT LIVE orders by `(userId, orderId, lifecycleAction)`:

1. FILLED Order with Position but no matching Trade; one Trade; or multiple Trades. Keep OPEN, DCA, and CLOSE separate. An ambiguous Position, order identity, side, quantity, or fill history is a manual-review case.
2. Matching `BotRuntimeEvent` by user, bot, event type, and `payload.orderId`: missing, exactly one, or duplicate. Record whether `payload.telemetryCommitted` is true and whether financial pending/settlement markers agree with canonical Order/Trade/Position/OrderFill values.
3. Session and `BotRuntimeSymbolStat` coverage: a unique session containing the order submission time; counts, open quantity, fee, and PnL compared with the sum of uniquely attributable orders. Preserve `null` for an unknown exchange fee or realized PnL. Do not infer zero from missing evidence.
4. Duplicates by `(orderId, lifecycleAction)` and by `(botId, eventType, payload.orderId)` must be enumerated before any unique index or repair. The current change adds no Trade uniqueness migration.

Export counts and order IDs with restricted access, plus a snapshot identifier and code SHA. Do not treat an existing event without `telemetryCommitted: true` as proof that its stat increment was applied.

## Proposed repair transaction

Build and review a separate idempotent repair tool after the preflight. For one unambiguous order at a time, lock `(userId, exchangeOrderId)` with the same PostgreSQL advisory transaction lock as runtime and the event handler. Read and validate the Order, Position, Trade, fills, event, session, and stat under that lock. Repair a missing OPEN Trade only from a uniquely attributable filled order and position with complete execution price and quantity. For a missing event, create it and apply its stat increment in one transaction; for a legacy event, reconcile the stat against a per-order ledger or audited baseline before setting `telemetryCommitted`. Never increment a stat solely because a legacy marker is absent. Duplicate or conflicting records remain quarantined for manual reconciliation.

Apply known exchange fees and PnL through the existing settlement functions inside the repair transaction. Leave pending financials pending when evidence is incomplete. Record a durable per-order repair result with before/after identifiers and exact deltas so replay can prove it did not add a second Trade, event, or count.

## Acceptance before production

Dry-run the preflight and repair on an isolated copy. Inject crashes before commit and after commit, replay the same order, and run two database clients concurrently. Require invariant checks: one Trade per order/action, one runtime event per order/type, stat totals equal the audited order ledger, and unchanged known fee/PnL after replay. Review every quarantined row. Repeat the read-only inventory immediately before a controlled production repair and read back the affected rows afterward. The production repair and LIVE acceptance require separate authorization.
