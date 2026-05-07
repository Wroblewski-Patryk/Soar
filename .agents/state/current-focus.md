# Current Focus

Last updated: 2026-05-07

## Active Focus

V1 production evidence closure: keep Soar stable, architecture-aligned,
regression-resistant, and explicit about the remaining authenticated read-only
production evidence gaps.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

Release verification is blocked on authenticated production readback for the
first open queue item, `LIVEIMPORT-03`. Local audit gates are closed through
`FULLARCH-FIX-11`, and public production web build-info now reports the pushed
collector hardening commit `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. The
latest local docs-only evidence commits are not pushed, by design, to avoid
creating another build-info target. The latest names-only prerequisite scan
still found no
production credentials or ops auth headers in the current shell, so future
continuation should resume with authenticated read-only evidence collection.

`LIVEIMPORT-03` now has one canonical read-only evidence command:
`pnpm run ops:liveimport:readback -- --expected-sha 1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output cannot be treated as V1
evidence.

A production `ops:release:v1:gate` dry-run on 2026-05-07 generated current
blocker artifacts and reports `readiness=not_ready`: activation audit,
activation plan, RC external gates status, RC sign-off, RC checklist,
backup/restore drill evidence, and rollback proof pack are stale, and dry-run
mode cannot approve production.

The activation audit and activation plan have since been refreshed as
2026-05-07 `NO-GO` artifacts. The latest dry-run now reports those two
families as `fresh`; remaining release-gate blockers are RC external gates
status, RC sign-off, RC checklist, backup/restore drill evidence, rollback
proof pack, and non-dry-run protected execution.

RC external gates status, RC sign-off, and RC checklist have now also been
refreshed as current blocked/open evidence. Latest RC snapshot is `G1=PASS`,
`G2=OPEN`, `G3=PASS`, `G4=OPEN`; sign-off remains `BLOCKED`.

## Current Priority Order

1. Stability
2. Architecture alignment
3. No regressions
4. Correct flows
5. UX quality
6. Visual polish
7. New features

## Active Constraints

- Do not touch unrelated in-progress code changes.
- Keep source-of-truth docs in English.
- Reuse existing `.codex/context`, planning, governance, and architecture
  systems.
- Do not run live-money or destructive production actions for `LIVEIMPORT-03`;
  the remaining work is authenticated read-only dashboard/API evidence.
- Keep `LIVEIMPORT-03` open until ETH/DOGE production runtime readback evidence
  is captured and redacted.
