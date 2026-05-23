# V1 Controlled LIVE Proof Preactivation - 00169d7f - 2026-05-13

## Context

- Stage: verification
- Operation mode: BUILDER
- Final preflight has one blocker:
  `evidence:liveImportReadback:failed`.
- `LIVEIMPORT-03` authentication works and the target LIVE Binance futures bot
  exists, but the bot has no running runtime session.

## Goal

Verify whether the controlled LIVE proof runner is ready to produce the final
`LIVEIMPORT-03` evidence without activating the bot or mutating live trading
state.

## Scope

- Run the controlled LIVE proof dry-run.
- Run the controlled LIVE proof preactivation check without
  `--i-understand-live-risk`, so the runner must stop before activation.
- Record the resulting decision blocker.

## Implementation Plan

1. Execute the dry-run command and verify no activation is planned.
2. Execute the preactivation command without live-risk approval.
3. Confirm the runner prints a redacted plan and refuses to activate.
4. Record the remaining explicit approval requirement.

## Acceptance Criteria

- The runner confirms build-info matches the deployed `00169d7f` build.
- The runner confirms the no-order guard is fully active.
- The runner confirms exactly one target LIVE Binance futures bot is available
  and inactive.
- The runner refuses activation without `--i-understand-live-risk`.

## Definition of Done

- No LIVE bot activation occurs.
- No order placement occurs.
- No secret values are committed.
- Source-of-truth files state that the remaining blocker is an explicit
  live-risk approval or an acceptance-contract change.

## Forbidden

- Do not run the activation command with `--i-understand-live-risk` without the
  user's explicit approval.
- Do not treat the preactivation plan as `LIVEIMPORT-03` readback evidence.
- Do not expose bot IDs, API key IDs, tokens, or credentials.

## Result Report

- Dry-run: PASS. It reported no live activation will run.
- Preactivation check: STOPPED AS DESIGNED. Build-info matched, no-order guard
  is fully active (`globalKillSwitch=true`, `emergencyStop=true`,
  `active=true`), and the target redacted bot is LIVE/BINANCE/FUTURES,
  inactive, `liveOptIn=true`, `manageExternalPositions=true`.
- The runner refused to activate because `--i-understand-live-risk` was not
  provided. V1 remains `NO-GO` pending explicit live-risk approval for the
  controlled proof run or a product decision to change the V1 acceptance
  contract.
