# V1 Production Activation And Evidence Plan (2026-05-14)

## Context
- V1 remains production-only; this plan does not introduce a stage requirement.
- Public production build-info exposes
  `457bce05338310c198c03a973395a9176f298dc1`.
- Current production UI clickthrough, controlled `LIVEIMPORT-03`, rollback
  proof, and RC evidence are fresh for 2026-05-14.
- Current final preflight is `ready` after production DB restore evidence was
  collected through the VPS Docker SSH context.
- Coolify terminal bridge automation is excluded from the current path because
  it proved unstable and risked unsafe automation behavior.

## Goal
Keep production activation planning truth current for the 2026-05-14 V1 blocker
state without claiming final release approval or replacing production restore
evidence with weaker signals.

## Scope
- Production activation evidence planning for 2026-05-14.
- Current production build-info, public smoke, authenticated UI clickthrough,
  controlled `LIVEIMPORT-03`, rollback proof, and RC evidence.
- Required follow-up evidence:
  - safe production DB restore context
  - production DB restore drill `PASS`
  - final preflight with no blocking evidence rows
  - non-dry-run production release gate returning `ready`

## Implementation Plan
1. Use a safer operator path for DB restore context:
   - manual Coolify terminal run with no-secret transcript markers, or
   - a dedicated ops script/endpoint that emits only no-secret restore evidence,
     or
   - an explicit VPS shell channel approved for this task.
2. Run the production DB restore drill and require a `PASS` artifact.
3. Rerun `pnpm run ops:release:v1:preflight` against production for
   `457bce05338310c198c03a973395a9176f298dc1`.
4. Rerun `pnpm run ops:release:v1:gate` without `--dry-run` and without
   skipping required protected gates.
5. Record the final `ready` or `not_ready` state in source-of-truth files.

## Acceptance Criteria
- Production DB restore drill produces a fresh 2026-05-14 `PASS` artifact.
- Final preflight has no blocking release evidence rows.
- Production release gate returns `ready`.
- No secrets, tokens, passwords, cookies, private headers, or raw protected
  payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05338310c198c03a973395a9176f298dc1` returns `ready`.
- `pnpm run quality:guardrails` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **READY**
- Satisfied for 2026-05-14:
  - production public build-info readback
  - production public smoke
  - authenticated production UI clickthrough
  - controlled `LIVEIMPORT-03` production runtime readback
  - production rollback proof
  - RC external gates, sign-off, and checklist evidence
- Remaining blockers:
  - none for the current protected operations release gate

## Result Report
- This plan now records the successful activation/release evidence path for
  deployed `457bce05338310c198c03a973395a9176f298dc1`.
- Final preflight and the full non-dry-run production release gate both passed.
