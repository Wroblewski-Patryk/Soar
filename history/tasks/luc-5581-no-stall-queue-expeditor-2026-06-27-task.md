# LUC-5581 No-Stall Queue Expeditor

## Header
- ID: LUC-5581
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: P0
- Mission ID: LUC-5581-NO-STALL-QUEUE-EXPEDITOR-2026-06-27
- Mission Status: VERIFIED

## Context
Paperclip woke the Soar Product Manager on issue assignment for [LUC-5581](/LUC/issues/LUC-5581). The issue required one concrete no-stall queue action, not code implementation.

## Goal
Inspect live Soar queue state, identify a stalled or mis-postured lane, force a clear disposition or delegated handoff, and close the PM heartbeat with evidence.

## Constraints
- Do not implement product code.
- Do not push, deploy, restart, rollback, edit env, read secrets, mutate accounts, touch DB/Redis data, exchange state, payments, subscriptions, orders, positions, or live trading.
- Preserve dirty worktree ownership; the checkout was already dirty and divergent.
- Use Paperclip issue state as the live board source.

## Definition of Done
- [x] Live Paperclip issue state read.
- [x] One stalled lane classified.
- [x] Direct safe mutation attempted where appropriate.
- [x] If direct mutation is blocked by authorization, create a narrow follow-up with owner/action.
- [x] Issue final disposition posted with residual risk and next owner.

## Validation Evidence
- Paperclip heartbeat context for [LUC-5581](/LUC/issues/LUC-5581) read successfully.
- Live Soar non-terminal issue query returned:
  - `blocked`: 132
  - `in_progress`: 3
  - `in_review`: 6
  - `todo`: 5
- Active live lanes found:
  - [LUC-5577](/LUC/issues/LUC-5577) in progress with active Test Automation run for QA smoke runner repair.
  - [LUC-5580](/LUC/issues/LUC-5580) in progress with active CTO run for TSA acceptance packet attachment.
  - [LUC-5581](/LUC/issues/LUC-5581) current PM heartbeat.
- `pnpm softwarehouse:control-tick` failed because the command is not exposed in this checkout: `Command "softwarehouse:control-tick" not found`.
- Worktree baseline: `main...origin/main [ahead 13, behind 1]` with existing same-day docs/state/evidence and script dirty paths. No commit was made from this PM heartbeat.

## Queue Decision
[LUC-241](/LUC/issues/LUC-241) was the concrete stale lane selected for this heartbeat:

- Live status before PM action: `todo`.
- Owner: DRE.
- No active run.
- Its own current blocker path requires [LUC-2755](/LUC/issues/LUC-2755), which is `in_review` and explicitly provisions/accepts the `SMOKE_AUTH_*` binding needed before protected read-only `/workers/ready` proof can run.

The PM attempted the exact safe mutation:

- set [LUC-241](/LUC/issues/LUC-241) to `blocked`;
- set [LUC-2755](/LUC/issues/LUC-2755) as first-class blocker.

Paperclip rejected the mutation with:

```text
Issue is outside this actor's authorization boundary
```

Concrete handoff created:

- [LUC-5585](/LUC/issues/LUC-5585) `[Softwarehouse][Control Plane] Apply LUC-241 smoke-auth blocker rewire`
- Assigned owner: [00 AIA](/LUC/agents/00-aia-ai-assistant)
- Requested action: apply the [LUC-241](/LUC/issues/LUC-241) blocker rewire or grant a scoped actor path.

## Result Report
- Task summary: PM converted one stale runnable-looking lane into a control-plane handoff because the direct blocker mutation was authorization-blocked.
- Files changed: this task packet plus source-of-truth state notes.
- How tested: Paperclip live issue readbacks and attempted authorized mutation.
- What is incomplete: [LUC-241](/LUC/issues/LUC-241) still needs the control-plane mutation in [LUC-5585](/LUC/issues/LUC-5585).
- Next steps:
  1. [LUC-5585](/LUC/issues/LUC-5585) applies the blocker rewire.
  2. [LUC-2755](/LUC/issues/LUC-2755) resolves the accepted smoke auth binding.
  3. DRE reruns the approved protected read-only workers-ready recheck after the binding exists.

## Safety
No code, push, deploy, restart, rollback, env edit, secret/account readback, DB/Redis mutation, production account mutation, exchange action, payment/subscription mutation, order, position, or live-trading action occurred.
