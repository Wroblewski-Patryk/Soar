# OPS-LIVE-PAUSE-001 — shared LIVE pause

## Contract

- `LiveExecutionControl(global)` is the single PostgreSQL control row. The
  migration creates it paused. Missing row, database/read failure, or inability
  to acquire the submission lock blocks new LIVE `createOrder` calls.
- Only authenticated `ADMIN` can read or change it through
  `/admin/live-execution` or the admin panel. Every change requires a reason
  and the last read version. State change and `Log` audit row commit together;
  the panel reads back the committed version.
- Each connector checks the control under a shared transaction advisory lock
  immediately before CCXT `createOrder`. Pause/resume uses the exclusive lock.
  Pause therefore completes after already-started submissions leave the gate;
  all later submissions see the new state. The venue may report an in-flight
  order after pause commits; its durable intent and fills must still reconcile.
- A pre-submission pause denial marks runtime OPEN/DCA/CLOSE dedupe as retryable.
  The same key can execute after resume, while an unknown venue outcome remains
  blocked for reconciliation and is never treated as a safe pause denial.
- Pause blocks new LIVE entries and DCA. A Futures `reduceOnly` close is allowed
  because the venue enforces no exposure increase, including Gate.io swap.
  Spot has no reduce-only guarantee and is blocked. Existing order polling,
  fills, intents, cancellation, and reconciliation continue. PAPER/BACKTEST are
  unaffected. A database outage blocks even reduce-only submissions until
  shared state can be verified.
- The CCXT request timeout is 30 seconds; the permit transaction timeout is
  120 seconds. A timeout after a request begins is an unknown exchange outcome
  and must follow the existing intent lookup path, never a blind resubmit.
- This checkout has no MCP LIVE-order implementation. A later API/MCP transport
  must use the same guarded connector and cannot introduce a second venue path.

## Rollout and incident use

1. Record current production SHA and halt all old LIVE-capable API and
   execution-worker instances **before** deploying any gated instance. Old
   binaries do not consult this control; the migration alone cannot stop them.
2. Follow the repository's STAGE-then-PROD migration policy. Apply this additive
   migration while writers are halted. Verify the singleton reads `paused=true`
   and `version=1`. Deploy the exact gated SHA to every API and execution worker.
3. Verify every writer's exact SHA and worker readiness separately. Use the
   admin GET and panel readback for the shared pause state; health alone does
   not prove order gating. Exercise PAPER and a non-order-producing read path.
   Do not use a production order as a smoke test.
4. An authorized operator may resume with a recorded reason only after all
   old writers are gone, the new SHA is verified, and the release gate is met.
   Read back the new version. Existing environment kill switches may still
   prevent runtime decisions and are separate process-local controls.
5. Before a risky deploy or incident change, pause through the admin API/panel
   and wait for its committed readback. Then stop old writers, deploy, verify
   SHA/readiness, and decide whether to resume. If pause cannot be confirmed,
   stop all LIVE writers at the platform level. Do not assume an unverified
   request took effect.

## Acceptance evidence

- Two independent Prisma clients submit while active; an in-flight submission
  holds pause until it finishes; later entry and Spot submissions are denied;
  Futures reduce-only is permitted; a fresh client sees the persisted state.
- Missing row and DB outage deny before submission. Anonymous and regular
  users cannot access the admin API. Invalid/stale version cannot overwrite a
  newer decision. The audit log records the reason and version change.
- Runtime retains pending DCA levels in TP/TTP/SL/TSL evaluation while paused.
  Reached LIVE DCA is not submitted; its unfilled proposal does not advance
  quantity, average price, or DCA progress. A pause/DCA race keeps the same
  pre-fill protection and blocks a false SL/TSL close. Futures reduce-only
  closes remain eligible when the full DCA protection rules permit them.
  Existing submitted/unknown DCA blocks close until reconciliation. A reached
  unaffordable DCA may release SL only after funds-exhausted telemetry; pause
  alone is not evidence that funds are exhausted.
- Production proof needs exact deployed SHA, migration status, per-instance
  worker inventory, admin readback, and reconciliation evidence. Local tests
  and `/health` do not establish this proof.
