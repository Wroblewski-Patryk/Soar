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
`FULLARCH-FIX-11`, and local `main` is pushed to `origin/main` at
`9bdd1c1a101603e872099f205f3e9b21904e2b0a`. Public production web build-info
still reports `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` until the official
manual `Promote PROD` workflow is dispatched and completed. The latest
names-only prerequisite scan still found no production credentials or ops auth
headers in the current shell, so protected evidence collection remains blocked
without an operator-authenticated environment.

`LIVEIMPORT-03` now has one canonical read-only evidence command:
`pnpm run ops:liveimport:readback -- --expected-sha 21bb52f1e4b8865aab0dbb83ecffe698061fd7a3 --output docs/operations/liveimport-03-prod-readback-2026-05-07.json`.
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

Backup/restore drill and rollback proof are also current for 2026-05-07 but
`FAILED`: restore drill was not executed without production DB/Coolify access,
and rollback proof failed closed on protected `401` responses. V1 remains
NO-GO.

The canonical `LIVEIMPORT-03` command now targets production SHA
`21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, matching public build-info.

Latest continuation recheck: public production build-info still matches
`21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, but the current shell exposes no
required Soar production auth variable. A no-auth `ops:liveimport:readback`
attempt failed closed before protected runtime readback, and the refreshed
release-gate dry-run
`docs/operations/v1-release-gate-prod-2026-05-07T18-20-30-000Z.md` remains
`not_ready`.

Post-push deploy check: `origin/main` is current at
`2b0056c0c08af9ed3c05803c05f18df1b30c0103`, but production build-info still
reports `21bb52f1...`. The approved production promote path is
`.github/workflows/promote-prod.yml`, a manual `workflow_dispatch`. The
workflow was dispatched through GitHub API for `92955a1c`, then retried for
current `main` at `2b0056c0`; run `25514674413` also failed before any steps
executed because GitHub reported: `The job was not started because your
account is locked due to a billing issue.`

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
