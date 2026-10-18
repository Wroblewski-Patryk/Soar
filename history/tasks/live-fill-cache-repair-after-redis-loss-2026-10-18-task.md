# SOAR-LIVE-FILL-CACHE-REPAIR-001 — repair after Redis marker loss

Status: open, separate from SOAR-LIVE-FILL-RECON-001 stage 4. No production repair is authorized by this ticket.

## Reproduction

Use the gated local process proof `RUN_LIVE_FILL_PROCESS_PROOF=1` on `cryptosparrow_test` and local Redis. After a BOT DCA becomes fully FILLED with all `OrderFill` rows, one lifecycle `Trade`, and settled fee, leave `Position` at quantity 2 / entry 95 but replace `runtime:position-state:<positionId>` with the prior quantity 1 / entry 100. Remove that order's `pending:data`, `pending:due`, and `pending:created` entries, modelling selective loss of Redis recovery metadata after the database commit. The stage-1 candidate predicate no longer emits the fully settled order, so stage-3 polling has no candidate to replay and does not repair the cache. The console rejects the stale BOT state against canonical `Position`, but automatic repair is unproven. The process test checks this state before restoring its local fixture and continuing to CLOSE.

## Required design and acceptance

Define a durable database-backed cache-repair signal or bounded scan of canonical BOT positions that can identify and repair an inconsistent cache even when all Redis recovery metadata has disappeared. Preserve the stage-2 transactional and account-identity guards; do not infer an additional fill, Trade, DCA, CLOSE, or createOrder from cache mismatch alone. Test a crash after DB commit, deletion of Redis metadata while old cache survives, restart with two workers, repair of DCA and CLOSE cache state, and idempotence under concurrent stream/poll replay. Report pending repair and age through operator status. Require independent review and controlled production evidence before claiming self-healing.
