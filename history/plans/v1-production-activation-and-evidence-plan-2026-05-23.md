# V1 Production Activation And Evidence Plan (2026-05-23)

## Context
- V1 remains production-only; this plan does not introduce a stage requirement.
- Public production build-info exposes
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c`.
- Production deployment, split-worker readiness, UI clickthrough, rollback
  proof, restore drill, SLO observation, and RC evidence are fresh for
  2026-05-23.
- Current final preflight has no blockers and the full non-dry-run production
  release gate is `ready`.
- No production LIVE order, position, or exchange mutation may be created by
  automation without separate explicit operator approval.

## Goal
Keep production activation planning truth current for the 2026-05-23 V1 blocker
state without claiming final release approval or replacing the required runtime
readback with weaker signals.

## Scope
- Production activation evidence planning for 2026-05-23.
- Current production build-info, public/protected smoke, authenticated UI
  clickthrough, split-worker readiness, rollback proof, restore drill, SLO
  observation, RC evidence, and `LIVEIMPORT-03`.
- Completed follow-up evidence:
  - qualifying open runtime payload for `LIVEIMPORT-03`
  - `LIVEIMPORT-03` production runtime readback with `PASS`
  - final preflight with no blocking evidence rows
  - non-dry-run production release gate returning `ready`

## Implementation Plan
1. Preserve the current production proof state in source-of-truth docs and
   ledgers.
2. Use read-only `LIVEIMPORT-03` auto-discovery for the running LIVE session
   instead of the legacy `ETHUSDT,DOGEUSDT` default when the real open symbols
   differ.
3. Require the collector to fail closed when no open runtime payload is visible.
4. Rerun final preflight against production for
   `b1ba69edccc639e97943f37fb2b1e6249a62e87c`.
5. Rerun `pnpm run ops:release:v1:gate` without `--dry-run` and without
   skipping required protected gates.
6. Record the final `ready` state in source-of-truth files.

## Acceptance Criteria
- `LIVEIMPORT-03` produces a fresh 2026-05-23 or later `PASS` artifact with a
  real qualifying runtime payload.
- Final preflight has no blocking release evidence rows.
- Production release gate returns `ready`.
- No secrets, tokens, passwords, cookies, private headers, or raw protected
  payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha b1ba69edccc639e97943f37fb2b1e6249a62e87c` returns `ready`.
- `pnpm run quality:guardrails` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **READY**
- Satisfied for 2026-05-23:
  - production public build-info readback
  - production public and authenticated smoke
  - split-worker production readiness
  - authenticated production UI clickthrough
  - production rollback proof
  - production DB restore drill
  - 30-minute production SLO observation, except live order ratio `NO_DATA`
  - RC external gates, sign-off, and checklist evidence
  - `LIVEIMPORT-03` production runtime readback for `SOLUSDT` and `BNBUSDT`
  - final preflight with no blockers
  - full non-dry-run production release gate `ready`
- Remaining blockers:
  - none

## Result Report
- This plan records the truthful activation state for deployed
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c`.
- `LIVEIMPORT-03` passed using read-only auto-discovery of the real open
  runtime symbols `SOLUSDT` and `BNBUSDT`; no production LIVE order, position,
  exchange mutation, or bot activation change was performed.
- Final preflight wrote
  `history/releases/v1-final-preflight-b1ba69ed-2026-05-23-after-liveimport.md`
  with no blockers.
- The full non-dry-run production release gate wrote
  `history/releases/v1-release-gate-prod-b1ba69ed-2026-05-23-after-liveimport.md`
  and returned `ready`.
