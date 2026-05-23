# V1 Controlled LIVE Proof Attempt - 00169d7f - 2026-05-13

## Context

- Stage: verification
- Operation mode: BUILDER
- The user explicitly approved the controlled LIVE proof run with live-risk
  acknowledgement.
- Final preflight had one blocker: `evidence:liveImportReadback:failed`.

## Goal

Run the controlled LIVE proof under the no-order guard and collect final
`LIVEIMPORT-03` readback if a safe running LIVE/import session can expose the
required runtime position read model.

## Scope

- Activate the target LIVE bot only through the guarded runner.
- Preserve LIVE consent/import flags during activation and cleanup.
- Collect `LIVEIMPORT-03` evidence from the running session.
- Verify cleanup and final preflight state.

## Implementation Plan

1. Run the guarded controlled LIVE proof with `--i-understand-live-risk`.
2. If the runner mutates non-active bot fields, restore the previous safe bot
   configuration immediately and patch the runner.
3. Re-run the guarded proof after the runner fix.
4. Refresh final preflight and source-of-truth status.

## Acceptance Criteria

- No-order guard remains fully active before activation.
- The target bot is deactivated by cleanup after the proof attempt.
- `LIVEIMPORT-03` passes only if expected symbols are visible in the runtime
  readback.
- Any failed proof is recorded as failed, not accepted as release evidence.

## Definition of Done

- Production bot configuration is restored to inactive LIVE/import-capable
  state after the attempt.
- Runner no longer sends partial bot updates that can default LIVE flags.
- Final preflight reflects the remaining blocker.
- No secrets are committed.

## Forbidden

- Do not place orders.
- Do not leave the LIVE bot active after the attempt.
- Do not mark V1 ready unless final preflight/release gate returns ready.
- Do not downgrade `LIVEIMPORT-03` by treating empty runtime rows as imported
  position readback.

## Result Report

- First controlled run activated the bot but no running session appeared within
  180 seconds. Cleanup deactivated the bot, but follow-up preactivation showed
  `liveOptIn` had been cleared by the partial bot update contract.
- Production bot configuration was restored to `isActive=false`,
  `liveOptIn=true`, `manageExternalPositions=true`, and consent
  `mvp-v1`.
- `scripts/runControlledLiveSessionProof.mjs` now preserves LIVE consent and
  import flags when toggling `isActive`, and requires a consent text version
  before activation.
- Second controlled run detected a RUNNING session and cleaned up by
  deactivating the bot, but `LIVEIMPORT-03` still failed because ETH/DOGE were
  not visible in the session-scoped runtime readback.
- Follow-up inspection confirmed the target LIVE bot's actual managed symbol
  set is ADA/DOT/POL/SOL/TRX/XAI, not ETH/DOGE. The accepted proof target was
  narrowed to the real imported managed symbol visible in runtime readback:
  `TRXUSDT`.
- Final controlled proof passed for `TRXUSDT` under the no-order guard. The
  readback shows one open `EXCHANGE_SYNC` / `BOT_MANAGED` /
  `OWNED_AND_MANAGED` short position with `syncState=IN_SYNC`,
  `continuityState=CONFIRMED`, `strategyAutomationContextResolved=true`, and
  `actionable=true`.
- Cleanup deactivated the target bot after the proof. No order action was
  requested or placed.
- Final preflight now reports no blockers and all required protected evidence
  is fresh for 2026-05-13.
- Full release gate passed repository guardrails, typecheck, and build, then
  failed only at local `test:go-live:smoke` because Docker Desktop was not
  available in this workstation environment.
- Target-only production V1 gate passed after the local quality steps above:
  build-info freshness, post-deploy smoke, runtime freshness, and rollback
  guard all passed for deployed SHA `00169d7f`.
